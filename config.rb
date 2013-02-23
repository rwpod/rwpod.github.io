# encoding: utf-8
Encoding.default_external = Encoding::UTF_8
Encoding.default_internal = Encoding::UTF_8
###
# Blog settings
###

Time.zone = "Kyiv"

activate :blog do |blog|
  blog.prefix = "posts"
  blog.permalink = ":year/:month/:day/:title.html"
  blog.sources = ":year-:month-:day-:title.html"
  blog.taglink = "categories/:tag.html"
  blog.layout = "layout.html"
  blog.summary_separator = /(READMORE)/
  blog.summary_length = 250
  blog.year_link = ":year.html"
  blog.month_link = ":year/:month.html"
  blog.day_link = ":year/:month/:day.html"
  blog.default_extension = ".md"

  blog.tag_template = "tag.html"
  blog.calendar_template = "calendar.html"

  blog.paginate = true
  blog.per_page = 10
  blog.page_link = "page/:num"
end

# Feeds
["rss", "podcasts", "screencasts"].each do |name|
  page "/#{name}.xml", proxy: "/feeds/rss.xml", layout: "rss.xml", locals: { tag_name: name, is_tag: ("rss" != name) }, ignore: true
end
page "/rss.xsl", proxy: "/feeds/rss.xsl", layout: false
# sitemap
page "/sitemap.xml", proxy: "/feeds/sitemap.xml", layout: false
page "/sitemap.xsl", proxy: "/feeds/sitemap.xsl", layout: false
# robots
page "/robots.txt", proxy: "/feeds/robots.txt", layout: false
# Static pages
page "/about.html", proxy: "/static_pages/about.html"

# json
page "/api/podcasts", layout: false

###
# Compass
###

# Susy grids in Compass
# First: gem install susy --pre
# require 'susy'

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

# ZURB Foundation
require "zurb-foundation"

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy (fake) files
# page "/this-page-has-no-template.html", :proxy => "/template-file.html" do
#   @which_fake_page = "Rendering a fake page with a variable"
# end

###
# Helpers
###

require "lib/defaults_pod_helpers"
helpers DefaultPodHelpers
require "lib/rw_pod_helpers"
helpers RwPodHelpers

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

set :css_dir, 'css'
set :js_dir, 'js'
set :images_dir, 'images'
set :markdown_engine, :redcarpet
set :markdown, fenced_code_blocks: true, smartypants: true
set :encoding, "utf-8"
# highlight
activate :syntax, linenos: 'inline', anchorlinenos: true, linenostart: 2
# rw markdown
require "lib/rw_markdown"
activate :rw_markdown
# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Enable cache buster
  # activate :cache_buster
  activate :favicon_maker, favicon_maker_input_dir: "source/images/favicons/", favicon_maker_output_dir: "build/images/favicons/"

  # Use relative URLs
  # activate :relative_assets

  # Compress PNGs after build
  # First: gem install middleman-smusher
  #require "middleman-smusher"
  #activate :smusher

  # Or use a different image path
  # set :http_path, "/Content/images/"
  #
  activate :asset_hash
  # min html
  activate :minify_html
end
# deploy
activate :deploy do |deploy|
  deploy.method = :git
  deploy.branch = "master"
  deploy.after_build = false
  deploy.clean = true
end
