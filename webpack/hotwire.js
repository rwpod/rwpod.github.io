import '@hotwired/turbo'
import {Application} from 'stimulus'
import {definitionsFromContext} from 'stimulus/webpack-helpers'

const application = Application.start()

const context = require.context('./controllers', true, /\.js$/)
application.load(definitionsFromContext(context))

document.addEventListener('turbo:load', () => {
  if (window.ga) {
    window.ga('send', 'pageview', location.pathname)
  }
})
