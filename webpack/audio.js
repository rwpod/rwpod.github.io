import Plyr from 'plyr'
import {onDomReady} from './utils/dom'
import Turbolinks from 'turbolinks'
import {on} from 'delegated-events'

/* PLAYER */

const footerVisibilityClass = 'footer-audio-player__visible'
const footerPlayerContainer = () => document.getElementById('footerAudioPlayer')
let player = null

const getArticleButton = () => document.querySelector('.track-play-button')

const setArticlePlayButton = (svgIcon) => {
  if (svgIcon.classList?.contains('svg-icon--pause')) {
    svgIcon.classList.replace('svg-icon--pause', 'svg-icon--play')
    svgIcon.innerHTML = "<svg class='svg-icon__cnt'><use xlink:href='#play-svg-icon'/></svg>"
  }
}

const setArticlePauseButton = (svgIcon) => {
  if (svgIcon.classList?.contains('svg-icon--play')) {
    svgIcon.classList.replace('svg-icon--play', 'svg-icon--pause')
    svgIcon.innerHTML = "<svg class='svg-icon__cnt'><use xlink:href='#pause-svg-icon'/></svg>"
  }
}

const refreshButtonState = () => {
  const playArticleButton = getArticleButton()

  if (!player || !playArticleButton) {
    return
  }

  if (!playArticleButton.dataset?.audioUrl || playArticleButton.dataset?.audioUrl !== player.source) {
    return
  }

  const svgIcon = playArticleButton.querySelector('.svg-icon')

  if (svgIcon) {
    if (player.playing) {
      setArticlePauseButton(svgIcon)
    } else if (!player.playing) {
      setArticlePlayButton(svgIcon)
    }
  }
}

const resetButtonState = () => {
  const playArticleButton = getArticleButton()

  if (!player || !playArticleButton) {
    return
  }

  const svgIcon = playArticleButton.querySelector('.svg-icon')

  if (svgIcon) {
    setArticlePlayButton(svgIcon)
  }
}

const initAudioPoster = ({title, image, link}) => {
  const posterContainer = footerPlayerContainer().querySelector('.footer-audio-player-cover')

  const prevLink = posterContainer.querySelector('a')
  if (prevLink && prevLink.pathname === link) {
    return // it is the same podcast link
  }

  const linkEl = document.createElement('a')
  linkEl.href = link
  linkEl.title = title

  const imgEl = document.createElement('img')
  imgEl.src = image
  imgEl.alt = title
  imgEl.title = title

  linkEl.appendChild(imgEl)

  posterContainer.textContent = ''
  posterContainer.appendChild(linkEl)
}

const createAudioPlayer = (url) => {
  const audio = document.createElement('audio')
  audio.controls = 'controls'

  const source = document.createElement('source')
  source.src = url
  source.type = 'audio/mp3'

  audio.appendChild(source)
  footerPlayerContainer().querySelector('.footer-audio-player-container').appendChild(audio)
  return audio
}

const createOrReplaceAudioPlayer = (url) => {
  const audio = footerPlayerContainer().querySelector('audio')

  if (audio) {
    const source = audio.querySelector('source')
    if (source) {
      source.src = url
    } else {
      const source = document.createElement('source')
      source.src = url
      source.type = 'audio/mp3'
      audio.appendChild(source)
    }
    return audio
  }

  return createAudioPlayer(url)
}

const clickPlayPlayerButton = (e) => {
  e.preventDefault()

  const {title, audioUrl, image, link} = e.currentTarget?.dataset

  if (!audioUrl) {
    console.error('Too old browser')
    return
  }

  initAudioPoster({title, image, link})

  const audioEl = createOrReplaceAudioPlayer(audioUrl)

  if (!player) {
    player = new Plyr(audioEl, {
      volume: 0.8,
      iconUrl: '/images/plyr.svg'
    })
    player.on('play', refreshButtonState)
    player.on('pause', refreshButtonState)
  }

  if (player.source !== audioUrl) {
    player.source = {
      type: 'audio',
      title,
      sources: [
        {
          src: audioUrl,
          type: 'audio/mp3',
        }
      ]
    }
  }

  player.togglePlay()

  if (!footerPlayerContainer().classList.contains(footerVisibilityClass)) {
    footerPlayerContainer().classList.add(footerVisibilityClass)
  }
}

const clickClosePlayerButton = () => {
  footerPlayerContainer().classList.remove(footerVisibilityClass)
  resetButtonState()
  if (player) {
    player.stop()
    player.destroy()
    player = null
  }
}

onDomReady(() => {
  if (Turbolinks.supported) {
    document.addEventListener('turbolinks:load', refreshButtonState)
    document.addEventListener('turbolinks:before-cache', resetButtonState)
  }
})

on('click', '.track-play-button', clickPlayPlayerButton)
on('click', '.footer-audio-player-close-button', clickClosePlayerButton)
