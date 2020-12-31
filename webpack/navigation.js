import {onDomReady} from './utils/dom'
import Turbolinks from 'turbolinks'
import {on} from 'delegated-events'

const navigationMedia = window.matchMedia('(max-width: 768px)')

/* NAVIGATIONS */
const navigationElement = () => document.querySelectorAll('.navigation')

const showHideNavigation = (isShow = false) => {
  navigationElement().forEach((el) => {
    el.style.display = (isShow ? 'block' : 'none')
  })
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

onDomReady(() => {
  navigationMedia.addEventListener('change', onNavigationMediaChange)

  if (Turbolinks.supported) {
    document.addEventListener('turbolinks:before-cache', () => {
      if (navigationMedia.matches) {
        showHideNavigation(false)
      }
    })
  }
})

on('click', '.menu-toggle', clickNavigation)
