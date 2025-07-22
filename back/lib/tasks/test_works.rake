namespace :test_works do
  TEST_WORK_PREFIX = "test_work_"

  desc "本番環境用テスト作品を作成"
  task create: :environment do
    puts "=== 本番環境用テスト作品作成 ==="

    # 既存のテスト作品を削除
    existing_count = Work.where("title LIKE ?", "#{TEST_WORK_PREFIX}%").count
    if existing_count > 0
      puts "既存のテスト作品 #{existing_count} 件を削除中..."
      Work.where("title LIKE ?", "#{TEST_WORK_PREFIX}%").destroy_all
    end

    # テスト作品データ
    test_works = [
      {
        user_id: 1,
        title: "#{TEST_WORK_PREFIX}1",
        illustration_image: nil,
        set_mask_data: {"maskId" => "dummy_mask_001", "maskName" => "ダミーマスク", "createdAt" => "2025-07-20T13:16:18.159Z", "maskSettings" => {"opacity" => 0.8, "blendMode" => "multiply"}},
        description: "これはテスト作品1です",
        is_public: "published"
      },
      {
        user_id: 2,
        title: "#{TEST_WORK_PREFIX}2",
        illustration_image: nil,
        set_mask_data: {"maskId" => "dummy_mask_001", "maskName" => "ダミーマスク", "createdAt" => "2025-07-20T13:16:18.159Z", "maskSettings" => {"opacity" => 0.8, "blendMode" => "multiply"}},
        description: "これはテスト作品2です",
        is_public: "published"
      },
      {
        user_id: 3,
        title: "#{TEST_WORK_PREFIX}3",
        illustration_image: nil,
        set_mask_data: {"maskId" => "dummy_mask_001", "maskName" => "ダミーマスク", "createdAt" => "2025-07-20T13:16:18.159Z", "maskSettings" => {"opacity" => 0.8, "blendMode" => "multiply"}},
        description: "これはテスト作品3です",
        is_public: "published"
      }
    ]

    created_count = 0
    test_works.each_with_index do |work_data, index|
      work = Work.new(work_data)
      if work.save
        puts "✓ #{work.title} を作成しました"
        created_count += 1
      else
        puts "✗ 作品#{index + 1}の作成に失敗: #{work.errors.full_messages.join(', ')}"
      end
    end

    puts "\n=== 作成完了 ==="
    puts "作成されたテスト作品数: #{created_count}"
    puts "テスト作品データの投入が完了しました！"
  end

  desc "テスト作品の一覧表示"
  task list: :environment do
    puts "=== テスト作品一覧 ==="
    works = Work.where("title LIKE ?", "#{TEST_WORK_PREFIX}%")

    if works.empty?
      puts "テスト作品は存在しません"
    else
      works.each do |work|
        puts "ID: #{work.id}, Title: #{work.title}"
      end
      puts "\n総数: #{works.count}"
    end
  end

  desc "テスト作品を削除"
  task destroy: :environment do
    puts "=== テストユーザー削除 ==="
    works = Work.where("title LIKE ?", "#{TEST_WORK_PREFIX}%")

    if works.empty?
      puts "削除対象のテスト作品が見つかりません"
    else
      count = works.count
      puts "#{count} 件のテスト作品を削除中..."

      works.each do |work|
        puts "✓ #{work.title} を削除しました"
      end
    end

    works.destroy_all
    puts "\n=== 削除完了 ==="
    puts "#{count} 件のテスト作品を削除しました"
  end
end