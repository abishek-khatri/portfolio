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

    // ---------- Everything below fills in the About page (all optional) ----------
    {
      type: 'collapsible',
      label: 'About page',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'aboutPhotoCaption',
          type: 'text',
          defaultValue: '[a caption in your own words]',
          admin: { description: 'Shown under your photo.' },
        },
        {
          name: 'aboutLead',
          type: 'textarea',
          defaultValue:
            "I'm an engineering student who builds the circuit, the code and the case it lives in.",
          admin: { description: 'The first, larger paragraph.' },
        },
        {
          name: 'aboutParagraph2',
          type: 'textarea',
          defaultValue:
            "[Where you study, what year you're in, and what first got you taking things apart.]",
        },
        {
          name: 'aboutParagraph3',
          type: 'textarea',
          defaultValue: "[One thing you're proud of building, and one thing you're still figuring out.]",
        },
        { name: 'aboutRightNow', type: 'text', defaultValue: "[what you're building this month]" },
        { name: 'aboutLookingFor', type: 'text', defaultValue: '[internships · collaborations · feedback]' },
        { name: 'githubUrl', type: 'text', label: 'GitHub URL' },
        { name: 'linkedinUrl', type: 'text', label: 'LinkedIn URL' },
        {
          name: 'skillsHardware',
          type: 'textarea',
          defaultValue: 'Circuit analysis, signals, sensors and embedded systems.',
        },
        {
          name: 'skillsSoftware',
          type: 'textarea',
          defaultValue: 'Mobile apps and AI / ML applications.',
        },
        {
          name: 'skills3d',
          type: 'textarea',
          defaultValue: 'CAD modeling, enclosures and interactive 3D visuals.',
        },
        {
          name: 'studying',
          type: 'textarea',
          defaultValue: 'circuit analysis\nstatics\nfluid mechanics\nsignals',
          admin: { description: 'One subject per line. Shown on the yellow sticky note.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Hardware / Software / 3D pages',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'drawerHardwareIntro',
          type: 'textarea',
          defaultValue:
            '[A sentence or two about what you make in this area: what you like building and the tools you reach for.]',
          admin: { description: 'The intro on the Hardware page.' },
        },
        {
          name: 'drawerSoftwareIntro',
          type: 'textarea',
          defaultValue:
            '[A sentence or two about what you make in this area: what you like building and the tools you reach for.]',
          admin: { description: 'The intro on the Software page.' },
        },
        {
          name: 'drawer3dIntro',
          type: 'textarea',
          defaultValue:
            '[A sentence or two about what you make in this area: what you like modelling and the tools you reach for.]',
          admin: { description: 'The intro on the 3D models page.' },
        },
      ],
    },
  ],
}