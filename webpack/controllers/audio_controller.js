import {Controller} from 'stimulus'
import {on, off} from 'delegated-events'
import Plyr from 'plyr'

let audioPlayer = null

const footerHiddenClass = 'footer-audio-player__hidden'
const externalPlayButtonSelector = '.track-play-button'

export default class extends Controller {
  static targets = ['cover', 'container']

  initialize() {
    this.refreshPlayerAndButtonState = this.refreshPlayerAndButtonState.bind(this)
    this.resetPlayerAndButtonState = this.resetPlayerAndButtonState.bind(this)
    this.clickPlayPlayerButton = this.clickPlayPlayerButton.bind(this)
  }

  connect() {
    document.addEventListener('turbo:load', this.refreshPlayerAndButtonState)
    document.addEventListener('turbo:before-cache', this.resetPlayerAndButtonState)

    on('click', externalPlayButtonSelector, this.clickPlayPlayerButton)
  }

  disconnect() {
    document.removeEventListener('turbo:load', this.refreshPlayerAndButtonState)
    document.removeEventListener('turbo:before-cache', this.resetPlayerAndButtonState)

    off('click', externalPlayButtonSelector, this.clickPlayPlayerButton)
  }

  getExternalButton() {
    return document.querySelector(externalPlayButtonSelector)
  }

  initAudioPoster({title, image, link}) {
    const prevLink = this.coverTarget.querySelector('a')
    if (prevLink && prevLink.pathname === link) {
      return // it is the same podcast link
    }

    const linkEl = document.createElement('a')
    linkEl.href = link
    linkEl.title = title

    const imgSize = 50
    const imgEl = document.createElement('img')
    imgEl.src = `${image}?width=${imgSize}&height=${imgSize}`
    imgEl.srcset = [
      `${image}?width=${imgSize}&height=${imgSize}`,
      `${image}?width=${Math.round(imgSize * 1.5)}&height=${Math.round(imgSize * 1.5)} 1.5x`,
      `${image}?width=${imgSize * 2}&height=${imgSize * 2} 2x`
    ].join(',')
    imgEl.alt = title
    imgEl.title = title
    imgEl.width = imgSize
    imgEl.height = imgSize

    linkEl.appendChild(imgEl)

    this.coverTarget.textContent = ''
    this.coverTarget.appendChild(linkEl)
  }

  createAudioPlayer(url) {
    const audio = document.createElement('audio')
    audio.controls = 'controls'
    audio.crossorigin = 'anonymous'

    const source = document.createElement('source')
    source.src = url
    source.type = 'audio/mp3'
    source.crossorigin = 'anonymous'

    audio.appendChild(source)
    this.containerTarget.appendChild(audio)
    return audio
  }

  createOrReplaceAudioPlayer(url) {
    const audio = this.containerTarget.querySelector('audio')

    if (audio) {
      const source = audio.querySelector('source')
      if (source) {
        source.src = url
      } else {
        const newSource = document.createElement('source')
        newSource.src = url
        newSource.type = 'audio/mp3'
        audio.appendChild(newSource)
      }
      return audio
    }

    return this.createAudioPlayer(url)
  }

  clickPlayPlayerButton(e) {
    e.preventDefault()

    const {title, audioUrl, image, link} = e.currentTarget?.dataset

    if (!audioUrl) {
      return
    }

    this.initAudioPoster({title, image, link})
    const audioElement = this.createOrReplaceAudioPlayer(audioUrl)

    if (!audioPlayer) {
      audioPlayer = new Plyr(audioElement, {
        volume: 0.8,
        iconUrl: '/images/plyr.svg'
      })
      audioPlayer.on('play', this.refreshPlayerAndButtonState)
      audioPlayer.on('pause', this.refreshPlayerAndButtonState)
    }

    if (audioPlayer.source !== audioUrl) {
      audioPlayer.source = {
        type: 'audio',
        title,
        sources: [
          {
            src: audioUrl,
            type: 'audio/mp3',
            crossorigin: 'anonymous'
          }
        ]
      }
    }

    audioPlayer.togglePlay()

    if (this.element.classList.contains(footerHiddenClass)) {
      this.element.classList.remove(footerHiddenClass)
    }
  }

  setArticlePlayButton(svgIcon) {
    if (svgIcon.classList?.contains('svg-icon--pause')) {
      svgIcon.classList.replace('svg-icon--pause', 'svg-icon--play')
      svgIcon.innerHTML = "<svg class='svg-icon__cnt'><use xlink:href='#play-svg-icon'/></svg>"
    }
  }

  setArticlePauseButton(svgIcon) {
    if (svgIcon.classList?.contains('svg-icon--play')) {
      svgIcon.classList.replace('svg-icon--play', 'svg-icon--pause')
      svgIcon.innerHTML = "<svg class='svg-icon__cnt'><use xlink:href='#pause-svg-icon'/></svg>"
    }
  }

  closePlayer() {
    this.element.classList.add(footerHiddenClass)
    this.resetPlayerAndButtonState()
    if (audioPlayer) {
      if (audioPlayer.playing) {
        audioPlayer.stop()
      }
      audioPlayer.destroy()
      audioPlayer = null
    }
  }

  refreshPlayerAndButtonState() {
    const playArticleButton = this.getExternalButton()

    if (!audioPlayer) {
      return
    }

    if (this.element.classList.contains(footerHiddenClass)) {
      this.element.classList.remove(footerHiddenClass)
    }

    if (!playArticleButton) {
      return
    }

    if (!playArticleButton.dataset?.audioUrl || playArticleButton.dataset?.audioUrl !== audioPlayer.source) {
      return
    }

    const svgIcon = playArticleButton.querySelector('.svg-icon')

    if (svgIcon) {
      if (audioPlayer.playing) {
        this.setArticlePauseButton(svgIcon)
      } else if (!audioPlayer.playing) {
        this.setArticlePlayButton(svgIcon)
      }
    }
  }

  resetPlayerAndButtonState() {
    const playArticleButton = this.getExternalButton()

    if (!audioPlayer || !playArticleButton) {
      return
    }

    const svgIcon = playArticleButton.querySelector('.svg-icon')

    if (svgIcon) {
      this.setArticlePlayButton(svgIcon)
    }
  }
}
