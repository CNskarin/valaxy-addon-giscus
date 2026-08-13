# valaxy-addon-giscus

💬 [Valaxy](https://valaxy.site/) 的 [Giscus](https://giscus.app/) 评论系统插件 —— 评论由 [GitHub Discussions](https://docs.github.com/discussions) 驱动。

无需后端，零成本。评论数据直接存在你的 GitHub 仓库 Discussions 里。

## 安装

```bash
pnpm add valaxy-addon-giscus
# 或从 GitHub 安装
npm i github:CNskarin/valaxy-addon-giscus
```

## 前置准备

1. 在 GitHub 仓库开启 **Discussions**（Settings → Features → Discussions）。
2. 获取仓库 ID 和分类 ID：

```bash
# 仓库 ID（node_id，以 R_kgDO... 开头）
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/repos/OWNER/REPO | grep node_id

# 分类 ID（以 DIC_... 开头）
curl -H "Authorization: token YOUR_TOKEN" \
  -d '{"query":"query { repository(owner: \"OWNER\", name: \"REPO\") { discussionCategories(first: 10) { nodes { id name } } } }"}' \
  https://api.github.com/graphql
```

## 使用

在 `valaxy.config.ts` 中：

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
      repo: 'OWNER/REPO',
      repoId: 'R_kgDO...',
      category: 'General',
      categoryId: 'DIC_...',
      // mapping: 'pathname',            // 页面与讨论的映射方式
      // lang: 'zh-CN',                   // 语言
      // theme: 'preferred_color_scheme', // 或 { light: 'light', dark: 'dark' } 跟随站点亮暗模式
    }),
  ],
})
```

## 主题集成

如果主题没有自动渲染评论组件，在站点根目录创建 `components/YunComment.vue`（或对应主题的评论组件）来覆盖它：

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

> 注意：`.vue` 组件是默认导出，请使用 `import GiscusClient from ...`，不要写成 `{ GiscusClient }`。

## 配置项

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `repo` | `string` | — | GitHub 仓库 `owner/name` |
| `repoId` | `string` | — | 仓库节点 ID（`R_kgDO...`） |
| `category` | `string` | — | 讨论分类名称 |
| `categoryId` | `string` | — | 讨论分类 ID（`DIC_...`） |
| `mapping` | `string` | `'pathname'` | `pathname` \| `url` \| `title` \| `og:title` \| `specific` \| `number` |
| `term` | `string` | — | `specific`/`number` 映射方式下的匹配词 |
| `strict` | `boolean` | `false` | 严格匹配 |
| `reactionsEnabled` | `boolean` | `true` | 表情回应 |
| `emitMetadata` | `boolean` | `false` | 输出元数据 |
| `inputPosition` | `string` | `'top'` | `top` \| `bottom` 评论框位置 |
| `theme` | `string \| { light, dark }` | `'preferred_color_scheme'` | Giscus 主题；传对象可跟随站点亮暗模式切换 |
| `lang` | `string` | `'zh-CN'` | 语言 |
| `loading` | `string` | `'lazy'` | `lazy` \| `eager` 加载方式 |

## 许可证

MIT
