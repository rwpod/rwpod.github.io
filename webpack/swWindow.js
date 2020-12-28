import {Workbox, messageSW} from 'workbox-window'
import {on} from 'delegated-events'

let wb = null
let wbRegistration = null

const hiddenNotificationClassName = 'sw-notification__hidden'
const notificationElement = () => document.querySelector('.sw-notification__toast')

const skipWaitingMessageAndReload = (e) => {
  e.preventDefault()
  wb.addEventListener('controlling', () => window.location.reload())

  if (wbRegistration && wbRegistration.waiting) {
    // Send a message to the waiting service worker,
    // instructing it to activate.
    messageSW(wbRegistration.waiting, {type: 'SKIP_WAITING'})
  }
}

const showUpdateNotification = () => {
  if (notificationElement()) {
    notificationElement().classList.remove(hiddenNotificationClassName)
  }
}

const dismissUpdateNotification = (e) => {
  e.preventDefault()
  if (notificationElement()) {
    notificationElement().classList.add(hiddenNotificationClassName)
  }
}

const initServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    wb = new Workbox('/sw.js')

    wb.addEventListener('waiting', showUpdateNotification)
    wb.addEventListener('externalwaiting', showUpdateNotification)

    // Register the service worker after event listeners have been added.
    wb.register().then((r) => {
      wbRegistration = r
    })
  }
}

on('click', '.sw-notification__message', skipWaitingMessageAndReload)
on('click', '.sw-notification__dismiss-btn', dismissUpdateNotification)

initServiceWorker()
