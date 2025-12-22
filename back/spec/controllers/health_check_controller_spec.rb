require 'rails_helper'

RSpec.describe HealthCheckController, type: :controller do
  describe 'GET #index' do
    it 'returns a successful response' do
      get :index
      expect(response).to have_http_status(:success)
    end

    it 'returns JSON with status ok' do
      get :index
      expect(response.content_type).to include('application/json')

      json_response = JSON.parse(response.body)
      expect(json_response['status']).to eq('ok')
    end
  end
end
