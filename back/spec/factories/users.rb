FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "test#{n}@example.com" }
    name { Faker::Name.name }
    password { "password123" }
    password_confirmation { "password123" }
    bio { Faker::Lorem.paragraph(sentence_count: 2) }

    trait :with_avatar do
      after(:build) do |user|
        user.avatar.attach(
          io: File.open(Rails.root.join('spec', 'fixtures', 'files', 'test_avatar.png')),
          filename: 'test_avatar.png',
          content_type: 'image/png'
        )
      end
    end
  end
end
