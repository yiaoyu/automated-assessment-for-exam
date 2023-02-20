<script setup lang="ts">
  import { mainStore } from "../stores/main"
  defineProps<{
    class: string;
  }>();
  const store = mainStore()
</script>

<template>
  <section v-if="store.currentNav == 'info'">
    
  </section>
</template>

<style scoped>

</style>
