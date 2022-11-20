import { readFile } from 'node:fs/promises'

export const get = async () => {
  const sw = await readFile(
    new URL('./service-worker.mjs', import.meta.url).pathname,
    { encoding: 'utf8' }
  )
  return {
    body: sw
  }
}
