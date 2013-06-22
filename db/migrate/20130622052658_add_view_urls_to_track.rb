class AddViewUrlsToTrack < ActiveRecord::Migration
  def change
  	rename_column :tracks, :track_name, :name
  	add_column :tracks, :album_view_url, :text
  	add_column :tracks, :artist_view_url, :text
  end
end
