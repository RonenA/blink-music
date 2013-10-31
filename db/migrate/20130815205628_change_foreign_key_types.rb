class ChangeForeignKeyTypes < ActiveRecord::Migration
  def up
    change_column :votes, :user_id,  :integer, :limit => nil
    change_column :votes, :track_id, :integer, :limit => nil
  end

  def down
    change_column :votes, :user_id,  :string
    change_column :votes, :track_id, :string
  end
end
