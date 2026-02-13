import React, { useEffect } from 'react';
import { useAdConsent } from '../context/AdConsentContext';

const ADSENSE_SCRIPT_ID = 'ai-coding-hub-adsense-script';
const ADSTERRA_SCRIPT_ID = 'ai-coding-hub-adsterra-script';

type AdRenderMode = 'development' | 'none' | 'vercel';

const readEnv = (key: string): string => {
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  const value = env?.[key];
  return typeof value === 'string' ? value.trim() : '';
};

const normalizeAdSenseClientId = (clientId: string): string => {
  if (!clientId) {
    return '';
  }

  return clientId.startsWith('ca-pub-') ? clientId : `ca-pub-${clientId}`;
};

const getAdRenderMode = (): AdRenderMode => {
  const mode = readEnv('VITE_AD_PLACEHOLDER_MODE').toLowerCase();

  if (mode === 'development' || mode === 'none' || mode === 'vercel') {
    return mode;
  }

  if (mode === 'mock') {
    return 'development';
  }

  if (mode === 'adsense') {
    return 'vercel';
  }

  return 'development';
};

const appendScript = (id: string, src: string, attributes?: Record<string, string>) => {
  if (!src || document.getElementById(id)) {
    return;
  }

  const script = document.createElement('script');
  script.id = id;
  script.src = src;
  script.async = true;

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });
  }

  document.head.appendChild(script);
};

export const AdNetworkLoader: React.FC = () => {
  const { status } = useAdConsent();

  useEffect(() => {
    if (status !== 'granted' || getAdRenderMode() !== 'vercel') {
      return;
    }

    const adsenseClientId = normalizeAdSenseClientId(readEnv('VITE_ADSENSE_CLIENT_ID'));
    if (adsenseClientId) {
      appendScript(
        ADSENSE_SCRIPT_ID,
        `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsenseClientId)}`,
        { crossorigin: 'anonymous' }
      );
    }

    const adsterraScriptUrl = readEnv('VITE_ADSTERRA_SCRIPT_URL');
    if (adsterraScriptUrl.startsWith('https://') || adsterraScriptUrl.startsWith('http://')) {
      appendScript(ADSTERRA_SCRIPT_ID, adsterraScriptUrl);
    }
  }, [status]);

  return null;
};

export default AdNetworkLoader;
