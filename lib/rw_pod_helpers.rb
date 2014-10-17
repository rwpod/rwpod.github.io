# encoding: utf-8
require 'erb'
require 'active_support'
require 'active_support/core_ext'
require 'action_view/helpers/sanitize_helper'

module RwPodHelpers

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
      blog.tags[tag.to_s][0..10]
    else
      blog.articles[0..10]
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

  def sanitize_tags(html)
    sanitize(html)
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

end