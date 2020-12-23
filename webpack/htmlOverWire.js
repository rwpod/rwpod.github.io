import {onDomReady} from './utils/dom'
import Turbolinks from 'turbolinks'

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
