import {Controller} from 'stimulus'

export default class extends Controller {
  static targets = ['itemsList']

  initialize() {
    this.navigationMedia = window.matchMedia('(max-width: 768px)')
    this.onNavigationMediaChange = this.onNavigationMediaChange.bind(this)

    document.addEventListener('turbo:before-cache', () => {
      if (this.navigationMedia.matches) {
        this.changeVisibilityForNavigation(false)
      }
    })
  }

  connect() {
    this.navigationMedia.addEventListener('change', this.onNavigationMediaChange)
  }

  disconnect() {
    this.navigationMedia.removeEventListener('change', this.onNavigationMediaChange)
  }

  toggle(e) {
    e.preventDefault()
    this.changeVisibilityForNavigation(!this.isNavigationVisible())
  }

  isNavigationVisible() {
    const firstElement = this.itemsListTargets[0]
    if (firstElement) {
      return firstElement.style.display === 'block'
    }
    return false
  }

  changeVisibilityForNavigation(isShow = true) {
    const displayValue = isShow ? 'block' : 'none'
    this.itemsListTargets.forEach((el) => {
      el.style.display = displayValue
    })
  }

  onNavigationMediaChange(e) {
    this.changeVisibilityForNavigation(!e.matches)
  }
}
