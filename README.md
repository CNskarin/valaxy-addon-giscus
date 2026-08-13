# valaxy-addon-giscus

💬 [Valaxy](https://valaxy.site/) 的 [Giscus](https://giscus.app/) 评论系统插件 —— 评论由 **GitHub Discussions** 驱动。

**无需任何后端服务，零成本，零维护。** 评论数据直接存放在你的 GitHub 仓库 Discussions 里，评论框通过 giscus.app 的 iframe 加载，托管在哪个平台都能用。

## 适用场景

| 博客托管方式 | 是否支持 | 额外配置 |
| --- | --- | --- |
| **GitHub Pages**（推荐） | ✅ | **完全不需要**，部署即用 |
| 自托管服务器（Nginx 等） | ✅ | 需配置 clean URL 和 HTTPS（见下文） |
| 其他静态托管（Netlify/Vercel 等） | ✅ | 无需额外配置 |

> 原理：Giscus 评论框是嵌入的第三方 iframe（giscus.app），评论读写走 GitHub API，**与博客部署在哪里无关**。唯一要求是博客页面能正常加载 giscus.app。

---

## 安装

```bash
pnpm add valaxy-addon-giscus
# 或从 GitHub 安装
npm i github:CNskarin/valaxy-addon-giscus
```

## 前置准备

1. 在 GitHub 仓库开启 **Discussions**：仓库 Settings → Features → Discussions → Enable。
2. 获取仓库 ID 和讨论分类 ID（只需一次）：

```bash
# 仓库 ID（node_id，以 R_kgDO... 开头）
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/repos/OWNER/REPO | grep node_id

# 分类 ID（以 DIC_... 开头）
curl -H "Authorization: token YOUR_TOKEN" \
  -d '{"query":"query { repository(owner: \"OWNER\", name: \"REPO\") { discussionCategories(first: 10) { nodes { id name } } } }"}' \
  https://api.github.com/graphql
```

## 配置

在 `valaxy.config.ts` 中：

```ts
import { defineValaxyConfig } from 'valaxy'
import { addonGiscus } from 'valaxy-addon-giscus'

export default defineValaxyConfig({
  siteConfig: {
    comment: {
      enable: true, // 开启评论
    },
  },
  addons: [
    addonGiscus({
      repo: 'OWNER/REPO',       // GitHub 仓库
      repoId: 'R_kgDO...',      // 仓库 node_id
      category: 'General',      // 讨论分类名称
      categoryId: 'DIC_...',    // 讨论分类 ID
      // —— 以下均为可选 ——
      // mapping: 'pathname',    // 页面↔讨论的映射方式
      // lang: 'zh-CN',          // 评论框语言
      // theme: 'preferred_color_scheme', // 主题，或 { light, dark } 跟随站点亮暗
    }),
  ],
})
```

## 主题集成

yun 主题已内置评论容器（`YunComment` 组件），启用 `siteConfig.comment.enable` 后会自动渲染。若你的主题未集成，在站点根目录创建 `components/YunComment.vue` 覆盖：

```vue
<script setup lang="ts">
import GiscusClient from 'valaxy-addon-giscus/components/GiscusClient.vue'
</script>

<template>
  <div class="comment">
    <ClientOnly>
      <GiscusClient />
    </ClientOnly>
  </div>
</template>
```

> ⚠️ `.vue` 组件是**默认导出**：`import GiscusClient from ...`，不要写成 `{ GiscusClient }`，否则 SSG 构建会报 "not exported" 错误。

## 部署场景

### 场景一：GitHub Pages 托管（零配置）

博客部署在 `username.github.io` 或自定义域名（CNAME 到 GitHub Pages）时：

- ✅ 评论组件开箱即用，无需任何服务器配置
- ✅ 站内链接（`/posts/xxx` 无后缀）由 GitHub Pages 自动补 `.html` 匹配，URL 天然兼容
- 直接 push 触发构建部署即可

### 场景二：自托管服务器（Nginx 等）

博客部署在自己的 VPS/服务器时，评论本身**无需额外配置**（Giscus 走 iframe，与服务器无关），但需注意：

**1. 必须启用 HTTPS**

浏览器会拦截 HTTPS 页面中的 HTTP 请求（混合内容），而 giscus.app 是 HTTPS。请用 Caddy / Certbot（Let's Encrypt）等为站点配置 HTTPS 证书。

**2. 配置 clean URL**

Valaxy 生成的站内链接是无后缀的（如 `/posts/hello-valaxy`），GitHub Pages 会自动补 `.html`，但 Nginx 不会，需要手动配置。Nginx 示例：

```nginx
server {
    listen 443 ssl;
    server_name blog.example.com;

    # SSL 证书配置（Caddy / Certbot）
    ssl_certificate     /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    root /var/www/blog/dist;
    index index.html;

    # 无后缀 URL → 补 .html（核心配置）
    location / {
        try_files $uri $uri.html $uri/index.html /404.html;
    }
}
```

**3. 服务器需要能访问 GitHub**

评论 iframe 由浏览器直接加载 giscus.app（不需要服务器转发），但构建时 `npm i` 会从 GitHub/npm 拉取依赖，国内服务器建议配置 npm 镜像：

```bash
npm config set registry https://registry.npmmirror.com
```

## 配置项

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `repo` | `string` | — | GitHub 仓库 `owner/name` |
| `repoId` | `string` | — | 仓库节点 ID（`R_kgDO...`） |
| `category` | `string` | — | 讨论分类名称 |
| `categoryId` | `string` | — | 讨论分类 ID（`DIC_...`） |
| `mapping` | `string` | `'pathname'` | 页面↔讨论映射：`pathname` \| `url` \| `title` \| `og:title` \| `specific` \| `number` |
| `term` | `string` | — | `specific`/`number` 映射方式下的匹配词 |
| `strict` | `boolean` | `false` | 严格匹配 |
| `reactionsEnabled` | `boolean` | `true` | 表情回应 |
| `emitMetadata` | `boolean` | `false` | 输出元数据 |
| `inputPosition` | `string` | `'top'` | 评论框位置：`top` \| `bottom` |
| `theme` | `string \| { light, dark }` | `'preferred_color_scheme'` | Giscus 主题；传对象可跟随站点亮暗模式自动切换 |
| `lang` | `string` | `'zh-CN'` | 评论框语言 |
| `loading` | `string` | `'lazy'` | 加载方式：`lazy` \| `eager` |

## 评论管理

- 所有评论就是仓库的 **Discussions**，在 GitHub 上直接查看/回复/删除
- Giscus 支持隐藏管理入口：评论框右上角设置里可配置管理员暗号，输入后进入管理面板

## 许可证

MIT
