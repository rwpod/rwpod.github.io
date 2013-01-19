###
# Blog settings
###

Time.zone = "Kyiv"

activate :blog do |blog|
  blog.prefix = "posts"
  blog.permalink = ":year/:month/:day/:title.html"
  blog.sources = ":year-:month-:day-:title.html"
  blog.taglink = "tags/:tag.html"
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
page "/rss.xml", proxy: "/feeds/rss.xml", layout: false
page "/rss.xsl", proxy: "/feeds/rss.xsl", layout: false

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

helpers do
  def default_title_helper
    "RWpod"
  end
  def default_keywords_helper
    "RWpod"
  end
  def default_description_helper
    "RWpod"
  end
  def default_long_description_helper
    "RWpod"
  end
  def default_main_url_helper
    "http://www.rwpod.com"
  end
  def default_image_helper
    "#{default_main_url_helper}/images/favicons/apple-touch-icon-144x144-precomposed.png"
  end
  def default_footer_copyright_helper
    "Copyright no one at all. Go to town."
  end
  def default_author_helper
    "RWpod команда"
  end
  def default_email_helper
    "support@rwpod.com"
  end
end

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
  require "middleman-smusher"
  #activate :smusher

  # Or use a different image path
  # set :http_path, "/Content/images/"
  #
  activate :asset_hash
end

activate :deploy do |deploy|
  deploy.method = :git
  deploy.branch = "master"
  deploy.after_build = false
  deploy.clean = true
end
