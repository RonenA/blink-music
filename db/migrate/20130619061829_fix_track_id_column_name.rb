class FixTrackIdColumnName < ActiveRecord::Migration
  def change
    rename_column :votes, :soundcloud_track_id, :track_id
  end
end
