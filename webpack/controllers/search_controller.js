import {Controller} from 'stimulus'
import EventBus from 'utils/eventBus'

let isScriptReady = false
const GREADY_EVENT_KEY = 'gready'
const channel = new EventBus()

const loadGoogleSearch = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.async = true
    script.type = 'text/javascript'
    script.src = 'https://cse.google.com/cse.js?cx=b0e57ad6eb10395a2'

    script.onload = resolve
    script.onerror = reject

    const parrent = document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]
    parrent.appendChild(script)
  })
}

window.__gcse = {
  parsetags: 'explicit',
  initializationCallback: () => {
    isScriptReady = true
    channel.dispatchEvent(GREADY_EVENT_KEY)
  }
}

loadGoogleSearch()

export default class extends Controller {
  initialize() {
    this.enableSearch = this.enableSearch.bind(this)
  }

  connect() {
    channel.addEventListener(GREADY_EVENT_KEY, this.enableSearch)
    this.enableSearch()
  }

  disconnect() {
    channel.removeEventListener(GREADY_EVENT_KEY, this.enableSearch)
    this.element.textContent = ''
  }

  enableSearch() {
    if (isScriptReady && window.google?.search?.cse?.element?.render) {
      window.google.search.cse.element.render({
        div: this.element,
        tag: 'search'
      })
    }
  }
}
