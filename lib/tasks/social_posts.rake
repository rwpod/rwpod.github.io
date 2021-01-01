# frozen_string_literal: true

require 'faraday'
require 'multi_json'
require 'koala'
require 'twitter'

CREDENTIALS = MultiJson.load(
  File.read(File.expand_path('../../.credentials.json', __dir__)),
  symbolize_keys: true
).freeze

HASH_TAGS = [
  '#ruby',
  '#rails',
  '#html',
  '#css',
  '#webdev',
  '#js',
  '#javascript',
  '#podcast'
].join(' ').freeze

class SolicalSharing

  attr_reader :podcast, :message

  def initialize(podcast)
    @podcast = podcast
    @message = "#{podcast[:link]} #{podcast[:title]} #{HASH_TAGS}"
    initialize_clients
  end

  def initialize_clients
    Koala.configure do |config|
      config.app_id = CREDENTIALS.dig(:facebook, :app_id)
      config.app_secret = CREDENTIALS.dig(:facebook, :app_secret)
    end
  end

  def post_to_facebook
    # user_graph = Koala::Facebook::API.new(CREDENTIALS.dig(:facebook, :access_token))
    # page_token = user_graph.get_page_access_token(CREDENTIALS.dig(:facebook, :page_id))

    page_graph = Koala::Facebook::API.new(CREDENTIALS.dig(:facebook, :page_access_token))
    page_graph.put_connections(CREDENTIALS.dig(:facebook, :page_id), 'feed', {
      message: message,
      link: podcast[:link]
    })
  end

  def post_to_twitter
    client = Twitter::REST::Client.new do |config|
      config.consumer_key        = CREDENTIALS.dig(:twitter, :consumer_key)
      config.consumer_secret     = CREDENTIALS.dig(:twitter, :consumer_secret)
      config.access_token        = CREDENTIALS.dig(:twitter, :access_token)
      config.access_token_secret = CREDENTIALS.dig(:twitter, :access_token_secret)
    end
    client.update(message)
  end

  def post_to_telegram
    url = "https://api.telegram.org/bot#{CREDENTIALS.dig(:telegram, :token)}/sendMessage"
    Faraday.get(url, {
      chat_id: CREDENTIALS.dig(:telegram, :chat_id),
      text: message
    }, {
      'Accept' => 'application/json',
      'Content-Type' => 'application/json'
    })
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

      raise "Aborting publish. You entered #{user_input}" if !user_input || !user_input.casecmp('y').zero?

      ss = SolicalSharing.new(first_podcast)
      $stdout.puts '[FACEBOOK] processing'
      ss.post_to_facebook
      $stdout.puts '[FACEBOOK] done'
      $stdout.puts '[TWITTER] processing'
      ss.post_to_twitter
      $stdout.puts '[TWITTER] done'
      $stdout.puts '[TELEGRAM] processing'
      ss.post_to_telegram
      $stdout.puts '[TELEGRAM] done'

    end
    $stdout.puts 'Work done'
  end
end
