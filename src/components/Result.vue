<script setup lang="ts">
  import { mainStore } from "../stores/main"
  import { reactive,watch,onBeforeMount } from "vue"
  const store = mainStore()
  onBeforeMount(() => {
    getAllResult()
  })
  watch(() => store.currentPaperId, (pid) => {
    store.getAllquestion(pid)
    store.getAnswers(store.userId,pid)
  });
  // 获取考试结果
  function getAllResult(){
    store.exams.length = 0
    fetch(`/api/getexambysid`,{
      method: 'post', 
      headers: new Headers({
        'Authorization': localStorage.getItem("token")!,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        sid:store.userId
      })
    }).then(v=>{
      return v.json()
    }).then(v=>{
      switch(v.msg){
        case "success":
          store.exams.push(...v.data)
          break
        case "fail":
          window.alert("获取考试结果失败")
          break
        default: window.alert(v)
      }
    }).catch(err=>{
      console.log(err)
    })
  }
  //获取学生的考试结果
  function getAllPaper(){
    fetch(`/api/`,{
      method: 'post', 
      headers: new Headers({
        'Authorization': localStorage.getItem("token")!,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
      })
    }).then(v=>{
      return v.json()
    }).then(v=>{
      switch(v.msg){
        case "success":
          break
        case "fail":
          window.alert("")
          break
        default: window.alert(v)
      }
    }).catch(err=>{
      console.log(err)
    })
  }
</script>

<template>
  <div class="result-container" >
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
  
</style>