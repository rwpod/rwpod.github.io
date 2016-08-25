# encoding: utf-8
require 'erb'
require 'active_support'
require 'active_support/core_ext'
require 'rails-html-sanitizer'

module RwPodHelpers
  include ActionView::Helpers::SanitizeHelper

  def current_link_class(path = "/")
    current_page.path == path ? "active" : ""
  end

  def is_tag_subscribe_panel?(tag)
    ["podcasts", "screencasts"].include?(tag)
  end

  def tag_subscribe_panel(tag)
    if is_tag_subscribe_panel?(tag)
      partial "partials/subscribe_box", locals: { rss_path: "/rwpod-#{tag}" }
    end
  end

  def get_rss_articles(tag, is_tag = false)
    if is_tag
      blog.tags[tag.to_s][0..39]
    else
      blog.articles[0..39]
    end
  end

  def article_icon(article)
    case article.data.small_icon
      when String
        "<i class=\"article-icon foundicon-#{article.data.small_icon}\"></i>"
      else
        ""
    end
  end

  def svg_sprite_icons
    svg_html_safe File.new(File.expand_path('../../source/svg/sprite.svg', __FILE__)).read
  end

  def svg_sprite(name, options = {})
    options[:class] = [
      "svg-icon svg-icon--#{name}",
      options[:size] ? "svg-icon--#{options[:size]}" : nil,
      options[:class]
    ].compact.join(" ")

    icon = "<svg class='svg-icon__cnt'><use xlink:href='##{name}-svg-icon'/></svg>"

    svg_html_safe "
      <div class='#{options[:class]}'>
        #{wrap_svg_spinner icon, options[:class]}
      </div>
    "
  end

  def wrap_svg_spinner(html, klass)
    if klass.include?("spinner")
      svg_html_safe "<div class='icon__spinner'>#{html}</div>"
    else
      html
    end
  end

  def svg_html_safe(html)
    html.respond_to?(:html_safe) ? html.html_safe : html
  end

  def sanitize_tags(html)
    Rails::Html::FullSanitizer.new.sanitize(html)
  end

  def hex_mail_to(email_address, name = nil, html_options = {})
    email_address = ERB::Util.html_escape(email_address)

    email_address_obfuscated = email_address.to_str
    email_address_obfuscated.gsub!(/@/, html_options.delete("replace_at")) if html_options.key?("replace_at")
    email_address_obfuscated.gsub!(/\./, html_options.delete("replace_dot")) if html_options.key?("replace_dot")

    email_address_encoded = email_address_obfuscated.unpack('C*').map {|c|
      sprintf("&#%d;", c)
    }.join

    string = 'mailto:' + email_address.unpack('C*').map { |c|
      char = c.chr
      char =~ /\w/ ? sprintf("%%%x", c) : char
    }.join

    content_tag "a", name || email_address_encoded, html_options.merge("href" => "#{string}")
  end

  def audio_tag(article = nil)
    str = ''

    if article && article.data && article.data.audio_url
      data = article.data

      str = <<-END.split("\n").map!(&:strip).join("")
<div>

<div id="podcastPlayer" class="podcast_player jp-jplayer" data-url="#{data.audio_url}" data-title="#{article.title}">
  <audio preload="metadata" src="#{data.audio_url}" title="#{article.title}"></audio>
</div>

<div id="podcastPlayerInterface" class="player_interface jp-audio">
  <div class="jp-type-single">
    <div class="jp-gui jp-interface">
      <ul class="jp-controls">
        <li><a href="javascript:;" class="jp-play icon-play" tabindex="1"></a></li>
        <li><a href="javascript:;" class="jp-pause icon-pause" tabindex="1"></a></li>
        <li><a href="javascript:;" class="jp-mute icon-volume-off" tabindex="1" title="mute"></a></li>
        <li><a href="javascript:;" class="jp-unmute icon-volume-up" tabindex="1" title="unmute"></a></li>
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
      <p>To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.</p>
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