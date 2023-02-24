<script setup lang="ts">
  import type { question } from "@/stores/entity";
  import { mainStore } from "../stores/main"
  import { reactive,watch } from "vue"
  const store = mainStore()
  const questions:question[] = reactive([])
  watch(() => store.currentPaperId, (n) => {
    questions.push(...store.getAllquestion(n))
  });
</script>

<template>
  <div class="question-container" >
    <div v-for="question in questions">
      {{ question }}
    </div>
  </div>
</template>

<style scoped lang="less">
  @import "../assets/base.less";
  
</style>