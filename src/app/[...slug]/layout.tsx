import { getArticles } from '~/utils/articles'
import { Navbar } from './navbar'
import { PropsWithChildren } from 'react'

interface LayoutProps extends PropsWithChildren {}

export default async function Layout({ children }: LayoutProps) {
  // const articles = await getArticles()

  return (
    <div className="mx-auto flex min-h-screen w-fit flex-col lg:flex-row">
      {/* <Navbar articles={articles} /> */}
      <main className="mx-4 flex grow flex-col lg:ml-80 lg:mr-0">
        {children}
      </main>
    </div>
  )
}
