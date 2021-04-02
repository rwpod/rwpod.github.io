export default class EventBus {
  /**
   * Initialize a new event bus instance.
   */
  constructor() {
    this.bus = document.createElement('fakeelement')
  }

  /**
   * Add an event listener.
   */
  addEventListener(event, callback) {
    this.bus.addEventListener(event, callback)
  }

  /**
   * Remove an event listener.
   */
  removeEventListener(event, callback) {
    this.bus.removeEventListener(event, callback)
  }

  /**
   * Dispatch an event.
   */
  dispatchEvent(event, detail = {}) {
    this.bus.dispatchEvent(new CustomEvent(event, {detail}))
  }
}
