let RetinaTag = {}

RetinaTag.init = function () {
  window.matchMedia('(-webkit-device-pixel-ratio:1)').addListener(RetinaTag.updateImages)
  document.addEventListener("page:load", RetinaTag.updateImages)
  document.addEventListener("turbolinks:load", RetinaTag.updateImages)
  document.addEventListener("retina_tag:refresh", RetinaTag.updateImages)
}

RetinaTag.updateImages = function () {
  let images = document.getElementsByTagName('img')
  for (let counter = 0; counter < images.length; counter++) {
    if (!images[counter].getAttribute('data-lazy-load')) {
      RetinaTag.refreshImage(images[counter])
    }
  }
}

RetinaTag.refreshImage = function (image) {
  let lazyLoad = image.getAttribute('data-lazy-load')
  let imageSrc = image.src
  let hiDpiSrc = image.getAttribute('data-hidpi-src')
  let lowDpiSrc = image.getAttribute('data-lowdpi-src')
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
  }
  else if ((!window.devicePixelRatio || window.devicePixelRatio <= 1) && (imageSrc == hiDpiSrc || (lowDpiSrc && imageSrc != lowDpiSrc))) {
    image.src = lowDpiSrc
  }
}

export {
  RetinaTag
}
