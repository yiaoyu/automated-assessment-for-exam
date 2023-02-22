<script setup lang="ts">
  import { mainStore } from "../stores/main"
  import { onBeforeMount,ref } from "vue"
  import Setting from "./Setting.vue"
  defineProps<{
    id: string;
  }>();
  const store = mainStore()
</script>

<template>
  <div class="content-container" id="student-info1" v-if="store.currentNav=='studentInfo'&&store.currentItem==0">
    <Setting/>
  </div>
  <!-- <header>
    <h1 class="header-title">期末考试</h1>
    <h3 class="header-time-limit">考试时间</h3>
    <div class="header-info">考试须知</div>
  </header>
  <hr/>
  <div class="question">
    <div class="description">
      1.题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述（3分）
    </div>
    <div class="choice-answer">
      <input type="checkbox" id="a">
      <label for="a">圆形</label>
      <input type="checkbox" id="b">
      <label for="b">正方形</label>
      <input type="checkbox" id="c">
      <label for="c">椭圆形</label>
      <input type="checkbox" id="d">
      <label for="d">钝角</label>
    </div>
    <hr/>
  </div>
  <div class="question">
    <div class="description">
      2.题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述题目描述
    </div>
    <div class="text-answer">
      <input>
    </div>
    <hr/>
  </div>
  <div class="question">
    <div class="description">
      3.题目描述题目描述题目描述题目描述题目描述
    </div>
    <div class="program-answer">
      <input>
    </div>
    <hr/>
  </div>
  <footer>
    <button class="submit-btn">提交试卷</button>
    <button class="delete-btn">删除试卷</button>
  </footer> -->
</template>

<style scoped lang="less">
  @import "../assets/base.less";
  .content-container{
    min-height: 50rem;
    margin-top: 4rem;
    margin-left: 24rem;
    width:100%;
    background-color: @background-color-light;
    z-index: 1;
    // header{
    //   display: flex;
    //   flex-direction: column;
    //   align-items: center;
    // };
    // .question{
    //   padding: 1rem;
    //   .description{
    //     padding-bottom: 1rem;
    //   }
    //   .text-answer{
    //     background-color: @input-background-color;
    //     input{
    //       width: 100%;
    //     }
    //   }
    //   .program-answer{
    //     background-color: @input-background-color;
    //     input{
    //       width: 100%;
    //     }
    //   }
    // }
    // footer{
    //   display: flex;
    //   justify-content: center;
    //   button{
    //     height: 3rem;
    //     width: 8rem;
    //   }
    //   .delete-btn{
    //     background-color: @warning-color-light;
    //   }
    //   .delete-btn:hover{
    //     background-color: @warning-color;
    //   }
    // };
  }
</style>