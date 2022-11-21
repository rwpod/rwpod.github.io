export const pageRoute = (path) => (
  path === '/' ? path : `${path}.html`
)

export const urlForPath = (path) => (
  (new URL(path, import.meta.env.SITE)).toString()
)

export const genPostUrl = ({ pubYear, pubMonth, pubDay, slug }) => (
  pageRoute(`/posts/${pubYear}/${pubMonth}/${pubDay}/${slug}`)
)
