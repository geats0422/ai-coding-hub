import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAdConsent } from '../context/AdConsentContext';

export const CookieConsentBanner: React.FC = () => {
  const { language } = useLanguage();
  const { status, setConsent } = useAdConsent();

  if (status !== 'unknown') {
    return null;
  }

  const isZh = language === 'zh';

  return (
    <div className="fixed inset-x-4 bottom-4 z-50">
      <div className="mx-auto max-w-4xl rounded-xl border border-border bg-background/95 backdrop-blur p-4 shadow-lg">
        <p className="text-sm text-foreground">
          {isZh
            ? '我们使用 Cookie 与本地存储来提供基础功能，并在您同意后加载广告脚本。'
            : 'We use cookies and local storage for core functionality and load ad scripts only after your consent.'}{' '}
          <Link to="/privacy" className="text-primary hover:underline">
            {isZh ? '隐私政策' : 'Privacy Policy'}
          </Link>{' '}
          ·{' '}
          <Link to="/terms" className="text-primary hover:underline">
            {isZh ? '服务条款' : 'Terms of Service'}
          </Link>
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setConsent('denied')}
            className="px-3 py-2 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {isZh ? '仅必要项' : 'Necessary only'}
          </button>
          <button
            type="button"
            onClick={() => setConsent('granted')}
            className="px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            {isZh ? '同意并继续' : 'Accept and continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
