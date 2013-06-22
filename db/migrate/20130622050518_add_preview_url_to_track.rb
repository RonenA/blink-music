class AddPreviewUrlToTrack < ActiveRecord::Migration
  def change
  	add_column :tracks, :preview_url, :text
  end
end
