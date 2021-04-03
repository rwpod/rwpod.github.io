import {Controller} from 'stimulus'
import memoize from 'memoizee'
import _keyBy from 'lodash/keyBy'
import Mark from 'mark.js'
import lunr from 'lunr'
import lunrStemmer from 'lunr-languages/lunr.stemmer.support'
import lunrRu from 'lunr-languages/lunr.ru'
import lunrMulti from 'lunr-languages/lunr.multi'

const BASE_ICON_SIZE = 100
const CONTAINER_VISIBILITY_CLASS = 'search-box-container__visible'

lunrStemmer(lunr)
lunrRu(lunr)
lunrMulti(lunr)

const loadSearchIndex = () => (
  fetch('/api/search-index.json', {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8'
    }
  }).then((r) => r.json()).then((docs) => ({
    docsMap: _keyBy(docs, 'id'),
    idx: lunr(function() {
      this.use(lunr.multiLanguage('en', 'ru'))
      this.ref('id')
      this.field('title', {
        boost: 10
      })
      this.field('content', {
        boost: 15
      })
      docs.forEach(function(doc) {this.add(doc)}, this)
    })
  }))
)

const loadSearchIndexCached = memoize(loadSearchIndex, {promise: true})

export default class extends Controller {
  static targets = ['container', 'input', 'results']

  connect() {
    this.markContainer = new Mark(this.resultsTarget)
  }

  disconnect() {
    this.containerTarget.classList.remove(CONTAINER_VISIBILITY_CLASS)
    this.cleanupSearch()
  }

  openSearch(e) {
    e.preventDefault()
    this.containerTarget.classList.add(CONTAINER_VISIBILITY_CLASS)
    this.inputTarget.focus()
    this.disableBodyScroll()
  }

  closeSearch(e) {
    e.preventDefault()
    this.containerTarget.classList.remove(CONTAINER_VISIBILITY_CLASS)
    this.cleanupSearch()
  }

  closeOnEscape(e) {
    const isEscape = (() => {
      if ('key' in e) {
        return e.key === 'Escape' || e.key === 'Esc'
      }
      return e.keyCode === 27
    })()

    if (isEscape) {
      this.closeSearch(e)
    }
  }

  closeOutsideSearch(e) {
    if (e.target === e.currentTarget) {
      this.closeSearch(e)
    }
  }

  enableBodyScroll() {
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.width = ''
    document.body.style.top = ''
  }

  disableBodyScroll() {
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.body.style.top = `-${window.scrollY}px`
  }

  cleanupSearch() {
    this.inputTarget.value = ''
    this.resultsTarget.innerText = ''
    this.enableBodyScroll()
  }

  doSearch(e) {
    e.preventDefault()
    const searchValue = this.inputTarget.value

    if (searchValue.length === 0) {
      return
    }

    this.resultsTarget.innerHTML = this.renderLoading()

    loadSearchIndexCached().then(({docsMap, idx}) => {
      const indexResult = idx.search(searchValue)
      if (indexResult.length === 0) {
        this.resultsTarget.innerHTML = this.renderNoResults()
        return
      }

      const docResults = indexResult.map((res) => docsMap[res.ref])
      const limitedDocResults = docResults.slice(0, 100)

      this.resultsTarget.innerHTML = limitedDocResults.map((d) => this.renderItem(d)).join('')

      if (this.markContainer) {
        this.markContainer.mark(searchValue, {
          className: 'search-box-container--item-content-mark'
        })
      }
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error to search make or index', err)
      this.resultsTarget.innerHTML = this.renderError()
    })
  }

  renderLoading() {
    return '<div class="search-box-container--loading">Поиск активирован прямо в браузере...</div>'
  }

  renderNoResults() {
    return '<div class="search-box-container--no-results">По данному запросу ничего не найдено</div>'
  }

  renderError() {
    return '<div class="search-box-container--error">Что то пошло не так</div>'
  }

  renderItem(document) {
    const srcSet = [
      `${document.main_img}?width=${BASE_ICON_SIZE}&height=${BASE_ICON_SIZE}`,
      `${document.main_img}?width=${Math.round(BASE_ICON_SIZE * 1.5)}&height=${Math.round(BASE_ICON_SIZE * 1.5)} 1.5x`,
      `${document.main_img}?width=${BASE_ICON_SIZE * 2}&height=${BASE_ICON_SIZE * 2} 2x`
    ].join(', ')

    return [
      `<a class="search-box-container--item-link" href="${document.id}">`,
      '<div class="search-box-container--item-header">',
      '<div class="search-box-container--item-header-left">',
      `<h4 class="search-box-container--item-title">${document.title}</h4>`,
      `<div class="search-box-container--item-date">${document.human_date}</div>`,
      '</div>',
      `<img src="${document.main_img}?width=${BASE_ICON_SIZE}&height=${BASE_ICON_SIZE}" srcset="${srcSet}" alt="${document.title}" title="${document.title}" loading="lazy" class="search-box-container--item-img" />`,
      '</div>',
      `<div class="search-box-container--item-content">${document.content}</div>`,
      '</a>'
    ].join(' ')
  }
}
