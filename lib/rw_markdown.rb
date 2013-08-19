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
    def audio_tag(options = {})
      if current_page && current_page.data && current_page.data.audio_url
        str = <<-END.split("\n").map!(&:strip).join("")
<div>
  <audio class="podcast_player audiojs" src="#{current_page.data.audio_url}" preload="none">
    <source src="#{current_page.data.audio_url}" type="audio/mpeg" />
  </audio>
</div>
<div class="track-details">
  #{current_page.data.duration},
  <a href="#{current_page.data.audio_url}" target="_blank">Скачать (#{number_to_human_size(current_page.data.audio_length)})</a>#{current_page.data.audio_mirror ? ", <a href=\"#{current_page.data.audio_mirror}\" target=\"_blank\">Зеркало</a>" : ""}
</div>
END
        return str
      else
        return ""
      end
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