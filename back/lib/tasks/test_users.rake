# back/lib/tasks/test_users.rake
namespace :test_users do
  TEST_USER_PREFIX = "test_user_"

  desc "本番環境用テストユーザーを作成"
  task create: :environment do
    puts "=== 本番環境用テストユーザー作成 ==="

    # 既存のテストユーザーを削除
    existing_count = User.where("email LIKE ?", "#{TEST_USER_PREFIX}%").count
    if existing_count > 0
      puts "既存のテストユーザー #{existing_count} 件を削除中..."
      User.where("email LIKE ?", "#{TEST_USER_PREFIX}%").destroy_all
    end

    # テストユーザーデータ
    test_users = [
      {
        name: "テストユーザー1",
        email: "#{TEST_USER_PREFIX}1@example.com",
        password: "password123",
        password_confirmation: "password123",
        avatar_url: "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=T1",
        bio: "これはテストユーザー1の自己紹介です。本番環境でのテスト用アカウントです。",
        x_account_url: "https://x.com/testuser1"
      },
      {
        name: "テストユーザー2",
        email: "#{TEST_USER_PREFIX}2@example.com",
        password: "password123",
        password_confirmation: "password123",
        avatar_url: "https://via.placeholder.com/150/4ECDC4/FFFFFF?text=T2",
        bio: "これはテストユーザー2の自己紹介です。フロントエンドとの連携テスト用です。",
        x_account_url: "https://x.com/testuser2"
      },
      {
        name: "テストユーザー3",
        email: "#{TEST_USER_PREFIX}3@example.com",
        password: "password123",
        password_confirmation: "password123",
        avatar_url: "https://via.placeholder.com/150/45B7D1/FFFFFF?text=T3",
        bio: "これはテストユーザー3の自己紹介です。API動作確認用のアカウントです。",
        x_account_url: "https://x.com/testuser3"
      }
    ]

    created_count = 0
    test_users.each_with_index do |user_data, index|
      user = User.new(user_data)
      if user.save
        puts "✓ #{user.name} (#{user.email}) を作成しました"
        created_count += 1
      else
        puts "✗ ユーザー#{index + 1}の作成に失敗: #{user.errors.full_messages.join(', ')}"
      end
    end

    puts "\n=== 作成完了 ==="
    puts "作成されたテストユーザー数: #{created_count}"
    puts "テストユーザーデータの投入が完了しました！"
  end

  desc "テストユーザーの一覧表示"
  task list: :environment do
    puts "=== テストユーザー一覧 ==="
    users = User.where("email LIKE ?", "#{TEST_USER_PREFIX}%")

    if users.empty?
      puts "テストユーザーは存在しません"
    else
      users.each do |user|
        puts "ID: #{user.id}, Name: #{user.name}, Email: #{user.email}"
      end
      puts "\n総数: #{users.count} 件"
    end
  end

  desc "テストユーザーを削除"
  task destroy: :environment do
    puts "=== テストユーザー削除 ==="
    users = User.where("email LIKE ?", "#{TEST_USER_PREFIX}%")

    if users.empty?
      puts "削除対象のテストユーザーが見つかりません"
    else
      count = users.count
      puts "#{count} 件のテストユーザーを削除中..."

      users.each do |user|
        puts "✓ #{user.name} (#{user.email}) を削除しました"
      end

      users.destroy_all
      puts "\n=== 削除完了 ==="
      puts "#{count} 件のテストユーザーを削除しました"
    end
  end

  desc "テストユーザーの動作確認"
  task verify: :environment do
    puts "=== テストユーザー動作確認 ==="

    # 最初のテストユーザーでログイン確認
    test_user = User.find_by(email: "#{TEST_USER_PREFIX}1@example.com")

    if test_user.nil?
      puts "✗ テストユーザーが見つかりません"
      return
    end

    # パスワード確認
    if test_user.valid_password?("password123")
      puts "✓ テストユーザーのパスワード認証が正常に動作しています"
    else
      puts "✗ テストユーザーのパスワード認証に問題があります"
    end

    # 必須フィールドの確認
    if test_user.name.present? && test_user.email.present?
      puts "✓ 必須フィールドが正しく設定されています"
    else
      puts "✗ 必須フィールドに問題があります"
    end

    puts "\n=== 確認完了 ==="
  end
end
