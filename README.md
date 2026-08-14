# valaxy-addon-giscus

💬 [Valaxy](https://valaxy.site/) 的 [Giscus](https://giscus.app/) 评论系统插件，评论数据由 **GitHub Discussions** 驱动。

无需后端服务、无需额外账号、零成本。评论框通过 giscus.app 的 iframe 加载，评论内容即你仓库里的 Discussions 帖子，可在 GitHub 上直接管理。

## 安装

```bash
pnpm add valaxy-addon-giscus
# 或
npm i valaxy-addon-giscus
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
      // term: 'Welcome',     // mapping 为 specific/number 时的匹配词
      // lang: 'zh-CN',       // 评论框语言
      // theme: 'preferred_color_scheme', // 或 { light, dark } 跟随站点亮暗模式
    }),
  ],
})
```

## 前置准备

1. 在 GitHub 仓库开启 **Discussions**：仓库 Settings → Features → Discussions → Enable。
2. 获取仓库 ID 与分类 ID（推荐使用 [giscus.app](https://giscus.app) 配置向导：填入仓库名搜索后，生成的代码中 `data-repo-id` 和 `data-category-id` 即为所需值）。也可通过命令行获取：

```bash
# 仓库 ID（node_id）
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/repos/OWNER/REPO | grep node_id

# 分类 ID（GraphQL）
curl -H "Authorization: token YOUR_TOKEN" \
  -d '{"query":"query { repository(owner: \"OWNER\", name: \"REPO\") { discussionCategories(first: 10) { nodes { id name } } } }"}' \
  https://api.github.com/graphql
```

## 主题集成

**默认 Yun 主题：零配置**。插件自带 `YunComment.vue` 覆盖组件，启用 `siteConfig.comment.enable` 并注册插件后自动渲染，无需任何额外操作。

**其他主题**：可在站点根目录创建 `components/YunComment.vue`（或对应主题的评论组件名）覆盖：

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

## 最小示例

仓库 `examples/demo/` 提供了完整的最小可运行站点（默认 Yun 主题 + Giscus 评论）：

```bash
cd examples/demo
pnpm i
pnpm dev   # 打开 http://localhost:4859，文章底部应出现评论框
```

## 部署注意事项

### GitHub Pages

无需额外配置。Valaxy 生成的站内链接为无后缀格式（`/posts/xxx`），GitHub Pages 会自动匹配对应的 `.html` 文件。

### 自托管服务器

评论功能本身无需配置，但需满足：

1. **HTTPS**：浏览器会拦截 HTTPS 页面中的混合内容，请为站点配置证书（Caddy / Certbot）。
2. **clean URL**：Nginx 需添加 `try_files $uri $uri.html $uri/index.html /404.html;` 以匹配无后缀链接。

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

## 评论管理

**评论框没有出现**
确认 `siteConfig.comment.enable` 为 `true`、repoId/categoryId 无误，且站点已完成重新构建部署。本地 `npm run dev` 也可预览，但评论会按 localhost 路径生成讨论，建议在正式网址上验证。

**提示配置错误 / Unable to fetch**
多为仓库名写错或 Discussions 未开启，重新检查前置准备两步。

**评论数据安全**
评论即 GitHub Discussions，与代码同仓库存储，可通过仓库 Discussions 标签页管理（查看/回复/删除）。

## 许可证

MIT
