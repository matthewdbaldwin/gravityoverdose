import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'status', 'updatedAt'],
  },
  access: {
    read: () => true, // public read
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'tagline', type: 'text' },
    { name: 'year', type: 'number', required: true },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published'],
      defaultValue: 'draft',
      required: true,
    },
    { name: 'accentColor', type: 'text', admin: { description: 'Hex, e.g. #ff4d2e' } },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'sections',
      type: 'blocks',
      blocks: [
        {
          slug: 'richText',
          fields: [{ name: 'content', type: 'richText' }],
        },
        {
          slug: 'imageFull',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'caption', type: 'text' },
          ],
        },
        {
          slug: 'twoColumn',
          fields: [
            { name: 'left', type: 'richText' },
            { name: 'right', type: 'richText' },
          ],
        },
      ],
    },
    { name: 'tags', type: 'text', hasMany: true },
    { name: 'externalUrl', type: 'text' },
  ],
}