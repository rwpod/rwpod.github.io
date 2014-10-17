root = global ? window

root.RWpod =
  init: ->
    this.initPlayer()
    this.initNavigation()
  initPlayer: ->
    return unless $('audio.podcast_player').length
    audiojs.events.ready ->
      as = audiojs.create $('audio.podcast_player'),
        imageLocation: root.audioImageLocation
        swfLocation: "/images/audiojs/audiojs.swf"
        css: null
  initNavigation: ->
    $('.menu-toggle').click ->
      if $('.navigation').is(':visible')
        $('.navigation').fadeOut(100)
      else
        $('.navigation').fadeIn(100)

$ -> root.RWpod.init()
