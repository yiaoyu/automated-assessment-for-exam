<script setup lang="ts">
  import { mainStore } from "../stores/main"
  import navOptions from "../configs/NavOptions.json"
  defineProps<{
    class: string;
  }>();
  const store = mainStore()
</script>

<template>
  <div class="nav-bar">
    <input type="search" id="nav-search" placeholder="搜索..." 
    v-if="store.currentNav!='studentInfo'&&store.currentNav!='teacherInfo'">
    <!-- <button>增加新试卷</button> -->
    <div class="list" v-if="store.currentNav=='studentInfo'">
      <div class="item" v-for="option in navOptions.studentInfo" 
      :key="option.id" 
      @click="store.currentItem=option.id" 
      :class="{selected:store.currentItem==option.id}">
        {{ option.title }}
      </div>
    </div>
    <div class="list" v-if="store.currentNav=='teacherInfo'">
      <div class="item" v-for="option in navOptions.teacherInfo" 
      :key="option.id" 
      @click="store.currentItem=option.id" 
      :class="{selected:store.currentItem==option.id}">
        {{ option.title }}
      </div>
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
        background-color: @sec-color-hover;
        color:@font-color-white;
        cursor: pointer;
      }
      .selected{
        background-color: @sec-color;
        color:@font-color-white;
      }
      .selected:hover{
        background-color: @sec-color;
        cursor: pointer;
      }
    }
  }
</style>
