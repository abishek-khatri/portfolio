import config from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { PlaceholderCard, ProjectCard, ProjectRow } from '@/components/notebook/ProjectCards'
import type { Project } from '@/payload-types'

export const dynamic = 'force-dynamic'

type Filter = 'all' | 'hardware' | 'software' | '3d'

function parseFilter(value: string | undefined): Filter {
  return value === 'hardware' || value === 'software' || value === '3d' ? value : 'all'
}

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const filter = parseFilter(category)

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'projects',
    where: { _status: { equals: 'published' } },
    sort: '-updatedAt',
    depth: 1,
    limit: 100,
  })

  const hardware = docs.filter((p: Project) => p.category === 'hardware')
  const software = docs.filter((p: Project) => p.category === 'software')
  const threeD = docs.filter((p: Project) => p.category === '3d')
  // Projects where no category was picked in the admin still show up in "all work".
  const uncategorised = docs.filter((p: Project) => !p.category)

  const tabs: { key: Filter; label: string; count: number; href: string }[] = [
    { key: 'all', label: 'all work', count: docs.length, href: '/projects' },
    { key: 'hardware', label: 'hardware', count: hardware.length, href: '/projects?category=hardware' },
    { key: 'software', label: 'software', count: software.length, href: '/projects?category=software' },
    { key: '3d', label: '3D', count: threeD.length, href: '/projects?category=3d' },
  ]

  const show = (key: Filter) => filter === 'all' || filter === key

  return (
    <main>
      <section className="nb-wrap page-head">
        <p className="hand eyebrow">work</p>
        <h1 className="display page-title">everything on the desk.</h1>
        <p className="page-intro">
          Circuits, code and 3D models — filter by drawer, or look at it all at once.
        </p>

        <nav className="filters hand" aria-label="Filter projects">
          {tabs.map((tab) => (
            <Link key={tab.key} href={tab.href} className={filter === tab.key ? 'on' : undefined}>
              {tab.label} ({tab.count})
            </Link>
          ))}
        </nav>
        <hr className="rule" />
      </section>

      {docs.length === 0 && (
        <section className="nb-wrap" style={{ paddingTop: 40 }}>
          <p className="hand empty-note">(nothing published yet — add a project in /admin)</p>
          <div className="card-grid cols-3">
            <PlaceholderCard title="[the board you built]" category="hardware" index={0} />
            <PlaceholderCard title="[the app you shipped]" category="software" index={1} />
            <PlaceholderCard title="[the model you drew]" category="3d" index={2} />
          </div>
        </section>
      )}

      {filter === 'all' && uncategorised.length > 0 && (
        <section className="nb-wrap" style={{ paddingTop: 32 }}>
          <h2 className="display section-title">on the desk</h2>
          <p className="hand section-hint">(pick a category on these in /admin to sort them into a drawer)</p>
          <div className="card-grid cols-3">
            {uncategorised.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {show('hardware') && hardware.length > 0 && (
        <section className="nb-wrap" style={{ paddingTop: 32 }}>
          <h2 className="display section-title scribble" style={{ ['--scribble-color' as string]: 'var(--ink)' }}>
            hardware
          </h2>
          <div className="card-grid cols-3">
            {hardware.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {show('software') && software.length > 0 && (
        <section className="nb-wrap" style={{ paddingTop: 32, paddingBottom: 72 }}>
          <h2 className="display section-title scribble" style={{ ['--scribble-color' as string]: 'var(--pen)' }}>
            software
          </h2>
          <div style={{ marginTop: 40 }}>
            {software.map((p, i) => (
              <ProjectRow key={p.id} project={p} number={i + 1} />
            ))}
          </div>
        </section>
      )}

      {show('3d') && threeD.length > 0 && (
        <section className="nb-wrap" style={{ paddingTop: 32 }}>
          <h2 className="display section-title scribble" style={{ ['--scribble-color' as string]: 'var(--ember)' }}>
            3D
          </h2>
          <div className="card-grid cols-3">
            {threeD.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}