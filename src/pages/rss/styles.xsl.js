import stylesheetContent from './styles.xsl.liquid?raw'
import { renderLiquid } from '@utils/liquid'
import { DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_AUTHOR } from '@utils/helpers'

export const get = async () => {
  const body = await renderLiquid(stylesheetContent, {
    title: DEFAULT_TITLE,
    site: import.meta.env.SITE,
    description: DEFAULT_DESCRIPTION,
    author: DEFAULT_AUTHOR
  })

  return { body }
}
