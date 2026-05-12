import { getPayload } from 'payload'
import config from '@payload-config'
import HomeClient, { type HomeProject } from './_components/HomeClient'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config })

  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    sort: '-year',
    limit: 4,
    depth: 1,
  })

  const items: HomeProject[] = projects.map((p, i) => ({
    n: String(i + 1).padStart(2, '0'),
    t: p.title.toUpperCase(),
    s: p.tagline ?? '',
    y: String(p.year),
    c: normalizeColor(p.accentColor) ?? '#ff4d2e',
    slug: p.slug,
  }))

  return <HomeClient projects={items} />
}

function normalizeColor(v: string | null | undefined): string | null {
  if (!v) return null
  const trimmed = v.trim()
  if (!trimmed) return null
  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`
}
