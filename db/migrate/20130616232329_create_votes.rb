class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.string :user, :null => false
      t.string :souncloud_track_id, :null => false
      t.boolean :liked

      t.timestamps
    end
  end
end
