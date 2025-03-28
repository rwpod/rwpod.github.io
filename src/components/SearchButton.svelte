<script>
  import { memoize } from '@utils/memoize'
  import _keyBy from 'lodash/keyBy'
  import _union from 'lodash/union'

  const BASE_ICON_SIZE = 100
  const QUERY_LIMIT = 50

  let { class: klass = '', searchIcon, closeIcon } = $props()

  let searchInput = $state(null)
  let isVisible = $state(false)
  let isLoading = $state(false)
  let isError = $state(false)
  let noResults = $state(false)
  let searchDocResults = $state([])
  let resultsWrapperElement = $state(null)

  const loadEngine = () => import('@utils/flexsearch')
  const loadMark = () => import('mark.js')
  const loadMarkCached = memoize(loadMark)

  const loadDocs = () =>
    fetch('/api/search-index.json', {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then((r) => r.json())

  const indexDocs = (indexes, docs) =>
    Promise.all(
      docs.map((doc) =>
        Promise.all([
          indexes.latinIndex.addAsync(doc.id, doc.content),
          indexes.cyrillicIndex.addAsync(doc.id, doc.content)
        ])
      )
    ).then(() => ({
      docsMap: _keyBy(docs, 'id'),
      indexes
    }))

  const getSearchIndexes = () =>
    Promise.all([loadEngine(), loadDocs()]).then(([indexes, docs]) => indexDocs(indexes, docs))

  const getSearchIndexesCached = memoize(getSearchIndexes)

  const enableBodyScroll = () => {
    document.body.classList.remove('disable-body-scroll')
  }

  const disableBodyScroll = () => {
    document.body.classList.add('disable-body-scroll')
  }

  const searchInputFocus = (el) => {
    el?.focus()
  }

  const openSearch = (e) => {
    e.preventDefault()
    isVisible = true
    disableBodyScroll()
  }

  const closeSearch = (e) => {
    e.preventDefault()
    isVisible = false
    enableBodyScroll()
    searchDocResults = []
    isError = false
    isLoading = false
    noResults = false
  }

  const closeOutsideSearch = (e) => {
    if (e.target === e.currentTarget) {
      closeSearch(e)
    }
  }

  const closeOnEscape = (e) => {
    const isEscape = (() => {
      if ('key' in e) {
        return e.code === 'Escape' || e.key === 'Escape'
      }
      return e.keyCode === 27
    })()

    if (isEscape) {
      closeSearch()
    }
  }

  const doSearch = (e) => {
    e.preventDefault()
    const searchValue = searchInput.value

    if (searchValue.length === 0) {
      return
    }

    isLoading = true
    isError = false
    noResults = false
    searchDocResults = []

    getSearchIndexesCached()
      .then(({ docsMap, indexes }) => {
        Promise.all([
          indexes.latinIndex.searchAsync(searchValue, QUERY_LIMIT),
          indexes.cyrillicIndex.searchAsync(searchValue, QUERY_LIMIT)
        ]).then((results) => {
          const indexResult = _union(...results)
          if (indexResult.length === 0) {
            isLoading = false
            noResults = true
            return
          }

          const docResults = indexResult.map((id) => docsMap[id])
          searchDocResults = docResults.slice(0, QUERY_LIMIT * 2)

          isLoading = false

          loadMarkCached()
            .then(({ default: Mark }) => {
              const markContainer = new Mark(resultsWrapperElement)
              markContainer.mark(searchValue, {
                className: 'search-box-container--item-content-mark'
              })
            })
            .catch((err) => {
              // eslint-disable-next-line no-console
              console.error('Error to mark search results', err)
            })
        })
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error to search make or index', err)
        searchDocResults = []
        isLoading = false
        isError = true
      })
  }
</script>

<button onclick={openSearch} class="search-btn" aria-label="Пошук" data-class={klass}>
  Пошук {@render searchIcon()}
</button>

{#if isVisible}
  <div
    class="search-box-container"
    role="presentation"
    onmousedown={closeOutsideSearch}
    ontouchstart={closeOutsideSearch}
  >
    <div class="search-box-container--content">
      <div class="search-box-container--form">
        <form onsubmit={doSearch}>
          <div class="search-box-container--form-wrapper">
            <input
              use:searchInputFocus
              bind:this={searchInput}
              onkeydown={closeOnEscape}
              type="text"
              autocomplete="off"
              dir="ltr"
              spellcheck="false"
              class="search-box-container--input"
              placeholder="Пошук..."
              data-search-target="input"
            />
            <button
              onclick={closeSearch}
              type="button"
              class="search-box-container--button"
              aria-label="Close search on website"
            >
              {@render closeIcon()}
            </button>
          </div>
        </form>
      </div>

      <div bind:this={resultsWrapperElement} class="search-box-container--results">
        {#if isLoading}
          <div class="search-box-container--loading">Пошук активовано у браузері...</div>
        {:else if isError}
          <div class="search-box-container--error">От курва, щось пішло не так</div>
        {:else if noResults}
          <div class="search-box-container--no-results">За цим запитом нічого не знайдено</div>
        {:else}
          {#each searchDocResults as doc}
            <a class="search-box-container--item-link" href={doc.id}>
              <div class="search-box-container--item-header">
                <div class="search-box-container--item-header-left">
                  <h4 class="search-box-container--item-title">{doc.title}</h4>
                  <div class="search-box-container--item-date">{doc.human_date}</div>
                </div>
                <img
                  src="{doc.cover}?width={BASE_ICON_SIZE}&height={BASE_ICON_SIZE}"
                  srcset={[
                    `${doc.cover}?width=${BASE_ICON_SIZE}&height=${BASE_ICON_SIZE}`,
                    `${doc.cover}?width=${Math.round(BASE_ICON_SIZE * 1.5)}&height=${Math.round(
                      BASE_ICON_SIZE * 1.5
                    )} 1.5x`,
                    `${doc.cover}?width=${BASE_ICON_SIZE * 2}&height=${BASE_ICON_SIZE * 2} 2x`
                  ].join(', ')}
                  alt={doc.title}
                  title={doc.title}
                  loading="lazy"
                  class="search-box-container--item-img"
                />
              </div>
              <div class="search-box-container--item-content">
                {doc.content}
              </div>
            </a>
          {/each}
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  :global(.disable-body-scroll) {
    overflow: hidden;
    position: fixed;
    width: 100%;
    top: 0;
  }

  .search-btn {
    font-size: 1rem;
    border: none;
    cursor: pointer;
    background: transparent;
    color: hsl(34deg 19% 26%);
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0;
  }

  .search-btn:active {
    color: hsl(13deg 74% 37%);
  }

  .search-box-container {
    display: block;
    position: fixed;
    z-index: 100;
    overflow-y: auto;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-color: hsl(210deg 14% 89% / 80%);
  }

  .search-box-container--content {
    margin: 0 auto;
    max-width: 60vw;
  }

  .search-box-container--form {
    position: sticky;
    z-index: 101;
    top: 0;
    padding-top: 1.5rem;
  }

  .search-box-container--form-wrapper {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    border: 1px solid hsl(0deg 0% 80%);
    margin: 0.6rem 0.1rem;
  }

  .search-box-container--input {
    display: flex;
    flex: 1;
    border: 1px solid hsl(0deg 0% 80%);
    height: 50px;
    font-size: 1.4rem;
  }

  .search-box-container--input:focus {
    border-color: hsl(13deg 70% 30%);
    outline: none;
  }

  .search-box-container--input:focus:not(:focus-visible) {
    outline: none;
  }

  .search-box-container--button {
    width: 54px;
    height: 54px;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    background-color: hsl(0deg 0% 100%);
    background-image: none;
    border: 1px solid hsl(0deg 0% 80%);
    color: hsl(217deg 15% 34%);
    cursor: pointer;
  }

  .search-box-container--button:hover {
    border: 1px solid hsl(0deg 0% 80%);
    color: hsl(0deg 0% 100%);
    background-color: hsl(198deg 100% 50%);
  }

  .search-box-container--button:focus:not(:focus-visible) {
    outline: none;
  }

  .search-box-container--results {
    box-sizing: border-box;
    background-color: hsl(0deg 0% 100%);
    margin: 1.5rem 0;
    border-radius: 3px;
  }

  .search-box-container--item-link {
    display: block;
    border-bottom: 1px solid hsl(0deg 0% 80%);
    padding: 0.5rem;
    text-align: left;
  }

  .search-box-container--item-link:hover {
    background: hsl(43deg 58% 95% / 80%);
  }

  .search-box-container--item-header {
    display: flex;
  }

  .search-box-container--item-header-left {
    flex: 1;
  }

  .search-box-container--item-img {
    width: 100px;
    height: 100px;
    aspect-ratio: 1/1;
    border: 1px solid hsl(0deg 0% 80%);
  }

  .search-box-container--item-date {
    color: #333;
    font-size: 0.8rem;
    line-height: normal;
    padding: 5px 0 10px 0;
  }

  .search-box-container--item-content {
    color: #333;
    font-size: 0.9rem;
    line-height: normal;
    padding: 0.5rem 0;
  }

  :global(.search-box-container--item-content-mark) {
    background-color: hsl(60deg 97% 60%);
  }

  .search-box-container--loading {
    text-align: center;
    font-size: 1.2rem;
    padding: 1.5rem 0;
  }

  .search-box-container--no-results {
    text-align: center;
    font-size: 1.2rem;
    padding: 1.5rem 0;
  }

  .search-box-container--error {
    text-align: center;
    font-size: 1.2rem;
    padding: 1.5rem 0;
    color: hsl(4deg 90% 58%);
  }

  @media screen and (max-width: 940px) {
    .search-box-container--content {
      max-width: 100vw;
    }
  }
</style>
