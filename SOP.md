# AI Coding Hub SOP - 标准化操作流程

## 一、项目初始化

### 1.1 环境准备
```bash
# 安装依赖
npm install

# 设置环境变量
# 编辑 .env.local 文件
GEMINI_API_KEY=your_api_key

# 启动开发服务器
npm run dev
```

### 1.2 项目结构
```
/
├── components/     # React组件
├── context/        # React Context（LanguageContext）
├── pages/          # 页面组件
├── data/           # 静态数据（docs.ts）
├── lib/            # 工具函数
├── content/        # MDX文档内容
├── scripts/        # 构建脚本
├── types.ts        # 全局类型定义
├── App.tsx        # 路由配置
└── index.tsx       # 入口文件
```

## 二、开发流程

### 2.1 新增工具文档流程

#### 步骤1: 创建文档目录
```bash
# 在 content/ 下创建新工具目录
mkdir content/new-tool
mkdir content/new-tool/en
mkdir content/new-tool/zh
```

#### 步骤2: 准备MDX文件
- 文件命名格式: `{Order}. {Category}-{SubOrder}. {SubCategory}-{Title}_final.mdx`
- Frontmatter必需字段:
```yaml
---
title: "Document Title"
description: "Brief description"
slug: "unique-identifier"
date: "YYYY-MM-DD"
tool: "Tool Name"
---
```

#### 步骤3: 创建页面组件
1. 复制 `pages/ClaudeDocs.tsx` 为新组件
2. 修改MDX路径导入
3. 更新正则表达式匹配文件名格式
4. 更新侧边栏标题

#### 步骤4: 更新路由配置
编辑 `App.tsx`:
```typescript
import { NewToolDocs } from './pages/NewToolDocs';

// 添加路由
<Route path="/docs/newtool" element={<NewToolDocs />} />
```

#### 步骤5: 更新导航栏
编辑 `components/Layout.tsx`:
```typescript
// 在导航栏添加链接
<NavLink to="/docs/newtool">{tools.newtool[language].name}</NavLink>
```

#### 步骤6: 更新文档元数据
编辑 `data/docs.ts`:
```typescript
newtool: {
  id: 'newtool',
  icon: <ToolIcon />,
  en: { name: 'NewTool', description: '...' },
  zh: { name: '新工具', description: '...' }
}
```

#### 步骤7: 构建验证
```bash
npm run build
```

### 2.2 MDX文档迁移流程

#### 步骤1: 扫描源文档
```python
# 使用 scripts/migrate_docs_bilingual.py
python scripts/migrate_docs_bilingual.py
```

#### 步骤2: 验证MDX编译
```bash
# 检查MDX语法
node scripts/check-mdx-tables.mjs
```

#### 步骤3: 修复语法问题
```python
# 运行批量修复脚本
python scripts/fix_mdx_format.py
```

#### 步骤4: 手动修复残留问题
- 检查 `tmp-mdx-errors.json` 中的错误
- 逐文件修复复杂问题

### 2.3 组件开发流程

#### 3.1 创建新组件
```typescript
// components/NewComponent.tsx
import React from 'react';
import { cn } from '../lib/utils';

interface NewComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export const NewComponent: React.FC<NewComponentProps> = ({ 
  className, 
  children 
}) => {
  return (
    <div className={cn("base-styles", className)}>
      {children}
    </div>
  );
};
```

#### 3.2 组件测试
```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 2.4 样式开发流程

#### 4.1 使用Tailwind CSS
```tsx
// 基本样式
<div className="flex items-center gap-4">

// 响应式设计
<div className="hidden md:block">

// 深色模式
<div className="dark:bg-slate-900">
```

#### 4.2 使用cn()工具函数
```typescript
import { cn } from '../lib/utils';

// 条件类名
<div className={cn(
  "base-class",
  condition && "conditional-class"
)}>
```

## 三、构建与部署

### 3.1 开发环境
```bash
npm run dev
# 访问 http://localhost:3000
```

### 3.2 生产构建
```bash
npm run build
# 输出到 dist/ 目录
```

### 3.3 预览构建
```bash
npm run preview
```

## 四、问题排查

### 4.1 MDX编译失败
```bash
# 检查错误
node scripts/check-mdx-tables.mjs

# 查看详细错误
cat tmp-mdx-errors.json
```

### 4.2 路由问题
- 检查 `App.tsx` 中的路由配置
- 确保组件已正确导入

### 4.3 样式问题
- 检查Tailwind CSS是否正确加载
- 验证深色模式类名

## 五、最佳实践

### 5.1 代码规范
- 使用TypeScript类型定义
- 组件使用 `React.FC<Type>` 模式
- 遵循项目命名约定

### 5.2 文档规范
- Frontmatter字段完整
- MDX语法正确
- 链接和引用有效

### 5.3 性能优化
- 使用 `eager: true` 预加载MDX
- 避免不必要的重渲染
- 使用 `useMemo` 和 `useCallback`

## 六、常用命令

```bash
# 安装依赖
npm install

# 开发服务器
npm run dev

# 构建
npm run build

# 预览
npm run preview

# MDX检查
node scripts/check-mdx-tables.mjs

# 迁移文档
python scripts/migrate_docs_bilingual.py

# 修复MDX格式
python scripts/fix_mdx_format.py
```
