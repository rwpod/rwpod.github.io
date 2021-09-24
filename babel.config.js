const browserlist = require('./browserslist.config')

module.exports = function(api) {
  let validEnv = ['development', 'test', 'production']
  let currentEnv = api.env()
  let isTestEnv = api.env('test')

  if (!validEnv.includes(currentEnv)) {
    throw new Error(
      'Please specify a valid `NODE_ENV` or ' +
      '`BABEL_ENV` environment variables. Valid values are "development", ' +
      '"test", and "production". Instead, received: ' +
      JSON.stringify(currentEnv) +
      '.'
    )
  }

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: browserlist,
          bugfixes: true,
          modules: (isTestEnv ? 'auto' : false),
          useBuiltIns: 'usage',
          corejs: 3,
          exclude: ['transform-typeof-symbol']
        }
      ]
    ],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          helpers: false
        }
      ]
    ]
  }
}
