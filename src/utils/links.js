export const normalizePathname = (path) => path.replace(/\.html$/, '')

export const normalizePagePath = (path) => (
  path === '/' ? path : path.replace(/\/$/, '') // remove trailing slash for pagination
)

export const urlForPath = (path) => (
  (new URL(path, import.meta.env.SITE)).toString()
)

export const genPostUrl = ({ pubYear, pubMonth, pubDay, slug }) => (
  `/posts/${pubYear}/${pubMonth}/${pubDay}/${slug}`
)
