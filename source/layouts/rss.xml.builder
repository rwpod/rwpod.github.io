# encoding: utf-8
xml.instruct!
xml.instruct! 'xml-stylesheet', { href: '/rss.xsl', type: 'text/xsl' }
xml.rss "xmlns:itunes" => "http://www.itunes.com/dtds/podcast-1.0.dtd",
"xmlns:media" => "http://search.yahoo.com/mrss/",
"xmlns:creativeCommons" => "http://cyber.law.harvard.edu/rss/creativeCommonsRssModule.html",
"xmlns:atom" => "http://www.w3.org/2005/Atom",
version: "2.0" do
  xml.channel do
    xml.title default_title_helper
    xml.description default_description_helper
    xml.language "ru"
    xml.link default_main_url_helper
    xml.copyright default_footer_copyright_helper
    xml.pubDate blog.articles.first.date.to_s(:rfc822)
    xml.lastBuildDate blog.articles.first.date.to_s(:rfc822)

    xml.atom(:link, href: "#{default_feeds_url_helper}#{defined?(is_tag) && is_tag ? "/rwpod-#{tag_name}" : "/rwpod"}", rel: "self", type: "application/rss+xml")

    xml.itunes :author, default_author_helper
    xml.itunes :keywords, default_keywords_helper
    xml.itunes :explicit, 'clean'
    xml.itunes :image, href: default_big_image_helper
    xml.itunes :owner do
      xml.itunes :name, default_author_helper
      xml.itunes :email, default_email_helper
    end
    xml.itunes :block, 'no'
    xml.itunes :category, :text => 'Technology' do
      xml.itunes :category, :text => 'Tech News'
    end
    xml.itunes :category, :text => 'Technology' do
      xml.itunes :category, :text => 'Software How-To'
    end

    xml.media :copyright, "Creative Commons - Attribution-NonCommercial-NoDerivatives 4.0 International."
    xml.media :thumbnail, url: default_big_image_helper
    xml.media :keywords, default_keywords_helper
    xml.media :category, "Technology/Tech News", scheme: "http://www.itunes.com/dtds/podcast-1.0.dtd"
    xml.media :category, "Technology/Software How-To", scheme: "http://www.itunes.com/dtds/podcast-1.0.dtd"

    xml.creativeCommons :license, "http://creativecommons.org/licenses/by-nc-nd/4.0/"

    xml << yield
  end
end