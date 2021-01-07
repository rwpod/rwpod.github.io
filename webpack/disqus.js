import {onDomReady} from './utils/dom'
import Turbolinks from 'turbolinks'

const DISQUS_SHORTNAME = 'rwpod'

/* Disqus */

const OBSERVER_THRESHOLD = 0.3

let disqusEmbedLoaded = false
let disqusCounterLoaded = false
let disqusObserver = null

const discusThreadElement = () => document.getElementById('disqus_thread')

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

const initDisqusEmbed = () => {
  if (disqusEmbedLoaded) {
    return
  }

  initDisqusScript()
  disqusEmbedLoaded = true
}

const initDisqusCounter = () => {
  if (disqusCounterLoaded) {
    return
  }

  initDisqusScript('count')
  disqusCounterLoaded = true
}

const toggleDisqusScript = (entry) => {
  entry.forEach((change) => {
    if (change.intersectionRatio >= OBSERVER_THRESHOLD) {
      initDisqusEmbed()
    }
  })
}

const cleanIntersectionObserver = () => {
  if (!discusThreadElement() || !disqusObserver) {
    return
  }

  disqusObserver.unobserve(discusThreadElement())
}

const initIntersectionObserver = () => {
  if (!discusThreadElement()) {
    return
  }

  if (!window.IntersectionObserver) {
    initDisqusEmbed()
    return
  }

  cleanIntersectionObserver()

  if (!disqusObserver) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: OBSERVER_THRESHOLD
    }

    disqusObserver = new window.IntersectionObserver(toggleDisqusScript, observerOptions)
  }

  disqusObserver.observe(discusThreadElement())
}

onDomReady(() => {
  initDisqusCounter()
  initIntersectionObserver()

  if (Turbolinks.supported) {
    document.addEventListener('turbolinks:load', () => {
      if (window.DISQUSWIDGETS && window.DISQUSWIDGETS.getCount) {
        window.DISQUSWIDGETS.getCount({
          reset: true
        })
      }

      initIntersectionObserver()

      if (discusThreadElement() && window.DISQUS && window.DISQUS.reset) {
        window.DISQUS.reset({
          reload: true,
          config: () => {
            this.page.identifier = document.title
            this.page.url = location.href
          }
        })
      }
    })
    document.addEventListener('turbolinks:before-cache', () => {
      cleanIntersectionObserver()
    })
  }
})
