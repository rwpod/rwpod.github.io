import $ from 'jquery'
import 'jplayer'

const initPlayer = () => {
  if (!$('#podcastPlayer').length) {
    return
  }
  $.jPlayer.prototype.options.noVolume = {} // show volume on mobile
  // init player
  $('#podcastPlayer').jPlayer({
    ready: function () {
      return $(this).jPlayer("setMedia", {
        title: $(this).data('title'),
        mp3: $(this).data('url')
      })
    },
    swfPath: "http://jplayer.org/latest/js",
    cssSelectorAncestor: '#podcastPlayerInterface',
    supplied: "mp3",
    solution: 'html, flash',
    preload: 'metadata',
    volume: 0.8,
    muted: false,
    smoothPlayBar: true,
    keyEnabled: false,
    remainingDuration: true,
    toggleDuration: true,
    noVolume: {}
  })
}

const initNavigation = () => {
  if (!$('.menu-toggle').length || !$('.navigation').length) {
    return
  }
  const navigation = $('.navigation')

  const clickNavigation = (e) => {
    e.preventDefault()
    if (navigation.is(':visible')) {
      navigation.fadeOut(100)
    } else {
      navigation.fadeIn(100)
    }
  }

  $('.menu-toggle').on('click', clickNavigation)
}

const initRWpod = () => {
  initPlayer()
  initNavigation()
}

$(function() {
  initRWpod()
})

