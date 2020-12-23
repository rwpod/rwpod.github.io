import {onDomReady} from './utils/dom'
import Turbolinks from 'turbolinks'

const DISQUS_SHORTNAME = 'rwpod'

/* Disqus */

let disqusCounterLoaded = false

const initDisqusScript = (type = 'embed') => {
  const script = document.createElement('script')
  script.async = true
  script.type = 'text/javascript'
  if (type === 'count') {
    script.id = 'dsq-count-scr'
  }
  script.src = `https://${DISQUS_SHORTNAME}.disqus.com/${type}.js`

  const parrent = document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]

  parrent.appendChild(script)
}

const initDisqusCounter = () => {
  if (disqusCounterLoaded) {
    return
  }

  initDisqusScript('count')
  disqusCounterLoaded = true
}

onDomReady(() => {
  initDisqusCounter()

  if (Turbolinks.supported) {
    document.addEventListener('turbolinks:load', () => {
      if (window.DISQUSWIDGETS && window.DISQUSWIDGETS.getCount) {
        window.DISQUSWIDGETS.getCount({reset: true})
      }
    })
  }
})
