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
# ignore npms
ignore 'node_modules/**/*'

###
# Helpers
###

require "lib/defaults_pod_helpers"
helpers DefaultPodHelpers
require "lib/rwpod_helpers"
helpers RwPodHelpers

set :images_dir, 'images'
set :markdown_engine, :kramdown
set :markdown, filter_html: false, fenced_code_blocks: true, smartypants: true
set :encoding, "utf-8"

assets_dir = ".tmp/dist"

activate :external_pipeline,
  name: :webpack,
  command: build? ?
    "./node_modules/.bin/gulp cleanup:assets && NODE_ENV=production ./node_modules/.bin/webpack --bail" :
    './node_modules/.bin/webpack --watch -d --color',
  source: assets_dir,
  latency: 1

# Build-specific configuration
configure :build do
  # min html
  activate :minify_html
  # ignore npms
  ignore 'node_modules/**/*'
end
# deploy
activate :deploy do |deploy|
  deploy.deploy_method = :git
  deploy.branch = "master"
  deploy.clean = true
end

after_build do
  system('yarn critical')
end
