'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import Fuse from 'fuse.js'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Article } from '~/utils/articles'
import { underscorify } from '~/utils/underscorify'

interface NavbarProps {
  articles: Article[]
}

export function Navbar({ articles }: NavbarProps) {
  const pathname = underscorify(usePathname())
  const [search, setSearch] = useState('')
  const fuse = new Fuse(articles, {
    keys: ['title', 'content'],
    threshold: 0.0,
  })

  const filteredArticles = search
    ? fuse.search(search).map((result) => result.item)
    : articles

  return (
    <nav className="fixed hidden h-full min-h-screen w-80 flex-col lg:flex">
      <div className="space-y-2 bg-white p-5">
        <h1 className="font-serif text-2xl">Encyclopedia</h1>
        <label htmlFor="search" className="sr-only">
          Search articles
        </label>
        <div className="relative text-gray-400 focus-within:text-gray-400">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
          </div>
          <input
            id="search"
            name="search"
            placeholder="Search articles"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="block w-full rounded-md border-0 bg-gray-400/25 py-1.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:outline-gray-700 focus:ring-0 focus:placeholder:text-gray-400 sm:text-sm sm:leading-6"
            style={{ WebkitAppearance: 'none' }}
          />
        </div>
      </div>
      <div className="grow snap-y scroll-pt-2 overflow-y-scroll px-5 pb-5">
        <ul className="space-y-1">
          {filteredArticles.map((article) => (
            <li
              key={article.slug}
              className={classNames(
                'item-center flex snap-start rounded-md',
                pathname === article.slug ? 'bg-gray-200' : 'hover:bg-gray-100'
              )}
            >
              <Link
                href={`${article.slug}`}
                scroll={false}
                className="block w-full rounded-md px-2 py-2 font-serif text-base leading-4 text-gray-900 focus-visible:outline-dashed focus-visible:outline-1 focus-visible:outline-gray-500"
              >
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
