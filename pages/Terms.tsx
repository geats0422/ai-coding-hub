import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Terms: React.FC = () => {
  const { language } = useLanguage();
  const isZh = language === 'zh';

  return (
    <main className="flex-1 py-10 md:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1>{isZh ? '服务条款' : 'Terms of Service'}</h1>
          <p>
            {isZh
              ? '欢迎使用 AI Coding Hub。访问或使用本网站即表示您同意遵守本条款。若您不同意本条款，请停止使用本网站。'
              : 'Welcome to AI Coding Hub. By accessing or using this website, you agree to comply with these terms. If you do not agree, please stop using this website.'}
          </p>

          <h2>{isZh ? '1. 服务说明' : '1. Service Description'}</h2>
          <p>
            {isZh
              ? '本网站提供 AI 编程工具相关的教程、文档整理与学习资料。内容仅用于技术学习和信息参考，不构成法律、税务或投资建议。'
              : 'This website provides tutorials, documentation guides, and learning materials related to AI coding tools. Content is for educational and informational purposes only and does not constitute legal, tax, or investment advice.'}
          </p>

          <h2>{isZh ? '2. 使用规则' : '2. Acceptable Use'}</h2>
          <ul>
            <li>
              {isZh
                ? '您不得利用本网站从事任何违法、侵权、欺诈或破坏性活动。'
                : 'You must not use this website for unlawful, infringing, fraudulent, or disruptive activities.'}
            </li>
            <li>
              {isZh
                ? '您不得尝试绕过安全机制、恶意抓取或干扰网站可用性。'
                : 'You must not attempt to bypass security controls, perform abusive scraping, or disrupt site availability.'}
            </li>
            <li>
              {isZh
                ? '您应自行核验命令、脚本和配置在实际环境中的适用性。'
                : 'You are responsible for validating commands, scripts, and configurations before using them in real environments.'}
            </li>
          </ul>

          <h2>{isZh ? '3. 知识产权' : '3. Intellectual Property'}</h2>
          <p>
            {isZh
              ? '除另有说明外，本网站的页面结构、原创说明与整理内容归 AI Coding Hub 或相关权利人所有。第三方商标、产品名及文档引用归其各自权利人所有。'
              : 'Unless otherwise stated, the website structure, original explanations, and curated materials are owned by AI Coding Hub or the respective rights holders. Third-party trademarks, product names, and referenced documents belong to their respective owners.'}
          </p>

          <h2>{isZh ? '4. 第三方内容与外部链接' : '4. Third-Party Content and External Links'}</h2>
          <p>
            {isZh
              ? '本网站可能包含第三方链接、文档引用或广告内容。我们不对第三方网站的内容、可用性或政策负责。'
              : 'This website may include third-party links, documentation references, or advertising content. We are not responsible for the content, availability, or policies of third-party websites.'}
          </p>

          <h2>{isZh ? '5. 广告与收益披露' : '5. Advertising and Monetization Disclosure'}</h2>
          <p>
            {isZh
              ? '本网站可能展示赞助信息或第三方广告。广告展示将遵循适用法律、平台政策及隐私政策。'
              : 'This website may display sponsorships or third-party advertisements. Advertising display will follow applicable laws, platform policies, and our privacy policy.'}
          </p>

          <h2>{isZh ? '6. 免责声明' : '6. Disclaimer'}</h2>
          <p>
            {isZh
              ? '本网站按“现状”提供，不保证内容始终完整、准确或适用于特定目的。因使用本网站内容导致的直接或间接损失，您需自行承担相应风险。'
              : 'This website is provided on an "as is" basis without guarantees of completeness, accuracy, or fitness for a particular purpose. You assume the relevant risks for any direct or indirect losses arising from the use of this website.'}
          </p>

          <h2>{isZh ? '7. 条款更新' : '7. Updates to Terms'}</h2>
          <p>
            {isZh
              ? '我们可能根据业务或法律要求更新本条款。更新后的版本在本页面发布后生效。继续使用本网站视为接受更新条款。'
              : 'We may update these terms due to business or legal requirements. Updated terms become effective once published on this page. Continued use of the website constitutes acceptance of the updated terms.'}
          </p>

          <h2>{isZh ? '8. 联系方式' : '8. Contact'}</h2>
          <p>
            {isZh
              ? '如对本条款有任何问题，请通过 GitHub 页面联系我们。'
              : 'If you have any questions about these terms, please contact us via our GitHub page.'}
          </p>

          <p className="text-sm text-muted-foreground">
            {isZh ? '最后更新：2026-02-12' : 'Last updated: 2026-02-12'}
          </p>
        </article>
      </div>
    </main>
  );
};
