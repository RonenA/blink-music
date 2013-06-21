class Track < ActiveRecord::Base
  validates_presence_of :id_from_vendor, :name
  validates_uniqueness_of :id_from_vendor

  def self.create_from_vendor_info(params)
    create do |t|
      t.id_from_vendor = params[:trackId]
      t.name           = params[:trackName]
    end
  end

  def self.sample(n)
    maximum = count
    (1..n).map do
      id = rand(maximum) + 1
      first(:conditions => ["id >= ?", id])
    end
  end
end
