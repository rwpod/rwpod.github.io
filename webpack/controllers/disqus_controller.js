import {Controller} from 'stimulus'
import {onDomReady} from 'utils/dom'

const DISQUS_SHORTNAME = 'rwpod'
const OBSERVER_THRESHOLD = 0.3
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: OBSERVER_THRESHOLD
}

let disqusEmbedLoaded = false
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

const initDisqusEmbed = () => {
  if (disqusEmbedLoaded) {
    return
  }

  initDisqusScript()
  disqusEmbedLoaded = true
}

export default class extends Controller {
  initialize() {
    this.toggleDisqusVisibility = this.toggleDisqusVisibility.bind(this)

    initDisqusCounter()

    onDomReady(() => {
      document.addEventListener('turbolinks:load', () => {
        if (window.DISQUSWIDGETS && window.DISQUSWIDGETS.getCount) {
          window.DISQUSWIDGETS.getCount({
            reset: true
          })
        }
        if (document.getElementById('disqus_thread') && window.DISQUS && window.DISQUS.reset) {
          window.DISQUS.reset({
            reload: true,
            config: () => {
              this.page.identifier = document.title
              this.page.url = location.href
            }
          })
        }
      })
    })
  }

  connect() {
    if (!window.IntersectionObserver) {
      initDisqusEmbed()
      return
    }

    this.disqusObserver = new window.IntersectionObserver(this.toggleDisqusVisibility, observerOptions)
    this.disqusObserver.observe(this.element)
  }

  disconnect() {
    if (this.disqusObserver) {
      this.disqusObserver.unobserve(this.element)
      this.disqusObserver = null
    }
  }

  toggleDisqusVisibility(entry) {
    entry.forEach((change) => {
      if (change.intersectionRatio >= OBSERVER_THRESHOLD) {
        initDisqusEmbed()
      }
    })
  }
}
