<script setup lang="ts">
  import { mainStore } from "../stores/main"
  import { ref,reactive,watch } from "vue"
  defineProps<{
    type: string;
  }>();
  const store = mainStore()
  watch(()=>store.currentNav,(nav)=>{
    store.currentPaperId=0
    store.currentItem=0
  })
  function changeNav(name:string){
    store.currentItem = 0
    store.currentNav = name
  }
</script>

<template>
  <div class="header" v-if="type=='student'">
    <button @click="changeNav('studentInfo')" :class="{ active: store.currentNav=='studentInfo' }">个人信息</button>
    <button @click="changeNav('exercise')" :class="{ active: store.currentNav=='exercise' }">练习</button>
    <button @click="changeNav('exam')" :class="{ active: store.currentNav=='exam' }">考试</button>
    <button @click="changeNav('result')"  :class="{ active: store.currentNav=='result' }">成绩</button>
  </div>
  <div class="header" v-if="type=='teacher'">
    <button @click="changeNav('teacherInfo')" :class="{ active: store.currentNav=='teacherInfo' }">个人信息</button>
    <button @click="changeNav('edit')" :class="{ active: store.currentNav=='edit' }">编辑试题</button>
    <button @click="changeNav('review')" :class="{ active: store.currentNav=='review' }">查看结果</button>
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
