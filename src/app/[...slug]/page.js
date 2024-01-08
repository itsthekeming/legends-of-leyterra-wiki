import { getArticle, getArticles } from "~/utils/articles";

/**
 * @typedef {Object} Params
 * @property {string[]} slug
 */

export async function generateStaticParams() {
  const articles = await getArticles();

  return articles.map((article) => ({
    slug: article.slug.split("/"),
  }));
}

/**
 * @param {Params} params
 */
export default async function Article({ params: { slug } }) {
  const article = await getArticle(slug.join("/"));
  console.log({ article });
  return null;
}
