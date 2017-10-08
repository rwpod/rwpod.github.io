# encoding: utf-8
Encoding.default_external = Encoding::UTF_8
Encoding.default_internal = Encoding::UTF_8
###
# Blog settings
###

Time.zone = "Kyiv"
# blog
activate :blog do |blog|
  blog.prefix = "posts"
  blog.permalink = "{year}/{month}/{day}/{title}.html"
  blog.sources = "{year}/{month}-{day}-{title}.html"
  blog.taglink = "categories/{tag}.html"
  blog.layout = "layout"
  blog.summary_separator = /(READMORE)/
  blog.summary_length = 250
  blog.year_link = "{year}.html"
  blog.month_link = "{year}/{month}.html"
  blog.generate_month_pages = false
  blog.day_link = "{year}/{month}/{day}.html"
  blog.generate_day_pages = false
  blog.default_extension = ".md"

  blog.tag_template = "tag.html"
  blog.calendar_template = "calendar.html"

  blog.paginate = true
  blog.per_page = 10
  blog.page_link = "page/{num}"
end

# Feeds
proxy "/rss.xml", "/feeds/rss.xml", layout: "rss.xml", ignore: true
ignore "/feeds/rss.xml"
proxy "/rss.xsl", "/feeds/rss.xsl", layout: false
ignore "/feeds/rss.xsl"
# sitemap
proxy "/sitemap.xml", "/feeds/sitemap.xml", layout: false
ignore "/feeds/sitemap.xml"
proxy "/sitemap.xsl", "/feeds/sitemap.xsl", layout: false
ignore "/feeds/sitemap.xsl"
# robots
proxy "/robots.txt", "/feeds/robots.txt", layout: false
ignore "/feeds/robots.txt"
# Static pages
proxy "/about.html", "/static_pages/about.html"
ignore "/static_pages/about.html"
# json api
proxy "/api/podcasts/page/{num}.json", "/api/podcasts.json", layout: false
page "/api/podcasts", layout: false

###
# Helpers
###

require "lib/defaults_pod_helpers"
helpers DefaultPodHelpers
require "lib/rwpod_helpers"
helpers RwPodHelpers

set :css_dir, 'css'
set :js_dir, 'js'
set :images_dir, 'images'
set :markdown_engine, :kramdown
set :markdown, filter_html: false, fenced_code_blocks: true, smartypants: true
set :encoding, "utf-8"

activate :sprockets do |c|
  c.expose_middleman_helpers = true
end

if defined?(RailsAssets)
  RailsAssets.load_paths.each do |path|
    sprockets.append_path path
  end
end

activate :autoprefixer do |config|
  config.browsers = ['last 2 versions']
end

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  activate :minify_css
  # Minify Javascript on build
  activate :minify_javascript
  # assets hash
  activate :asset_hash, ignore: %r{^images/static/.*}
  # min html
  activate :minify_html
end
# deploy
activate :deploy do |deploy|
  deploy.deploy_method = :git
  deploy.branch = "master"
  deploy.clean = true
end
