# frozen_string_literal: true

require 'erb'
require 'active_support'
require 'active_support/core_ext'
require 'rails-html-sanitizer'

module RwPodHelpers

  include ActionView::Helpers::SanitizeHelper

  def current_link_class(path = '/')
    current_page.path == path ? 'active' : ''
  end

  def get_rss_articles(tag: nil, limit: 50)
    if tag.nil?
      blog.articles[0...limit]
    else
      blog.tags[tag.to_s][0...limit]
    end
  end

  def svg_sprite_icons
    svg_html_safe File.new(File.expand_path('../source/svg/sprite.svg', __dir__)).read
  end

  def svg_sprite(name, options = {})
    options[:class] = [
      "svg-icon svg-icon--#{name}",
      options[:size] ? "svg-icon--#{options[:size]}" : nil,
      options[:class]
    ].compact.join(' ')

    icon = "<svg class='svg-icon__cnt'><use href='##{name}-svg-icon'/></svg>"

    svg_html_safe "
      <div class='#{options[:class]}'>
        #{wrap_svg_spinner icon, options[:class]}
      </div>
    "
  end

  def wrap_svg_spinner(html, klass)
    if klass.include?('spinner')
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

  def mail_to_hex(email_address)
    hex_email = ERB::Util.html_escape(email_address).unpack('C*').map do |c|
      char = c.chr
      /\w/.match?(char) ? format('%%%x', c) : char
    end.join

    "mailto:#{hex_email}".html_safe
  end

end
