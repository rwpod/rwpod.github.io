# encoding: utf-8
module LinksPodHelpers

  def current_link_class(path = "/")
    current_page.path == path ? "active" : ""
  end
  
  def audio_tag(options = {})
    "<audio class=\"podcast_player\" src=\"#{current_article.data.audio_url}\" preload=\"none\" />" if current_article && current_article.data && current_article.data.audio_url
  end

end