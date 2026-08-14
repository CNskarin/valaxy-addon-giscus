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
      repo: 'CNskarin/valaxy-blog',
      repoId: 'R_kgDOT3Y1xw',
      category: 'General',
      categoryId: 'DIC_kwDOT3Y1x84DDS7B',
    }),
  ],
})
