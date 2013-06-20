class User < ActiveRecord::Base

  attr_accessible :token
  validates_presence_of :token

  before_validation :generate_token, :only => :create

  has_many :votes

  def generate_token
    begin
      new_token = SecureRandom.urlsafe_base64(32)
    end until User.find_by_token(new_token).blank?
    self.token = new_token
  end

  #returns ids of newly added tracks
  def get_new_tracks
    track_ids = get_music(:term => :coldplay).map { |t| t[:trackId] }

    transaction do
      track_ids.select do |id|
        self.votes.create { |v| v.track_id = id }
      end
    end
  end

  def votes_as(liked)
    self.votes.where(:liked => liked)
  end

  def tracks_to_vote
    tracks_to_vote = votes_as(nil).pluck(:track_id)
    if tracks_to_vote.length < 10
      tracks_to_vote += get_new_tracks
    end
    tracks_to_vote
  end

  def like_votes
    votes_as(true)
  end

  def get_music(options={})
    options.reverse_merge!(:media => :music)

    url = MakeURL.make_url('https://itunes.apple.com/search', options)
    response = RestClient.get(url)
    JSON.parse(response).with_indifferent_access[:results]
  end
end
