import Plyr from 'plyr'
import {onDomReady} from './utils/dom'
import Turbolinks from 'turbolinks'

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
  if (playerObject) {
    playerObject.destroy()
    playerObject = null
  }
}

onDomReady(() => {
  initPlayer()

  if (Turbolinks.supported) {
    document.addEventListener('turbolinks:load', () => {
      initPlayer()
    })

    document.addEventListener('turbolinks:before-cache', () => {
      cleanPlayer()
    })
  }
})
