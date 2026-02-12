# 技术栈总结

## 1. TypeScript (主要开发语言)

### 1.1 字符串
```typescript
// 字符串声明
const title: string = "Document Title";
const description = "Brief description";

// 字符串方法
title.trim();
title.toLowerCase();
title.replace(/pattern/, "replacement");
title.split(",");
title.match(/regex/);
```

### 1.2 数值
#### 整型
```typescript
const categoryOrder: number = 1;
const maxSize: number = 1000;
```

#### 浮点型
```typescript
const version: number = 1.0;
const ratio: number = 0.5;
```

### 1.3 布尔值
#### true
```typescript
const isActive: boolean = true;
const hasError = true;
```

#### false
```typescript
const isLoading = false;
const isComplete = false;
```

### 1.4 类型系统
```typescript
// 接口定义
interface Frontmatter {
  title?: string;
  description?: string;
  slug?: string;
}

// 类型别名
type MdxModule = {
  default: React.ComponentType<{
    components?: Record<string, React.ComponentType<Record<string, unknown>>>;
  }>;
  frontmatter?: Frontmatter;
};

// 泛型
const modules: Record<string, MdxModule> = {};
```

## 2. 运算符与表达式

### 2.1 算术运算
```typescript
// 加减乘除
const sum = a + b;
const diff = a - b;
const product = a * b;
const quotient = a / b;

// 取模
const remainder = a % b;
```

### 2.2 比较运算
```typescript
// 大于小于
if (a > b) { }
if (a < b) { }
if (a >= b) { }
if (a <= b) { }

// 等于判断
if (a === b) { }
if (a !== b) { }
```

### 2.3 逻辑运算
```typescript
// 与
if (condition1 && condition2) { }

// 或
if (condition1 || condition2) { }

// 非
if (!isLoading) { }

// 复合逻辑
if ((a && b) || c) { }
```

## 3. 控制流程语句

### 3.1 分支语句
#### if
```typescript
if (docs.length === 0) {
  return null;
}

if (activeSlug && docs.some(item => item.slug === activeSlug)) {
  setActiveSlug(docs[0].slug);
}
```

#### switch
```typescript
switch (language) {
  case 'en':
    return modulesEn;
  case 'zh':
    return modulesZh;
  default:
    return modulesEn;
}
```

### 3.2 循环语句
#### for
```typescript
// for...of
for (const doc of docs) {
  // 处理每个文档
}

// for...in
for (const key in object) {
  // 处理每个属性
}

// 传统for
for (let i = 0; i < length; i++) {
  // 遍历数组
}
```

#### while
```typescript
let index = 0;
while (index < items.length) {
  // 处理
  index++;
}
```

## 4. 数据存储

### 4.1 数据结构类型

#### 数组
```typescript
const docs: DocItem[] = [];
const modules: Record<string, MdxModule> = {};

// 数组操作
docs.push(item);
docs.filter(d => d.category === category);
docs.map(d => d.title);
docs.sort((a, b) => a.order - b.order);
docs.find(d => d.slug === activeSlug);
```

#### 字典/对象
```typescript
// TypeScript接口
interface DocItem {
  fileName: string;
  title: string;
  slug: string;
  categoryOrder: number;
  category: string;
}

// 对象创建
const doc: DocItem = {
  fileName: "example.mdx",
  title: "Example",
  slug: "example",
  categoryOrder: 1,
  category: "Getting Started"
};

// 访问属性
doc.title;
doc["slug"];
```

#### Map
```typescript
const categoryMap = new Map<string, CategoryGroup>();

// 设置
categoryMap.set(key, value);

// 获取
const category = categoryMap.get(key);

// 检查存在
if (categoryMap.has(key)) { }
```

#### Set
```typescript
const slugs = new Set<string>();
slugs.add(doc.slug);
slugs.has(doc.slug);
```

### 4.2 数据操作

#### 遍历
```typescript
// 数组遍历
docs.forEach((doc, index) => {
  // 处理每个文档
});

// 对象遍历
Object.entries(modules).forEach(([path, mod]) => {
  // 处理每个模块
});

// Map遍历
categoryMap.forEach((group, key) => {
  // 处理每个分类
});
```

#### 查找
```typescript
// 数组查找
const activeDoc = docs.find(item => item.slug === activeSlug);

// 条件筛选
const filteredDocs = docs.filter(item => 
  item.categoryOrder === categoryOrder
);
```

#### 添加元素
```typescript
// 数组添加
docs.push(newDoc);
docs.unshift(newDoc);

// Map添加
categoryMap.set(categoryKey, newCategory);
```

#### 删除元素
```typescript
// 数组删除
const index = docs.findIndex(d => d.slug === slug);
if (index > -1) docs.splice(index, 1);

// Map删除
categoryMap.delete(categoryKey);
```

## 5. 面向对象

### 5.1 对象和类的基本概念
```typescript
// 函数式组件（React推荐）
interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <div>{children}</div>;
};

// 对象字面量
const component = {
  name: "Layout",
  props: { children: null },
  render: () => { }
};
```

### 5.2 函数和方法
```typescript
// 函数声明
function parseDocFileMeta(fileName: string): ParsedMeta | null {
  const match = fileName.match(pattern);
  return match ? { /* 解析结果 */ } : null;
}

// 箭头函数
const toSafeSlug = (value: string): string => {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
};

// 方法
const docs = {
  items: [],
  
  sort(comparator: (a: DocItem, b: DocItem) => number) {
    this.items.sort(comparator);
  }
};
```

## 6. 内置对象

### 6.1 日期
```typescript
// Date对象
const now = new Date();
const dateString = now.toISOString();

// 格式化
const formatted = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
```

### 6.2 字符串
```typescript
// 正则表达式
const match = fileName.match(/pattern/);
const parts = fileName.split('/');

// 字符串方法
title.toLowerCase();
title.toUpperCase();
title.trim();
title.replace(/old/g, "new");
title.includes("search");
title.startsWith("prefix");
title.endsWith("suffix");
```

### 6.3 时间
```typescript
// 性能计时
const start = performance.now();
// 执行操作
const end = performance.now();
const duration = end - start;

// 延迟执行
setTimeout(() => {
  // 延迟代码
}, 1000);
```

### 6.4 生成随机数
```typescript
// Math.random()
const random = Math.random();
const randomInt = Math.floor(Math.random() * 10);

// 唯一ID生成
const id = Math.random().toString(36).substring(2);
```

## 7. React框架特性

### 7.1 组件系统
```typescript
// 函数组件
export const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  return <div>{prop1} {prop2}</div>;
};

// 组件属性
interface Props {
  title: string;
  children?: React.ReactNode;
}
```

### 7.2 Hooks系统

#### useState
```typescript
const [state, setState] = useState(initialValue);

// 更新状态
setState(newValue);
setState(prev => prev + 1);
```

#### useEffect
```typescript
useEffect(() => {
  // 副作用逻辑
  return () => {
    // 清理函数
  };
}, [dependencies]);
```

#### useMemo
```typescript
const computed = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

#### useCallback
```typescript
const handler = useCallback((event) => {
  // 处理逻辑
}, [dependencies]);
```

#### useContext
```typescript
const { language, setLanguage } = useLanguage();
```

### 7.3 路由系统
```typescript
// 路由配置
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/docs/:toolId" element={<Docs />} />
</Routes>

// 导航链接
<NavLink to="/docs/gemini">Gemini</NavLink>

// 获取参数
const { toolId } = useParams();
```

### 7.4 条件渲染
```typescript
// 三元运算符
{isActive ? <ActiveComponent /> : <InactiveComponent />}

// 逻辑与
{showContent && <Content />}

// Switch匹配
{switch (status) {
  case 'loading': return <Loading />;
  case 'error': return <Error />;
  default: return <Content />;
}}
```

### 7.5 列表渲染
```typescript
{items.map((item, index) => (
  <ListItem key={item.id} item={item} />
))}
```

### 7.6 状态提升
```typescript
// 父组件
const [activeSlug, setActiveSlug] = useState('');

// 传递setter
<ChildComponent 
  activeSlug={activeSlug}
  setActiveSlug={setActiveSlug}
/>
```

## 8. Vite构建工具

### 8.1 配置
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), mdx()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.')
    }
  },
  define: {
    'process.env.API_KEY': JSON.stringify(env.API_KEY)
  }
});
```

### 8.2 动态导入
```typescript
// 批量导入MDX文件
const modules = import.meta.glob('../content/**/*.mdx', {
  eager: true
});

// 条件导入
const module = await import(`./pages/${componentName}.tsx`);
```

## 9. Tailwind CSS

### 9.1 基础类
```tsx
// 布局
<div className="flex items-center justify-between">

// 间距
<div className="p-4 m-2 space-y-4">

// 颜色
<div className="text-foreground bg-background">

// 响应式
<div className="hidden md:block lg:w-1/2">

// 状态
<button className="hover:bg-primary active:scale-95">
```

### 9.2 工具函数
```typescript
// cn()组合类
import { cn } from '../lib/utils';

<div className={cn(
  "base-class",
  condition && "conditional-class",
  error && "error-class"
)}>
```

## 10. Node.js运行时

### 10.1 文件系统
```typescript
import fs from 'fs/promises';

// 读取文件
const content = await fs.readFile(path, 'utf-8');

// 写入文件
await fs.writeFile(path, content, 'utf-8');

// 目录操作
await fs.mkdir(path, { recursive: true });
```

### 10.2 路径处理
```typescript
import path from 'path';

const fullPath = path.join(dirName, fileName);
const fileName = path.basename(fullPath);
const dirName = path.dirname(fullPath);
```

### 10.3 进程信息
```typescript
import process from 'process';

process.cwd();  // 当前工作目录
process.env;    // 环境变量
process.exit(0); // 退出进程
```
