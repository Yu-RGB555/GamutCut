require 'rails_helper'

RSpec.describe 'Health Check API', type: :request do
  describe 'GET /health' do
    xit 'returns health check status' do
      get '/health'

      expect(response).to have_http_status(:ok)
      expect(response.content_type).to include('application/json')

      json_response = JSON.parse(response.body)
      expect(json_response).to have_key('status')
      expect(json_response['status']).to eq('ok')
    end
  end
end