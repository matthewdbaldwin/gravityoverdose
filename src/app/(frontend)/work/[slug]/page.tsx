import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Media, Project } from '@/payload-types'

export const dynamic = 'force-dynamic'

type Params = { slug: string }

async function getProject(slug: string): Promise<Project | null> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'projects',
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
    },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: 'Not found' }
  return {
    title: `${project.title} — GravityOverdose`,
    description: project.tagline ?? undefined,
  }
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  const accent = project.accentColor || '#ff4d2e'
  const cover = isMedia(project.cover) ? project.cover : null

  return (
    <article className="min-h-screen bg-black text-white font-sans">
      <header className="px-8 md:px-14 py-6 flex items-center justify-between text-xs tracking-widest text-white/50">
        <Link href="/work" className="hover:text-white transition">← ARCHIVE</Link>
        <span>{project.year}</span>
      </header>

      <section className="px-8 md:px-14 pt-12 md:pt-20 pb-16">
        <h1
          className="font-black tracking-tighter leading-[0.9]"
          style={{ fontSize: 'clamp(2.5rem, 9vw, 9rem)', color: accent }}
        >
          {project.title}
        </h1>
        {project.tagline && (
          <p className="mt-6 text-xl md:text-2xl text-white/70 italic font-serif max-w-3xl">
            {project.tagline}
          </p>
        )}
      </section>

      {cover && (
        <figure className="px-8 md:px-14 pb-16">
          <CoverImage media={cover} title={project.title} />
        </figure>
      )}

      {project.sections?.length ? (
        <div className="px-8 md:px-14 pb-16 space-y-16 max-w-5xl mx-auto">
          {project.sections.map((block, i) => (
            <Section key={i} block={block} />
          ))}
        </div>
      ) : null}

      {project.gallery?.length ? (
        <section className="px-8 md:px-14 pb-16">
          <h2 className="text-xs tracking-widest text-white/50 mb-6">GALLERY</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {project.gallery.map((item, i) => {
              const img = isMedia(item.image) ? item.image : null
              if (!img) return null
              return (
                <figure key={i}>
                  <CoverImage media={img} title={item.caption ?? `${project.title} ${i + 1}`} />
                  {item.caption && (
                    <figcaption className="mt-2 text-sm text-white/50">{item.caption}</figcaption>
                  )}
                </figure>
              )
            })}
          </div>
        </section>
      ) : null}

      <footer className="px-8 md:px-14 py-16 border-t border-white/10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        {project.tags?.length ? (
          <ul className="flex flex-wrap gap-2 text-xs tracking-widest text-white/60">
            {project.tags.map((tag) => (
              <li key={tag} className="border border-white/15 px-3 py-1 rounded-full">{tag}</li>
            ))}
          </ul>
        ) : <span />}

        {project.externalUrl && (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm tracking-widest hover:opacity-80 transition"
            style={{ color: accent }}
          >
            VISIT LIVE SITE ↗
          </a>
        )}
      </footer>
    </article>
  )
}

function isMedia(v: unknown): v is Media {
  return typeof v === 'object' && v !== null && 'url' in v
}

function CoverImage({ media, title }: { media: Media; title: string }) {
  const url = media.url
  const alt = media.alt || title
  if (!url) return null
  const width = media.width ?? 1600
  const height = media.height ?? 900
  return (
    <Image
      src={url}
      alt={alt}
      width={width}
      height={height}
      className="w-full h-auto"
      sizes="(min-width: 768px) 80vw, 100vw"
    />
  )
}

type Block = NonNullable<Project['sections']>[number]

function Section({ block }: { block: Block }) {
  switch (block.blockType) {
    case 'richText':
      return block.content ? (
        <div className="prose prose-invert max-w-none text-lg leading-relaxed">
          <RichText data={block.content} />
        </div>
      ) : null
    case 'imageFull': {
      const img = isMedia(block.image) ? block.image : null
      if (!img) return null
      return (
        <figure>
          <CoverImage media={img} title={block.caption ?? 'image'} />
          {block.caption && (
            <figcaption className="mt-2 text-sm text-white/50">{block.caption}</figcaption>
          )}
        </figure>
      )
    }
    case 'twoColumn':
      return (
        <div className="grid md:grid-cols-2 gap-12 text-lg leading-relaxed">
          <div className="prose prose-invert max-w-none">
            {block.left ? <RichText data={block.left} /> : null}
          </div>
          <div className="prose prose-invert max-w-none">
            {block.right ? <RichText data={block.right} /> : null}
          </div>
        </div>
      )
    default:
      return null
  }
}
