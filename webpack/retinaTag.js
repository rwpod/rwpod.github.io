export const RetinaTag = {
  init: () => {
    window.matchMedia('(-webkit-device-pixel-ratio:1)').addListener(RetinaTag.updateImages)
    document.addEventListener("page:load", RetinaTag.updateImages)
    document.addEventListener("retina_tag:refresh", RetinaTag.updateImages)
  },
  reset: () => {
    window.matchMedia('(-webkit-device-pixel-ratio:1)').removeListener(RetinaTag.updateImages)
    document.removeEventListener("page:load", RetinaTag.updateImages)
    document.removeEventListener("retina_tag:refresh", RetinaTag.updateImages)
  },
  updateImages: () => {
    const images = document.getElementsByTagName('img')
    for (let image of images) {
      if (!image.getAttribute('data-lazy-load')) {
        RetinaTag.refreshImage(image)
      }
    }
  },
  refreshImage: (image) => {
    const lazyLoad = image.getAttribute('data-lazy-load')
    const imageSrc = image.src
    const hiDpiSrc = image.getAttribute('data-hidpi-src')
    const lowDpiSrc = image.getAttribute('data-lowdpi-src')
    if (!hiDpiSrc) {
      return
    }
    if (lazyLoad) {
      image.removeAttribute('data-lazy-load')
    }
    if (window.devicePixelRatio > 1 && imageSrc != hiDpiSrc) {
      if (!lowDpiSrc) {
        image.setAttribute('data-lowdpi-src', imageSrc)
      }
      image.src = hiDpiSrc
    } else if ((!window.devicePixelRatio || window.devicePixelRatio <= 1) && (imageSrc == hiDpiSrc || (lowDpiSrc && imageSrc != lowDpiSrc))) {
      image.src = lowDpiSrc
    }
  }
}
