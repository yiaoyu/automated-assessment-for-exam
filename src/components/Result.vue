<script setup lang="ts">
  import type { question } from "@/stores/entity";
  import { mainStore } from "../stores/main"
  import { reactive,watch } from "vue"
  const store = mainStore()

</script>

<template>
  <div class="result-container" >
    
  </div>
</template>

<style scoped lang="less">
  @import "../assets/base.less";
  
</style>