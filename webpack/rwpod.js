import Plyr from 'plyr'
import {RetinaTag} from './retinaTag'
import Turbolinks from 'turbolinks'

const DISQUS_SHORTNAME = 'rwpod'
const navigationMedia = window.matchMedia('(max-width: 768px)')

const onDomReady = () => {
  return new Promise((resolve) => {
    if (document.readyState !== 'loading') {
      return resolve()
    } else {
      return document.addEventListener('DOMContentLoaded', () => resolve())
    }
  })
}

/* NAVIGATIONS */

const menuToggle = () => document.querySelector('.menu-toggle')
const navigationElement = () => document.querySelectorAll('.navigation')

const showHideNavigation = (isShow = false) => {
  navigationElement().forEach((el) => el.style.display = (isShow ? 'block' : 'none'))
}

const clickNavigation = (e) => {
  e.preventDefault()
  const firstElement = navigationElement()[0]
  if (firstElement) {
    if (firstElement.style.display === 'block') {
      showHideNavigation(false)
    } else {
      showHideNavigation(true)
    }
  }
}

const onNavigationMediaChange = (e) => {
  if (!e.matches) {
    showHideNavigation(true)
  }
}

const initNavigation = () => {
  if (!menuToggle()) {
    return
  }

  menuToggle().addEventListener('click', clickNavigation)
  navigationMedia.addListener(onNavigationMediaChange)
}

const cleanNavigation = () => {
  if (!menuToggle()) {
    return
  }

  navigationMedia.removeListener(onNavigationMediaChange)
  menuToggle().removeEventListener('click', clickNavigation)
}

/* PLAYER */

const playerElement = () => document.getElementById('podcastPlayer')
let playerObject = null

const initPlayer = () => {
  if (!playerElement()) {
    return
  }
  playerObject = new Plyr(playerElement(), {
    iconUrl: '/images/plyr.svg'
  })
}

const cleanPlayer = () => {
  if (!playerElement() || !playerObject) {
    return
  }
  playerObject.destroy()
  playerObject = null
}

/* Turbolinks */

const initTurbolinks = () => {
  Turbolinks.start()
}

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

onDomReady().then(() => {
  initNavigation()
  initPlayer()
  initDisqusCounter()
  RetinaTag.init()
  RetinaTag.updateImages()

  if (Turbolinks.supported) {
    initTurbolinks()

    document.addEventListener('turbolinks:load', () => {
      initNavigation()
      initPlayer()
      RetinaTag.updateImages()
      if (window.DISQUSWIDGETS && window.DISQUSWIDGETS.getCount) {
        window.DISQUSWIDGETS.getCount({reset: true})
      }
      if (window.ga) {
        window.ga('send', 'pageview', location.pathname)
      }
    })

    document.addEventListener('turbolinks:before-cache', () => {
      if (navigationMedia.matches) {
        showHideNavigation(false)
      }
      cleanNavigation()
      cleanPlayer()
    })
  }
})

