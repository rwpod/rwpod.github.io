<svelte:options immutable="{true}" />

<script>
  import { onMount, onDestroy } from 'svelte'
  import { playerState, playButtonState } from '@utils/svelte-stores'
  import { memoize } from '@utils/memoize'

  let klass = ''

  export { klass as class }

  const IMG_SIZE = 50

  let audioPlayer = null
  let audioElement = null
  let audioInfo = {}
  let playerMedia = null

  const loadPlyr = () => import('plyr')
  const loadPlyrCached = memoize(loadPlyr)

  const getAudioControls = () => {
    if (!playerMedia || !playerMedia.matches) {
      return [
        'rewind',
        'play',
        'fast-forward',
        'progress',
        'current-time',
        'duration',
        'mute',
        'volume',
        'settings',
        'airplay'
      ]
    }
    // mobile need less buttons
    return ['rewind', 'play', 'fast-forward', 'progress', 'mute', 'volume']
  }

  const refreshButtonState = () => {
    playButtonState.set({
      isPlay: audioPlayer.playing,
      info: audioInfo
    })
  }

  const stopButtonState = () => {
    playButtonState.set({
      isPlay: false,
      info: audioInfo
    })
  }

  const togglePlayer = () => {
    if (audioPlayer.source !== audioInfo.audioUrl) {
      audioPlayer.source = {
        type: 'audio',
        title: audioInfo.title,
        sources: [
          {
            src: audioInfo.audioUrl,
            type: 'audio/mp3',
            crossorigin: 'anonymous'
          }
        ]
      }
    }

    audioPlayer.togglePlay()
  }

  const triggerPlayer = () => {
    if (!audioPlayer) {
      loadPlyrCached()
        .then(({ default: Plyr }) => {
          audioPlayer = new Plyr(audioElement, {
            volume: 0.8,
            iconUrl: '/images/plyr.svg',
            seekTime: 15,
            controls: getAudioControls()
          })
          audioPlayer.on('play', refreshButtonState)
          audioPlayer.on('pause', refreshButtonState)

          togglePlayer()
        })
        .catch((err) => {
          console.error('Error to load audio', err) // eslint-disable-line no-console
        })
    } else {
      togglePlayer()
    }
  }

  const playerStateUnsubscribe = playerState.subscribe((state) => {
    if (state.info) {
      audioInfo = state.info
      triggerPlayer()
    }
  })

  const closePlayer = () => {
    stopButtonState()

    audioInfo = {}
    if (!audioPlayer) {
      return
    }

    if (audioPlayer.playing) {
      audioPlayer.stop()
    }
    audioPlayer.destroy()
    audioPlayer = null
  }

  onMount(() => {
    playerMedia = window.matchMedia('(max-width: 768px)')
  })

  onDestroy(playerStateUnsubscribe)
</script>

{#if audioInfo.audioUrl}
  <div class="footer-audio-player" data-class="{klass}">
    <div class="footer-audio-player-cover">
      <a href="{audioInfo.url}" title="{audioInfo.title}">
        <img
          src="{`${audioInfo.mainImage}?width=${IMG_SIZE}&height=${IMG_SIZE}`}"
          srcset="{[
            `${audioInfo.mainImage}?width=${IMG_SIZE}&height=${IMG_SIZE}`,
            `${audioInfo.mainImage}?width=${Math.round(IMG_SIZE * 1.5)}&height=${Math.round(
              IMG_SIZE * 1.5
            )} 1.5x`,
            `${audioInfo.mainImage}?width=${IMG_SIZE * 2}&height=${IMG_SIZE * 2} 2x`
          ].join(',')}"
          title="{audioInfo.title}"
          alt="{audioInfo.title}"
          height="{IMG_SIZE}"
          width="{IMG_SIZE}"
        />
      </a>
    </div>
    <div class="footer-audio-player-container">
      <audio bind:this="{audioElement}" controls="controls" crossorigin="anonymous">
        <source src="{audioInfo.audioUrl}" type="audio/mp3" crossorigin="anonymous" />
      </audio>
    </div>
    <button
      on:click|preventDefault="{closePlayer}"
      class="footer-audio-player-close-button"
      aria-label="Close podcast audio"
    >
      <slot name="closeIcon">Close</slot>
    </button>
  </div>
{/if}

<style>
  .footer-audio-player {
    display: flex;
    width: 100%;
  }

  .footer-audio-player-cover {
    width: 54px;
    height: 54px;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
  }

  .footer-audio-player-cover a {
    width: 50px;
    height: 50px;
    border: 2px solid hsl(13deg 61% 55%);
    box-sizing: content-box;
  }

  .footer-audio-player-cover img {
    width: 50px;
    height: 50px;
  }

  .footer-audio-player-container {
    flex: 1;
  }

  .footer-audio-player-close-button {
    width: 54px;
    height: 54px;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    background-color: hsl(0deg 0% 100%);
    background-image: none;
    border: 1px solid hsl(0deg 0% 80%);
    color: hsl(217deg 15% 34%);
    cursor: pointer;
  }

  .footer-audio-player-close-button:hover {
    border: 1px solid hsl(0deg 0% 80%);
    color: hsl(0deg 0% 100%);
    background-color: hsl(198deg 100% 50%);
  }

  .footer-audio-player-close-button:focus:not(:focus-visible) {
    outline: none;
  }
</style>
