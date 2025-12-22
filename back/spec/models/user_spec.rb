require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    subject { build(:user) }

    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:email) }
    it { should validate_length_of(:name).is_at_most(20) }
    it { should validate_length_of(:bio).is_at_most(300) }
    it { should validate_length_of(:password).is_at_least(8) }

    it 'validates email format' do
      expect(subject).to allow_value('test@example.com').for(:email)
      expect(subject).not_to allow_value('invalid_email').for(:email)
    end

    context 'when password is present' do
      it 'validates password format' do
        user = build(:user, password: 'validPassword123!', password_confirmation: 'validPassword123!')
        expect(user).to be_valid

        user.password = 'invalid password with spaces'
        user.password_confirmation = 'invalid password with spaces'
        expect(user).not_to be_valid
      end
    end
  end

  describe 'associations' do
    it { should have_many(:works).dependent(:restrict_with_exception) }
    it { should have_many(:presets).dependent(:destroy) }
    it { should have_many(:social_accounts).dependent(:destroy) }
    it { should have_many(:likes).dependent(:destroy) }
    it { should have_many(:liked_works).through(:likes) }
    it { should have_many(:bookmarks).dependent(:destroy) }
    it { should have_many(:bookmarked_works).through(:bookmarks) }
  end

  describe 'factory' do
    it 'has a valid factory' do
      expect(build(:user)).to be_valid
    end

    it 'has a valid factory with avatar' do
      expect(build(:user, :with_avatar)).to be_valid
    end
  end

  describe '.ransackable_attributes' do
    it 'returns the correct searchable attributes' do
      expected_attributes = [ "name", "created_at", "updated_at" ]
      expect(User.ransackable_attributes).to match_array(expected_attributes)
    end
  end

  describe 'creation' do
    it 'creates a user with valid attributes' do
      user = create(:user)
      expect(user).to be_persisted
      expect(user.name).to be_present
      expect(user.email).to be_present
    end
  end
end
