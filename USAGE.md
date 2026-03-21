# 2025 Blog 使用指南

> 📝 本指南详细介绍如何使用和操作 2025 Blog 个人博客系统

## 目录

- [快速开始](#快速开始)
- [本地开发](#本地开发)
- [功能介绍](#功能介绍)
- [内容管理](#内容管理)
- [网站配置](#网站配置)
- [部署指南](#部署指南)
- [常见问题](#常见问题)

---

## 快速开始

### 前置要求

- Node.js 18+ 
- pnpm 包管理器
- GitHub 账号

### 安装步骤

1. 克隆项目到本地

```bash
git clone https://github.com/your-username/2025-blog-public.git
cd 2025-blog-public
```

2. 安装依赖

```bash
pnpm install
```

3. 启动开发服务器

```bash
pnpm dev
```

4. 访问 `http://localhost:2025` 查看网站

---

## 本地开发

### 可用命令

```bash
# 启动开发服务器 (端口 2025)
pnpm dev

# 生成 SVG 索引
pnpm svg

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# Cloudflare 部署相关命令
pnpm build:cf       # 构建 Cloudflare 版本
pnpm preview        # 预览 Cloudflare 版本
pnpm deploy         # 部署到 Cloudflare
pnpm cf-typegen     # 生成 Cloudflare 类型定义
```

### 项目结构

```
2025-blog-public/
├── public/                 # 静态资源
│   ├── blogs/             # 博客文章 (Markdown + config.json)
│   ├── images/            # 图片资源
│   ├── live2d/            # Live2D 模型
│   └── music/             # 音乐文件
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (home)/       # 首页相关
│   │   ├── blog/         # 博客页面
│   │   ├── write/        # 写作页面
│   │   ├── pictures/     # 图片管理
│   │   ├── projects/     # 项目展示
│   │   ├── share/        # 分享内容
│   │   ├── snippets/     # 代码片段
│   │   ├── bloggers/     # 关注的博主
│   │   ├── about/        # 关于页面
│   │   └── ...           # 其他功能页面
│   ├── components/       # 公共组件
│   ├── config/           # 配置文件
│   ├── hooks/            # 自定义 Hooks
│   ├── layout/           # 布局组件
│   └── styles/           # 样式文件
├── scripts/              # 脚本工具
└── package.json         # 项目配置
```

---

## 功能介绍

### 1. 博客系统

- **文章管理**: 支持创建、编辑、删除博客文章
- **分类系统**: 按年、月、周、日、分类查看文章
- **标签系统**: 为文章添加标签
- **阅读记录**: 自动记录已阅读文章
- **Markdown 编辑**: 支持完整的 Markdown 语法
- **代码高亮**: 使用 Shiki 进行代码语法高亮
- **数学公式**: 支持 KaTeX 数学公式渲染

### 2. 图片管理

- **图片上传**: 支持批量上传图片
- **随机展示**: 首页随机展示图片
- **图片压缩**: 推荐上传前压缩图片 (宽度不超过 1200px)

### 3. 项目展示

- **项目卡片**: 展示个人项目
- **图片上传**: 为项目添加封面图
- **链接管理**: 添加项目链接

### 4. 分享内容

- **快捷分享**: 分享链接、图片等内容
- **Logo 上传**: 为分享内容添加 Logo

### 5. 代码片段

- **片段管理**: 保存常用的代码片段
- **分类整理**: 按类别组织代码片段

### 6. 关注博主

- **博主列表**: 展示关注的博主
- **头像上传**: 为博主添加头像
- **链接管理**: 添加博主主页链接

### 7. 特色功能

- **Live2D**: 2D 动画角色展示
- **时钟**: 自定义时钟显示
- **图片工具箱**: 图片处理工具
- **SVG 图标**: SVG 图标库

---

## 内容管理

### 博客文章管理

#### 创建新文章

1. 在首页点击"写博客"按钮
2. 进入写作页面
3. 输入文章标题和内容
4. 点击右上角"预览"查看效果
5. 确认无误后点击"保存"

#### 图片管理

1. 点击编辑区域的"+"按钮上传图片
2. 推荐图片宽度不超过 1200px
3. 将上传好的图片拖入编辑区即可插入
4. 支持多张图片上传

#### 编辑模式

1. 进入博客列表页面
2. 点击右上角"编辑"按钮进入编辑模式
3. 可以进行以下操作:
   - **选择文章**: 点击文章进行选择
   - **全选/取消全选**: 批量操作文章
   - **删除文章**: 删除选中的文章
   - **分类管理**: 为文章分配分类
   - **保存更改**: 保存所有修改

#### 分类管理

1. 在编辑模式下点击"分类"按钮
2. 可以:
   - 添加新分类
   - 删除分类
   - 调整分类顺序
   - 为文章分配分类

### 图片管理

1. 进入"图片"页面
2. 点击右上角"上传"按钮
3. 选择要上传的图片
4. 图片会自动添加到首页随机展示

### 项目管理

1. 进入"项目"页面
2. 点击"创建"按钮添加新项目
3. 填写项目信息:
   - 项目名称
   - 项目描述
   - 项目链接
   - 封面图片
4. 保存项目

### 分享内容管理

1. 进入"分享"页面
2. 点击"创建"按钮添加新分享
3. 填写分享信息:
   - 分享标题
   - 分享链接
   - Logo 图片
4. 保存分享

---

## 网站配置

### 网站元信息

配置网站的基本信息:

```json
{
  "meta": {
    "title": "你的博客标题",
    "description": "博客描述",
    "username": "用户名"
  }
}
```

### 主题颜色

自定义网站主题颜色:

```json
{
  "theme": {
    "colorBrand": "#35bfab",           // 品牌色
    "colorPrimary": "#334f52",         // 主色
    "colorSecondary": "#7b888e",       // 次要色
    "colorBrandSecondary": "#1fc9e7",  // 品牌次要色
    "colorBg": "#eeeeee",              // 背景色
    "colorBorder": "#ffffff",          // 边框色
    "colorCard": "#ffffff66",          // 卡片色
    "colorArticle": "#ffffffcc"        // 文章色
  }
}
```

### 背景图片

配置首页背景图片:

```json
{
  "backgroundImages": [
    {
      "id": "image1",
      "url": "/images/background1.jpg"
    }
  ],
  "currentBackgroundImageId": "image1"
}
```

### 艺术图片

配置首页展示的艺术图片:

```json
{
  "artImages": [
    {
      "id": "cat",
      "url": "/images/art/cat.png"
    }
  ],
  "currentArtImageId": "cat"
}
```

### 社交按钮

配置社交媒体链接:

```json
{
  "socialButtons": [
    {
      "id": "github",
      "type": "github",
      "value": "https://github.com/your-username",
      "label": "Github",
      "order": 1
    },
    {
      "id": "email",
      "type": "email",
      "value": "your-email@example.com",
      "label": "Email",
      "order": 2
    }
  ]
}
```

### 其他配置

```json
{
  "clockShowSeconds": false,      // 时钟是否显示秒
  "summaryInContent": false,      // 是否在内容中显示摘要
  "isCachePem": false,            // 是否缓存 PEM 密钥
  "hideEditButton": false,        // 是否隐藏编辑按钮
  "enableCategories": true,       // 是否启用分类功能
  "currentHatIndex": 3,           // 当前帽子索引
  "hatFlipped": false,            // 帽子是否翻转
  "enableChristmas": false,       // 是否启用圣诞节主题
  "beian": {                      // 备案信息
    "text": "",
    "link": ""
  }
}
```

### 配置方式

#### 方式一: 前端配置

1. 访问首页
2. 找到并点击"配置"按钮
3. 在弹出的配置对话框中修改配置
4. 保存配置

#### 方式二: 代码配置

直接修改 `src/config/site-content.json` 文件。

---

## 部署指南

### Vercel 部署

1. 在 Vercel 创建新项目
2. 导入 GitHub 仓库
3. 配置环境变量:

```
NEXT_PUBLIC_GITHUB_OWNER=your-username
NEXT_PUBLIC_GITHUB_REPO=2025-blog-public
NEXT_PUBLIC_GITHUB_BRANCH=main
NEXT_PUBLIC_GITHUB_APP_ID=your-app-id
```

4. 点击部署
5. 等待部署完成 (约 60 秒)

### Cloudflare 部署

1. 构建 Cloudflare 版本:

```bash
pnpm build:cf
```

2. 预览构建结果:

```bash
pnpm preview
```

3. 部署到 Cloudflare:

```bash
pnpm deploy
```

### GitHub App 配置

#### 创建 GitHub App

1. 进入 GitHub 设置 -> Developer settings
2. 点击 "New GitHub App"
3. 填写基本信息 (名称和 URL 可以随意填写)
4. 关闭 Webhook
5. 设置仓库权限:
   - Repository permissions: Contents (Write)
6. 创建 App 并下载 Private Key
7. 复制 App ID

#### 安装 GitHub App

1. 进入 App 安装页面
2. 选择要授权的仓库 (仅当前项目)
3. 点击安装

#### 配置环境变量

在部署平台配置以下环境变量:

- `NEXT_PUBLIC_GITHUB_OWNER`: GitHub 用户名
- `NEXT_PUBLIC_GITHUB_REPO`: 仓库名称
- `NEXT_PUBLIC_GITHUB_BRANCH`: 分支名称 (默认 main)
- `NEXT_PUBLIC_GITHUB_APP_ID`: GitHub App ID

---

## 常见问题

### Q: 如何删除 Liquid Grass 背景?

A: 编辑 `src/layout/index.tsx` 文件,删除以下代码:

```tsx
// 删除导入
const LiquidGrass = dynamic(() => import('@/components/liquid-grass'), { ssr: false })

// 删除使用 (约第 53 行)
<LiquidGrass />
```

### Q: 如何修改首页卡片内容?

A: 首页卡片位于 `src/app/(home)` 目录:

- `hi-card.tsx`: 欢迎卡片
- `calendar-card.tsx`: 日历卡片
- `clock-card.tsx`: 时钟卡片
- `art-card.tsx`: 艺术图片卡片
- `share-card.tsx`: 分享卡片
- `social-buttons.tsx`: 社交按钮
- `write-buttons.tsx`: 写作按钮

### Q: 图片上传失败怎么办?

A: 检查以下几点:

1. 确保 GitHub App 已正确配置
2. 检查 Private Key 是否正确导入
3. 确认网络连接正常
4. 检查图片大小是否过大 (建议小于 2MB)

### Q: 如何备份博客内容?

A: 博客内容存储在 `public/blogs/` 目录,每个博客是一个文件夹:

```
public/blogs/
├── blog-slug-1/
│   ├── index.md          # 博客内容
│   ├── config.json       # 博客配置
│   └── images/           # 博客图片
├── blog-slug-2/
│   └── ...
```

定期备份整个 `public/blogs/` 目录即可。

### Q: 如何自定义主题颜色?

A: 有两种方式:

1. **前端配置**: 首页点击"配置"按钮,在"颜色配置"中修改
2. **代码配置**: 修改 `src/config/site-content.json` 中的 `theme` 字段

### Q: 如何添加新的页面?

A: 在 `src/app/` 目录下创建新的文件夹和 `page.tsx` 文件:

```
src/app/
└── your-page/
    └── page.tsx
```

### Q: 如何修改导航菜单?

A: 导航卡片位于 `src/components/` 目录,找到对应的导航组件进行修改。

### Q: 部署后内容没有更新?

A: 需要等待后台部署完成:

1. 前端保存内容后提示成功
2. 等待 GitHub Actions 或部署平台完成部署
3. 刷新页面查看更新内容

### Q: 如何启用/禁用分类功能?

A: 在 `src/config/site-content.json` 中设置:

```json
{
  "enableCategories": true   // true 启用, false 禁用
}
```

### Q: 如何添加备案信息?

A: 在 `src/config/site-content.json` 中配置:

```json
{
  "beian": {
    "text": "京ICP备12345678号",
    "link": "https://beian.miit.gov.cn/"
  }
}
```

---

## 技术栈

- **框架**: Next.js 16
- **UI 库**: React 19
- **样式**: Tailwind CSS 4
- **动画**: Framer Motion
- **Markdown**: Marked
- **代码高亮**: Shiki
- **数学公式**: KaTeX
- **状态管理**: Zustand
- **数据请求**: SWR
- **日期处理**: Day.js

---

## 许可证

MIT License

---

## 获取帮助

如果遇到问题,可以通过以下方式获取帮助:

- GitHub Issues: 提交问题
- QQ 群: https://qm.qq.com/q/spdpenr4k2
- Telegram 群: https://t.me/public_blog_2025

---

## 更新日志

查看项目更新历史,请访问 GitHub Releases 页面。

---

**祝你使用愉快! 🎉**
