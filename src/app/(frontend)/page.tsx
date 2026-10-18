import config from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { ExplodedEnclosure } from '@/components/notebook/ExplodedEnclosure'
import { PlaceholderCard, ProjectCard } from '@/components/notebook/ProjectCards'
import { getSite } from '@/components/notebook/getSite'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const site = await getSite()
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'projects',
    where: { _status: { equals: 'published' } },
    sort: '-updatedAt',
    depth: 1,
    limit: 3,
  })

  // Anything after the last "& " in the headline shows in orange italics.
  const cut = site.headline.lastIndexOf('& ')
  const headlineBefore = cut >= 0 ? site.headline.slice(0, cut + 2) : site.headline
  const headlineAccent = cut >= 0 ? site.headline.slice(cut + 2) : ''

  return (
    <main>
      <section className="nb-wrap hero">
        <div>
          <p className="hand hero-greeting">{site.greeting}</p>
          <h1 className="display hero-title">
            {headlineBefore}
            {headlineAccent && <em>{headlineAccent}</em>}
          </h1>
          <p className="hero-intro">{site.intro}</p>
          <Link href="#desk" className="hand hero-cta scribble">
            see what&apos;s on the desk ↓
          </Link>
        </div>

        <div className="hero-stage">
          <div className="nb-card viewer-card">
            <span className="tape" />
            <ExplodedEnclosure />
            <p className="hand caption">fig. 1 — exploded view</p>
          </div>
          <div className="hero-below">
            <div className="hand sticky-note">
              drag it.
              <br />
              slide to explode
            </div>
            <div className="nb-card photo-card">
              <span className="tape alt" />
              <div className="slot" style={{ aspectRatio: '190 / 130' }}>
                <span className="hand slot-hint">a real photo of your board goes here</span>
              </div>
              <p className="hand caption">first working one</p>
            </div>
          </div>
        </div>
      </section>

      <section id="desk" className="nb-wrap" style={{ paddingTop: 40 }}>
        <h2 className="display section-title">on the desk right now</h2>
        {docs.length === 0 && (
          <p className="hand section-hint">(placeholders — publish a project in /admin to replace these)</p>
        )}

        <div className="card-grid cols-3">
          {docs.length > 0 ? (
            docs.map((project, i) => <ProjectCard key={project.id} project={project} index={i} />)
          ) : (
            <>
              <PlaceholderCard title="[the board you built]" category="hardware" index={0} />
              <PlaceholderCard title="[the app you shipped]" category="software" index={1} />
              <PlaceholderCard title="[the model you drew]" category="3d" index={2} />
            </>
          )}
        </div>
      </section>
    </main>
  )
}