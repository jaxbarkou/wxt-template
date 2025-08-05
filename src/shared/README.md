# 共享组件架构

这个目录包含了可以在侧边栏和弹窗中复用的组件。

## 目录结构

```
src/shared/
├── components/
│   └── AppWrapper.tsx      # 主包装器组件，处理路由和模式切换
├── pages/
│   ├── Home.tsx           # 主页组件
│   ├── User.tsx           # 用户页面组件
│   └── index.tsx          # 页面导出文件
├── styles/
│   └── AppWrapper.css     # 包装器样式
├── types/
│   └── index.ts           # 共享类型定义
└── README.md              # 本文档
```

## 使用方法

### 在侧边栏中使用

```tsx
// src/entrypoints/sidepanel/App.tsx
import AppWrapper from "@/shared/components/AppWrapper";
import "@/assets/style/globals.css";
import "./App.css";

const App: React.FC = () => {
  return <AppWrapper mode="sidepanel" />;
};

export default App;
```

### 在弹窗中使用

```tsx
// src/entrypoints/popup/App.tsx
import AppWrapper from "@/shared/components/AppWrapper";
import "@/assets/style/globals.css";
import "./App.css";

const App: React.FC = () => {
  return <AppWrapper mode="popup" />;
};

export default App;
```

## 添加新页面

1. 在 `src/shared/pages/` 目录下创建新的页面组件
2. 页面组件需要接收 `mode` 参数（类型为 `AppMode`）
3. 在 `src/shared/pages/index.tsx` 中导出新页面
4. 在 `src/shared/components/AppWrapper.tsx` 中添加路由

### 示例

```tsx
// src/shared/pages/NewPage.tsx
import { PageProps } from "../types";

const NewPage: React.FC<PageProps> = ({ mode }) => {
  return (
    <div className={`w-full ${mode === 'popup' ? 'p-4' : 'p-2'}`}>
      <h2>新页面</h2>
      <p>当前模式: {mode}</p>
    </div>
  );
};

export default NewPage;
```

## 类型定义

- `AppMode`: 应用模式类型，可以是 `'sidepanel'` 或 `'popup'`
- `PageProps`: 页面组件的通用属性接口

## 样式

- 不同模式有不同的样式类名
- 弹窗模式：`popup-mode`
- 侧边栏模式：`sidepanel-mode`
- 可以通过 `mode` 参数来调整组件的样式和行为 