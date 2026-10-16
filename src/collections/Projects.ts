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
  ],
}