import {onDomReady} from './utils/dom'
import {RetinaTag} from './utils/retinaTag'
import Turbolinks from 'turbolinks'

onDomReady(() => {
  RetinaTag.init()
  RetinaTag.updateImages()

  if (Turbolinks.supported) {
    document.addEventListener('turbolinks:load', () => {
      RetinaTag.updateImages()
    })
  }
})
