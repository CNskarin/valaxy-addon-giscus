export interface GiscusOptions {
  /**
   * GitHub repository in `owner/name` format, e.g. `user/blog`
   */
  repo: string
  /**
   * Repository node ID (starts with `R_kgDO...`).
   * Find it via GitHub API: `GET /repos/{owner}/{repo}` → `node_id`
   */
  repoId: string
  /**
   * Discussion category name, e.g. `General`
   */
  category: string
  /**
   * Discussion category ID (starts with `DIC_...`).
   * Find it via GitHub GraphQL API: `repository.discussionCategories.nodes[].id`
   */
  categoryId: string
  /**
   * Page-to-discussion mapping
   * @default 'pathname'
   */
  mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number'
  /**
   * Term for `specific` / `number` mapping
   */
  term?: string
  /**
   * Whether to enable strict matching
   * @default false
   */
  strict?: boolean
  /**
   * Whether to enable reactions
   * @default true
   */
  reactionsEnabled?: boolean
  /**
   * Whether to emit comment metadata
   * @default false
   */
  emitMetadata?: boolean
  /**
   * Comment input position
   * @default 'top'
   */
  inputPosition?: 'top' | 'bottom'
  /**
   * Giscus theme: a theme name, or `{ light, dark }` for auto switching
   * @default 'preferred_color_scheme'
   */
  theme?: string | { light: string; dark: string }
  /**
   * Language code, e.g. `zh-CN`, `en`
   * @default 'zh-CN'
   */
  lang?: string
  /**
   * Loading mode
   * @default 'lazy'
   */
  loading?: 'lazy' | 'eager'
}
