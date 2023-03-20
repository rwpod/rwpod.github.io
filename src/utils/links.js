export const urlForPath = (path) => (
  (new URL(path, import.meta.env.SITE)).toString()
)

export const genPostUrl = ({ pubYear, pubMonth, pubDay, slug }) => (
  `/posts/${pubYear}/${pubMonth}/${pubDay}/${slug}`
)
