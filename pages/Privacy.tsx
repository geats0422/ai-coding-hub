import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Privacy: React.FC = () => {
  const { language } = useLanguage();

  const isZh = language === 'zh';

  return (
    <main className="flex-1 py-10 md:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1>{isZh ? '隐私政策' : 'Privacy Policy'}</h1>
          <p>
            {isZh
              ? 'AI Coding Hub 尊重并保护每一位访问者的个人信息。我们承诺以透明、克制和负责任的方式处理数据，仅在提供文档服务、提升站点体验和保障安全所必需的范围内使用信息。'
              : 'AI Coding Hub respects and protects every visitor\'s personal information. We commit to processing data in a transparent, minimal, and responsible way, using information only when necessary to provide documentation services, improve site experience, and protect security.'}
          </p>

          <h2>{isZh ? '1. 适用范围' : '1. Scope'}</h2>
          <p>
            {isZh
              ? '本政策适用于您访问 AI Coding Hub 网站及相关页面时产生的信息处理活动。若您通过外部链接访问第三方网站，则应适用第三方的隐私政策。'
              : 'This policy applies to data processing activities when you visit AI Coding Hub and related pages. If you access third-party websites through external links, their privacy policies apply.'}
          </p>

          <h2>{isZh ? '2. 我们收集的信息类型' : '2. Types of Information We Collect'}</h2>
          <ul>
            <li>
              {isZh
                ? '基础访问数据：如页面访问时间、浏览器类型、设备类型、来源页面、访问路径等匿名或去标识化日志信息。'
                : 'Basic access data: anonymized or de-identified logs such as visit time, browser type, device type, referrer, and page path.'}
            </li>
            <li>
              {isZh
                ? '功能性数据：如语言偏好、主题偏好等用于改善使用体验的本地设置。'
                : 'Functional data: local settings such as language preference and theme preference used to improve usability.'}
            </li>
            <li>
              {isZh
                ? '广告与统计数据：在启用广告或统计服务时，可能通过 Cookie 或类似技术收集聚合行为数据。'
                : 'Advertising and analytics data: when enabled, cookies or similar technologies may collect aggregated behavior data.'}
            </li>
          </ul>

          <h2>{isZh ? '3. 我们如何使用信息' : '3. How We Use Information'}</h2>
          <ul>
            <li>{isZh ? '提供、维护并优化文档内容和站点性能。' : 'To provide, maintain, and optimize documentation content and site performance.'}</li>
            <li>{isZh ? '进行安全审计、故障排查和滥用防护。' : 'To perform security monitoring, troubleshooting, and abuse prevention.'}</li>
            <li>{isZh ? '评估内容质量与用户体验，以持续改进服务。' : 'To evaluate content quality and user experience for continuous improvement.'}</li>
            <li>{isZh ? '在符合法律要求和平台政策的前提下展示广告。' : 'To display ads in compliance with applicable laws and platform policies.'}</li>
          </ul>

          <h2>{isZh ? '4. Cookie 与类似技术' : '4. Cookies and Similar Technologies'}</h2>
          <p>
            {isZh
              ? '我们可能使用 Cookie、像素标签或本地存储来保存偏好设置、衡量访问效果并提升站点稳定性。部分第三方服务（如广告与统计服务）也可能使用 Cookie 进行频次控制、受众分析或反欺诈。您可以通过浏览器设置管理或清除 Cookie，但这可能影响部分功能。'
              : 'We may use cookies, pixels, or local storage to remember preferences, measure performance, and improve reliability. Some third-party services (such as advertising and analytics) may also use cookies for frequency capping, audience measurement, or fraud prevention. You can manage or clear cookies in your browser settings, but doing so may affect certain features.'}
          </p>

          <h2>{isZh ? '5. 第三方服务与广告（含 Google AdSense）' : '5. Third-Party Services and Advertising (Including Google AdSense)'}</h2>
          <p>
            {isZh
              ? '我们可能接入第三方服务提供商（例如流量统计、内容分发、广告平台）。当启用 Google AdSense 时，Google 及其合作伙伴可能使用 Cookie 来基于您此前访问本网站或其他网站的记录展示个性化广告。您可访问 Google 广告设置页面管理个性化广告偏好，也可通过第三方行业退出机制选择退出部分广告定向。'
              : 'We may use third-party providers (such as analytics, content delivery, and ad platforms). When Google AdSense is enabled, Google and its partners may use cookies to show personalized ads based on your visits to this and other websites. You can manage personalization through Google Ads Settings or opt out of certain targeted advertising via industry opt-out mechanisms.'}
          </p>

          <h2>{isZh ? '6. 数据共享与披露' : '6. Data Sharing and Disclosure'}</h2>
          <ul>
            <li>
              {isZh
                ? '我们不会将可识别个人身份的信息出售给第三方。'
                : 'We do not sell personally identifiable information to third parties.'}
            </li>
            <li>
              {isZh
                ? '仅在实现服务功能、遵守法律义务或保护合法权益所必需时，与受约束的服务提供商共享必要数据。'
                : 'We share limited necessary data with bound service providers only when required for service delivery, legal compliance, or legitimate rights protection.'}
            </li>
          </ul>

          <h2>{isZh ? '7. 数据安全与保留' : '7. Data Security and Retention'}</h2>
          <p>
            {isZh
              ? '我们采取合理的技术和管理措施降低数据被未经授权访问、泄露、篡改或丢失的风险。数据仅保留在实现本政策目的所需的最短期间，或按法律法规要求保留。'
              : 'We apply reasonable technical and organizational measures to reduce risks of unauthorized access, disclosure, alteration, or loss. Data is retained only for the minimum period necessary for the purposes of this policy, unless a longer period is required by law.'}
          </p>

          <h2>{isZh ? '8. 您的权利与选择' : '8. Your Rights and Choices'}</h2>
          <ul>
            <li>{isZh ? '您可通过浏览器设置控制 Cookie、清除本地存储数据。' : 'You can control cookies and clear local storage through your browser settings.'}</li>
            <li>{isZh ? '您可就信息处理提出访问、更正、删除或限制处理请求（在适用法律范围内）。' : 'You may request access, correction, deletion, or restriction of processing where applicable by law.'}</li>
            <li>{isZh ? '如您不同意本政策，可停止访问或使用本网站。' : 'If you do not agree with this policy, you may discontinue using this website.'}</li>
          </ul>

          <h2>{isZh ? '9. 儿童隐私' : '9. Children\'s Privacy'}</h2>
          <p>
            {isZh
              ? '本网站面向开发者与技术学习者，不以儿童为主要受众。若我们发现无意中收集了儿童个人信息，将在合理期限内删除。'
              : 'This website is intended for developers and technical learners and is not primarily directed to children. If we become aware that children\'s personal information has been collected unintentionally, we will delete it within a reasonable timeframe.'}
          </p>

          <h2>{isZh ? '10. 政策更新' : '10. Policy Updates'}</h2>
          <p>
            {isZh
              ? '我们可能根据业务、法律或平台规则变化更新本政策。更新后将发布在本页面，并以页面展示日期作为生效时间。'
              : 'We may update this policy based on business, legal, or platform requirement changes. Updates will be posted on this page, and the page publication date will serve as the effective time.'}
          </p>

          <h2>{isZh ? '11. 联系我们' : '11. Contact Us'}</h2>
          <p>
            {isZh
              ? '若您对本隐私政策或数据处理方式有任何问题，请通过我们的 GitHub 页面联系我们。我们会以认真、诚恳和可追溯的方式处理您的反馈。'
              : 'If you have any questions about this privacy policy or our data handling, please contact us through our GitHub page. We handle feedback with care, sincerity, and accountability.'}
          </p>

          <p className="text-sm text-muted-foreground">
            {isZh ? '最后更新：2026-02-12' : 'Last updated: 2026-02-12'}
          </p>
        </article>
      </div>
    </main>
  );
};
