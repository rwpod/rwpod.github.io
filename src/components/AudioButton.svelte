<script>
  import { onMount, onDestroy } from 'svelte'
  import { playerState, playButtonState } from '@utils/svelte-stores'

  let { audioInfo = {}, class: klass = '' } = $props()

  let isPlay = $state(false)

  const togglePlay = (e) => {
    e.preventDefault()
    isPlay = !isPlay
    playerState.set({
      isPlay,
      info: audioInfo
    })
  }

  const resetPlayerButtonState = () => {
    isPlay = false
  }

  const playButtonStateUnsubscribe = playButtonState.subscribe((state) => {
    if (state.info && state.info.audioUrl === audioInfo.audioUrl) {
      isPlay = state.isPlay
    }
  })

  onMount(() => {
    const eventAbortController = new AbortController()
    const { signal } = eventAbortController

    document.addEventListener('turbo:before-cache', resetPlayerButtonState, { signal, once: true })
    return () => eventAbortController?.abort()
  })

  onDestroy(playButtonStateUnsubscribe)
</script>

<button
  onclick="{togglePlay}"
  class="track-play-button"
  aria-label="Play podcast audio"
  data-class="{klass}"
>
  {#if isPlay}
    <span class="icon-wrapper">
      <slot name="stopIcon">Stop</slot>
    </span>
  {:else}
    <span class="icon-wrapper">
      <slot name="playIcon">Play</slot>
    </span>
  {/if}
</button>

<style>
  .track-play-button {
    background-color: hsl(13deg 61% 55%);
    border: none;
    border-radius: 3px;
    color: hsl(0deg 0% 100%);
    height: 2.5rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .track-play-button:active {
    background-color: hsl(13deg 71% 55%);
  }

  .track-play-button:focus:not(:focus-visible) {
    outline: none;
  }

  .icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
