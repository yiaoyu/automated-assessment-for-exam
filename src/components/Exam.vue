<script setup lang="ts">
  import { mainStore } from "../stores/main"
  import { reactive,watch,onBeforeMount,ref } from "vue"
  import type * as entity from "../stores/entity"
  const store = mainStore()
  const exceedTimes = ref(false)//答题是否超过次数
  onBeforeMount(() => {
    getlocalExam()
  })
  watch(() => store.currentPaperId, (pid) => {
    store.getAllquestion(pid)
  });
  //展示题目的要求，分数，类型，以及序号
  function questionHead(index:number){
    let type = ""
    switch(store.questions[index].type){
      case 'choice':
        if(store.questions[index].answerOBJ.model=='radio'){
          type='(单选题) '
        }else{
          type='(多选题) '
        }
        break;
      case 'blank':type='(填空题) ';break;
      case 'code':type='(编程题) ';break;
    }
    return (index+1)+'.'+type+store.questions[index].description+' ('+store.questions[index].score+'分)'
  }
  //获取本地保存内容
  function getlocalExam(){
    if(store.currentAnswers.length==0){
      if(localStorage.getItem('currentExam')!=null){
        store.currentExam = JSON.parse(localStorage.getItem('currentExam')!)
        store.currentAnswers.push(...JSON.parse(localStorage.getItem('currentAnswers')!))
        store.currentPaperId = store.currentExam.pid
        store.StringToOBJ()
        store.hasCreatedAnswer=true
      }
    }
  }

  //保存内容到本地
  function saveExam(){
    store.OBJToString()
    localStorage.setItem('currentExam',JSON.stringify(store.currentExam))
    localStorage.setItem('currentAnswers',JSON.stringify(store.currentAnswers))
    window.alert("试卷已保存！")
  }

  //开始考试
  async function startExam(paperId:number){
    console.log("startExam()")
    await checkTimes(paperId)
    if(exceedTimes.value){
      window.alert("已经超过考试次数!")
    }else{
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
          comment:"",
          answerOBJ:createAnswerOBJ(i)
        }
        store.currentAnswers.push(answer)
      }
      await createExam()
      store.hasCreatedAnswer=true
    }
  }
  //根据题目类型创建每个题目的回答框架
  function createAnswerOBJ(index:number){
    switch(store.questions[index].type){
      case 'choice':
        let choices = []
        for(let i=0;i<store.questions[index].answerOBJ.trueAnswers.length;i++){
          choices.push(false)
        }
        return choices
      case 'blank':
        let blanks = []
        for(let i=0;i<store.questions[index].answerOBJ.trueAnswers.length;i++){
          blanks.push("")
        }
        return blanks
      case 'code':
        let code:string = store.questions[index].answerOBJ.frame
        return code
    }
  }
  //检测剩余次数
  async function checkTimes(paperId:number){
    console.log("checkTimes()")
    //获取该学生参加了几次测试
    await fetch(`/api/getexambysidpid`,{
      method: 'post', 
      headers: new Headers({
        'Authorization': localStorage.getItem("token")!,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        sid:store.userId,
        pid:paperId
      })
    }).then(async v=>{
      return v.json()
    }).then(async v=>{//箭头函数使用async/await
      switch(v.msg){
        case "success":
          if(store.papers[store.getPaperPage(paperId)].maxTimes! == 0){
            //无次数限制
            store.currentExam.times = v.data[0].times + 1
            await deleteLastExam(store.userId,paperId)
            exceedTimes.value = false
            return
          }
          if(store.papers[store.getPaperPage(paperId)].type == 'exercise'){
            //练习模式
            store.currentExam.times = v.data[0].times + 1
            await deleteLastExam(store.userId,paperId)
            exceedTimes.value = false
            return
          }
          if(v.data.length==0){
            //初次做题
            store.currentExam.times = 1
            exceedTimes.value = false
            return
          }
          if(v.data[0].times < store.papers[store.getPaperPage(paperId)].maxTimes!){
            //次数不超过上限
            store.currentExam.times = v.data[0].times + 1
            await deleteLastExam(store.userId,paperId)
            exceedTimes.value = false
            return
          }else{
            //次数超过上限
            exceedTimes.value = true
            return
          }
        case "fail":
          window.alert(v.msg)
          return
        default: window.alert(v)
      }
    }).catch(err=>{
      console.log(err)
    })
  }

  //清除上一次考试数据
  async function deleteLastExam(sid:number,pid:number){
    console.log("deleteLastExam()")
    // 清除上次考试内容
    await fetch(`/api/removeexam`,{
      method: 'post', 
      headers: new Headers({
        'Authorization': localStorage.getItem("token")!,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        sid:sid,
        pid:pid
      })
    }).then(async v=>{
      return v.json()
    }).then(async v=>{
      switch(v.msg){
        case "success":
          console.log("examRemoved!")
          break
        case "fail":
          window.alert("删除上次考试信息失败")
          return
        default: 
          window.alert(v)
          return
      }
    }).catch(err=>{
      console.log(err)
    })

    // 清除上次试题
    await fetch(`/api/removeanswer`,{
      method: 'post', 
      headers: new Headers({
        'Authorization': localStorage.getItem("token")!,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        sid:sid,
        pid:pid
      })
    }).then(async v=>{
      return v.json()
    }).then(async v=>{
      switch(v.msg){
        case "success":
          console.log("answerRemoved!")
          break
        case "fail":
          window.alert("删除上次考试信息失败")
          return
        default: 
          window.alert(v)
          return
      }
    }).catch(err=>{
      console.log(err)
    })
  }

  //建立考试数据
  async function createExam(){
    console.log("createExam()")
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
        times:store.currentExam.times
      })
    }).then(async v=>{
      return v.json()
    }).then(async v=>{
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
  }

  //提交考试
  async function submitExam(){
    console.log("submitExam()")
    store.OBJToString()
    // 添加结束时间
    store.currentExam.finishTime = store.getDateTime()
    // 上传考试信息
    await fetch(`/api/changeexam`,{
      method: 'post', 
      headers: new Headers({
        'Authorization': localStorage.getItem("token")!,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        startTime:store.currentExam.startTime,
        finishTime:store.currentExam.finishTime,
        score:store.currentExam.score,
        public:store.currentExam.public,
        times:store.currentExam.times,
        sid:store.currentExam.sid,
        pid:store.currentExam.pid,
      })
    }).then(v=>{
      return v.json()
    }).then(v=>{
      switch(v.msg){
        case "success":
          break
        case "fail":
          window.alert("提交考试失败")
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
            return
          default: 
            console.log(v)
            return
        }
      }).catch(err=>{
        console.log(err)
      })
    }
    window.alert("提交考试成功！")
    //清除数据
    localStorage.removeItem('currentExam')
    localStorage.removeItem('currentAnswers')
    //store.currentAnswers = [] 会破坏响应式！！！
    //store.currentAnswers = [] 会破坏响应式！！！
    //store.currentAnswers = [] 会破坏响应式！！！
    store.currentAnswers.length = 0
    store.currentExam = {
      sid:0,
      pid:0,
      startTime:"",
      finishTime:"",
      score:0,
      public:"yes",
      times:0
    }
    store.currentPaperId = -1
    store.hasCreatedAnswer = false
  }
</script>

<template>
  <div class="edit-paper-container" v-if="store.currentPaperId!=-1">
    <div class="header" v-if="store.currentPaperId!=0">
      <h1 class="header-title">{{ store.papers[store.getPaperPage(store.currentPaperId)].title }}</h1>
      <h3 class="header-time-limit">考试时长：{{ store.papers[store.getPaperPage(store.currentPaperId)].timeLimit }}</h3>
      <div class="header-info">{{ store.papers[store.getPaperPage(store.currentPaperId)].description }}</div>
      <button @click="startExam(store.currentPaperId)" 
      :disabled="store.currentExam.pid!=0">
      开始作答
      </button>
    </div>
    <div class="exam" v-if="store.papers[store.getPaperPage(store.currentPaperId)].id==store.currentExam.pid&&store.hasCreatedAnswer">
      <div class="paper">
        <template v-for="question,index in store.questions" :key="question.id">
          <div class="question">
            <div class="question-head">
              <span>{{ questionHead(index) }}</span>
            </div>
            <!-- 选择题 -->
            <div class="answer-container" v-if="question.currentAnswerType=='choice'">
              <div v-for="_,i in store.questions[index].answerOBJ.choices">
                <span>{{ store.questions[index].answerOBJ.choices[i] }}</span>
                <input type="checkbox" v-model="store.currentAnswers[index].answerOBJ[i]">
              </div>
            </div>
            <!-- 填空题 -->
            <div class="answer-container" v-if="question.currentAnswerType=='blank'">
              <div v-for="_,i in store.currentAnswers[index].answerOBJ">
                <span>{{ '('+(i+1)+')' }}</span>
                <input class="blank-input" type="text" v-model="store.currentAnswers[index].answerOBJ[i]">
              </div>
            </div>
            <!-- 编程题 -->
            <div class="answer-container" v-if="question.currentAnswerType=='code'">
              <textarea class="code-input" v-model="store.currentAnswers[index].answerOBJ"></textarea>
            </div>
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
          .answer-container{
            .blank-input{
              background-color: azure;
            }
            .code-input{
              width: 20rem;
              height: 12rem;
            }
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