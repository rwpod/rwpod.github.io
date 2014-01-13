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

# rw markdown
require "lib/rw_markdown"
activate :rw_markdown

set :css_dir, 'css'
set :js_dir, 'js'
set :images_dir, 'images'
set :markdown_engine, :redcarpet
set :markdown, filter_html: false, fenced_code_blocks: true, smartypants: true
set :encoding, "utf-8"
# highlight
#activate :syntax, linenos: 'inline', anchorlinenos: true, linenostart: 2
# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Enable cache buster
  # activate :cache_buster

  # Use relative URLs
  # activate :relative_assets

  # Compress PNGs after build
  # First: gem install middleman-smusher
  #require "middleman-smusher"
  #activate :smusher

  # Or use a different image path
  # set :http_path, "/Content/images/"
  #
  activate :asset_hash, ignore: %r{^images/static/.*}
  # min html
  activate :minify_html

  activate :favicon_maker do |f|
    f.template_dir  = File.join(root, 'source/images/favicons')
    f.output_dir    = File.join(root, 'build/images/favicons')
    f.icons = {
      "favicon_base.png" => [
        { icon: "apple-touch-icon-152x152-precomposed.png", size: "152x152" },
        { icon: "apple-touch-icon-144x144-precomposed.png", size: "144x144" },
        { icon: "apple-touch-icon-120x120-precomposed.png", size: "120x120" },
        { icon: "apple-touch-icon-114x114-precomposed.png", size: "114x114" },
        { icon: "apple-touch-icon-76x76-precomposed.png", size: "76x76" },
        { icon: "apple-touch-icon-72x72-precomposed.png", size: "72x72" },
        { icon: "apple-touch-icon-60x60-precomposed.png", size: "60x60" },
        { icon: "apple-touch-icon-57x57-precomposed.png", size: "57x57" },
        { icon: "apple-touch-icon-precomposed.png", size: "57x57" },
        { icon: "apple-touch-icon.png", size: "57x57" },
        { icon: "favicon.png", size: "16x16" },
        { icon: "favicon.ico", size: "64x64,32x32,24x24,16x16" }
      ]
    }
  end
end
# deploy
activate :deploy do |deploy|
  deploy.method = :git
  deploy.branch = "master"
  deploy.clean = true
end
