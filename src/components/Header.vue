<script setup lang="ts">
  import { mainStore } from "../stores/main"
  defineProps<{
    type: string;
  }>();
  const store = mainStore()
</script>

<template>
  <div v-if="type=='student'">
    student header
    <div @click="store.currentNav = 'info'">个人信息</div>
    <div @click="store.currentNav = 'exercise'">练习</div>
    <div @click="store.currentNav = 'exam'">考试</div>
    <div @click="store.currentNav = 'score'">成绩</div>
  </div>
  <div v-if="type=='teacher'">
    teacher header
    <div @click="store.currentNav = 'info'">个人信息</div>
    <div @click="store.currentNav = 'edit'">编辑试题</div>
    <div @click="store.currentNav = 'view'">查看结果</div>
  </div>
</template>

<style scoped>

</style>
