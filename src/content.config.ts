import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/data/posts',
    generateId: ({ entry }) => {
      const entryNoExt = entry.replace(/\.md$/, '')
      const idParts = entryNoExt.split('/')
      return idParts[idParts.length - 1]
    }
  }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    audio_url: z.url(),
    audio_size: z.number(),
    audio_aac_url: z.url().optional(),
    audio_aac_size: z.number().optional(),
    duration: z.string(),
    cover: z.string(),
    draft: z.boolean().optional().default(false)
  })
})

export const collections = { posts }
