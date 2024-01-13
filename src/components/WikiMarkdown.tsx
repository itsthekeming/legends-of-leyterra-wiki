import Link from 'next/link'
import Markdown from 'react-markdown'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkWikiLink from 'remark-wiki-link'
import { underscorify } from '~/utils/underscorify'

interface WikiMarkdownProps {
  children: string
}

export function WikiMarkdown({ children }: WikiMarkdownProps) {
  return (
    <Markdown
      remarkPlugins={[
        remarkGfm,
        [
          remarkWikiLink,
          {
            pageResolver: (name: string) => [underscorify(name)],
            hrefTemplate: (permalink: string) => `/${permalink}`,
            aliasDivider: '|',
          },
        ],
      ]}
      rehypePlugins={[rehypeSlug]}
      components={{
        a: ({ href, children }) => (
          <Link href={href!} className="underline">
            {children}
          </Link>
        ),
      }}
    >
      {children}
    </Markdown>
  )
}
