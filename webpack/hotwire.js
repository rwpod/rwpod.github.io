import Turbolinks from 'turbolinks'
import {onDomReady} from './utils/dom'
import {Application} from 'stimulus'
import {definitionsFromContext} from 'stimulus/webpack-helpers'

const application = Application.start()

const context = require.context('./controllers', true, /\.js$/)
application.load(definitionsFromContext(context))

onDomReady(() => {
  if (Turbolinks.supported) {
    Turbolinks.start()

    document.addEventListener('turbolinks:load', () => {
      if (window.ga) {
        window.ga('send', 'pageview', location.pathname)
      }
    })
  }
})
