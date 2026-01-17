import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const SocialLoginButtons: React.FC = () => {
  const t = useTranslations('SocialLoginButton');

  const handleSocialLogin = (provider: string) => {
    const url = `${API_BASE_URL}/auth/${provider}`;

    window.location.href = url;
  };

  return (
    <div className="flex justify-center w-full gap-x-10 my-6">
      <Image
        src="/web_dark_rd_na.svg"
        alt="Google"
        width={40}
        height={40}
        onClick={() => handleSocialLogin('google_oauth2')}
        className="hover: cursor-pointer"
      />

      <div className="place-items-center border-1 rounded-full p-2">
        <Image
          src="/X_logo.svg"
          alt="X"
          width={20}
          height={20}
          onClick={() => handleSocialLogin('twitter')}
          className="hover: cursor-pointer"
        />
      </div>
    </div>
  );
};

export default SocialLoginButtons;