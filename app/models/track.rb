class Track < ActiveRecord::Base
  validates_presence_of :id_from_vendor, :name

  def self.create_tracks(options={})
    # TODO: Optimize this and user.rb with multi-inserts
    # TODO: Better error handling and organization
    transaction do
      feed_url = 'https://itunes.apple.com/WebObjects/MZStore.woa/wpa/MRSS/newreleases/sf=143441/limit=100/explicit=true/rss.xml'
      feed = Nokogiri::XML(RestClient.get(feed_url))

      track_ids = feed.xpath('//item//link').map do |collection_url|
        collection_id = /id(\d*)/.match(collection_url)[1]

        collection_api_url = MakeURL.make_url(
          'https://itunes.apple.com/lookup',
          :id => collection_id, :entity => :song)
        response = RestClient.get(collection_api_url)
        results = JSON.parse(response).with_indifferent_access[:results]
        first_track_info = results.select {|info| info[:wrapperType] == 'track' }.first

        if first_track_info
          create_from_vendor_info(first_track_info)
        end
      end.reject(&:nil?)
    end
  end

  def self.create_from_vendor_info(params)
    create do |t|
      t.id_from_vendor = params[:trackId]
      t.name           = params[:trackName]
    end
  end
end
