# Shonen Jump Grid - 项目指南

## 项目概述

这是一个漫画过场动画编辑器应用，灵感来自任天堂 NDS 平台游戏《Jump Ultimate Stars》的过场动画，再次重现阅读漫画时的感动。
用户可以创建和编辑每一页，在每页划分漫画格子，同时在格子里上传图片并调整裁剪，最后可以通过预览按钮来看到自己把每个格子，每一页组合起来的效果。

---

## 技术栈

| 技术 | 用途 |
|------|------|
| React 19 | UI 框架 |
| TypeScript | 类型安全 |
| rsbuild | 构建工具 |
| Zustand | 状态管理 |
| Tailwind CSS | 样式 |
| Radix UI | 无障碍 UI 组件 |
| Pixi.js | Canvas 渲染 |
| framer-motion / GSAP | 动画效果 |

---

## 项目结构

```
grid-demo/
├── src/                    # 应用入口
│   ├── App.tsx             # 主应用组件
│   └── index.tsx           # React 渲染入口
├── components/             # UI 组件
│   ├── canvas/             # 画布核心组件（Pixi.js）
│   ├── comic/              # 漫画预览组件
│   ├── slider/             # 页面侧边栏滑动条
│   ├── attr-card/          # 属性编辑卡片
│   ├── img-crop/           # 图片裁剪组件
│   ├── header-bar/         # 顶部操作栏
│   ├── action-bar/         # 动作按钮栏
│   └── ui/                 # 基础 UI 组件（shadcn/ui 风格）
├── store/                  # Zustand 状态管理
│   └── index.ts            # 全局 store
├── hooks/                  # 自定义 React hooks
├── lib/                    # 工具函数
├── api/                    # API 接口
└── public/                 # 静态资源
```

---

## 开发指南

### 启动开发服务器

```bash
pnpm install
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 代码规范

- 使用 ESLint（@antfu/eslint-config）进行代码检查
- 提交前自动运行 lint-staged
