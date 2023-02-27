<script setup lang="ts">
  import { mainStore } from "../stores/main"
  import { reactive,watch,onBeforeMount } from "vue"
  import type * as entity from "../stores/entity"
  const store = mainStore()
  onBeforeMount(() => {
    getlocalExam()
  })
  watch(() => store.currentPaperId, (pid) => {
    store.getAllquestion(pid)
  });
  //获取本地保存内容
  function getlocalExam(){
    if(store.currentAnswers.length==0){
      if(localStorage.getItem('currentExam')!=null){
        store.currentExam = JSON.parse(localStorage.getItem('currentExam')!)
        store.currentAnswers.push(...JSON.parse(localStorage.getItem('currentAnswers')!))
        store.currentPaperId = store.currentExam.pid
        store.hasCreatedAnswer=true
        // console.log(store.currentExam)
        // console.log(store.currentAnswers)
      }
    }
  }
  //开始考试
  function startExam(paperId:number){
    store.currentExam.pid = paperId
    store.currentExam.sid = store.userId
    store.currentExam.startTime = store.getDateTime()
    for(let i=0;i<store.questions.length;i++){
      let answer:entity.answer = {
        sid:store.userId,
        pid:paperId,
        qid:store.questions[i].id,
        answer:"",
        score:0,
        comment:""
      }
      store.currentAnswers.push(answer)
    }
    // console.log(store.currentExam)
    // console.log(store.currentAnswers)
    store.hasCreatedAnswer=true
  }
  //保存内容到本地
  function saveExam(){
    localStorage.setItem('currentExam',JSON.stringify(store.currentExam))
    localStorage.setItem('currentAnswers',JSON.stringify(store.currentAnswers))
    window.alert("试卷已保存！")
  }
  //提交考试
  async function submitExam(){
    // 添加结束时间
    store.currentExam.finishTime = store.getDateTime()
    // 上传考试信息
    await fetch(`/api/addexam`,{
      method: 'post', 
      headers: new Headers({
        'Authorization': localStorage.getItem("token")!,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        sid:store.currentExam.sid,
        pid:store.currentExam.pid,
        startTime:store.currentExam.startTime,
        finishTime:store.currentExam.finishTime
      })
    }).then(v=>{
      return v.json()
    }).then(v=>{
      switch(v.msg){
        case "success":
          break
        case "fail":
          window.alert("创建考试失败")
          return
        default: 
          window.alert(v)
          return
      }
    }).catch(err=>{
      console.log(err)
    })
    //上传answers
    for(let i=0;i<store.currentAnswers.length;i++){
      await fetch(`/api/addanswer`,{
        method: 'post', 
        headers: new Headers({
          'Authorization': localStorage.getItem("token")!,
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          sid:store.currentAnswers[i].sid,
          pid:store.currentAnswers[i].pid,
          qid:store.currentAnswers[i].qid,
          answer:store.currentAnswers[i].answer,
          score:store.currentAnswers[i].score,
          comment:store.currentAnswers[i].comment,
        })
      }).then(v=>{
        return v.json()
      }).then(v=>{
        switch(v.msg){
          case "success":
            break
          case "fail":
            console.log("提交考试失败")
            break
          default: console.log(v)
        }
      }).catch(err=>{
        console.log(err)
      })
    }
    window.alert("提交考试成功！")
    localStorage.removeItem('currentExam')
    localStorage.removeItem('currentAnswers')
    store.currentAnswers = []
    store.currentExam = {
      sid:0,
      pid:0,
      startTime:"",
      finishTime:"",
    }
    store.currentPaperId = 0
  }
</script>

<template>
  <div class="edit-paper-container">
    <div class="header" v-if="store.currentPaperId!=0">
      <h1 class="header-title">{{ store.papers[store.getPaperPage(store.currentPaperId)].title }}</h1>
      <h3 class="header-time-limit">考试时长：{{ store.papers[store.getPaperPage(store.currentPaperId)].timeLimit }}</h3>
      <div class="header-info">考试须知 请给数据库添加description字段!</div>
      <button @click="startExam(store.currentPaperId)" 
      :disabled="store.currentExam.pid!=0">
      开始作答
      </button>
    </div>
    <div class="exam" v-if="store.papers[store.getPaperPage(store.currentPaperId)].id==store.currentExam.pid&&store.hasCreatedAnswer">
      <div class="paper">
        <template v-for="question in store.questions" :key="question.id">
          <div class="question">
            <div class="description">
              {{ question.description }}
            </div>
            <input type="text" v-model="store.currentAnswers[store.getCurrentAnswer(question.id)].answer" class="answer">
            <hr/>
          </div>
        </template>
      </div>
      <div class="footer">
        <button class="save-btn" @click="saveExam()">保存试卷</button>
        <button class="submit-btn" @click="submitExam()">提交试卷</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  @import "../assets/base.less";
  .edit-paper-container{
    .header{
      display: flex;
      flex-direction: column;
      align-items: center;
    };
    .exam{
      .paper{
        .question{
          padding: 1rem;
          .description{
            padding-bottom: 1rem;
          }
          .answer{
            background-color: #ffffff;
          }
        }
      }
      .footer{
        display: flex;
        justify-content: center;
        button{
          height: 3rem;
          width: 8rem;
        }
        .delete-btn{
          background-color: @warning-color-light;
        }
        .delete-btn:hover{
          background-color: @warning-color;
        }
      };
    }
  }
</style>