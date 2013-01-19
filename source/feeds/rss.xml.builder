# encoding: utf-8
get_rss_articles(tag_name, is_tag).each do |article|
  xml.item do
    xml.title article.title
    xml.description article.body
    xml.pubDate article.date.to_s(:rfc822)
    xml.link article.url
    xml.guid({:isPermaLink => "true"}, article.url)
    if article.data.audio_url && article.data.audio_length
      xml.enclosure(url: article.data.audio_url, length: article.data.audio_length, type: (article.data.audio_format || "audio/mp3"))
    elsif article.data.video_url && article.data.video_length && article.data.video_format
      xml.enclosure(url: article.data.video_url, length: article.data.video_length, type: article.data.video_format)
    end

    xml.itunes :author, default_author_helper
    xml.itunes :subtitle, truncate(article.body, :length => 150)
    xml.itunes :summary, article.summary
    xml.itunes :explicit, 'no'
    xml.itunes :image, article.data.main_image if article.data.main_image
    xml.itunes :duration, (article.data.duration ? article.data.duration : "00:30:00")
  end
end if defined?(tag_name) && defined?(is_tag)