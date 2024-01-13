import Image from 'next/image'
import Markdown from 'react-markdown'
import Link from 'next/link'
import remarkGfm from 'remark-gfm'
import remarkWikiLink from 'remark-wiki-link'
import { underscorify } from '~/utils/underscorify'
import { Article } from '~/utils/articles'

const imageKeys = ['image-src', 'image-alt', 'image-caption']

interface InfoboxProps {
  article: Article
}

export function Infobox({ article }: InfoboxProps) {
  let infoboxEntries = Object.entries(article.data)
    .filter(([key]) => key.startsWith('[infobox]'))
    .map(([key, value]) => [key.replace('[infobox]', ''), value])

  if (infoboxEntries.length === 0) return null

  // extract image entries
  const imageSrc = infoboxEntries.find(([key]) => key === 'image-src')?.[1]
  const imageCaption = infoboxEntries.find(
    ([key]) => key === 'image-caption'
  )?.[1]
  const imageAlt = infoboxEntries.find(([key]) => key === 'image-alt')?.[1]

  // filter out image entries
  infoboxEntries = infoboxEntries.filter(([key]) => !imageKeys.includes(key))

  return (
    <div className="not-prose float-right clear-left mb-6 ml-6 w-72">
      <table>
        <caption className="pb-2 font-bold">{article.title}</caption>
        <tbody className="border">
          {imageSrc ? (
            <tr>
              <td colSpan={2} className="pb-4">
                <figure>
                  <InfoboxImage src={imageSrc} alt={imageAlt} />
                  <figcaption className="text-center text-xs">
                    {imageCaption}
                  </figcaption>
                </figure>
              </td>
            </tr>
          ) : null}
          {infoboxEntries.map(([key, value]) => (
            <InfoboxEntry key={key} title={key} value={value} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface InfoboxImageProps {
  src: string
  alt: string
}

function InfoboxImage({ src, alt }: InfoboxImageProps) {
  return <Image alt={alt} src={src} fill className="!relative p-4" />
}

interface InfoboxEntryProps {
  title: string
  value: any
}

function InfoboxEntry({ title, value }: InfoboxEntryProps) {
  return (
    <tr>
      <td className="flex px-4 py-2 text-sm font-bold">{title}</td>
      <td className="px-4 py-2 text-sm">
        <InfoboxValue value={value} />
      </td>
    </tr>
  )
}

interface InfoboxValueProps {
  value: any
}

function InfoboxValue({ value }: InfoboxValueProps) {
  if (Array.isArray(value)) return <ListEntry value={value} />

  if (typeof value === 'string') return <StringEntry value={value} />
}

interface ListEntryProps {
  value: string[]
}

function ListEntry({ value }: ListEntryProps) {
  return (
    <ul className="list-outside list-none">
      {value.map((x) => (
        <li key={x} className="whitespace-nowrap">
          {x}
        </li>
      ))}
    </ul>
  )
}

interface StringEntryProps {
  value: string
}

function StringEntry({ value }: StringEntryProps) {
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
      components={{
        a: ({ href, children }) => (
          <Link href={href!} className="underline">
            {children}
          </Link>
        ),
      }}
    >
      {value}
    </Markdown>
  )
}
