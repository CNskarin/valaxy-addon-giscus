# valaxy-addon-giscus

💬 [Giscus](https://giscus.app/) comment system addon for [Valaxy](https://valaxy.site/) — comments powered by [GitHub Discussions](https://docs.github.com/discussions).

No backend needed. Zero cost. Uses your GitHub repo's Discussions as the comment store.

## Install

```bash
pnpm add valaxy-addon-giscus
# or from GitHub
npm i github:CNskarin/valaxy-addon-giscus
```

## Prerequisites

1. Enable **Discussions** on your GitHub repo (Settings → Features → Discussions).
2. Get your repo ID and category ID:

```bash
# repo ID (node_id, starts with R_kgDO...)
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/repos/OWNER/REPO | grep node_id

# category ID (starts with DIC_...)
curl -H "Authorization: token YOUR_TOKEN" \
  -d '{"query":"query { repository(owner: \"OWNER\", name: \"REPO\") { discussionCategories(first: 10) { nodes { id name } } } }"}' \
  https://api.github.com/graphql
```

## Usage

In `valaxy.config.ts`:

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
      // mapping: 'pathname',          // page-to-discussion mapping
      // lang: 'zh-CN',                 // language
      // theme: 'preferred_color_scheme', // or { light: 'light', dark: 'dark' }
    }),
  ],
})
```

## Theme integration

If your theme doesn't render giscus automatically, create `components/YunComment.vue` (or your theme's comment component) in your site root to override it:

```vue
<script setup lang="ts">
import { GiscusClient } from 'valaxy-addon-giscus/components/GiscusClient.vue'
</script>

<template>
  <div class="comment">
    <ClientOnly>
      <GiscusClient />
    </ClientOnly>
  </div>
</template>
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `repo` | `string` | — | GitHub repo `owner/name` |
| `repoId` | `string` | — | Repo node ID (`R_kgDO...`) |
| `category` | `string` | — | Discussion category name |
| `categoryId` | `string` | — | Discussion category ID (`DIC_...`) |
| `mapping` | `string` | `'pathname'` | `pathname` \| `url` \| `title` \| `og:title` \| `specific` \| `number` |
| `term` | `string` | — | Term for `specific`/`number` mapping |
| `strict` | `boolean` | `false` | Strict matching |
| `reactionsEnabled` | `boolean` | `true` | Reactions |
| `emitMetadata` | `boolean` | `false` | Emit metadata |
| `inputPosition` | `string` | `'top'` | `top` \| `bottom` |
| `theme` | `string \| { light, dark }` | `'preferred_color_scheme'` | Giscus theme; object enables dark-mode switching |
| `lang` | `string` | `'zh-CN'` | Language |
| `loading` | `string` | `'lazy'` | `lazy` \| `eager` |

## License

MIT
