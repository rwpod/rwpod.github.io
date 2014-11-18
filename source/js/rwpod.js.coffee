class RWpod
  constructor: ->
    @_initPlayer()
    @_initNavigation()

  _initPlayer: =>
    return unless $('#podcastPlayer').length
    $.jPlayer::options.noVolume = {} # show volume on mobile
    # init player
    $('#podcastPlayer').jPlayer
      ready: ->
        $(@).jPlayer "setMedia",
          title: $(@).data('title')
          mp3: $(@).data('url')
      swfPath: "http://jplayer.org/latest/js"
      cssSelectorAncestor: '#podcastPlayerInterface'
      supplied: "mp3"
      solution: 'html, flash'
      preload: 'metadata'
      volume: 0.8
      muted: false
      smoothPlayBar: true
      keyEnabled: true
      remainingDuration: true
      toggleDuration: true
      noVolume: {}


  _initNavigation: =>
    $('.menu-toggle').on 'click', @_clickNavigation

  _clickNavigation: (e) =>
    e.preventDefault()
    if $('.navigation').is(':visible')
      $('.navigation').fadeOut(100)
    else
      $('.navigation').fadeIn(100)

$ -> new RWpod()
