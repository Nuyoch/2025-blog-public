# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev           # 启动开发服务器 (端口 2025, Turbopack)
pnpm build         # 生产构建
pnpm start         # 启动生产服务器
pnpm svg           # 生成 SVG 图标索引
pnpm build:cf      # 构建 Cloudflare Workers 版本
pnpm preview       # 本地预览 Cloudflare 版本
pnpm deploy        # 部署到 Cloudflare
```

无测试命令、无 lint 命令。包管理器为 pnpm。

## 架构概览

**这是一个"无后端"的博客系统** — 所有内容以文件形式存储在 GitHub 仓库的 `public/` 目录中，前端通过 GitHub REST API 直接读写仓库文件。没有独立的数据库或 API 服务器。

### 核心数据流

```
浏览器 (前端编辑) → GitHub REST API → 仓库文件变更 → 部署平台检测到 push → 自动重新部署
```

实际上有两层"数据":
1. **本地读取**: Next.js 直接从 `public/blogs/` 提供静态文件 (config.json, index.md, 图片)
2. **远程写入**: 前端通过 GitHub App 认证 → 创建 blob → 创建 tree → 创建 commit → 更新 branch ref

### 认证机制 (`src/lib/auth.ts` + `src/lib/github-client.ts`)

- 使用 GitHub App 安装令牌进行认证
- 流程: 用户粘贴 Private Key → 前端用 Web Crypto (AES-GCM) 加密存储在 sessionStorage → 使用时解密 → 签发 RS256 JWT → 获取 installation token → 调用 GitHub API
- Zustand store `useAuthStore` 管理认证状态

### 内容模型

**博客文章** 存储在 `public/blogs/{slug}/`:
- `index.md` — Markdown 内容
- `config.json` — 元数据 (title, date, tags, cover, category, hidden)
- 图片文件以 SHA256 哈希命名实现去重

**博客索引** `public/blogs/index.json` — `BlogIndexItem[]` 数组，用于列表和搜索

**站点配置** `src/config/site-content.json` — 主题颜色、背景图片、社交按钮、备案号等。也通过 GitHub API 远程更新 (`push-site-content.ts`)

### 关键目录

| 目录 | 用途 |
|---|---|
| `src/app/(home)/` | 首页，卡片式布局（支持拖拽编辑），配置弹窗 |
| `src/app/write/` | 博客编辑器 (创建/编辑)，包括 Markdown 编辑、图片上传、元数据 |
| `src/app/blog/` | 博客列表页、详情页 (`[id]`)、批量删除、分类管理 |
| `src/app/pictures/` | 图片管理页面 |
| `src/app/projects/` | 项目展示页面 |
| `src/app/share/` | 分享内容管理 |
| `src/app/snippets/` | 代码片段管理 |
| `src/app/bloggers/` | 关注的博主管理 |
| `src/app/about/` | 关于页面 |
| `src/app/api/chat/` | LLM 聊天 API 路由 (OpenAI 兼容接口代理) |
| `src/components/` | 公共组件 (nav-card, blog-preview, code-block, card, music-card 等) |
| `src/layout/` | 根布局组件、背景动画 (BlurredBubbles, Snowfall) |
| `src/lib/` | 核心库: GitHub 客户端、认证、Markdown 渲染、博客索引 |
| `src/hooks/` | 自定义 hooks: use-auth, use-blog-index, use-chat-stream, use-markdown-render 等 |
| `scripts/` | gen-svgs-index.js — 扫描 SVG 文件生成索引 |

### Markdown 渲染 (`src/lib/markdown-renderer.ts`)

- 基于 `marked` 库，使用自定义 renderer
- **Shiki** 代码高亮 — 懒加载以兼容 Cloudflare Workers 环境
- **KaTeX** 数学公式 — 懒加载，支持 `$...$` (inline) 和 `$$...$$` (block)
- 自动提取标题生成目录 (TOC)

### AI 聊天 (`src/hooks/use-chat-stream.ts` + `src/app/api/chat/route.ts`)

- 前端 hook 处理 SSE 流式响应和纯 JSON 回退
- API route 代理到 OpenAI 兼容的 LLM 后端 (配置在 `.env.local` 的 `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`)
- 角色设定为"纳西妲(Nahida)"，定义在 `src/config/nahida-persona.ts`

### 环境变量

| 变量 | 用途 |
|---|---|
| `NEXT_PUBLIC_GITHUB_OWNER` | GitHub 用户名 |
| `NEXT_PUBLIC_GITHUB_REPO` | 仓库名 |
| `NEXT_PUBLIC_GITHUB_BRANCH` | 分支名 (默认 main) |
| `NEXT_PUBLIC_GITHUB_APP_ID` | GitHub App ID |
| `NEXT_PUBLIC_GITHUB_ENCRYPT_KEY` | PEM 加密密钥 |
| `LLM_BASE_URL` | LLM API 地址 |
| `LLM_API_KEY` | LLM API 密钥 |
| `LLM_MODEL` | LLM 模型名 |

### 技术要点

- **Next.js 16** + App Router, 启用了 React Compiler, SVG 通过 `@svgr/webpack` 导入为 React 组件
- **Tailwind CSS 4**, 主题色通过 CSS 变量 (`--color-brand` 等) 在 `layout.tsx` 中注入
- **Zustand** 用于客户端状态 (认证、写博客、配置编辑)
- **SWR** 用于客户端数据请求 (博客索引)
- **Motion** (framer-motion) 用于动画
- Cloudflare Workers 部署通过 `@opennextjs/cloudflare`，`wrangler.toml` 中已配置
- TypeScript 构建错误被忽略 (`ignoreBuildErrors: true`)，`reactStrictMode: false`
