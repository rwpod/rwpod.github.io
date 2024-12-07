import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/data/posts'
  }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    audio_url: z.string().url(),
    audio_size: z.number(),
    audio_aac_url: z.string().url().optional(),
    audio_aac_size: z.number().optional(),
    duration: z.string(),
    cover: z.string(),
    draft: z.boolean().optional().default(false)
  })
})

export const collections = { posts }
