import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'projects',
    where: { _status: { equals: 'published' } },
    depth: 1,
    limit: 50,
  })

  return (
    <main style={{ padding: 32 }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>Projects</h1>
      {docs.length === 0 && <p>No published projects yet.</p>}
      <ul>
        {docs.map((p) => (
          <li key={p.id} style={{ marginBottom: 12 }}>
            <strong>{p.title}</strong> — {p.shortDescription}
          </li>
        ))}
      </ul>
    </main>
  )
}