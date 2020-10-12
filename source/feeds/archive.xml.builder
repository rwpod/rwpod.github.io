# encoding: utf-8
get_rss_articles(limit: 160).each do |article|
  xml.item do
    xml.title article.title
    xml.description do
      xml.cdata! article.body
    end
    xml.content :encoded do
      xml.cdata! article.body
    end
    xml.pubDate article.date.to_s(:rfc822)
    xml.link full_url(article.url)
    xml.guid({:isPermaLink => "true"}, full_url(article.url))

    if article.data.audio_url && article.data.audio_length
      xml.enclosure(url: article.data.audio_url, length: article.data.audio_length, type: (article.data.audio_format || "audio/mpeg"))
      xml.media :content, url: article.data.audio_url, fileSize: article.data.audio_length, type: (article.data.audio_format || "audio/mpeg")
    elsif article.data.video_url && article.data.video_length && article.data.video_format
      xml.enclosure(url: article.data.video_url, length: article.data.video_length, type: article.data.video_format)
      xml.media :content, url: article.data.video_url, fileSize: article.data.video_length, type: article.data.video_format
    end

    xml.itunes :author, default_author_helper
    xml.itunes :subtitle, truncate(Nokogiri::HTML(article.body).text, length: 150)
    xml.itunes :summary, Nokogiri::HTML(article.summary).text
    xml.itunes :explicit, 'no'
    xml.itunes :image, href: (article.data.main_image ? full_url(article.data.main_image) : default_image_helper)
    xml.itunes :duration, (article.data.duration ? article.data.duration : "00:30:00")

    xml.creativeCommons :license, "http://creativecommons.org/licenses/by-nc-nd/4.0/"
  end
end
