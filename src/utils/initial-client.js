import '@hotwired/turbo'

// Before every page navigation, remove any previously added component hydration scripts
document.addEventListener('turbolinks:before-render', () => {
  const scripts = document.querySelectorAll('script[data-astro-component-hydration]')
  for (const script of scripts) {
    script.remove()
  }
})
