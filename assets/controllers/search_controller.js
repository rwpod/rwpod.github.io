import {Controller} from '@hotwired/stimulus'
import {memoize} from '@utils/memoize'
import {keyBy} from '@utils/keyBy'

const BASE_ICON_SIZE = 100
const CONTAINER_VISIBILITY_CLASS = 'search-box-container__visible'
const QUERY_LIMIT = 60

const loadEngine = () => import('@utils/flexsearchEngine')
const loadMark = () => import('mark.js')

const loadDocs = () => (
  fetch('/api/search-index.json', {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8'
    }
  }).then((r) => r.json())
)

const indexDocs = (indexes, docs) => (
  Promise.all(docs.map((doc) => (
    Promise.all([
      indexes.latinIndex.addAsync(doc.id, doc.content),
      indexes.cyrillicIndex.addAsync(doc.id, doc.content)
    ])
  ))).then(() => ({
    docsMap: keyBy(docs, 'id'),
    indexes
  }))
)

const getSearchIndexes = () => (
  Promise.all([
    loadEngine(),
    loadDocs()
  ]).then(([indexes, docs]) => indexDocs(indexes, docs))
)

const getSearchIndexesCached = memoize(getSearchIndexes)
const loadMarkCached = memoize(loadMark)

export default class extends Controller {
  static targets = ['container', 'input', 'results']

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
    Object.assign(document.body.style, {
      overflow: '',
      position: '',
      width: '',
      top: ''
    })
  }

  disableBodyScroll() {
    Object.assign(document.body.style, {
      overflow: 'hidden',
      position: 'fixed',
      width: '100%',
      top: `-${window.scrollY}px`
    })
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

    this.resultsTarget.replaceChildren(this.loadingElement())

    getSearchIndexesCached().then(({docsMap, indexes}) => {
      Promise.all([
        indexes.latinIndex.searchAsync(searchValue, QUERY_LIMIT),
        indexes.cyrillicIndex.searchAsync(searchValue, QUERY_LIMIT)
      ]).then((results) => {
        const allResults = results.reduce((agg, r) => agg.concat(r), [])
        const indexResult = [...new Set(allResults)]

        if (indexResult.length === 0) {
          this.resultsTarget.replaceChildren(this.noResultsElement())
          return
        }

        const docResults = indexResult.map((id) => docsMap[id])
        const limitedDocResults = docResults.slice(0, QUERY_LIMIT * 2)

        this.resultsTarget.replaceChildren(...limitedDocResults.map((d) => this.itemElement(d)))

        loadMarkCached().then(({default: Mark}) => {
          const markContainer = new Mark(this.resultsTarget)
          markContainer.mark(searchValue, {
            className: 'search-box-container--item-content-mark'
          })
        }).catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error to mark search results', err)
        })
      })
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error to search make or index', err)
      this.resultsTarget.replaceChildren(this.errorElement())
    })
  }

  loadingElement() {
    const loadingEl = document.createElement('div')
    loadingEl.classList.add('search-box-container--loading')
    loadingEl.textContent = 'Поиск активирован прямо в браузере...'
    return loadingEl
  }

  noResultsElement() {
    const noResultsEl = document.createElement('div')
    noResultsEl.classList.add('search-box-container--no-results')
    noResultsEl.textContent = 'По данному запросу ничего не найдено'
    return noResultsEl
  }

  errorElement() {
    const errorEl = document.createElement('div')
    errorEl.classList.add('search-box-container--error')
    errorEl.textContent = 'Что то пошло не так'
    return errorEl
  }

  itemElement(item) {
    const linkEl = document.createElement('a')
    linkEl.classList.add('search-box-container--item-link')
    linkEl.setAttribute('href', item.url)

    const headerEl = document.createElement('div')
    headerEl.classList.add('search-box-container--item-header')

    const headerLeftEl = document.createElement('div')
    headerLeftEl.classList.add('search-box-container--item-header-left')

    const headEl = document.createElement('h4')
    headEl.classList.add('search-box-container--item-title')
    headEl.textContent = item.title

    const dateEl = document.createElement('div')
    dateEl.classList.add('search-box-container--item-date')
    dateEl.textContent = item.human_date

    headerLeftEl.appendChild(headEl)
    headerLeftEl.appendChild(dateEl)

    const srcSet = [
      `${item.main_img}?width=${BASE_ICON_SIZE}&height=${BASE_ICON_SIZE}`,
      `${item.main_img}?width=${Math.round(BASE_ICON_SIZE * 1.5)}&height=${Math.round(BASE_ICON_SIZE * 1.5)} 1.5x`,
      `${item.main_img}?width=${BASE_ICON_SIZE * 2}&height=${BASE_ICON_SIZE * 2} 2x`
    ].join(', ')

    const headerImageEl = document.createElement('img')
    headerImageEl.classList.add('search-box-container--item-img')
    headerImageEl.setAttribute('loading', 'lazy')
    headerImageEl.setAttribute('alt', item.title)
    headerImageEl.setAttribute('title', item.title)
    headerImageEl.setAttribute(
      'src',
      `${item.main_img}?width=${BASE_ICON_SIZE}&height=${BASE_ICON_SIZE}`
    )
    headerImageEl.setAttribute('srcset', srcSet)

    headerEl.appendChild(headerLeftEl)
    headerEl.appendChild(headerImageEl)

    const contentEl = document.createElement('div')
    contentEl.classList.add('search-box-container--item-content')
    contentEl.textContent = item.content

    linkEl.appendChild(headerEl)
    linkEl.appendChild(contentEl)

    return linkEl
  }
}
