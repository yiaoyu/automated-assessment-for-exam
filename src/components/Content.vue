<script setup lang="ts">
  import { mainStore } from "../stores/main"
  import { onBeforeMount,ref } from "vue"
  import Setting from "./Setting.vue"
  import EditPaper from "./EditPaper.vue"
  import Exam from './Exam.vue'
  import Result from './Result.vue'
  import Review from './Review.vue'
  defineProps<{
    id: string;
  }>();
  const store = mainStore()
</script>

<template>
  <div class="content-container" v-if="store.currentNav=='studentInfo'&&store.currentItem==0">
    <Setting/>
  </div>
  <div class="content-container" v-if="store.currentNav=='teacherInfo'&&store.currentItem==0">
    <Setting/>
  </div>
  <div class="content-container" v-if="store.currentNav=='edit'">
    <EditPaper/>
  </div>
  <div class="content-container" v-if="store.currentNav=='exercise'">
    <Exam/>
  </div>
  <div class="content-container" v-if="store.currentNav=='exam'">
    <Exam/>
  </div>
  <div class="content-container" v-if="store.currentNav=='review'">
    <Review/>
  </div>
  <div class="content-container" v-if="store.currentNav=='result'">
    <Result/>
  </div>
</template>

<style scoped lang="less">
  @import "../assets/base.less";
  .content-container{
    min-height: 47rem;
    height: 100%;
    margin-top: 4rem;
    margin-left: 24rem;
    width:100%;
    background-color: @background-color;
    z-index: 1;
  }
</style>