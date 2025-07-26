import React from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const SocialLoginButtons: React.FC = () => {
  const handleSocialLogin = (provider: string) => {
    const omniauthProvider = provider === 'google' ? 'google_oauth2' : provider;
    const url = `${API_BASE_URL}/auth/${omniauthProvider}`;

    console.log(`Redirecting to: ${url}`);
    window.location.href = url;
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => handleSocialLogin('google')}
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
        Googleでログイン
      </button>

      <button
        onClick={() => handleSocialLogin('twitter')}
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <img src="/x-icon.svg" alt="X" className="w-5 h-5 mr-2" />
        Xでログイン
      </button>
    </div>
  );
};

export default SocialLoginButtons;