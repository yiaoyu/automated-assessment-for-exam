<script setup lang="ts">
  import Header from "../components/Header.vue"
  import NavigationBar from "../components/NavigationBar.vue"
  import Content from "../components/Content.vue"
  import { mainStore } from "../stores/main"
  const store = mainStore()
</script>
  
<template>
  <div class="display">
    <Header type="student" />
    <div class="row-display">
      <NavigationBar :class="store.currentNav" />
      <Content id="0" />
    </div>
  </div>
</template>

<style scoped lang="less">
  @import "../assets/base.less";
  .display{
    min-height: 50rem;
    background-color: @background-color;
    .row-display{
      display: flex;
    }
  }
</style>
