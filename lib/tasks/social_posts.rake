# frozen_string_literal: true

require 'faraday'
require 'multi_json'
require 'concurrent'
require 'koala'
require 'twitter'

# first_podcast[:title]
# first_podcast[:link]
# first_podcast[:main_img]

CREDENTIALS = MultiJson.load(
  File.read(File.expand_path('../../.credentials', __dir__)),
  symbolize_keys: true
).freeze

class SolicalSharing

  attr_reader :podcast

  def initialize(podcast)
    @podcast = podcast
    initialize_clients
  end

  def initialize_clients
    Koala.configure do |config|
      config.app_id = CREDENTIALS.dig(:facebook, :app_id)
      config.app_secret = CREDENTIALS.dig(:facebook, :app_secret)
    end
  end

  def post_to_facebook
    # https://github.com/arsduo/koala/wiki/Acting-as-a-Page
    oauth = Koala::Facebook::OAuth.new
    access_token = oauth.get_app_access_token

    raise access_token.inspect

    # user_graph = Koala::Facebook::API.new(access_token)
    # page_token = user_graph.get_page_access_token(CREDENTIALS.dig(:facebook, :page_id))

    # page_graph = Koala::Facebook::API.new(page_token)

    # raise page_graph.get_object('me').inspect

    # page_graph.get_object('me') # I'm a page
    # page_graph.get_connection('me', 'feed') # the page's wall
    # page_graph.put_wall_post('post on page wall') # post as page, requires new publish_pages permission
    # page_graph.put_connections('me', 'feed', message: message, link: link_url) # post as link to page
    # page_graph.put_picture(picture_url, { message: 'hello' }, page_id) # post as picture with caption

    # api.put_wall_post(podcast[:title], {
    #   'name' => podcast[:title],
    #   'link' => podcast[:link],
    #   'description' => podcast[:title],
    #   'picture' => podcast[:main_img]
    # })
  end

end

namespace :social do
  desc 'Post to social channels last podcast'
  task :share do |_t, _args|
    url = 'https://www.rwpod.com/api/podcasts.json'
    resp = Faraday.get(url, {}, {
      'Accept' => 'application/json',
      'Content-Type' => 'application/json'
    })
    if resp.status == 200
      response_json = MultiJson.load(resp.body, symbolize_keys: true)

      raise "No response from #{url}, result: #{response_json}" if !response_json || response_json.empty?

      first_podcast = response_json.first

      $stdout.puts 'Confirm to publish'
      $stdout.puts "Title: #{first_podcast[:title]}'"
      $stdout.puts "Link: #{first_podcast[:link]}"
      $stdout.puts "Enter 'y' to confirm:"
      user_input = $stdin.gets.chomp

      raise "Aborting publish. You entered #{user_input}" if user_input != 'y'

      ss = SolicalSharing.new(first_podcast)
      ss.post_to_facebook

    end
    puts 'Work done'
  end
end
