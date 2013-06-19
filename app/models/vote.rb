class Vote < ActiveRecord::Base
  attr_accessible :liked
  validates_presence_of :soundcloud_track_id, :user_id
  validates :liked, :inclusion => {:in => [true, false, nil]}
  validates_uniqueness_of :soundcloud_track_id, :scope => :user_id

  belongs_to :user
end
