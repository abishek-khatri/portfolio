import config from '@payload-config'
import { getPayload } from 'payload'

export type SiteInfo = {
  name: string
  greeting: string
  headline: string
  intro: string
  email: string
  footerText: string
}

// Used if Site Settings is empty or the database can't be reached yet.
const DEFAULTS: SiteInfo = {
  name: '[your name]',
  greeting: "hi — i'm [your name], an engineering student",
  headline: 'I build the circuit, the code & the case it lives in.',
  intro:
    'Hardware, software and 3D. This site is the desk where all three meet. Pick things up, turn them around, take them apart.',
  email: '[your@email.com]',
  footerText: '© 2026 — made by hand, mostly',
}

// Reads the text you edit in the admin under Globals → Site Settings.
export async function getSite(): Promise<SiteInfo> {
  try {
    const payload = await getPayload({ config })
    const s = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    return {
      name: s.siteName || DEFAULTS.name,
      greeting: s.greeting || DEFAULTS.greeting,
      headline: s.headline || DEFAULTS.headline,
      intro: s.intro || DEFAULTS.intro,
      email: s.email || DEFAULTS.email,
      footerText: s.footerText || DEFAULTS.footerText,
    }
  } catch {
    return DEFAULTS
  }
}