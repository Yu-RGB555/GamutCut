class ShapeTemplate < ApplicationRecord
  validates :shape_type, presence: true
  validates :shape_data, presence: true
  validates :display_order, presence: true, numericality: { greater_than_or_equal_to: 0 }

end