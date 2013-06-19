class FixSouncloudTypo < ActiveRecord::Migration
  def change
  	rename_column :votes, :souncloud_track_id, :soundcloud_track_id
  end
end
