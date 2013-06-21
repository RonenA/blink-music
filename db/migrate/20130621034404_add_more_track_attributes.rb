class AddMoreTrackAttributes < ActiveRecord::Migration
  def change
  	remove_column :tracks, :name
  	add_column :tracks, :track_name, :text
  	add_column :tracks, :artist_name, :text
  	add_column :tracks, :album_name, :text
  	add_column :tracks, :artwork_url, :text
  	add_column :tracks, :view_url, :text
  end
end
