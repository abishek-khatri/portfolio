import Link from 'next/link'
import React from 'react'

import type { Media, Project } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

type Category = NonNullable<Project['category']>

const CATEGORY_LABEL: Record<Category, string> = {
  hardware: 'hardware',
  software: 'software',
  '3d': '3D',
}

const CATEGORY_CLASS: Record<Category, string> = {
  hardware: 'hardware',
  software: 'software',
  '3d': 'threed',
}

function thumbnailOf(project: Project): { url: string; alt: string } | null {
  const t = project.thumbnail
  if (!t || typeof t === 'number') return null
  const media = t as Media
  const url = getMediaUrl(media.url, media.updatedAt)
  if (!url) return null
  return { url, alt: media.alt || project.title }
}

export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project
  index?: number
}) {
  const thumb = thumbnailOf(project)
  const category = project.category || 'hardware'
  const rotation = ['r1', 'r2', 'r3'][index % 3]

  return (
    <Link href={`/projects/${project.slug}`} className={`nb-card ${rotation}`}>
      <span className={index % 2 ? 'tape alt' : 'tape'} />
      <div className="slot">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb.url} alt={thumb.alt} />
        ) : (
          <span className="hand slot-hint">no image yet</span>
        )}
      </div>
      <h3 className="display card-title">{project.title}</h3>
      <p className="card-oneliner">{project.shortDescription}</p>
      <p className={`hand card-meta scribble ${CATEGORY_CLASS[category]}`}>
        {CATEGORY_LABEL[category]}
      </p>
    </Link>
  )
}

export function PlaceholderCard({
  title,
  category,
  index = 0,
}: {
  title: string
  category: Category
  index?: number
}) {
  const rotation = ['r1', 'r2', 'r3'][index % 3]
  return (
    <div className={`nb-card ${rotation}`}>
      <span className={index % 2 ? 'tape alt' : 'tape'} />
      <div className="slot" />
      <h3 className="display card-title">{title}</h3>
      <p className={`hand card-meta scribble ${CATEGORY_CLASS[category]}`}>
        {CATEGORY_LABEL[category]}
      </p>
    </div>
  )
}

export function ProjectRow({ project, number }: { project: Project; number: number }) {
  const thumb = thumbnailOf(project)
  const year = project.createdAt ? new Date(project.createdAt).getFullYear() : ''
  const stack = (project.technologies || []).map((t) => t.name).join(' · ')

  return (
    <Link href={`/projects/${project.slug}`} className="row">
      <span className="hand num">{String(number).padStart(2, '0')}</span>
      <div>
        <h3 className="display row-title">{project.title}</h3>
        <p className="card-oneliner">{project.shortDescription}</p>
      </div>
      <p className="hand row-stack">{stack}</p>
      <p className="row-year">{year}</p>
      <div className="row-thumb">
        {thumb && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb.url} alt={thumb.alt} />
        )}
      </div>
      <span className="hand row-arrow">→</span>
    </Link>
  )
}