<script setup lang="ts">
  import type * as entity from "../stores/entity"
  import { mainStore } from "../stores/main"
  import { ref,reactive,watch } from "vue"
  const store = mainStore()
  const studentExams:entity.exam[] = reactive([]) 
  watch(() => store.currentPaperId, (pid) => {
    store.currentStudentId = 0
    studentExams.length = 0
    store.studentAnswers.length = 0
    store.getAllquestion(pid)
    getExamByPid(pid)
  });
  //获取全部提交考试的学生
  function getExamByPid(pid:number){
    fetch(`/api/getexambypid`,{
      method: 'post', 
      headers: new Headers({
        'Authorization': localStorage.getItem("token")!,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        pid:pid
      })
    }).then(v=>{
      return v.json()
    }).then(v=>{
      switch(v.msg){
        case "success":
          studentExams.length=0
          studentExams.push(...v.data)
          break
        case "fail":
          window.alert(v.msg)
          break
        default: window.alert(v)
      }
    }).catch(err=>{
      console.log(err)
    })
  }
  //公布考试结果
  function publishExam(){
    if(window.confirm("是否公布考试结果?")){
      fetch(`/api/publishexam`,{
        method: 'post', 
        headers: new Headers({
          'Authorization': localStorage.getItem("token")!,
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          public:"yes",
          pid:store.currentPaperId
        })
      }).then(v=>{
        return v.json()
      }).then(v=>{
        switch(v.msg){
          case "success":
            window.alert("成绩已公布")
            break
          case "fail":
            window.alert("成绩公布失败")
            break
          default: window.alert(v)
        }
      }).catch(err=>{
        console.log(err)
      })
    }
  }
</script>

<template>
  <div class="student-nav">
    <template v-for="exam in studentExams">
      <div @click="store.getAnswers(exam.sid,exam.pid)" class="item" :class="{selected:exam.sid==store.currentStudentId}">
        {{ exam.name }}
      </div>
    </template>
    <button v-if="store.currentPaperId!=0" @click="publishExam()">公布考试结果</button>
  </div>
  <div class="review-container">
    <div v-for="(answer, index) in store.studentAnswers">
      <div>
        {{ store.questions[index].description }}
      </div>
      <div>
        {{ answer.answer }}
      </div>
      <hr/>
    </div>
  </div>
</template>

<style scoped lang="less">
  @import "../assets/base.less";
  .student-nav{
    width: 16rem;
    min-height: 50rem;
    background-color: @background-color-silver-light;
    position: absolute;
    top: 4rem;
    left: 24rem;
    .item{
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      padding-left: 0.5rem;
    }
    .item:hover{
      cursor: pointer;
      background-color: @sec-color-hover;
    }
    .selected{
      cursor: pointer;
      background-color: @sec-color;
    }
    .selected:hover{
      cursor: pointer;
      background-color: @sec-color;
    }
  }
  .review-container{
    margin-left: 16rem;
    min-height: 50rem;
    background-color: @background-color;
  }
</style>