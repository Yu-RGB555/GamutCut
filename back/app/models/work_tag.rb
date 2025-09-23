class WorkTag < ApplicationRecord
	belongs_to :work
	belongs_to :tag

	validates :tag_id, uniqueness: { scope: :work_id }
end
