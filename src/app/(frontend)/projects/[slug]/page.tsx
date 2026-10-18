import config from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { ExplodedEnclosure } from '@/components/notebook/ExplodedEnclosure'
import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export const dynamic = 'force-dynamic'

type Discipline = 'hardware' | 'software' | '3d'

const DISCIPLINE_LABEL: Record<Discipline, string> = {
  hardware: 'hardware',
  software: 'software',
  '3d': '3D',
}
const DISCIPLINE_COLOR: Record<Discipline, string> = {
  hardware: 'var(--ink)',
  software: 'var(--pen)',
  '3d': 'var(--ember)',
}
const VERSION_COLORS = ['var(--ink)', 'var(--pen)', 'var(--ember)']

function mediaOf(
  m: number | Media | null | undefined,
  fallbackAlt: string,
): { url: string; alt: string } | null {
  if (!m || typeof m === 'number') return null
  const url = getMediaUrl(m.url, m.updatedAt)
  return url ? { url, alt: m.alt || fallbackAlt } : null
}

function linesOf(text: string | null | undefined): string[] {
  const lines = (text || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  return Array.from({ length: Math.max(4, lines.length) }, (_, i) => lines[i] ?? '')
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'projects',
    where: { _status: { equals: 'published' } },
    sort: 'createdAt',
    depth: 1,
    limit: 100,
  })

  const index = docs.findIndex((p) => p.slug === slug)
  if (index === -1) notFound()

  const project = docs[index]
  const next = docs.length > 1 ? docs[(index + 1) % docs.length] : null
  const number = String(index + 1).padStart(2, '0')

  const disciplines: Discipline[] =
    project.disciplines && project.disciplines.length > 0
      ? project.disciplines
      : project.category
        ? [project.category]
        : []

  const stack = (project.technologies || []).map((t) => t.name).join(' · ')
  const year = project.year || (project.createdAt ? String(new Date(project.createdAt).getFullYear()) : '')
  const facts = [
    { label: 'role', value: project.role },
    { label: 'stack', value: stack },
    { label: 'year', value: year },
    { label: 'status', value: project.status },
  ].filter((f) => f.value)

  const parts = project.parts || []
  const results = project.results || []
  const figures = project.figures || []
  const versions = project.versions || []
  const hasNotes = Boolean(project.whatBroke?.trim() || project.howFixed?.trim())

  return (
    <main className="nb-wrap">
      <Link href="/projects" className="hand back-link">
        ← back to the desk
      </Link>

      <section className="detail-top">
        <div>
          <p className="hand detail-eyebrow">
            {`project ${number}`}
            {disciplines.length > 0 && ` · ${disciplines.map((d) => DISCIPLINE_LABEL[d]).join(' + ')}`}
          </p>
          <h1 className="display detail-title">{project.title}</h1>
          <p className="detail-intro">{project.shortDescription}</p>

          {facts.length > 0 && (
            <div className="facts">
              {facts.map((f) => (
                <div className="fact" key={f.label}>
                  <span className="fact-label">{f.label}</span>
                  <span>{f.value}</span>
                </div>
              ))}
            </div>
          )}

          {disciplines.length > 0 && (
            <div className="hand disciplines">
              {disciplines.map((d) => (
                <span
                  key={d}
                  className="scribble"
                  style={{ color: DISCIPLINE_COLOR[d], ['--scribble-color' as string]: DISCIPLINE_COLOR[d] }}
                >
                  {DISCIPLINE_LABEL[d]}
                </span>
              ))}
            </div>
          )}

          {(project.githubUrl || project.liveUrl) && (
            <div className="hand detail-links">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  github ↗
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  live demo ↗
                </a>
              )}
            </div>
          )}
        </div>

        <div className="nb-card detail-viewer">
          <span className="tape" />
          <p className="hand viewer-hint">drag to turn it around</p>
          <div className="detail-viewer-body">
            <ExplodedEnclosure />
            {parts.length > 0 && (
              <div className="parts">
                {parts.map((part, i) => (
                  <div className="part" key={part.id || i}>
                    <p className="hand part-name">{`${String(parts.length - i).padStart(2, '0')} · ${part.name}`}</p>
                    {part.note && <p className="part-note">{part.note}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {results.length > 0 && (
        <section className="sec">
          <div className="sec-head">
            <h2 className="display sec-title">results</h2>
            <p className="sec-hint">real numbers from my own tests</p>
          </div>
          <div className="results">
            {results.map((r, i) => (
              <div className="nb-card result" key={r.id || i}>
                <p className="hand num scribble">{r.value}</p>
                {r.unit && <p className="unit">{r.unit}</p>}
                {r.caption && <p className="cap">{r.caption}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {figures.length > 0 && (
        <section className="figures">
          {figures.map((fig, i) => {
            const img = mediaOf(fig.image, fig.caption || project.title)
            return (
              <div className={`nb-card ${i % 2 ? 'r2' : 'r1'}`} key={fig.id || i}>
                <span className={i % 2 ? 'tape' : 'tape alt'} />
                <div className="slot">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.url} alt={img.alt} />
                  ) : (
                    <span className="hand slot-hint">no image yet</span>
                  )}
                </div>
                <p className="hand fig-caption">{`fig. ${i + 2}${fig.caption ? ` — ${fig.caption}` : ''}`}</p>
              </div>
            )
          })}
        </section>
      )}

      {hasNotes && (
        <section className="sec">
          <h2 className="display sec-title">what broke, and how I fixed it</h2>
          <div className="notes">
            <div className="nb-card note-card">
              <h3 className="hand c-ember">what broke</h3>
              <div className="note-lines">
                {linesOf(project.whatBroke).map((line, i) => (
                  <p className="note-line" key={i}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
            <span className="hand note-arrow" aria-hidden="true">
              →
            </span>
            <div className="nb-card note-card">
              <h3 className="hand c-pen">how I fixed it</h3>
              <div className="note-lines">
                {linesOf(project.howFixed).map((line, i) => (
                  <p className="note-line" key={i}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {versions.length > 0 && (
        <section className="sec">
          <div className="sec-head">
            <h2 className="display sec-title">how it changed</h2>
            <p className="sec-hint">one line each</p>
          </div>
          <div className="versions">
            {versions.map((v, i) => {
              const img = mediaOf(v.image, `${project.title} ${v.label}`)
              return (
                <div className="nb-card version" key={v.id || i}>
                  <div className="v-head">
                    <span className="hand v-label" style={{ color: VERSION_COLORS[i % 3] }}>
                      {v.label}
                    </span>
                    {v.date && <span className="hand v-date">{v.date}</span>}
                  </div>
                  <div className="slot">
                    {img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img.url} alt={img.alt} />
                    )}
                  </div>
                  {v.note && <p className="v-note">{v.note}</p>}
                </div>
              )
            })}
          </div>
        </section>
      )}

      <nav className="detail-nav" aria-label="Project navigation">
        <Link href="/projects" className="hand">
          ← all work
        </Link>
        {next && (
          <Link href={`/projects/${next.slug}`} className="hand next scribble">
            next project →
          </Link>
        )}
      </nav>
    </main>
  )
}