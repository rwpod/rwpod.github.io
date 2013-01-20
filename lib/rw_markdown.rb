require "middleman-core"

module RwMarkdown
  class << self

    def options
      @@options
    end

    def registered(app, options_hash={})
      @@options = options_hash
      yield @@options if block_given?
      
      app.send :include, Helper
      
      require "middleman-core/renderers/redcarpet"
      Middleman::Renderers::MiddlemanRedcarpetHTML.send :include, RwMarkdownRenderer
    end
    alias :included :registered
  end
  
  module Helper
    def audio_tag(options = {})
      "<audio class=\"podcast_player\" src=\"#{current_page.data.audio_url}\" preload=\"none\" />" if current_page && current_page.data && current_page.data.audio_url
    end
  end
  
  module RwMarkdownRenderer
    def paragraph(text)
      return "<p>#{middleman_app.audio_tag()}</p>" if "[audio_tag]" == text
      "<p>#{text}</p>"
    end
  end
end

::Middleman::Extensions.register(:rw_markdown, RwMarkdown)