# valaxy-addon-giscus

💬 给 [Valaxy](https://valaxy.site/) 博客加评论系统（Giscus），评论由 **GitHub Discussions** 驱动。

**不用买服务器、不用注册新账号、不用花一分钱。** 你的读者在你的文章底下留言，留言会变成你 GitHub 仓库里的 Discussions 帖子，你随时可以在 GitHub 上管理。

---

## 📋 开始之前

请确认你已经满足以下条件（都满足再继续）：

- [ ] 你的博客已经是 Valaxy 搭建的（用 `pnpm create valaxy` 创建的）
- [ ] 你的博客代码已经推到 GitHub 上（有仓库地址，比如 `你的名字/你的博客仓库`）
- [ ] 电脑上装了 Node.js（如果博客能本地跑起来，那一定装了）

> 如果你的博客托管在 GitHub Pages（免费的那种），**全程只需要以下 7 步，不需要任何服务器配置**。

---

## 🚀 傻瓜式安装教程（照着做就行）

### 第 1 步：安装插件

打开你博客项目所在的文件夹（能看到 `valaxy.config.ts` 的那个），打开终端（命令行），输入：

```bash
npm i github:CNskarin/valaxy-addon-giscus
```

看到 `added 1 package` 之类的提示就成功了。

---

### 第 2 步：开启仓库的 Discussions（讨论区）

1. 用浏览器打开你的 GitHub 仓库页面（比如 `https://github.com/你的名字/你的博客仓库`）
2. 点击顶部的 **Settings**（设置）
3. 在左侧菜单找到 **Features**（功能）
4. 勾选 **Discussions**，点击 **Enable**（开启）

完成！现在你的仓库多了个 Discussions 标签。

---

### 第 3 步：获取两个"神秘代码"（网页操作，不用命令行）

1. 打开 Giscus 官网：**https://giscus.app**
2. 在 **Repository** 输入框里填你的仓库名，格式是 `你的名字/你的博客仓库`（比如 `CNskarin/valaxy-blog`）
3. 点 **Search**（搜索）按钮。如果上一步 Discussions 没开，这里会提示错误，回去开好再试
4. 往下滚动找到 **Discussion Category**，选一个分类（推荐 `General`）
5. 页面底部会自动生成一段代码，里面藏着两个 ID：
   - `data-repo-id="R_kgDO..."` —— 记下引号里的内容，这就是**仓库 ID**
   - `data-category-id="DIC_..."` —— 记下引号里的内容，这就是**分类 ID**

> 💡 这两个 ID 分别是 `R_kgDO...` 和 `DIC_...` 开头的长串字符，先复制到记事本里备用。

---

### 第 4 步：修改配置文件 `valaxy.config.ts`

在博客项目根目录找到 **`valaxy.config.ts`** 文件，用记事本/VS Code 打开。

**文件开头**（最上面 3 行）加上一行引入代码，改完是这样：

```ts
import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'
import { addonGiscus } from 'valaxy-addon-giscus'   // ← 新增这一行
```

**文件中间**，找到 `theme: 'yun',` 这一行，在它下面加上：

```ts
  addons: [
    addonGiscus({
      repo: '你的名字/你的博客仓库',     // ← 改成你自己的仓库
      repoId: 'R_kgDO...',              // ← 第 3 步记下的仓库 ID
      category: 'General',
      categoryId: 'DIC_...',            // ← 第 3 步记下的分类 ID
    }),
  ],
```

**文件结尾**，找到 `siteConfig` 相关部分——如果你的配置里没有 `siteConfig`，就在最后一行 `})` 前面加上：

```ts
  siteConfig: {
    comment: {
      enable: true,
    },
  },
```

> 💡 如果文件里本来就有 `siteConfig: { comment: { enable: ... } }`，直接把 `enable` 改成 `true` 就行。

---

### 第 5 步：创建评论组件文件（如果用的是 yun 主题可跳过）

> 大多数 Valaxy 博客用的是默认的 yun 主题，**这一步可以跳过**，第 4 步配置完直接到第 6 步。
>
> 只有当你用的是非官方主题（比如自己写的主题）时，才需要做这一步：

1. 在博客项目根目录新建文件夹 **`components`**（如果已经存在就跳过）
2. 在 `components` 文件夹里新建文件 **`YunComment.vue`**
3. 把下面内容**整个复制**进去，保存：

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

---

### 第 6 步：推送到 GitHub，让网站重新构建

在你博客项目文件夹的终端里，依次输入：

```bash
git add -A
git commit -m "添加 Giscus 评论"
git push
```

如果你的博客用的是 GitHub Actions 自动部署（GitHub Pages 默认就是），推送后**等 1~2 分钟**，网站会自动重新构建并上线。

---

### 第 7 步：验证评论是否生效

1. 打开你博客的任意一篇文章
2. 拉到文章最底部
3. 看到评论框（可以填昵称和内容、支持 GitHub 登录）就说明成功了！🎉

---

## 🖥️ 博客部署在自己的服务器上？（Nginx 等）

如果你的博客不是托管在 GitHub Pages，而是自己的服务器，评论功能本身不用额外配置（评论框是浏览器直接加载的），但需要满足两个条件：

**1. 网站必须有 HTTPS**（浏览器不允许 HTTPS 网页里加载 HTTP 内容）。用 Caddy 或 Certbot 申请免费证书。

**2. 服务器要能正确处理无后缀的网址**（Valaxy 的文章链接是 `/posts/xxx` 这种没有 `.html` 的，GitHub Pages 会自动匹配，但 Nginx 不会）。在 Nginx 配置里加一行：

```nginx
location / {
    try_files $uri $uri.html $uri/index.html /404.html;
}
```

---

## ⚙️ 所有可配置项

| 配置项 | 必填？ | 默认值 | 说明 |
| --- | --- | --- | --- |
| `repo` | ✅ | — | 你的 GitHub 仓库，格式 `名字/仓库名` |
| `repoId` | ✅ | — | 仓库 ID（`R_kgDO...`），giscus.app 获取 |
| `category` | ✅ | — | 讨论分类名称（如 `General`） |
| `categoryId` | ✅ | — | 分类 ID（`DIC_...`），giscus.app 获取 |
| `mapping` | ❌ | `'pathname'` | 文章和讨论的对应方式，一般不用改 |
| `lang` | ❌ | `'zh-CN'` | 评论框语言 |
| `theme` | ❌ | `'preferred_color_scheme'` | 评论框主题；写 `{ light: 'light', dark: 'dark' }` 可跟随网站亮暗模式 |
| `inputPosition` | ❌ | `'top'` | 评论输入框位置 |
| `loading` | ❌ | `'lazy'` | 加载方式 |

---

## ❓ 常见问题

**Q：评论框没出现？**
A：先确认第 4 步的 `comment.enable` 是 `true`，且配置的 repoId/categoryId 没抄错。再确认网站已经重新构建部署完成（第 6 步）。

**Q：提示 "Error: Unable to fetch" / 配置错误？**
A：说明 Giscus 连不上你的仓库或 ID 不对。重新做第 2、3 步，确认仓库名没打错、Discussions 已开启。

**Q：评论数据存在哪？会被删吗？**
A：存在你 GitHub 仓库的 Discussions 里，跟你的代码一样安全，永远不会丢。管理评论 = 打开仓库的 Discussions 标签。

**Q：本地预览能看到评论吗？**
A：本地 `npm run dev` 也能看到评论框（localhost 可以加载 giscus），但评论会按 localhost 路径创建讨论，建议在正式网址上测试。

---

## 📜 许可证

MIT
