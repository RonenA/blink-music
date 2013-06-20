class Vote < ActiveRecord::Base
  attr_accessible :liked
  validates_presence_of :track_id, :user_id
  validates :liked, :inclusion => {:in => [true, false, nil]}
  validates_uniqueness_of :track_id, :scope => :user_id

  belongs_to :user

  # TODO: This and a lot of stuff in user would make more sense in a track
  # model, both for efficiency and readability.
  def get_track_properties
    url = MakeURL.make_url('https://itunes.apple.com/lookup', :id => track_id)
    response = RestClient.get(url)
    JSON.parse(response).with_indifferent_access[:results][0]
  end
end
