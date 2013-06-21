class Track < ActiveRecord::Base
  def self.create_tracks(options={})
    options.reverse_merge!(:media => :music)

    url = MakeURL.make_url('https://itunes.apple.com/search', options)
    response = RestClient.get(url)
    track_info = JSON.parse(response).with_indifferent_access[:results]

    transaction do
      # TODO optimize this and user.rb with multi-inserts
      track_info.map do |params|
        create_from_vendor_info(params)
      end
    end
  end

  def self.create_from_vendor_info(params)
    create do |t|
      t.id_from_vendor = params[:trackId]
      t.track_name     = params[:trackName]
      t.artist_name    = params[:artistName]
      t.album_name     = params[:collectionName]
      t.artwork_url    = params[:artworkUrl100]
      t.view_url       = params[:viewURL]
    end
  end
end
