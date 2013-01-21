# encoding: utf-8
xml.instruct!
xml.instruct! 'xml-stylesheet', { href: '/sitemap.xsl', type: 'text/xsl' }
xml.urlset 'xmlns' => "http://www.sitemaps.org/schemas/sitemap/0.9" do
  sitemap.resources.select { |page| page.path =~ /\.html/ }.each do |page|
    xml.url do
      xml.loc "#{default_main_url_helper}#{page.url}"
      xml.lastmod Date.today.to_time.iso8601
      xml.changefreq page.data.changefreq || "weekly"
      xml.priority page.data.priority || "0.6"
    end
  end
end