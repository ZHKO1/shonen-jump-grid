# Shonen Jump Grid - 项目指南

## 项目概述

漫画过场动画编辑器应用，灵感来自任天堂 NDS 平台游戏《Jump Ultimate Stars》的过场动画。用户可以创建和编辑漫画页面，划分格子，上传并裁剪图片，预览最终效果。

---

## 常用命令

```bash
# 开发
pnpm dev              # 启动开发服务器 (自动打开浏览器)
pnpm build            # 构建生产版本
pnpm preview          # 预览生产构建

# 代码质量 (pnpm lint --fix 会自动修复大部分格式问题)
pnpm lint             # ESLint 检查并自动修复
pnpm lint --fix       # 强制修复所有可自动修复的问题
pnpm typecheck        # TypeScript 类型检查

# 测试
pnpm test             # 启动测试监听模式
pnpm test:run         # 运行测试并退出
pnpm test -- src/foo.test.ts    # 运行单个测试文件
pnpm test -- --reporter=verbose # 详细输出
```

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
| Vitest | 测试框架 |

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

## 验证代码质量

```bash
pnpm lint --fix   # ESLint 自动修复 (首选)
pnpm typecheck    # TypeScript 类型检查
pnpm test:run     # 运行测试
```

**Lint 会自动修复**: import 顺序、空格、分号、括号、代码风格等。

---
