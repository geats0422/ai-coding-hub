# AI Coding Hub 广告联盟集成分析报告（AdSense / Adsterra）

更新时间：2026-02-12

## 0) 项目当前集成现状（基于仓库证据）

### 已有能力（可复用）
- 已有广告位占位组件，但仅为 UI 占位：`components/AdPlaceholder.tsx`
- 文档页和内容中已大量预留广告位挂点（`<AdPlaceholder />`）：`pages/Docs.tsx`、`pages/ClaudeDocs.tsx`、`pages/OpenCodeDocs.tsx`、`content/**/**/*.mdx`
- 已有隐私政策页面，且文案覆盖 Cookie/第三方广告/AdSense 场景：`pages/Privacy.tsx`
- 已有隐私页路由：`App.tsx` 中 `/privacy`

### 关键缺口（未达可投放状态）
- 未接入任何真实广告网络脚本（未发现 `adsbygoogle.js`、`ca-pub-*`、Adsterra script）：`index.html`
- 缺失 `ads.txt`（未找到文件）
- 缺失 Terms 页面（Footer 仅 `href="#"`）：`components/Layout.tsx`
- 缺失 Consent/CMP（Cookie 同意弹窗、同意状态管理、同意前阻断个性化广告加载）
- 缺失 SEO/爬虫基础文件（未发现 `robots.txt`、`sitemap.xml`）

结论：当前是“广告位占位已完成，广告网络生产集成未开始”的状态。

---

## 1) AdSense 资格与 LVC（Low Value Content）防拒策略

> 说明：你的 Prompt 要求“必须买顶级域名”。从 AdSense 官方政策角度，**自定义域并非硬性必须**；但从审核可信度、品牌和长期变现角度，**业务上强烈建议视为必须动作**。

### 1.1 域名策略（建议按“必须项”执行）
- 执行动作：购买独立 TLD，不使用免费二级域名作为长期变现主站
- 推荐优先级：`.com` > `.dev`/`.io` > `.tech`
- 原因：
  - `.com` 在广告主与用户侧信任普适性最高，后续迁移成本最低
  - 自定义域便于品牌沉淀、外链建设、站点资产化
  - 审核时可避免“免费托管站点”的主观质量偏见
- 官方口径校准：AdSense 未明确“必须自定义域”；该项是运营与审核成功率优化策略
- 参考：Google AdSense 站点管理文档（可接受部分子域场景）
  - https://support.google.com/adsense/answer/12170421

### 1.2 官方文档改写为“原创增值内容”的 3 套模板

#### 模板 A：`Vs.` 选型对比模板
- 结构：场景定义 -> 方案 A/B/C 对比表 -> 成本/时延/稳定性基准 -> 推荐决策树
- 交付标准：每篇至少 1 个“可复制配置片段 + 结果截图/日志”
- 适用：Claude Code vs Gemini CLI vs OpenCode vs Codex 的同任务对比

#### 模板 B：错误日志复盘模板（Error Log Analysis）
- 结构：错误现象 -> 复现步骤 -> 根因定位 -> 修复方案 -> 预防清单
- 交付标准：每篇至少 2 个真实错误 case（含命令、堆栈、修复前后对比）
- 适用：安装失败、模型/网络/权限错误、IDE 集成异常

#### 模板 C：生产实践模板（Playbook）
- 结构：目标 -> 前置条件 -> 逐步实施 -> 回滚方案 -> 风险矩阵
- 交付标准：必须有“你自己的实践数据”（耗时、成功率、坑点）
- 适用：团队落地流程、CI 集成、成本控制、权限治理

### 1.3 中国区收款（Hyperwallet 重点）
- 已确认：AdSense 的 PayPal Hyperwallet 在 2025-10 扩展到中国发布商（需以后台可选项为准）
  - https://ppc.land/google-expands-paypal-hyperwallet-to-china-and-argentina-publishers/
  - https://support.google.com/adsense/answer/1714397
- 实操建议：
  1. AdSense 后台先看 `Payments -> Add payment method` 是否出现 Hyperwallet
  2. 若可用，优先 Hyperwallet（通常比传统电汇流程更轻）
  3. 同时准备备用路径（本地银行卡电汇）防止通道波动
- 风险提示：阈值、可用通道和到账时效均存在国家/账户级差异，最终以后台为准
  - https://support.google.com/adsense/answer/7164701

---

## 2) 备选联盟策略（Adsterra + AdSense 组合）

### 2.1 为什么 Adsterra 适合当前阶段
- 关键优势：较低起付门槛（如 Hyperwallet/Local Bank Transfer 常见 $25 起）
- 对比传统电汇：电汇通常门槛高、手续费高（例如 $1,000 起付一类方案）
- 适合你当前“新站低流量启动期”的现金流需求
- 参考：
  - https://help-publishers.adsterra.com/en/articles/6141418-receiving-payouts-through-paypal-by-hyperwallet
  - https://adsterra.com/blog/payouts-in-local-currency/
  - https://adsterra.com/blog/adsterra-minimum-payout-for-publishers/

### 2.2 广告形式策略（开发者友好，避免打扰）
- 禁用：Popunder、全屏强打断、自动跳转类
- 启用优先级：
  1. Native Banner（正文段间）
  2. Social Bar（底部轻量、可关闭）
  3. 目录侧栏固定位（仅桌面）
- 频控建议：
  - 首屏最多 1 个广告容器
  - 移动端正文每 2~3 屏 1 个广告位
  - 同一会话上限控制（避免“广告墙”）

### 2.3 Wise 集成可行性（务实结论）
- 结论：Wise 不是 AdSense 官方直连收款方式；更多是“中转方案”
- 建议：不要把 Wise 作为主路径；优先平台原生可选通道（Hyperwallet/银行）
- 参考：
  - https://wise.com/gb/blog/how-to-withdraw-money-from-adsense
  - https://wise.com/us/blog/ach-wise

---

## 3) 技术上线 Checklist（本项目可执行版）

### 3.1 法务与合规页面（必须补齐）
- [已完成] Privacy Policy：`pages/Privacy.tsx`
- [缺失] Terms of Service（需新建页面 + 路由）
- [建议] About（主体介绍/编辑原则/内容来源说明）
- [建议] Contact（邮箱或 GitHub issue 联系方式）
- [建议] Cookie/Consent 声明页（如单独政策页）

### 3.2 部署与域名（Vercel）
1. 购买并绑定自定义域（推荐 `.com`）
2. 在 Vercel `Project -> Settings -> Domains` 添加域名
3. 按 Vercel 提示配置 DNS（A/CNAME）
4. 配置 HTTPS（Vercel 自动签发证书）
5. 回归检查：主域 + `www` 跳转策略一致

### 3.3 `ads.txt` 与验证
1. 新建根路径 `ads.txt`（当前仓库缺失）
2. 若使用 AdSense，填入对应 `google.com, pub-xxxxxx, DIRECT, f08c47fec0942fa0`
3. 若并行 Adsterra，追加其要求行
4. 上线后验证：`https://your-domain.com/ads.txt` 可直接访问

### 3.4 当前代码改造建议（按优先级）

#### P0（本周必须）
- [ ] 新建 `pages/Terms.tsx`，并在 `App.tsx` 注册 `/terms`
- [ ] 修复 Footer 的 Terms 链接：`components/Layout.tsx`
- [ ] 新建根目录 `ads.txt`
- [ ] 新建广告脚本加载层（按 consent 状态启停）

#### P1（提交审核前）
- [ ] 接入 Consent Banner（首次访问同意管理）
- [ ] 同意前禁止个性化广告脚本执行
- [ ] 增加 `robots.txt`、`sitemap.xml`
- [ ] 将占位广告位逐步替换为真实 ad unit（保留布局不抖动）

#### P2（增长优化）
- [ ] 广告位 A/B：段间密度、首屏位置、侧栏位表现
- [ ] 内容模板化生产（对比、故障复盘、Playbook）
- [ ] 监控 RPM、可视率、跳出率和停留时长联动

---

## 4) 审批前“红线排查”
- 禁止大段复写官方文档无增值（高 LVC 风险）
- 禁止广告脚本先于同意机制加载（合规风险）
- 禁止死链 Terms/Contact（信任分与审核印象差）
- 禁止 `ads.txt` 缺失即申请（常见拒因）

---

## 5) 结论摘要（给 PM）
- 当前项目具备广告位结构和隐私政策基础，但未完成任何生产级广告网络接入。
- 申请 AdSense 前，必须先补齐：`Terms`、`ads.txt`、Consent、真实广告脚本接入与验证。
- 收款策略建议：主路径优先平台原生可用通道（AdSense Hyperwallet / 银行；Adsterra Hyperwallet/Local Transfer），Wise 仅作为可选中转。
