xml.instruct!
xml.instruct! 'xml-stylesheet', { href: '/rss.xsl', type: 'text/xsl' }
xml.rss "xmlns:itunes" => "http://www.itunes.com/dtds/podcast-1.0.dtd", "xmlns:media" => "http://search.yahoo.com/mrss/", version: "2.0" do
  xml.channel do
    xml.title default_title_helper
    xml.description default_description_helper
    xml.language "ru"
    xml.link default_main_url_helper
    xml.copyright default_footer_copyright_helper
    xml.pubDate blog.articles.first.date.to_s(:rfc822)
    xml.lastBuildDate blog.articles.first.date.to_s(:rfc822)
    
    xml.itunes :author, default_author_helper
    xml.itunes :keywords, default_keywords_helper
    xml.itunes :explicit, 'clean'
    xml.itunes :image, :href => default_image_helper
    xml.itunes :owner do
      xml.itunes :name, default_author_helper
      xml.itunes :email, default_email_helper
    end
    xml.itunes :block, 'no'
    xml.itunes :category, :text => 'Technology' do
      xml.itunes :category, :text => 'Software How-To'
    end

    blog.articles[0..10].each do |article|
      xml.item do
        xml.title article.title
        xml.description article.body
        xml.pubDate article.date.to_s(:rfc822)
        xml.link article.url
        xml.guid({:isPermaLink => "true"}, article.url)

        xml.itunes :author, default_author_helper
        xml.itunes :subtitle, truncate(article.body, :length => 150)
        xml.itunes :summary, article.summary
        xml.itunes :explicit, 'no'
        xml.itunes :image, article.data.main_image if article.data.main_image
        xml.itunes :duration, (article.data.duration ? article.data.duration : "00:30:00")
      end
    end
  end
end