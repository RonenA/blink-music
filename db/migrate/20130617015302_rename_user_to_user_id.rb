class RenameUserToUserId < ActiveRecord::Migration
  def change
  	rename_column :votes, :user, :user_id
  end
end
