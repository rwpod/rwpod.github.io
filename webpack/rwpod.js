import Plyr from 'plyr'
import {RetinaTag} from './retinaTag'

const onDomReady = () => {
  return new Promise((resolve) => {
    if (document.readyState !== 'loading') {
      return resolve()
    } else {
      return document.addEventListener('DOMContentLoaded', () => resolve())
    }
  })
}

const initPlayer = () => {
  const playerElement = document.getElementById('podcastPlayer')
  if (!playerElement) {
    return
  }
  new Plyr(playerElement, {
    iconUrl: '/images/plyr.svg'
  })
}

const initNavigation = () => {
  const navigation = document.querySelectorAll('.navigation')
  const menuToggle = document.querySelector('.menu-toggle')

  if (!menuToggle || !navigation.length) {
    return
  }

  const clickNavigation = (e) => {
    e.preventDefault()
    const firstElement = navigation[0]
    if (firstElement.style.display === 'block') {
      navigation.forEach((el) => el.style.display = 'none')
    } else {
      navigation.forEach((el) => el.style.display = 'block')
    }
  }

  menuToggle.addEventListener('click', clickNavigation)
}

onDomReady().then(() => {
  initPlayer()
  initNavigation()

  RetinaTag.init()
  RetinaTag.updateImages()
})

