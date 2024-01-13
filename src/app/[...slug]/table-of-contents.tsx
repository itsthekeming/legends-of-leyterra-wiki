'use client'

import Link from 'next/link'
import { Article, TocNode } from '~/utils/articles'
import * as Collapsible from '@radix-ui/react-collapsible'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

interface TableOfContentsProps {
  article: Article
}

export function TableOfContents({ article }: TableOfContentsProps) {
  return (
    <>
      {article.toc.map((node) => (
        <TableOfContentsNode key={node.value} node={node} />
      ))}
    </>
  )
}

interface TableOfContentsNodeProps {
  node: TocNode
}

function TableOfContentsNode({ node }: TableOfContentsNodeProps) {
  console.log(node)
  if (node.children.length === 0)
    return <Link href={`#${node.value}`}>{node.value}</Link>

  return (
    <Collapsible.Root>
      <div className="flex items-center">
        <Collapsible.Trigger>
          <ChevronRightIcon className="h-5 w-5 transform duration-200 ease-in-out data-[state=open]:rotate-45" />
        </Collapsible.Trigger>
        <Link href={`#${node.value}`} className="ml-1">
          {node.value}
        </Link>
      </div>
      <Collapsible.Content>
        <ul>
          {node.children.map((child) => (
            <li key={child.value}>
              <TableOfContentsNode node={child} />
            </li>
          ))}
        </ul>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
