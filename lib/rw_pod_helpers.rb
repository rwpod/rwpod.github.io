# encoding: utf-8
module RwPodHelpers

  def current_link_class(path = "/")
    current_page.path == path ? "active" : ""
  end
  
  def is_tag_subscribe_panel?(tag)
    ["podcasts", "screencasts"].include?(tag)
  end
  
  def tag_subscribe_panel(tag)
    if is_tag_subscribe_panel?(tag)
      partial "partials/subscribe_box", locals: { rss_path: "/rwpod-#{tag}", itunes_url: "/#{tag}.xml" }
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
        "<i class=\"foundicon-#{article.data.small_icon}\"></i>"
      else
        ""
    end
  end

end