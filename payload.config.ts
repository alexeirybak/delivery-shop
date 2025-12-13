import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export default buildConfig({
  serverURL: 'http://localhost:3000',
  
  collections: [
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    {
      slug: 'posts',
      admin: {
        useAsTitle: 'title',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
        },
        {
          name: 'excerpt',
          type: 'textarea',
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Черновик', value: 'draft' },
            { label: 'Опубликовано', value: 'published' },
          ],
          defaultValue: 'draft',
        },
      ],
    },
  ],
  
  secret: '6f0a80c1123c4f41985f2ad4ca960b398514c2bd3383a1ae0bc45860747723fa',
  
  db: mongooseAdapter({
    url: 'mongodb://127.0.0.1:27017/delivery-shop',
  }),
  
  editor: lexicalEditor(),
  
  admin: {
    user: 'users',
    autoLogin: {
      email: 'admin@example.com',
      password: 'admin123',
      prefillOnly: true,
    },
  },
})