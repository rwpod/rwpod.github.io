import { z, defineCollection } from 'astro:content'

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    audio_url: z.string().url(),
    audio_size: z.number(),
    audio_aac_url: z.string().url().optional(),
    audio_aac_size: z.number().optional(),
    duration: z.string(),
    cover: z.string()
  })
})

export const collections = {
  posts: postsCollection
}
