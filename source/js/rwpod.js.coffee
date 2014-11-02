root = (exports ? this)

class RWpod
  constructor: ->
    @_initPlayer()
    @_initNavigation()

  _initPlayer: =>
    return unless $('div.podcast_player').length
    $('div.podcast_player').jPlayer
      ready: ->
        $(@).jPlayer "setMedia",
          title: $(@).data('title')
          mp3: $(@).data('url')
      swfPath: "http://jplayer.org/latest/js"
      cssSelectorAncestor: 'div.player_interface'
      supplied: "mp3"
      solution: 'html, flash'
      preload: 'metadata'
      volume: 0.8
      muted: false
      smoothPlayBar: true
      keyEnabled: true
      remainingDuration: true
      toggleDuration: true


  _initNavigation: =>
    $('.menu-toggle').click ->
      if $('.navigation').is(':visible')
        $('.navigation').fadeOut(100)
      else
        $('.navigation').fadeIn(100)

$ -> new RWpod
