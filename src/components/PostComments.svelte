<script>
  const giscus = (node) => {
    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.crossOrigin = 'anonymous'
    script.async = true

    const config = {
      repo: 'rwpod/website-comments',
      repoId: 'R_kgDOIgx3MA',
      category: 'General',
      categoryId: 'DIC_kwDOIgx3MM4CSyWk',
      mapping: 'pathname',
      strict: '0',
      reactionsEnabled: '1',
      emitMetadata: '0',
      inputPosition: 'top',
      theme: 'light',
      lang: 'en',
      loading: 'lazy'
    }

    Object.entries(config).forEach(([key, value]) => {
      script.dataset[key] = value
    })

    node.appendChild(script)

    const controller = new AbortController()
    const { signal } = controller

    const cleanup = () => {
      node.replaceChildren() // Clean up HTML specifically for Turbo cache
      controller.abort()
    }

    document.addEventListener('turbo:before-cache', cleanup, { signal, once: true })

    return {
      destroy() {
        cleanup()
      }
    }
  }
</script>

<div use:giscus class="post-comments"></div>

<style>
  .post-comments {
    width: 100%;
    padding: 1rem 0;
    min-height: 8rem;
  }
</style>
