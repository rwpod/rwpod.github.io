import { writable } from 'svelte/store'

const createHeaderStore = (initialValue = false) => {
  const { subscribe, set, update } = writable(initialValue)

  return {
    subscribe,
    set,
    toggle: () => update((v) => !v),
    reset: () => set(initialValue)
  }
}

export const headerMenuOpen = createHeaderStore()
