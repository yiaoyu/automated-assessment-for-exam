<script setup lang="ts">
  import { mainStore } from "../stores/main"
  defineProps<{
    type: string;
  }>();
  const store = mainStore()
</script>

<template>
  <div class="header" v-if="type=='student'">
    <button @click="store.currentNav = 'info'" :class="{ active: store.currentNav=='info' }">个人信息</button>
    <button @click="store.currentNav = 'exercise'" :class="{ active: store.currentNav=='exercise' }">练习</button>
    <button @click="store.currentNav = 'exam'" :class="{ active: store.currentNav=='exam' }">考试</button>
    <button @click="store.currentNav = 'score'"  :class="{ active: store.currentNav=='score' }">成绩</button>
  </div>
  <div class="header" v-if="type=='teacher'">
    <button @click="store.currentNav = 'info'">个人信息</button>
    <button @click="store.currentNav = 'edit'">编辑试题</button>
    <button @click="store.currentNav = 'view'">查看结果</button>
  </div>
</template>

<style scoped lang="less">
  @import "../assets/base.less";
  .header{
    background-color: red;
    width: 100%;
    height: 4rem;
    display: flex;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    z-index: 3;
    position: absolute;
    button{
      background-color: @sec-color-light;
    }
    button:hover{
      background-color: @sec-color-hover;
    }
    .active{
      background-color: @sec-color;
    }
    .active:hover{
      background-color: @sec-color;
    }
  }
</style>
