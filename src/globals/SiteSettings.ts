import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: '[your name]' },
    { name: 'greeting', type: 'text', defaultValue: "hi — i'm [your name], an engineering student" },
    { name: 'headline', type: 'textarea', defaultValue: 'I build the circuit, the code & the case it lives in.' },
    {
      name: 'intro',
      type: 'textarea',
      defaultValue:
        'Hardware, software and 3D. This site is the desk where all three meet. Pick things up, turn them around, take them apart.',
    },
    { name: 'email', type: 'email' },
    { name: 'footerText', type: 'text', defaultValue: '© 2026 — made by hand, mostly' },
    { name: 'aboutPhoto', type: 'upload', relationTo: 'media' },
  ],
}