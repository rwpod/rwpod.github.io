<svelte:options immutable="{true}" />

<script>
  import { onMount } from 'svelte'

  let commentsElement = null

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

    document.addEventListener('turbo:before-cache', resetCommentsEngine, { signal })

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
    script.dataset.theme = 'preferred_color_scheme'
    script.dataset.lang = 'en'
    script.dataset.loading = 'lazy'
    commentsElement.appendChild(script)

    return () => {
      eventAbortController?.abort()
      resetCommentsEngine()
    }
  })
</script>

<style>
  .post-comments {
    width: 100%;
    padding: 1rem 0;
  }
</style>

<div bind:this={commentsElement} class="post-comments" />
