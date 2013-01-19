root = global ? window

root.RWpod =
  init: ->
    this.initPlayer()
  initPlayer: ->
    return unless $('audio.podcast_player').length
    audiojs.events.ready ->
      as = audiojs.create $('audio.podcast_player'),
        imageLocation: root.audioImageLocation
        swfLocation: "/images/audiojs/audiojs.swf"
    
$ -> root.RWpod.init()