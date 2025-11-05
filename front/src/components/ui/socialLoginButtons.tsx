import React from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const SocialLoginButtons: React.FC = () => {
  const handleSocialLogin = (provider: string) => {
    const url = `${API_BASE_URL}/auth/${provider}`;

    window.location.href = url;
  };

  return (
    <div className="grid gap-4 w-full space-y-3 my-6">
      <button
        onClick={() => handleSocialLogin('google_oauth2')}
        className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-sm shadow-sm bg-background text-sm font-medium text-label hover:cursor-pointer"
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
        Googleではじめる
      </button>

      <button
        onClick={() => handleSocialLogin('twitter')}
        className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-sm shadow-sm bg-background text-sm font-medium text-label hover:cursor-pointer"
      >
        <img src="/X_logo.svg" alt="X" className="w-5 h-5 mr-2" />
        Xではじめる
      </button>
    </div>
  );
};

export default SocialLoginButtons;