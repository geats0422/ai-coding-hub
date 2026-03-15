type SeoConfig = {
  title: string;
  canonicalUrl?: string;
  robots?: string;
};

const CANONICAL_SELECTOR = 'link[rel="canonical"]';
const ROBOTS_SELECTOR = 'meta[name="robots"]';

export const updateSeo = ({ title, canonicalUrl, robots }: SeoConfig): void => {
  document.title = title;

  let canonicalLink = document.head.querySelector(CANONICAL_SELECTOR) as HTMLLinkElement | null;
  if (canonicalUrl) {
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);
  } else if (canonicalLink) {
    canonicalLink.remove();
  }

  let robotsMeta = document.head.querySelector(ROBOTS_SELECTOR) as HTMLMetaElement | null;
  if (robots) {
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', robots);
  } else if (robotsMeta) {
    robotsMeta.remove();
  }
};
