<script>
  import { onMount } from 'svelte'

  let commentsElement = $state(null)

  const resetCommentsEngine = () => {
    if (!commentsElement) {
      return
    }

    commentsElement.replaceChildren() // cleanup all childrens
  }

  onMount(() => {
    if (!commentsElement) {
      return () => {}
    }

    const eventAbortController = new AbortController()
    const { signal } = eventAbortController

    const resetAll = () => {
      resetCommentsEngine()
      eventAbortController?.abort()
    }

    document.addEventListener('turbo:before-cache', resetAll, { signal, once: true })

    const script = document.createElement('script')
    script.setAttribute('src', 'https://giscus.app/client.js')
    script.setAttribute('crossorigin', 'anonymous')
    script.setAttribute('async', 'async')
    script.dataset.repo = 'rwpod/website-comments'
    script.dataset.repoId = 'R_kgDOIgx3MA'
    script.dataset.category = 'General'
    script.dataset.categoryId = 'DIC_kwDOIgx3MM4CSyWk'
    script.dataset.mapping = 'pathname'
    script.dataset.strict = '0'
    script.dataset.reactionsEnabled = '1'
    script.dataset.emitMetadata = '0'
    script.dataset.inputPosition = 'top'
    script.dataset.theme = 'light'
    script.dataset.lang = 'en'
    script.dataset.loading = 'lazy'
    commentsElement.appendChild(script)

    return () => resetAll
  })
</script>

<div bind:this={commentsElement} class="post-comments"></div>

<style>
  .post-comments {
    width: 100%;
    padding: 1rem 0;
    min-height: 8rem;
  }
</style>
