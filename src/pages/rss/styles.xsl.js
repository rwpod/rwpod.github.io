import stylesheetContent from '@utils/styles.xsl.liquid?raw'
import { renderLiquid } from '@utils/liquid'
import { DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_COPYRIGHT } from '@utils/content'

const body = await renderLiquid(stylesheetContent, {
  title: DEFAULT_TITLE,
  site: import.meta.env.SITE,
  description: DEFAULT_DESCRIPTION,
  copyright: DEFAULT_COPYRIGHT
})

export const get = async () => {
  return { body }
}
