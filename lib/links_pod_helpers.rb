# encoding: utf-8
module LinksPodHelpers

  def current_link_class(path = "/")
    current_page.path == path ? "active" : ""
  end
  
  def audio_tag(options = {})
    "<audio class=\"podcast_player\" src=\"#{current_article.data.audio_url}\" preload=\"none\" />"
  end

end