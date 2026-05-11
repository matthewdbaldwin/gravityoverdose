import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

export default async function HomePage() {
  const payload = await getPayload({ config })

  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    sort: '-year',
    limit: 10,
  })

  return (
    <main className="min-h-screen bg-black text-white p-12">
      <h1 className="text-7xl font-black tracking-tighter">GRAVITY/OD</h1>
      <ul className="mt-20 divide-y divide-white/10 border-y border-white/10">
        {projects.map((p) => (
          <li key={p.id} className="py-8">
            <Link href={`/work/${p.slug}`} className="flex justify-between items-baseline group">
              <span className="text-4xl font-black group-hover:text-[#ff4d2e]">{p.title}</span>
              <span className="text-sm text-white/40">{p.year}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}