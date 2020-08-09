# encoding: utf-8
xml.instruct!
xml.instruct! 'xml-stylesheet', { href: '/sitemap.xsl', type: 'text/xsl' }
xml.urlset 'xmlns' => "http://www.sitemaps.org/schemas/sitemap/0.9" do
  sitemap.resources
    .select {|page| page.path =~ /\.html/ && page.path != '404.html' && page.url !~ /\/page\/\d+/ }
    .sort {|a, b| (b.respond_to?(:date) ? b.date : Date.today) <=> (a.respond_to?(:date) ? a.date : Date.today) }
    .each do |page|
      xml.url do
        xml.loc full_url(page.url)
        xml.lastmod (page.respond_to?(:date) ? page.date : Date.today).to_time.iso8601
        xml.changefreq page.data.changefreq || "weekly"
        xml.priority page.data.priority || "0.6"
      end
  end
end
