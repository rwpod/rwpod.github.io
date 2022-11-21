import '@hotwired/turbo'

// Before every page navigation, remove any previously added component hydration scripts
document.addEventListener('turbo:before-render', () => {
  const scripts = document.querySelectorAll('script[data-astro-component-hydration]')
  for (const script of scripts) {
    script.remove()
  }
})

// After every page navigation, move the bundled styles into the body
// document.addEventListener('turbo:render', () => {
//   const styles = document.querySelectorAll('link[href^="/assets/asset"][href$=".css"]')
//   for (const style of styles) {
//     document.body.append(style)
//   }
// })
