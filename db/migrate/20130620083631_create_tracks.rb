class CreateTracks < ActiveRecord::Migration
  def change
    create_table :tracks do |t|
      t.string :id_from_vendor
      t.string :name

      t.timestamps
    end
  end
end
