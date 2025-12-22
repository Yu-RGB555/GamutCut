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
        bucket = ENV["S3_BUCKET_NAME"]

        # 開発環境
        if ENV["AWS_ENDPOINT"].present?
          endpoint = ENV["AWS_ENDPOINT"]

          # Docker内部のminio:9000をlocalhostに変換
          if endpoint.include?("minio:9000")
            endpoint = endpoint.gsub("minio:9000", "localhost:9000")
          end

          "#{endpoint}/#{bucket}/#{blob.key}"
        else
          # S3(本番環境)の場合（署名付きURLを生成）
          attachment.url
        end
      else
        # フォールバック
        begin
          attachment.url
        rescue => e
          # attachment.urlでエラーの場合は、serviceのurlメソッドを使用
          Rails.logger.warn "Failed to generate URL for attachment: #{e.message}"
          service.url(blob.key, expires_in: 1.hour)
        end
      end
    end
  end

  # インスタンスメソッドとしても使える（不要検討）
  def minio_direct_url(attachment)
    self.class.minio_direct_url(attachment)
  end
end
