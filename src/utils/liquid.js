import { Liquid } from 'liquidjs'

const engine = new Liquid()

export const renderLiquid = async (template, vars = {}) => {
  return await engine.render(engine.parse(template), vars)
}
