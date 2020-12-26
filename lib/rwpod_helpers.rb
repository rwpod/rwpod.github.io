# encoding: utf-8
require 'erb'
require 'active_support'
require 'active_support/core_ext'
require 'rails-html-sanitizer'

module RwPodHelpers
  include ActionView::Helpers::SanitizeHelper

  def javascript_pack_tag(name)
    file_name = "#{name}.js"
    %(<script src="#{asset_pack_path(file_name)}" defer="defer" async="async" data-turbolinks-track="true"></script>)
  end

  def stylesheet_pack_tag(name)
    file_name = "#{name}.css"
    %(<link href="#{asset_pack_path(file_name)}" rel="stylesheet" media="all" />)
  end

  def asset_pack_path(name)
    public_manifest_path = File.expand_path File.join(
      File.dirname(__FILE__),
      '../.tmp/dist/assets-manifest.json',
    )
    manifest_data = if File.exist?(public_manifest_path)
                      JSON.parse(File.read(public_manifest_path))
                    else
                      {}
                    end

    manifest_data[name.to_s] || raise("asset #{name} not found in #{manifest_data.inspect}")
  end

  def current_link_class(path = "/")
    current_page.path == path ? "active" : ""
  end

  def get_rss_articles(tag: nil, limit: 50)
    unless tag.nil?
      blog.tags[tag.to_s][0...limit]
    else
      blog.articles[0...limit]
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
    email_address_obfuscated.gsub!(/@/, html_options.delete('replace_at')) if html_options.key?('replace_at')
    email_address_obfuscated.gsub!(/\./, html_options.delete('replace_dot')) if html_options.key?('replace_dot')

    email_address_encoded = email_address_obfuscated.unpack('C*').map {|c|
      sprintf("&#%d;", c)
    }.join

    string = 'mailto:' + email_address.unpack('C*').map { |c|
      char = c.chr
      char =~ /\w/ ? sprintf("%%%x", c) : char
    }.join

    content_tag "a", name || email_address_encoded, html_options.merge('href' => string)
  end

end
