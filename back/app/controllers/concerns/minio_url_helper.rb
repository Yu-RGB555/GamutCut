module MinioUrlHelper
  extend ActiveSupport::Concern

  included do
    # インスタンスメソッドとクラスメソッド両方で使えるようにする
    extend ClassMethods
  end

  module ClassMethods
    # AWS S3(MinIO)に保存済みの画像データを取得するために、直接URLを生成するヘルパーメソッド
    def minio_direct_url(attachment)
      return nil unless attachment&.attached?

      blob = attachment.blob
      service = blob.service

      # S3互換サービス(MinIO、AWS S3)の場合
      if service.is_a?(ActiveStorage::Service::S3Service)
        bucket = ENV['S3_BUCKET_NAME']

        # 開発環境
        if ENV['AWS_ENDPOINT'].present?
          endpoint = ENV['AWS_ENDPOINT']

          # Docker内部のminio:9000をlocalhostに変換
          if endpoint.include?('minio:9000')
            endpoint = endpoint.gsub('minio:9000', 'localhost:9000')
          end

          "#{endpoint}/#{bucket}/#{blob.key}"
        else
          # 本番環境
          Rails.application.routes.url_helpers.url_for(attachment)
        end
      else
        # フォールバック(通常のActive Storage URL)
        Rails.application.routes.url_helpers.url_for(attachment)
      end
    end
  end

  # インスタンスメソッドとしても使える
  def minio_direct_url(attachment)
    self.class.minio_direct_url(attachment)
  end
end