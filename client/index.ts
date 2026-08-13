import { useRuntimeConfig } from 'valaxy'
import { computed } from 'vue'

import type { GiscusOptions } from '../types'

/**
 * Get the resolved giscus addon config from runtime.
 */
export function useAddonGiscus() {
  const runtimeConfig = useRuntimeConfig()
  return computed(() => {
    const addon = runtimeConfig.value.addons?.['valaxy-addon-giscus'] as
      | { options?: GiscusOptions }
      | undefined
    return addon?.options
  })
}
