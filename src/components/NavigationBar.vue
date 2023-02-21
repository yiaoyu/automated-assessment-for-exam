<script setup lang="ts">
  import { mainStore } from "../stores/main"
  defineProps<{
    class: string;
  }>();
  const store = mainStore()
</script>

<template>
  <!-- <section v-if="store.currentNav == 'info'">
    
  </section> -->
  <div class="nav-bar">
    <input type="search" id="nav-search" placeholder="搜索...">
    <button>增加新试卷</button>
    <div class="list">
      <div class="item">期初测试</div>
      <div class="item">期末测试</div>
      <div class="item">计算机测试</div>
    </div>
  </div>
</template>

<style scoped lang="less">
  @import "../assets/base.less";
  .nav-bar{
    min-height: 50rem;
    width: 24rem;
    background-color: @background-color;
    box-shadow: 0 2px 4px rgba(0,0,0,0.12), 0 2px 3px rgba(0,0,0,0.24);
    position: absolute;
    z-index: 2;
    top: 4rem;
    #nav-search{
      background-color: @input-background-color;
      width:24rem;
      padding: 1rem;
    }
    .list{
      display: flex;
      flex-direction: column;
      .item{
        padding: 0.5rem;
      }
      .item:hover{
        background-color: @main-color-hover;
        cursor: pointer;
      }
      .active{
        background-color: @main-color;
      }
      .active:hover{
        background-color: @main-color;
        cursor: pointer;
      }
    }
  }
</style>
