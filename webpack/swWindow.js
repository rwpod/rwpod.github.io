import {Workbox, messageSW} from 'workbox-window'

let wb = null
let wbRegistration = null

const skipWaitingMessageAndReload = () => {
  wb.addEventListener('controlling', () => window.location.reload())

  if (wbRegistration && wbRegistration.waiting) {
    // Send a message to the waiting service worker,
    // instructing it to activate.
    messageSW(wbRegistration.waiting, {type: 'SKIP_WAITING'})
  }
}

const initServiceWorker = (store) => {
  if ('serviceWorker' in navigator) {
    wb = new Workbox('/sw.js')

    const showUpdatedInfo = () => {}

    wb.addEventListener('waiting', showUpdatedInfo)
    wb.addEventListener('externalwaiting', showUpdatedInfo)

    // Register the service worker after event listeners have been added.
    wb.register().then((r) => {
      wbRegistration = r
    })
  }
}

initServiceWorker()
