class User < ActiveRecord::Base

  attr_accessible :token
  validates_presence_of :token

  before_validation :generate_token, :only => :create

  has_many :votes

  def generate_token
    new_token = SecureRandom.urlsafe_base64(32)
    until User.find_by_token(new_token).blank?
      new_token = SecureRandom.urlsafe_base64(32)
    end
    self.token = new_token
  end

  #returns ids of newly added tracks
  def get_new_tracks
    tracks = soundcloud_client.get('/tracks',
                                    :filter => :streamable,
                                    :order => :hotness)
    tracks.each do |track|
      @id = track[:id]
      unless self.votes.create { |v| v.soundcloud_track_id = @id }
        tracks.delete(track)
      end
    end

    tracks.map{ |t| t[:id] }
  end

  def tracks_to_vote
    tracks_to_vote = self.votes.where(:liked => nil).pluck(:soundcloud_track_id)
    if tracks_to_vote.length < 10
      tracks_to_vote += get_new_tracks
    end
    tracks_to_vote
  end

  def soundcloud_client
    if @soundcloud_client.nil?
      config_file = Rails.root.join('config', 'soundcloud.yml')
      config = YAML.load_file(config_file)[Rails.env].with_indifferent_access

      @soundcloud_client = Soundcloud.new(:client_id => config[:client_id])
    end
    @soundcloud_client
  end

end
