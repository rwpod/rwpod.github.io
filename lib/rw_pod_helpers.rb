# encoding: utf-8
module RwPodHelpers

  def current_link_class(path = "/")
    current_page.path == path ? "active" : ""
  end
  
  def audio_tag(options = {})
    "<audio class=\"podcast_player\" src=\"#{current_page.data.audio_url}\" preload=\"none\" />" if current_page && current_page.data && current_page.data.audio_url
  end
  
  def is_tag_subscribe_panel?(tag)
    ["podcasts", "screencasts"].include?(tag)
  end
  
  def tag_subscribe_panel(tag)
    if is_tag_subscribe_panel?(tag)
      partial "partials/subscribe_box", locals: { rss_path: "http://feeds.feedburner.com/rwpod-#{tag}", itunes_path: "/#{tag}.xml" }
    end
  end
  
  def get_rss_articles(tag, is_tag = false)
    if is_tag
      blog.tags[tag.to_s][0..10]
    else
      blog.articles[0..10]
    end
  end

end