import { getArticles } from "~/utils/articles"

export default async function Home() {
  const articles = await getArticles()
  console.log({articles})
  return null
}
