# Code Explorer 部署指南

## Vercel 部署步骤

### 1. 准备工作

确保你已经安装了 Vercel CLI（可选，用于本地测试）：

```bash
npm i -g vercel
```

### 2. 部署到 Vercel

#### 方式一：通过 Git 仓库部署（推荐）

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
3. 点击 "Add New Project"
4. 导入你的 Git 仓库
5. 配置项目：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. 点击 "Deploy"

#### 方式二：通过 Vercel CLI 部署

```bash
# 登录 Vercel
vercel login

# 在项目根目录执行
vercel

# 生产环境部署
vercel --prod
```

### 3. 环境变量配置（如需要）

在 Vercel Dashboard 的项目设置中，可以添加环境变量：

```
# 示例环境变量
VITE_API_URL=https://api.example.com
VITE_APP_NAME=Code Explorer
```

### 4. 自定义域名（可选）

1. 在 Vercel Dashboard 中选择你的项目
2. 进入 "Settings" → "Domains"
3. 添加你的自定义域名
4. 按照提示配置 DNS 记录

### 5. 自动部署

Vercel 会自动为你的 Git 仓库配置 Webhook：
- 每次推送到 `main` 分支会自动触发部署
- Pull Request 会生成预览链接

## 项目配置说明

### vercel.json 配置

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

这个配置确保：
- 使用 Vite 构建
- 支持前端路由（SPA）
- 所有路由都指向 index.html

### 构建输出

构建后的文件将位于 `dist` 目录：
- `index.html` - 主页面
- `assets/` - 静态资源（JS、CSS、图片等）

## 故障排除

### 构建失败

1. 检查 Node.js 版本（建议使用 18+）
2. 确保所有依赖已安装：`npm install`
3. 本地测试构建：`npm run build`

### 路由 404

确保 `vercel.json` 中的 rewrites 配置正确，将所有路由指向 index.html。

### 资源加载失败

检查 `vite.config.js` 中的 `base` 配置。如果是子路径部署，需要设置：

```js
export default defineConfig({
  base: '/your-subpath/',
  // ...
})
```

## 性能优化

项目已配置以下优化：

1. **代码分割**: 将 vendor 和 UI 库分离到单独的 chunk
2. **资源缓存**: 静态资源长期缓存（1年）
3. **安全头**: 添加 XSS、点击劫持等防护头
4. **Gzip/Brotli**: Vercel 自动启用压缩

## 监控和分析

在 Vercel Dashboard 中可以查看：
- 部署历史
- 性能指标
- 访问统计
- 错误日志

## 联系方式

如有部署问题，请检查：
1. Vercel 文档：https://vercel.com/docs
2. Vite 部署指南：https://vitejs.dev/guide/static-deploy.html#vercel
