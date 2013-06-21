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

  # Returns a list of newly added tracks
  def get_new_tracks
    transaction do
      tracks = Track.create_tracks

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
