#!rails runner

def itunes_feed(options={})
  options.reverse_merge!(
    :feed_type => :newreleases,
    :sf => 143441,
    :limit => 100,
    :explicit => true
  )

  feed_url = 'https://itunes.apple.com/WebObjects/MZStore.woa/wpa/MRSS/'
  feed_url << options.delete(:feed_type).to_s << '/'
  options.each do |key, value|
    feed_url << key.to_s << '=' << value.to_s << '/'
  end
  feed_url << 'rss.xml'

  RestClient.get(feed_url)
end

def parse_feed_for_ids(feed)
  Nokogiri::XML(feed).xpath('//item//link').map do |collection_url|
    collection_id = /id(\d*)/.match(collection_url)[1]
  end
end

def track_info_from_collection_ids(ids)
  ids.flat_map do |id|
    api_url = MakeURL.make_url(
      'https://itunes.apple.com/lookup',
      :id => id, :entity => :song
    )
    response = RestClient.get(api_url)
    results = JSON.parse(response).with_indifferent_access[:results]
    results.select {|info| info[:wrapperType] == 'track' }
  end
end

genres = {
  "Alternative" => 20,
  "Blues" => 2,
  "Children's Music" => 4,
  "Christian & Gospel" => 22,
  "Classical" => 5,
  "Comedy" => 3,
  "Country" => 6,
  "Dance" => 17,
  "Electronic" => 7,
  "Fitness & Workout" => 50,
  "Hip-Hop/Rap" => 18,
  "Holiday" => 8,
  "Jazz" => 11,
  "Latino" => 12,
  "Pop" => 14,
  "R&B/Soul" => 15,
  "Reggae" => 24,
  "Rock" => 21,
  "Singer/Songwriter" => 10,
  "Soundtrack" => 16,
  "Spoken Word" => 50000061,
  "World" => 19
}.with_indifferent_access

good_genres = %w(Alternative Dance Electronic Hip-Hop/Rap R&B/Soul Rock Singer/Songwriter)

# TODO: Optimize this and user.rb with multi-inserts
ActiveRecord::Base.transaction do
  good_genres.each do |genre_name|
    feed = itunes_feed(:genre => genres[genre_name])
    ids = parse_feed_for_ids(feed)

    track_info_from_collection_ids(ids).each do |info|
      Track.create_from_vendor_info(info)
    end
  end
end
