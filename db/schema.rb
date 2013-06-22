# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130622052658) do

  create_table "tracks", :force => true do |t|
    t.string   "id_from_vendor"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
    t.text     "name"
    t.text     "artist_name"
    t.text     "album_name"
    t.text     "artwork_url"
    t.text     "view_url"
    t.text     "preview_url"
    t.text     "album_view_url"
    t.text     "artist_view_url"
  end

  create_table "users", :force => true do |t|
    t.string   "token"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "votes", :force => true do |t|
    t.string   "user_id",    :null => false
    t.string   "track_id",   :null => false
    t.boolean  "liked"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

end
