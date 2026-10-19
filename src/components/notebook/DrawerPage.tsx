import config from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import type { Media, Project, SiteSetting } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

import { DrawerDoodles } from './DrawerDoodles'
import { PlaceholderCard, ProjectRow } from './ProjectCards'
import { ExplodedWidget, LossCurve, RcLowPass } from './Widgets'

import './drawer.css'

type Drawer = 'hardware' | 'software' | '3d'

const DRAWERS: Record<
  Drawer,
  { number: string; title: string; href: string; color: string; tab: string; hint: string }
> = {
  hardware: {
    number: '01',
    title: 'hardware',
    href: '/hardware',
    color: 'var(--ink)',
    tab: 'hardware',
    hint: 'a small working widget: an RC filter you can drag',
  },
  software: {
    number: '02',
    title: 'software',
    href: '/software',
    color: 'var(--pen)',
    tab: 'software',
    hint: 'a small working widget: a training curve you can scrub',
  },
  '3d': {
    number: '03',
    title: '3D models',
    href: '/3d',
    color: 'var(--ember)',
    tab: '3D',
    hint: 'a small working widget: pull the enclosure apart',
  },
}

const DEFAULT_INTRO =
  '[A sentence or two about what you make in this area: what you like building and the tools you reach for.]'

function mediaOf(m: number | Media | null | undefined, alt: string): { url: string; alt: string } | null {
  if (!m || typeof m === 'number') return null
  const url = getMediaUrl(m.url, m.updatedAt)
  return url ? { url, alt: m.alt || alt } : null
}

function yearOf(p: Project): string {
  return p.year || (p.createdAt ? String(new Date(p.createdAt).getFullYear()) : '')
}

function stackOf(p: Project): string {
  return (p.technologies || []).map((t) => t.name).join(' · ')
}

function Chip({ project }: { project: Project }) {
  const r = project.results && project.results[0]
  if (!r) return null
  return (
    <div className="chip">
      <span className="hand v">{r.value}</span>
      {r.unit && <span className="u">{r.unit}</span>}
    </div>
  )
}

function Thumb({ project }: { project: Project }) {
  const img = mediaOf(project.thumbnail, project.title)
  return (
    <div className="slot-wrap">
      <div className="slot">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img.url} alt={img.alt} />
        ) : (
          <span className="hand slot-hint">no image yet</span>
        )}
      </div>
      <Chip project={project} />
    </div>
  )
}

function DrawerCard({ project, index }: { project: Project; index: number }) {
  const meta = [yearOf(project), stackOf(project)].filter(Boolean).join(' · ')
  return (
    <Link href={`/projects/${project.slug}`} className={`nb-card drawer-card ${index % 2 ? 'r2' : 'r1'}`}>
      <span className={index % 2 ? 'tape' : 'tape alt'} />
      <Thumb project={project} />
      <h3 className="display card-title">{project.title}</h3>
      <p className="card-oneliner">{project.shortDescription}</p>
      <div className="drawer-meta">
        <span className="hand m">{meta}</span>
        <span className="hand o">open →</span>
      </div>
    </Link>
  )
}

function FeaturedCard({ project }: { project: Project }) {
  const facts = [
    { l: 'role', v: project.role },
    { l: 'stack', v: stackOf(project) },
    { l: 'year', v: yearOf(project) },
  ].filter((f) => f.v)

  return (
    <Link href={`/projects/${project.slug}`} className="nb-card featured">
      <span className="tape" />
      <Thumb project={project} />
      <div>
        <p className="hand featured-label">featured</p>
        <h2 className="display featured-title">{project.title}</h2>
        <p className="featured-desc">{project.shortDescription}</p>
        {facts.length > 0 && (
          <div className="featured-facts">
            {facts.map((f) => (
              <div className="featured-fact" key={f.l}>
                <span className="l">{f.l}</span>
                <span>{f.v}</span>
              </div>
            ))}
          </div>
        )}
        <span className="hand featured-open">open project →</span>
      </div>
    </Link>
  )
}

export async function DrawerPage({ drawer }: { drawer: Drawer }) {
  const info = DRAWERS[drawer]
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'projects',
    where: {
      and: [{ _status: { equals: 'published' } }, { category: { equals: drawer } }],
    },
    sort: '-updatedAt',
    depth: 1,
    limit: 100,
  })

  let settings: SiteSetting | null = null
  try {
    settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  } catch {
    settings = null
  }

  const intro =
    (drawer === 'hardware'
      ? settings?.drawerHardwareIntro
      : drawer === 'software'
        ? settings?.drawerSoftwareIntro
        : settings?.drawer3dIntro) || DEFAULT_INTRO

  const tabs: { label: string; href: string; color: string; on: boolean }[] = [
    { label: 'all work', href: '/projects', color: 'var(--ink)', on: false },
    { label: 'hardware', href: '/hardware', color: 'var(--ink)', on: drawer === 'hardware' },
    { label: 'software', href: '/software', color: 'var(--pen)', on: drawer === 'software' },
    { label: '3D', href: '/3d', color: 'var(--ember)', on: drawer === '3d' },
  ]

  const others = (Object.keys(DRAWERS) as Drawer[]).filter((d) => d !== drawer)

  const featured = drawer === 'hardware' ? (docs.find((p) => p.featured) ?? docs[0]) : null
  const rest = featured ? docs.filter((p) => p.id !== featured.id) : docs

  return (
    <main className="nb-wrap">
      <Link href="/projects" className="hand back-link">
        ← all work
      </Link>

      <section className="drawer-head">
        <div>
          <p className="hand drawer-eyebrow">{`drawer ${info.number} / 03`}</p>
          <h1
            className="display drawer-title scribble"
            style={{ ['--scribble-color' as string]: info.color }}
          >
            {info.title}
          </h1>
          <p className="drawer-intro">{intro}</p>
        </div>
        <div className="drawer-side">
          <DrawerDoodles drawer={drawer} />
          <nav className="hand drawer-tabs" aria-label="Drawers">
            {tabs.map((t) => (
              <Link
                key={t.label}
                href={t.href}
                className={t.on ? 'on' : undefined}
                style={{ color: t.color }}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {docs.length === 0 ? (
        <section>
          <p className="hand drawer-note">(nothing published here yet — add a project in /admin and pick this category)</p>
          <div className="drawer-grid">
            <PlaceholderCard title="[the first thing you built]" category={drawer} index={0} />
            <PlaceholderCard title="[the next thing you built]" category={drawer} index={1} />
          </div>
        </section>
      ) : drawer === 'software' ? (
        <section className="drawer-rows">
          {docs.map((p, i) => (
            <ProjectRow key={p.id} project={p} number={i + 1} />
          ))}
        </section>
      ) : (
        <section>
          {featured && <FeaturedCard project={featured} />}
          {rest.length > 0 && (
            <div className={drawer === '3d' ? 'drawer-grid tall' : 'drawer-grid'}>
              {rest.map((p, i) => (
                <DrawerCard key={p.id} project={p} index={i} />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="poke">
        <div className="sec-head">
          <h2 className="display sec-title">poke at it</h2>
          <p className="sec-hint">{info.hint}</p>
        </div>
        <div style={{ marginTop: 40 }}>
          {drawer === 'hardware' && <RcLowPass />}
          {drawer === 'software' && <LossCurve />}
          {drawer === '3d' && <ExplodedWidget />}
        </div>
      </section>

      <nav className="other" aria-label="Other drawers">
        <span className="hand l">other drawers:</span>
        {others.map((d) => (
          <Link
            key={d}
            href={DRAWERS[d].href}
            className="hand scribble"
            style={{ color: DRAWERS[d].color, ['--scribble-color' as string]: DRAWERS[d].color }}
          >
            {DRAWERS[d].title}
          </Link>
        ))}
      </nav>
    </main>
  )
}