# encoding: utf-8
module RwMarkdown
  class << self

    def options
      @@options
    end

    def registered(app, options_hash={})
      @@options = options_hash
      yield @@options if block_given?

      app.send :include, Helper
      app.after_configuration do
        if markdown_engine == :redcarpet
          require "middleman-core/renderers/redcarpet"
          Middleman::Renderers::MiddlemanRedcarpetHTML.send :include, RwMarkdownRenderer
        elsif markdown_engine == :kramdown
          require 'kramdown'
          Kramdown::Converter::Html.class_eval do
            def convert_p(el, indent)
              if el && "[audio_tag]" == inner(el, indent)
                ""
              else
                if el.options[:transparent]
                  inner(el, indent)
                else
                  format_as_block_html(el.type, el.attr, inner(el, indent), indent)
                end
              end
            end
          end
        end
      end
    end
    alias :included :registered
  end

  module Helper
    def audio_tag(article = nil)
      if article
        data = article.data
      elsif current_page.try(:data).try(:audio_url)
        article = current_page
        data = current_page.data
      else
        data = nil
      end

      str = ''

      if data && data.audio_url && article
        str = <<-END.split("\n").map!(&:strip).join("")
<div>

  <div class="podcast_player jp-jplayer" data-url="#{data.audio_url}" data-title="#{article.title}">
    <audio preload="metadata" src="#{data.audio_url}" title="#{article.title}"></audio>
  </div>

  <div class="player_interface jp-audio">
    <div class="jp-type-single">
      <div class="jp-gui jp-interface">
        <ul class="jp-controls">
          <li><a href="javascript:;" class="jp-previous" tabindex="1">previous</a></li>
          <li><a href="javascript:;" class="jp-play" tabindex="1">play</a></li>
          <li><a href="javascript:;" class="jp-pause" tabindex="1">pause</a></li>
          <li><a href="javascript:;" class="jp-next" tabindex="1">next</a></li>
          <li><a href="javascript:;" class="jp-stop" tabindex="1">stop</a></li>
          <li><a href="javascript:;" class="jp-mute" tabindex="1" title="mute">mute</a></li>
          <li><a href="javascript:;" class="jp-unmute" tabindex="1" title="unmute">unmute</a></li>
          <li><a href="javascript:;" class="jp-volume-max" tabindex="1" title="max volume">max volume</a></li>
        </ul>

        <div class="jp-progress">
          <div class="jp-seek-bar">
            <div class="jp-play-bar"></div>
          </div>
        </div>

        <div class="jp-volume-bar">
          <div class="jp-volume-bar-value"></div>
        </div>

        <div class="jp-time-holder">
          <div class="jp-current-time"></div>
          <div class="jp-duration"></div>
        </div>

        <ul class="jp-toggles">
          <li><a href="javascript:;" class="jp-shuffle" tabindex="1" title="shuffle">shuffle</a></li>
          <li><a href="javascript:;" class="jp-shuffle-off" tabindex="1" title="shuffle off">shuffle off</a></li>
          <li><a href="javascript:;" class="jp-repeat" tabindex="1" title="repeat">repeat</a></li>
          <li><a href="javascript:;" class="jp-repeat-off" tabindex="1" title="repeat off">repeat off</a></li>
        </ul>
      </div>

      <div class="jp-no-solution">
        <span>Update Required</span>
        To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.
      </div>
    </div>
  </div>

</div>

<div class="track-details">
  #{data.duration}, <a href="#{data.audio_url}" target="_blank">Скачать (#{number_to_human_size(data.audio_length)})</a>#{data.audio_mirror ? ", <a href=\"#{data.audio_mirror}\" target=\"_blank\">Зеркало</a>" : ""}
</div>
END
      end
      str
    end

    def number_to_human_size(number, precision = 2)
      number = begin
        Float(number)
      rescue ArgumentError, TypeError
        return number
      end
      case
        when number.to_i == 1 then
          "1 Byte"
        when number < 1024 then
          "%d Bytes" % number
        when number < 1048576 then
          "%.#{precision}f KB"  % (number / 1024)
        when number < 1073741824 then
          "%.#{precision}f MB"  % (number / 1048576)
        when number < 1099511627776 then
          "%.#{precision}f GB"  % (number / 1073741824)
        else
          "%.#{precision}f TB"  % (number / 1099511627776)
      end.sub(/([0-9]\.\d*?)0+ /, '\1 ' ).sub(/\. /,' ')
    rescue
      nil
    end
  end

  module RwMarkdownRenderer
    def paragraph(text)
      return middleman_app.audio_tag() if "[audio_tag]" == text
      #return "<audio class=\"podcast_player audiojs\" preload=\"none\"><source type=\"audio/mpeg\" /></audio>\n" if "[audio_tag]" == text
      "<p>#{text}</p>\n"
    end
  end
end

::Middleman::Extensions.register(:rw_markdown, RwMarkdown)
