import { WikiMarkdown } from '~/components/WikiMarkdown'
import { getArticle, getArticles } from '~/utils/articles'
import { Infobox } from './infobox'
import { TableOfContents } from './table-of-contents'

interface Params {
  params: {
    slug: string[]
  }
}

export async function generateStaticParams() {
  const articles = await getArticles()

  return articles.map((article) => ({
    slug: article.slug.split('/'),
  }))
}

export default async function Article({ params: { slug } }: Params) {
  const article = await getArticle(slug.join('/'))

  return (
    <article className="prose my-5 max-w-screen-md text-pretty px-5 text-gray-900 lg:my-5">
      <h1 className="border-b">{article.title}</h1>
      <TableOfContents article={article} />
      <Infobox article={article} />
      <WikiMarkdown>{article.content}</WikiMarkdown>
    </article>
  )
}
