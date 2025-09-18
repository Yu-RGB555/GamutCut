FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "test#{n}@example.com" }
    name { Faker::Name.name }
    password { "password123" }
    password_confirmation { "password123" }
    bio { Faker::Lorem.paragraph(sentence_count: 2) }

    trait :with_avatar do
      avatar_url { "https://example.com/avatar.jpg" }
    end
  end
end