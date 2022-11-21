<svelte:options immutable="{true}" />

<script>
  import { onMount } from 'svelte'
  import { headerMenuOpen } from '@utils/svelte-stores'
  import { pageRoute } from '@utils/helpers'

  const klass = null
  export { klass as class }
  export let currentPath = '/'

  const isActiveNavigation = (path = '/') => (
    currentPath === pageRoute(path)
  )

  const toggle = () => {
    headerMenuOpen.toggle()
  }

  onMount(() => {
    const navigationMedia = window.matchMedia('(max-width: 768px)')

    const onNavigationMediaChange = (e) => {
      headerMenuOpen.set(!e.matches)
    }

    const cleanupNavigationForTurboCache = () => {
      if (navigationMedia.matches) {
        headerMenuOpen.reset()
      }
    }

    const eventAbortController = new AbortController()
    const { signal } = eventAbortController

    window.addEventListener('turbo:before-cache', cleanupNavigationForTurboCache, { signal })
    navigationMedia.addEventListener('change', onNavigationMediaChange, { signal })

    return () => eventAbortController?.abort()
  })
</script>

<style>
  .left-side, .right-side {
    padding: 36px 0;
    width: 37%;
  }

  .left-side {
    float: left;
  }

  .right-side {
    float: right;
  }

  .navigation {
    list-style: none;
    margin: 0;
    z-index: 100;
  }

  .left-side .navigation {
    float: right;
  }

  .right-side .navigation {
    float: left;
  }

  .navigation-item {
    display: inline-block;
    min-height: 36px;
    padding: 0 15px;
  }

  .menu-toggle {
    display: none;
    font-size: 1.5rem;
    margin-left: 40px;
  }

  .navigation-link {
    color: hsl(34deg 19% 26%);
    text-transform: uppercase;
  }

  .navigation-link:hover {
    color: hsl(0deg 0% 20%);
  }

  .navigation-item__active .navigation-link {
    color: hsl(13deg 74% 37%);
    font-weight: 500;
  }

  @media screen and (max-width: 940px) {
    .left-side, .right-side {
      width: 34%;
    }
  }

  @media screen and (max-width: 768px) {
    .navigation {
      display: none;
      top: 68px;
      left: 25px;
      position: absolute;
      background: hsl(0deg 0% 100%);
      width: 200px;
      box-shadow: 0 2px 4px hsl(0deg 0% 0% / 15%);
    }

    .navigation__visible {
      display: block;
    }

    .navigation-item {
      display: block;
      padding: 0 5px;
    }

    .navigation-link {
      display: block;
      padding: 8px 15px;
      border-radius: 2px;
      transition: background 0.3s ease;
    }

    .navigation-link:hover {
      background: hsl(45deg 27% 94%);
    }

    .left-side .navigation {
      padding-top: 5px;
      border-radius: 2px 2px 0 0;
    }

    .left-side .navigation:before, .left-side .navigation:after {
      content: "";
      position: absolute;
      bottom: 100%;
      left: 20px;
      border: solid transparent;
      height: 0;
      width: 0;
      pointer-events: none;
    }

    .left-side .navigation:before {
      margin-right: -2px;
      border-color: hsla(0, 0%, 83%, 0);
      border-bottom-color: hsl(0deg 0% 87%);
      border-width: 8px;
    }

    .left-side .navigation:after {
      border-color: hsla(0, 0%, 100%, 0);
      border-bottom-color: hsl(0deg 0% 100%);
      border-width: 6px;
    }

    .right-side .navigation {
      top: 145px;
      padding-bottom: 5px;
      border-radius: 0 0 2px 2px;
    }

    .menu-toggle {
      display: inline-block;
    }
  }

  @media screen and (max-width: 600px) {
    .left-side, .right-side {
      padding: 13px 0;
    }

    .navigation {
      top: 48px;
    }
    .right-side .navigation {
      top: 125px;
    }
  }
</style>

<div>
  <div class="left-side">
    <button on:click|preventDefault="{toggle}" class="menu-toggle" aria-label="Toggle mobile menu link">
      <div class="svg-icon svg-icon--menu">
        <svg class="svg-icon__cnt"><use href="#menu-svg-icon"></use></svg>
      </div>
    </button>
    <ul class="navigation" class:navigation__visible="{$headerMenuOpen}">
      <li class="navigation-item" class:navigation-item__active="{isActiveNavigation('/')}">
        <a class="navigation-link" href="{pageRoute('/')}">Головна</a>
      </li>
      <li class="navigation-item" class:navigation-item__active="{isActiveNavigation('/about')}">
        <a class="navigation-link" href="{pageRoute('/about')}">Про нас</a>
      </li>
    </ul>
  </div>
  <div class="right-side">
    <ul class="navigation" class:navigation__visible="{$headerMenuOpen}">
      <li class="navigation-item" class:navigation-item__active="{isActiveNavigation('/podcasts')}">
        <a class="navigation-link" href="{pageRoute('/podcasts')}">Подкасти</a>
      </li>
      <li class="navigation-item" class:navigation-item__active="{isActiveNavigation('/screencasts')}">
        <a class="navigation-link" href="https://www.youtube.com/rwpod" target="_blank" rel="noopener noreferrer">
          Скрінкасти
        </a>
      </li>
    </ul>
  </div>
</div>
