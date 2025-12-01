import browserlist from './browserslist.config.js'
import postcssImport from 'postcss-import'
import postcssPresetEnv from 'postcss-preset-env'
import postcssReporter from 'postcss-reporter'

export default {
  plugins: [
    postcssImport({
      path: ['assets/css']
    }),
    postcssPresetEnv({
      stage: 1,
      browsers: browserlist,
      features: {
        'custom-properties': {
          strict: false,
          warnings: false,
          preserve: true
        }
      }
    }),
    postcssReporter()
  ]
}
