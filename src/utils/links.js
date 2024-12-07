export const getPathname = ({ pathname }) => pathname.replace(/\.html$/, '') // remove `.html` from the end

export const urlForPath = (path) => new URL(path, import.meta.env.SITE).toString()

export const genPostUrl = ({ pubYear, pubMonth, pubDay, id }) =>
  `/posts/${pubYear}/${pubMonth}/${pubDay}/${id}`
