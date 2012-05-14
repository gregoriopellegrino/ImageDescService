class DynamicImage < ActiveRecord::Base
  validates_presence_of :book_id
  validates :image_location,  :presence => true, :length => { :maximum => 255 }

  has_attached_file :physical_file, {
      :styles => { :medium => "400x300>", :thumb => "160x120>" }, :path => :path_by_book
  }.merge(PAPERCLIP_STORAGE_OPTIONS)

  belongs_to :book
  has_many :dynamic_descriptions
  
  def best_description
    return dynamic_descriptions.last
  end
  
  def image_source(host)
    return "#{host}/#{book.uid}/original/#{image_location}"
  end

  def thumb_source(host)
    if thumbnailable?
      "#{host}/#{book.uid}/thumb/#{image_location}"
    else
      image_source(host)
    end
  end

  def medium_source(host)
    if thumbnailable?
      "#{host}/#{book.uid}/medium/#{image_location}"
    else
      image_source(host)
    end
  end

  def thumbnailable?
    return false unless physical_file.content_type
    ['image/jpeg', 'image/pjpeg', 'image/gif', 'image/png', 'image/x-png', 'image/jpg'].join('').include?(physical_file.content_type)
  end

  private

  def path_by_book
    root = ""
    if ENV['POET_LOCAL_STORAGE_DIR']
      root = ENV['POET_LOCAL_STORAGE_DIR']
    end
    root + "#{book.uid}/:style/#{image_location}"
  end
end
