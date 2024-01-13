import invariant from 'tiny-invariant'
import { promises as fs } from 'fs'
import grayMatter from 'gray-matter'
import path from 'path'
import { spacify } from './spacify'
import { underscorify } from './underscorify'
import { remark } from 'remark'
// @ts-ignore
import remarkExtractToc from 'remark-extract-toc'
import remarkGfm from 'remark-gfm'

export interface TocNode {
  depth: number
  value: string
  children: Array<TocNode>
}

export interface Article {
  title: string
  slug: string
  data: Record<string, any>
  content: string
  toc: Array<TocNode>
}

export async function getArticles(): Promise<Article[]> {
  invariant(process.env.USE_LOCAL_VAULT)

  const articles = await getLocalVault(['/Encyclopedia'])

  // const articles =
  //   process.env.USE_LOCAL_VAULT === 'true'
  //     ? await getLocalVault(['/Encyclopedia'])
  //     : await getRemoteVault()

  return articles.flat().filter((article) => article.data.publish === true)
}

async function getLocalVault(topLevelPaths: string[]): Promise<Article[]> {
  const articles = await Promise.all(
    topLevelPaths.map(async (topLevelPath) => {
      invariant(process.env.LOCAL_VAULT_PATH)

      const fullPath = path.join(process.env.LOCAL_VAULT_PATH, topLevelPath)
      return await scanDirectory(fullPath, topLevelPath)
    })
  )

  return articles.flat()
}

async function scanDirectory(
  dirPath: string,
  topLevelPath: string
): Promise<Article[]> {
  const files = await fs.readdir(dirPath)

  const results = await Promise.all(
    files
      .filter(async (file) => {
        const filePath = path.join(dirPath, file)
        const stats = await fs.stat(filePath)

        return stats.isDirectory() || path.extname(filePath) === '.md'
      })
      .map(async (file) => {
        const filePath = path.join(dirPath, file)
        const stats = await fs.stat(filePath)

        if (stats.isDirectory())
          return await scanDirectory(filePath, topLevelPath)

        const parsedPath = path.parse(filePath)
        const title = parsedPath.name
        const slug = underscorify(path.join(topLevelPath, title))

        const article = await getLocalArticle(slug)

        return article
      })
  )

  return results.flat()
}

export async function getArticle(slug: string): Promise<Article> {
  invariant(process.env.USE_LOCAL_VAULT)

  return getLocalArticle(slug)
  // const article =
  //   process.env.USE_LOCAL_VAULT === 'true'
  //     ? await getLocalArticle(slug)
  //     : await getRemoteArticle(slug)

  // return article
}

async function getLocalArticle(slug: string): Promise<Article> {
  invariant(process.env.LOCAL_VAULT_PATH)

  // read the file from the Vault
  const fullPath = path.join(
    process.env.LOCAL_VAULT_PATH,
    spacify(slug) + '.md'
  )
  const fileContent = (await fs.readFile(fullPath)).toString()

  // extract the frontmatter and content
  const { content, data } = grayMatter(fileContent)

  // extract the toc
  const tocProcessor = remark().use(remarkGfm).use(remarkExtractToc)
  const tocNode = tocProcessor.parse(content)
  const toc = tocProcessor.runSync(tocNode) as unknown as Array<TocNode>

  // extract the file's title
  const splitPath = fullPath.split('/')
  const title = path.parse(splitPath[splitPath.length - 1]).name

  return {
    title,
    slug,
    data,
    content,
    toc,
  }
}

async function getRemoteVault() {}
