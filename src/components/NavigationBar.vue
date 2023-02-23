<script setup lang="ts">
  import { mainStore } from "../stores/main"
  import navOptions from "../configs/NavOptions.json"
  defineProps<{
    class: string;
  }>();
  const store = mainStore()
  //增加试卷
  function addPaper(){
    fetch(`/api/addpaper`,{
      method: 'post', 
      headers: new Headers({
        'Authorization': localStorage.getItem("token")!,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        tid:store.userId,
        title:"新建试卷",
        type:"exam"
      })
    }).then(v=>{
      return v.json()
    }).then(v=>{
      switch(v.msg){
        case "success":
          store.getAllPaper()
          break
        case "fail":
          window.alert("添加失败")
          break
        default: window.alert(v)
      }
    }).catch(err=>{
      console.log(err)
    })
  }
</script>

<template>
  <div class="nav-bar">
    <input type="search" id="nav-search" placeholder="搜索..." 
    v-if="store.currentNav!='studentInfo'&&store.currentNav!='teacherInfo'">
    <button v-if="store.currentNav=='edit'" @click="addPaper">增加新试卷</button>
    <!-- 学生信息 -->
    <div class="list" v-if="store.currentNav=='studentInfo'">
      <div class="item" v-for="option in navOptions.studentInfo" 
      :key="option.id" 
      @click="store.currentItem=option.id" 
      :class="{selected:store.currentItem==option.id}">
        {{ option.title }}
      </div>
    </div>
    <!-- 教师信息 -->
    <div class="list" v-if="store.currentNav=='teacherInfo'">
      <div class="item" v-for="option in navOptions.teacherInfo" 
      :key="option.id" 
      @click="store.currentItem=option.id" 
      :class="{selected:store.currentItem==option.id}">
        {{ option.title }}
      </div>
    </div>
    <!-- 编辑试卷 -->
    <div class="list" v-if="store.currentNav=='edit'">
      <div class="item" v-for="paper in store.papers"
      :key="paper.id" 
      @click="store.currentPaperId=paper.id" 
      :class="{selected:store.currentPaperId==paper.id}">
        {{paper.title}}
      </div>
    </div>
    <!-- 查看结果 -->
    <div class="list" v-if="store.currentNav=='view'">
      <div class="item">
        查看结果
      </div>
    </div>
    <!-- 练习 -->
    <div class="list" v-if="store.currentNav=='exercise'">
      <div class="item">
        练习
      </div>
    </div>
    <!-- 考试 -->
    <div class="list" v-if="store.currentNav=='exam'">
      <div class="item">
        考试
      </div>
    </div>
    <!-- 成绩 -->
    <div class="list" v-if="store.currentNav=='score'">
      <div class="item">
        成绩
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
