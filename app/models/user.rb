class User < ActiveRecord::Base
  validates_presence_of :token, :share_token

  before_validation :generate_token, :only => :create
  before_validation :generate_share_token, :only => :create

  has_many :votes

  def generate_token
    begin
      self.token = SecureRandom.urlsafe_base64(32)
    end until User.find_by_token(self.token).nil?
  end

  def generate_share_token
    begin
      self.share_token = SecureRandom.urlsafe_base64(4).gsub(/-|_/, '')
    end until User.find_by_share_token(self.share_token).nil?
  end

  # Returns a list of newly added tracks
  def get_new_tracks
    transaction do
      tracks = Track.sample(50)

      tracks.select do |t|
        self.votes.create { |v| v.track = t }
      end
    end
  end

  def tracks_voted(liked)
    self.votes.where(:liked => liked).includes(:track)
              .map(&:track)
  end

  def tracks_to_vote
    tracks_to_vote = tracks_voted(nil)
    if tracks_to_vote.length < 10
      tracks_to_vote += get_new_tracks
    end
    tracks_to_vote
  end

  def liked_tracks
    tracks_voted(true)
  end
end
