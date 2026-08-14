<script setup lang="ts">
import GiscusClient from './GiscusClient.vue'
</script>

<template>
  <div class="comment yun-comment">
    <ClientOnly>
      <GiscusClient />
    </ClientOnly>
  </div>
</template>
