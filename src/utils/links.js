export const getPathname = ({ pathname }) => pathname.replace(/\.html$/, '') // remove `.html` from the end

export const normalizePagePath = (path) => (
  path === '/' ? path : path.replace(/\/$/, '') // remove trailing slash for pagination
)

export const urlForPath = (path) => (
  (new URL(path, import.meta.env.SITE)).toString()
)

export const genPostUrl = ({ pubYear, pubMonth, pubDay, slug }) => (
  `/posts/${pubYear}/${pubMonth}/${pubDay}/${slug}`
)
