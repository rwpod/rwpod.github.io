<svelte:options immutable="{true}" />

<script>
  import { onDestroy } from 'svelte'
  import { playerState } from '@utils/svelte-stores'

  let isVisible = false

  const playerStateUnsubscribe = playerState.subscribe((state) => {
		console.log('state', state)
	})

  onDestroy(playerStateUnsubscribe)
</script>

<style>
  .footer-audio-player {
    display: flex;
    position: sticky;
    bottom: 0;
    width: 100%;
  }

  .footer-audio-player__hidden {
    display: none;
  }
</style>

<div
  id="footerAudioPlayer"
  class="footer-audio-player"
  class:footer-audio-player__hidden="{!isVisible}"
  data-turbo-permanent="true"
>
  <div class="footer-audio-player-cover" data-audio-target="cover">

  </div>
  <div class="footer-audio-player-container" data-audio-target="container">

  </div>
  <button class="footer-audio-player-close-button" aria-label="Close podcast audio">
    <slot name="closeIcon">Close</slot>
  </button>
</div>
