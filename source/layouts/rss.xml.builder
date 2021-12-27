# frozen_string_literal: true

xml.instruct!
xml.instruct! 'xml-stylesheet', { href: '/rss.xsl', type: 'text/xsl' }
xml.rss 'xmlns:itunes' => 'http://www.itunes.com/dtds/podcast-1.0.dtd',
        'xmlns:googleplay' => 'http://www.google.com/schemas/play-podcasts/1.0',
        'xmlns:media' => 'http://search.yahoo.com/mrss/',
        'xmlns:creativeCommons' => 'http://backend.userland.com/creativeCommonsRssModule',
        'xmlns:atom' => 'http://www.w3.org/2005/Atom',
        'xmlns:content' => 'http://purl.org/rss/1.0/modules/content/',
        'version' => '2.0' do
  xml.channel do
    xml.title default_title_helper
    xml.description default_description_helper
    xml.language 'ru'
    xml.link full_url('/')
    xml.copyright default_footer_copyright_helper
    xml.pubDate blog.articles.first.date.to_formatted_s(:rfc822)
    xml.lastBuildDate blog.articles.first.date.to_formatted_s(:rfc822)
    xml.ttl 1440

    xml.atom(:link, href: full_url(current_page.url), rel: 'self', type: 'application/rss+xml')

    xml.itunes :author, default_author_helper
    xml.itunes :keywords, default_keywords_helper
    xml.itunes :image, href: default_big_image_helper
    xml.itunes :owner do
      xml.itunes :name, default_author_helper
      xml.itunes :email, default_email_helper
    end
    xml.itunes :block, 'no'
    xml.itunes :explicit, 'no'
    xml.itunes :category, text: 'Technology'

    xml.media :copyright, 'Creative Commons - Attribution-NonCommercial-NoDerivatives 4.0 International.', url: 'http://creativecommons.org/licenses/by-nc-nd/4.0/'
    xml.media :thumbnail, url: default_big_image_helper
    xml.media :keywords, default_keywords_helper
    xml.media :category, 'Technology', scheme: 'http://www.itunes.com/dtds/podcast-1.0.dtd'

    xml.googleplay :author, default_author_helper
    xml.googleplay :owner, default_email_helper
    xml.googleplay :image, href: default_big_image_helper
    xml.googleplay :block, 'no'
    xml.googleplay :explicit, 'no'
    xml.googleplay :category, text: 'Technology'

    xml.creativeCommons :license, 'http://creativecommons.org/licenses/by-nc-nd/4.0/'

    xml << yield
  end
end
