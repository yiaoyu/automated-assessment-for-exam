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
    <button v-if="store.currentNav=='edit'" @click="addPaper" class="add-btn">增加新试卷</button>
    <!-- 学生信息 -->
    <div class="list" v-if="store.currentNav=='studentInfo'">
      <div class="items" v-for="option in navOptions.studentInfo" 
      :key="option.id" 
      @click="store.currentItem=option.id">
        <div class="item" :class="{selected:store.currentPaperId==option.id}">
          {{ option.title }}
        </div>
      </div>
    </div>
    <!-- 教师信息 -->
    <div class="list" v-if="store.currentNav=='teacherInfo'">
      <div class="items" v-for="option in navOptions.teacherInfo" 
      :key="option.id" 
      @click="store.currentItem=option.id">
        <div class="item" :class="{selected:store.currentPaperId==option.id}">
          {{ option.title }}
        </div>
      </div>
    </div>
    <!-- 编辑试卷 -->
    <div class="list" v-if="store.currentNav=='edit'">
      <div class="items" v-for="paper in store.papers"
      :key="paper.id" 
      @click="store.currentPaperId=paper.id">
        <div class="item" :class="{selected:store.currentPaperId==paper.id}">
          {{ paper.title }}
        </div>
      </div>
    </div>
    <!-- 查看结果 -->
    <div class="list" v-if="store.currentNav=='review'">
      <div class="items" v-for="paper in store.papers"
      :key="paper.id" 
      @click="store.currentPaperId=paper.id">
        <div class="item" :class="{selected:store.currentPaperId==paper.id}">
          {{ paper.title }}
        </div>
      </div>
    </div>
    <!-- 练习 -->
    <div class="list" v-if="store.currentNav=='exercise'">
      <div class="items" v-for="paper in store.papers"
      :key="paper.id"
      @click="store.currentPaperId=paper.id">
        <div v-if="paper.type=='exercise'&&paper.closed !== 'true'" class="item" :class="{selected:store.currentPaperId==paper.id}">
          {{paper.title}}
        </div>
      </div>
    </div>
    <!-- 考试 -->
    <div class="list" v-if="store.currentNav=='exam'">
      <div class="items" v-for="paper in store.papers"
      :key="paper.id"
      @click="store.currentPaperId=paper.id"
      :class="{selected:store.currentPaperId==paper.id}">
        <div v-if="paper.type=='exam'&&paper.closed !== 'true'" class="item" :class="{selected:store.currentPaperId==paper.id}">
          {{paper.title}}
        </div>
      </div>
    </div>
    <!-- 成绩 -->
    <div class="list" v-if="store.currentNav=='result'">
      <div class="items" v-for="exam in store.exams"
      :key="exam.pid"
      @click="store.currentPaperId=exam.pid"
      :class="{selected:store.currentPaperId==exam.pid}">
        <div v-if="exam.public=='yes'" class="item" :class="{selected:store.currentPaperId==exam.pid}">
          {{exam.title}}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  @import "../assets/base.less";
  .nav-bar{
    min-height: 36rem;
    height: 100%;
    width: 24rem;
    background-color: @background-color-silver;
    box-shadow: 0 2px 4px rgba(0,0,0,0.12), 0 2px 3px rgba(0,0,0,0.24);
    position: absolute;
    z-index: 2;
    top: 4rem;
    #nav-search{
      background-color: @input-background-color;
      width:24rem;
      padding: 1rem;
    }
    .add-btn{
      height: 3rem;
    }
    .list{
      display: flex;
      flex-direction: column;
      .items{
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
  }
</style>
