class Track < ActiveRecord::Base
  validates_presence_of :id_from_vendor, :name
  validates_uniqueness_of :id_from_vendor

  def self.create_from_vendor_info(params)
    create do |t|
      t.id_from_vendor  = params[:trackId]
      t.name            = params[:trackName]
      t.artist_name     = params[:artistName]
      t.album_name      = params[:collectionName]
      t.artwork_url     = params[:artworkUrl100]
      t.view_url        = params[:trackViewUrl]
      t.preview_url     = params[:previewUrl]
      t.album_view_url  = params[:collectionViewUrl]
      t.artist_view_url = params[:artistViewUrl]
    end
  end

  def self.sample(n)
    maximum = count
    (1..n).map do
      id = rand(maximum) + 1
      first(:conditions => ["id >= ?", id])
    end
  end
end
