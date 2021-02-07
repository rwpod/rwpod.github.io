# frozen_string_literal: true

# require 'faraday'
# require 'multi_json'
# require 'time'
# require 'tzinfo'
# require 'googleauth'
# require 'googleauth/stores/file_token_store'
# require 'google/apis/youtube_v3'

# class ScheduleBroadcast

#   CREDENTIALS = MultiJson.load(
#     File.read(File.expand_path('../../.credentials.json', __dir__)),
#     symbolize_keys: true
#   ).freeze

#   GTOKEN_FILENAME = File.expand_path('../../.credentials.google_token.yml', __dir__).freeze

#   OOB_URI = 'urn:ietf:wg:oauth:2.0:oob'

#   YT = Google::Apis::YoutubeV3

#   attr_reader :scheduled_time, :title, :description, :youtube, :github

#   def initialize(scheduled_time, title)
#     @scheduled_time = scheduled_time
#     @title = title
#     @description = ''

#     @youtube = YT::YouTubeService.new
#     @youtube.authorization = user_credentials_for(YT::AUTH_YOUTUBE)
#   end

#   def user_credentials_for(scope)
#     token_store = Google::Auth::Stores::FileTokenStore.new(file: GTOKEN_FILENAME)
#     client_id = Google::Auth::ClientId.new(
#       CREDENTIALS.dig(:google, :client_id),
#       CREDENTIALS.dig(:google, :client_secret)
#     )
#     authorizer = Google::Auth::UserAuthorizer.new(client_id, scope, token_store)

#     user_id = 'default'

#     credentials = authorizer.get_credentials(user_id)
#     if credentials.nil?
#       url = authorizer.get_authorization_url(base_url: OOB_URI)
#       $stdout.puts "Open the following URL in your browser and authorize the application."
#       $stdout.puts url
#       $stdout.puts "Enter the authorization code:"
#       code = $stdin.gets.chomp
#       credentials = authorizer.get_and_store_credentials_from_code(
#         user_id: user_id,
#         code: code,
#         base_url: OOB_URI
#       )
#     end
#     credentials
#   end

#   def schedule_youtube_stream
#     video_category = video_categories.find{ |c| c.snippet.title == 'Science & Technology' }
#     raise 'Cannot find category' if video_category.nil?

#     stream = youtube.insert_live_stream(
#       %w[id snippet cdn status contentDetails],
#       google_live_stream
#     )
#     broadcast = youtube.insert_live_broadcast(
#       %w[id snippet status contentDetails],
#       google_live_broadcast
#     )
#     youtube.bind_live_broadcast(broadcast.id, %w[id], stream_id: stream.id)
#     youtube.update_video(
#       %w[id snippet status],
#       google_video_information(broadcast.id, video_category)
#     )
#     # insert_playlist_item

#     $stdout.puts stream.inspect
#     $stdout.puts broadcast.inspect
#     {
#       live_stream_id: stream.id,
#       ingestion_address: stream.cdn.ingestion_info.ingestion_address,
#       backup_ingestion_address: stream.cdn.ingestion_info.backup_ingestion_address,
#       rtmps_ingestion_address: stream.cdn.ingestion_info.rtmps_ingestion_address,
#       stream_name: stream.cdn.ingestion_info.stream_name,
#       broadcast_id: broadcast.id
#     }
#   end

#   # def send_message_to_chat
#   #   youtube.insert_live_chat_message(
#   #     %w[id snippet],
#   #     Google::Apis::YoutubeV3::LiveChatMessage.new(
#   #       snippet: Google::Apis::YoutubeV3::LiveChatMessageSnippet.new(
#   #         live_chat_id: 'Cg0KCzNpMjhJa00yVVRNKicKGFVDZ3QwSEU0TGZyb0tSbGEyVUpnSmpDdxILM2kyOElrTTJVVE0',
#   #         type: 'textMessageEvent',
#   #         text_message_details: Google::Apis::YoutubeV3::LiveChatTextMessageDetails.new(
#   #           message_text: 'https://www.rwpod.com/rss.xml'
#   #         )
#   #       )
#   #     )
#   #   )
#   # end

#   private

#   def video_categories
#     @video_categories ||= youtube.list_video_categories(
#       %w[snippet],
#       region_code: 'us'
#     ).items
#   end

#   def google_live_stream
#     Google::Apis::YoutubeV3::LiveStream.new(
#       snippet: Google::Apis::YoutubeV3::LiveStreamSnippet.new(
#         title: title,
#         description: description
#       ),
#       cdn: Google::Apis::YoutubeV3::CdnSettings.new(
#         frame_rate: 'variable',
#         resolution: 'variable',
#         ingestion_type: 'rtmp'
#       ),
#       content_details: Google::Apis::YoutubeV3::LiveStreamContentDetails.new(
#         is_reusable: false
#       )
#     )
#   end

#   def google_live_broadcast
#     Google::Apis::YoutubeV3::LiveBroadcast.new(
#       snippet: Google::Apis::YoutubeV3::LiveBroadcastSnippet.new(
#         scheduled_start_time: scheduled_time.getutc.iso8601(3),
#         title: title,
#         description: description
#       ),
#       status: Google::Apis::YoutubeV3::LiveBroadcastStatus.new(
#         privacy_status: 'unlisted', # unlisted or public
#         self_declared_made_for_kids: false
#       ),
#       content_details: Google::Apis::YoutubeV3::LiveBroadcastContentDetails.new(
#         enable_auto_start: false,
#         enable_auto_stop: false,
#         enable_content_encryption: false,
#         enable_dvr: true,
#         enable_embed: true,
#         record_from_start: true,
#         start_with_slate: false,
#         latency_preference: 'low',
#         monitor_stream: Google::Apis::YoutubeV3::MonitorStreamInfo.new(
#           enable_monitor_stream: false,
#           broadcast_stream_delay_ms: 0
#         )
#       )
#     )
#   end

#   def google_video_information(video_id, video_category)
#     Google::Apis::YoutubeV3::Video.new(
#       id: video_id,
#       snippet: Google::Apis::YoutubeV3::VideoSnippet.new(
#         title: title,
#         category_id: video_category.id,
#         default_audio_language: 'ru',
#         default_language: 'ru',
#         tags: ['podcast', 'rwpod', 'ruby', 'rails', 'js', 'css', 'html', 'webdev', 'dev']
#       ),
#       status: Google::Apis::YoutubeV3::VideoStatus.new(
#         license: 'creativeCommon',
#         embeddable: true,
#         self_declared_made_for_kids: false
#       )
#     )
#   end

# end

# namespace :schedule_broadcast do
#   desc 'Schedule broardcast. Need title and date'
#   task :create, [:date, :title] do |_t, args|
#     selected_date = Date.strptime(args[:date], '%Y-%m-%d')

#     scheduled_time = Time.new(
#       selected_date.year,
#       selected_date.month,
#       selected_date.day,
#       20, # hours
#       0, # minutes
#       0, # seconds
#       TZInfo::Timezone.get('Europe/Kiev') # timezone
#     )

#     scheduler = ScheduleBroadcast.new scheduled_time, args[:title]
#     raise scheduler.schedule_youtube_stream.inspect
#     $stdout.puts 'Work done'
#   end
# end
