import Plyr from 'plyr'
import {onDomReady} from './utils/dom'
import Turbolinks from 'turbolinks'
import {on} from 'delegated-events'

/* PLAYER */

const footerHiddenClass = 'footer-audio-player__hidden'
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

const refreshPlayerAndButtonState = () => {
  const playArticleButton = getArticleButton()

  if (!player) {
    return
  }

  if (footerPlayerContainer().classList.contains(footerHiddenClass)) {
    footerPlayerContainer().classList.remove(footerHiddenClass)
  }

  if (!playArticleButton) {
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

const resetPlayerAndButtonState = () => {
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

  const imgSize = 50
  const imgEl = document.createElement('img')
  imgEl.src = `${image}?width=${imgSize}&height=${imgSize}`
  imgEl.srcset = `${image}?width=${imgSize}&height=${imgSize}, ${image}?width=${imgSize * 2}&height=${imgSize * 2} 2x`
  imgEl.alt = title
  imgEl.title = title
  imgEl.width = imgSize
  imgEl.height = imgSize

  linkEl.appendChild(imgEl)

  posterContainer.textContent = ''
  posterContainer.appendChild(linkEl)
}

const createAudioPlayer = (url) => {
  const audio = document.createElement('audio')
  audio.controls = 'controls'
  audio.crossorigin = 'anonymous'

  const source = document.createElement('source')
  source.src = url
  source.type = 'audio/mp3'
  source.crossorigin = 'anonymous'

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
    player.on('play', refreshPlayerAndButtonState)
    player.on('pause', refreshPlayerAndButtonState)
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

  if (footerPlayerContainer().classList.contains(footerHiddenClass)) {
    footerPlayerContainer().classList.remove(footerHiddenClass)
  }
}

const clickClosePlayerButton = () => {
  footerPlayerContainer().classList.add(footerHiddenClass)
  resetPlayerAndButtonState()
  if (player) {
    player.stop()
    player.destroy()
    player = null
  }
}

onDomReady(() => {
  if (Turbolinks.supported) {
    document.addEventListener('turbolinks:load', refreshPlayerAndButtonState)
    document.addEventListener('turbolinks:before-cache', resetPlayerAndButtonState)
  }
})

on('click', '.track-play-button', clickPlayPlayerButton)
on('click', '.footer-audio-player-close-button', clickClosePlayerButton)
