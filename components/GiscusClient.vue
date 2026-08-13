<script setup lang="ts">
import Giscus from '@giscus/vue'
import { useAppStore } from 'valaxy'
import { computed } from 'vue'

import { useAddonGiscus } from '../client'
import type { GiscusOptions } from '../types'

const addonOptions = useAddonGiscus()
const appStore = useAppStore()

const options = computed<GiscusOptions | undefined>(() => addonOptions.value)

const theme = computed(() => {
  const configTheme = options.value?.theme
  if (typeof configTheme === 'string')
    return resolveTheme(configTheme)

  return resolveTheme(
    appStore.isDark ? configTheme?.dark : configTheme?.light,
  )
})

function resolveTheme(theme: string | undefined) {
  if (!theme)
    return appStore.isDark ? 'dark' : 'light'
  return theme
}

const giscusProps = computed(() => {
  const o = options.value
  if (!o)
    return {}

  return {
    repo: o.repo,
    repoId: o.repoId,
    category: o.category,
    categoryId: o.categoryId,
    mapping: o.mapping ?? 'pathname',
    strict: o.strict ? '1' : '0',
    reactionsEnabled: o.reactionsEnabled ?? true,
    emitMetadata: o.emitMetadata ? '1' : '0',
    inputPosition: o.inputPosition ?? 'top',
    theme: theme.value,
    lang: o.lang ?? 'zh-CN',
    loading: o.loading ?? 'lazy',
  }
})
</script>

<template>
  <Giscus
    v-if="options?.repo"
    v-bind="giscusProps"
  />
</template>
