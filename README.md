# valaxy-addon-giscus

💬 [Valaxy](https://valaxy.site/) 的 [Giscus](https://giscus.app/) 评论系统插件，评论数据由 **GitHub Discussions** 驱动。

无需后端服务、无需额外账号、零成本。评论框通过 giscus.app 的 iframe 加载，评论内容即你仓库里的 Discussions 帖子，可在 GitHub 上直接管理。

## 适用场景

| 托管方式 | 支持 | 额外配置 |
| --- | --- | --- |
| GitHub Pages | ✅ | 无，部署即用 |
| 自托管服务器（Nginx 等） | ✅ | 需 HTTPS + clean URL 配置（见下文） |
| 其他静态托管（Netlify/Vercel 等） | ✅ | 无 |

Giscus 评论框是浏览器直接加载的第三方 iframe，与博客部署位置无关，唯一要求是页面能正常访问 giscus.app。

---

## 安装

在博客项目根目录执行：

```bash
npm i github:CNskarin/valaxy-addon-giscus
```

## 前置准备

### 1. 开启仓库 Discussions

GitHub 仓库 → **Settings** → **Features** → 勾选 **Discussions** → **Enable**。

### 2. 获取仓库 ID 与分类 ID

推荐直接用 [giscus.app](https://giscus.app) 的配置向导：

1. 打开 https://giscus.app，在 Repository 输入框填入 `你的名字/你的仓库名`，点击 Search
2. 选择 Discussion Category（推荐 `General`）
3. 页面底部生成的代码中：
   - `data-repo-id="R_kgDO..."` 即为仓库 ID
   - `data-category-id="DIC_..."` 即为分类 ID

也可以命令行获取：

```bash
# 仓库 ID（node_id）
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/repos/OWNER/REPO | grep node_id

# 分类 ID（需 GraphQL）
curl -H "Authorization: token YOUR_TOKEN" \
  -d '{"query":"query { repository(owner: \"OWNER\", name: \"REPO\") { discussionCategories(first: 10) { nodes { id name } } } }"}' \
  https://api.github.com/graphql
```

## 配置

编辑项目根目录的 `valaxy.config.ts`：

```ts
import { defineValaxyConfig } from 'valaxy'
import { addonGiscus } from 'valaxy-addon-giscus'

export default defineValaxyConfig({
  siteConfig: {
    comment: {
      enable: true,
    },
  },
  addons: [
    addonGiscus({
      repo: 'OWNER/REPO',    // 你的仓库
      repoId: 'R_kgDO...',   // 仓库 node_id
      category: 'General',   // 讨论分类名称
      categoryId: 'DIC_...', // 讨论分类 ID
      // 以下均为可选：
      // mapping: 'pathname', // 页面↔讨论的映射方式
      // lang: 'zh-CN',       // 评论框语言
      // theme: 'preferred_color_scheme', // 或 { light, dark } 跟随站点亮暗模式
    }),
  ],
})
```

## 主题集成

**yun 主题（默认主题）已内置评论容器**，启用 `siteConfig.comment.enable` 后自动渲染，无需其他操作。

其他主题若未集成，可在站点根目录创建 `components/YunComment.vue`（或对应主题的评论组件名）覆盖：

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

> 注意：`.vue` 组件为默认导出，请使用 `import GiscusClient from ...`，写成 `{ GiscusClient }` 会导致 SSG 构建报错 "not exported"。

## 部署注意事项

### GitHub Pages

无需额外配置。Valaxy 生成的站内链接为无后缀格式（`/posts/xxx`），GitHub Pages 会自动匹配对应的 `.html` 文件，部署后即可使用。

### 自托管服务器

评论功能本身无需配置，但需要满足：

**1. HTTPS**：浏览器会拦截 HTTPS 页面中的混合内容（HTTP 请求），请为站点配置证书（Caddy / Certbot 均可）。

**2. clean URL**：Nginx 不会像 GitHub Pages 那样自动补 `.html`，需要在站点配置中添加：

```nginx
location / {
    try_files $uri $uri.html $uri/index.html /404.html;
}
```

**3. 构建环境**：服务器执行 `npm i` 时需要能访问 GitHub（拉取本插件），国内服务器建议配置镜像：`npm config set registry https://registry.npmmirror.com`。

## 配置项

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `repo` | `string` | — | GitHub 仓库，`owner/name` 格式 |
| `repoId` | `string` | — | 仓库节点 ID（`R_kgDO...`） |
| `category` | `string` | — | 讨论分类名称 |
| `categoryId` | `string` | — | 讨论分类 ID（`DIC_...`） |
| `mapping` | `string` | `'pathname'` | 页面↔讨论映射：`pathname` \| `url` \| `title` \| `og:title` \| `specific` \| `number` |
| `term` | `string` | — | `specific`/`number` 映射下的匹配词 |
| `strict` | `boolean` | `false` | 严格匹配 |
| `reactionsEnabled` | `boolean` | `true` | 表情回应 |
| `emitMetadata` | `boolean` | `false` | 输出元数据 |
| `inputPosition` | `string` | `'top'` | 评论框位置：`top` \| `bottom` |
| `theme` | `string \| { light, dark }` | `'preferred_color_scheme'` | Giscus 主题；传对象可跟随站点亮暗模式切换 |
| `lang` | `string` | `'zh-CN'` | 评论框语言 |
| `loading` | `string` | `'lazy'` | 加载方式：`lazy` \| `eager` |

## 常见问题

**评论框没有出现**
确认 `siteConfig.comment.enable` 为 `true`、repoId/categoryId 无误，且站点已完成重新构建部署。本地 `npm run dev` 也可预览，但评论会按 localhost 路径生成讨论，建议在正式网址上验证。

**提示配置错误 / Unable to fetch**
多为仓库名写错或 Discussions 未开启，重新检查前置准备两步。

**评论数据安全**
评论即 GitHub Discussions，与代码同仓库存储，可通过仓库 Discussions 标签页管理（查看/回复/删除）。Giscus 还支持设置管理员暗号进入管理面板。

## 许可证

MIT
