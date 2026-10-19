import config from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { AboutDoodles } from '@/components/notebook/AboutDoodles'
import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

import './about.css'

export const dynamic = 'force-dynamic'

const DEFAULT_LEAD =
  "I'm an engineering student who builds the circuit, the code and the case it lives in."
const DEFAULT_P2 = "[Where you study, what year you're in, and what first got you taking things apart.]"
const DEFAULT_P3 = "[One thing you're proud of building, and one thing you're still figuring out.]"
const DEFAULT_STUDYING = 'circuit analysis\nstatics\nfluid mechanics\nsignals'

export default async function AboutPage() {
  const payload = await getPayload({ config })
  const s = await payload.findGlobal({ slug: 'site-settings', depth: 1 })

  const name = s.siteName || '[your name]'
  const email = s.email || '[your@email.com]'

  const photo = s.aboutPhoto && typeof s.aboutPhoto !== 'number' ? (s.aboutPhoto as Media) : null
  const photoUrl = photo ? getMediaUrl(photo.url, photo.updatedAt) : ''

  const studying = (s.studying || DEFAULT_STUDYING)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const findMe: { label: string; href: string }[] = []
  if (s.githubUrl) findMe.push({ label: 'github', href: s.githubUrl })
  if (s.linkedinUrl) findMe.push({ label: 'linkedin', href: s.linkedinUrl })
  if (s.email) findMe.push({ label: 'email', href: `mailto:${s.email}` })

  return (
    <main className="nb-wrap">
      <Link href="/" className="hand back-link">
        ← back to the desk
      </Link>

      <section className="about-top">
        <div className="nb-card portrait">
          <span className="tape" />
          <div className="slot">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt={photo?.alt || name} />
            ) : (
              <span className="hand slot-hint">
                a real photo of you,
                <br />
                at your bench
              </span>
            )}
          </div>
          <p className="hand caption">{s.aboutPhotoCaption || '[a caption in your own words]'}</p>
        </div>

        <div>
          <p className="hand about-eyebrow">about me</p>
          <h1 className="display about-title">
            {"hi, I'm "}
            <em>{`${name}.`}</em>
          </h1>
          <p className="about-lead">{s.aboutLead || DEFAULT_LEAD}</p>
          <p className="about-p">{s.aboutParagraph2 || DEFAULT_P2}</p>
          <p className="about-p">{s.aboutParagraph3 || DEFAULT_P3}</p>

          <div className="about-facts">
            <div className="about-fact">
              <span className="about-fact-label">right now</span>
              <span>{s.aboutRightNow || "[what you're building this month]"}</span>
            </div>
            <div className="about-fact">
              <span className="about-fact-label">looking for</span>
              <span>{s.aboutLookingFor || '[internships · collaborations · feedback]'}</span>
            </div>
            <div className="about-fact">
              <span className="about-fact-label">find me</span>
              <span>
                {findMe.length > 0
                  ? findMe.map((f, i) => (
                      <React.Fragment key={f.label}>
                        {i > 0 && ' · '}
                        <a href={f.href} target={f.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                          {f.label}
                        </a>
                      </React.Fragment>
                    ))
                  : '[github] · [linkedin] · [email]'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-work">
        <h2 className="display section-title">what I work with</h2>
        <div className="skills">
          <div>
            <p className="hand skill-name scribble" style={{ ['--scribble-color' as string]: 'var(--ink)' }}>
              hardware
            </p>
            <p className="skill-text">
              {s.skillsHardware || 'Circuit analysis, signals, sensors and embedded systems.'}
            </p>
          </div>
          <div>
            <p
              className="hand skill-name scribble c-pen"
              style={{ ['--scribble-color' as string]: 'var(--pen)' }}
            >
              software
            </p>
            <p className="skill-text">{s.skillsSoftware || 'Mobile apps and AI / ML applications.'}</p>
          </div>
          <div>
            <p
              className="hand skill-name scribble c-ember"
              style={{ ['--scribble-color' as string]: 'var(--ember)' }}
            >
              3D
            </p>
            <p className="skill-text">{s.skills3d || 'CAD modeling, enclosures and interactive 3D visuals.'}</p>
          </div>
        </div>
      </section>

      <section className="about-bottom">
        <div className="hand sticky-note studying">
          <p className="studying-title">what I&apos;m studying</p>
          <ul>
            {studying.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <AboutDoodles />

        <div className="sayhi">
          <a href={`mailto:${email}`} className="hand big scribble">
            say hi →
          </a>
          <a href={`mailto:${email}`} className="mail">
            {email}
          </a>
        </div>
      </section>
    </main>
  )
}