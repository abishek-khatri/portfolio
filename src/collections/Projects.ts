import type { CollectionConfig } from 'payload'

const formatSlug = (val: string): string =>
  val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Project', plural: 'Projects' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', '_status', 'updatedAt'],
    preview: (doc) =>
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/projects/${doc?.slug}`,
  },
  // Visitors only see published projects. Logged-in admins see everything.
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  // Drafts give you Save draft / Publish / Unpublish buttons in the admin.
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Auto-filled from the title. Used in the URL.' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (typeof value === 'string' && value.length > 0) return formatSlug(value)
            if (typeof data?.title === 'string') return formatSlug(data.title)
            return value
          },
        ],
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Hardware', value: 'hardware' },
        { label: 'Software', value: 'software' },
        { label: '3D', value: '3d' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      maxLength: 200,
      admin: { description: 'One or two lines shown on the cards.' },
    },
    { name: 'fullDescription', type: 'richText' },
    { name: 'thumbnail', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'gallery',
      type: 'array',
      labels: { singular: 'Screenshot', plural: 'Screenshots' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'technologies',
      type: 'array',
      labels: { singular: 'Tag', plural: 'Technology tags' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    { name: 'githubUrl', type: 'text', label: 'GitHub URL' },
    { name: 'liveUrl', type: 'text', label: 'Live demo URL' },

    // ---------- Everything below fills in the project page (all optional) ----------
    {
      type: 'collapsible',
      label: 'Project page — facts',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'disciplines',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Hardware', value: 'hardware' },
            { label: 'Software', value: 'software' },
            { label: '3D', value: '3d' },
          ],
          admin: { description: 'Shown as the coloured words under the facts. Pick every kind of work this project has.' },
        },
        { name: 'role', type: 'text', admin: { description: 'Your part in it.' } },
        { name: 'year', type: 'text', admin: { description: 'For example 2026.' } },
        { name: 'status', type: 'text', admin: { description: 'For example: built, tested, shipped.' } },
      ],
    },
    {
      type: 'collapsible',
      label: 'Project page — 3D viewer parts (up to 4)',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'parts',
          type: 'array',
          maxRows: 4,
          labels: { singular: 'Part', plural: 'Parts' },
          admin: { description: 'The labels beside the 3D viewer, from the top part to the bottom part.' },
          fields: [
            { name: 'name', type: 'text', required: true, admin: { description: 'For example: lid' } },
            { name: 'note', type: 'text', admin: { description: 'What it is, in a few words.' } },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Project page — results (up to 4)',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'results',
          type: 'array',
          maxRows: 4,
          labels: { singular: 'Result', plural: 'Results' },
          fields: [
            { name: 'value', type: 'text', required: true, admin: { description: 'The big number, for example 92' } },
            { name: 'unit', type: 'text', admin: { description: 'For example: % accuracy' } },
            { name: 'caption', type: 'text', admin: { description: 'What was measured.' } },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Project page — figures (up to 2)',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'figures',
          type: 'array',
          maxRows: 2,
          labels: { singular: 'Figure', plural: 'Figures' },
          admin: { description: 'A scope trace, data screenshot or system diagram.' },
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'caption', type: 'text' },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Project page — what broke, and how I fixed it',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'whatBroke',
          type: 'textarea',
          admin: { description: 'One thought per line. Each line goes on its own notebook line.' },
        },
        {
          name: 'howFixed',
          type: 'textarea',
          admin: { description: 'One thought per line.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Project page — how it changed (up to 3 versions)',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'versions',
          type: 'array',
          maxRows: 3,
          labels: { singular: 'Version', plural: 'Versions' },
          fields: [
            { name: 'label', type: 'text', required: true, admin: { description: 'For example: v1' } },
            { name: 'date', type: 'text', admin: { description: 'For example: Mar 2026' } },
            { name: 'image', type: 'upload', relationTo: 'media' },
            { name: 'note', type: 'text', admin: { description: 'What changed, and why.' } },
          ],
        },
      ],
    },
  ],
}