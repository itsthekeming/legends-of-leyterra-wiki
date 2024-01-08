import invariant from "tiny-invariant";
import { promises as fs } from "fs";
import grayMatter from "gray-matter";
import path from "path";
import { spacify } from "./spacify";
import { underscorify } from "./underscorify";

/**
 * @typedef {Object} Article
 * @property {string} title
 * @property {string} slug
 * @property {Record<string, any>} data
 * @property {string} content
 */

/**
 * @returns {Promise<Article[]>}
 */
export async function getArticles() {
  invariant(process.env.USE_LOCAL_VAULT);

  const articles =
    process.env.USE_LOCAL_VAULT === "true"
      ? await getLocalVault(["/Encyclopedia"])
      : await getRemoteVault();

  return articles.flat().filter((article) => article.data.publish === true);
}

/**
 * @param {string[]} topLevelPaths
 * @returns {Promise<Article[]>}
 */
async function getLocalVault(topLevelPaths) {
  const articles = await Promise.all(
    topLevelPaths.map(async (topLevelPath) => {
      const fullPath = path.join(process.env.LOCAL_VAULT_PATH, topLevelPath);
      return await scanDirectory(fullPath, topLevelPath);
    }),
  );

  return articles.flat();
}

/**
 * @param {string} dirPath
 * @param {string} topLevelPath
 * @returns {Promise<Article[]>}
 */
async function scanDirectory(dirPath, topLevelPath) {
  const files = await fs.readdir(dirPath);

  return await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dirPath, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory())
        return await scanDirectory(filePath, topLevelPath);

      const fileContent = (await fs.readFile(filePath)).toString();
      const title = path.parse(file).name;
      const slug = underscorify(path.join(topLevelPath, title));

      const { content, data } = grayMatter(fileContent);

      return {
        title,
        slug,
        data,
        content,
      };
    }),
  );
}

/**
 * @param {string} slug
 * @returns {Promise<Article>}
 */
export async function getArticle(slug) {
  invariant(process.env.USE_LOCAL_VAULT);

  const article =
    process.env.USE_LOCAL_VAULT === "true"
      ? await getLocalArticle(slug)
      : await getRemoteArticle(slug);

  return article;
}

/**
 * @param {string} slug
 * @returns {Promise<Article>}
 */
async function getLocalArticle(slug) {
  const fullPath = path.join(
    process.env.LOCAL_VAULT_PATH,
    spacify(slug) + ".md",
  );
  const fileContent = await fs.readFile(fullPath);
  const title = path.parse(fullPath.split("/").at(-1)).name;
  const { content, data } = grayMatter(fileContent.toString());

  if (data.publish === false) throw new Error("Article not published");

  return {
    title,
    slug,
    data,
    content,
  };
}

async function getRemoteVault() {}
