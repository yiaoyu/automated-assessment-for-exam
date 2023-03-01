<script setup lang="ts">
  import { mainStore } from "../stores/main"
  import { reactive,watch } from "vue"
  const store = mainStore()
  watch(() => store.currentPaperId, (pid) => {
    store.getAllquestion(pid)
  });
  //保存修改 *需要添加事务*
  function saveAllQuestion(){
    for(let i=0;i<store.questions.length;i++){
      fetch(`/api/changequestion`,{
        method: 'post', 
        headers: new Headers({
          'Authorization': localStorage.getItem("token")!,
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          description:store.questions[i].description,
          type:store.questions[i].type,
          answer:store.questions[i].answer,
          id:store.questions[i].id
        })
      }).then(v=>{
        return v.json()
      }).then(v=>{
        switch(v.msg){
          case "success":
            break
          case "fail":
            window.alert(v)
            break
          default: window.alert(v)
        }
      }).catch(err=>{
        console.log(err)
      })
    }
    store.getAllquestion(store.currentPaperId)
  }
  //删除题目
  function removeQuestion(id:number){
    fetch(`/api/removequestion`,{
      method: 'post', 
      headers: new Headers({
        'Authorization': localStorage.getItem("token")!,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        id:id
      })
    }).then(v=>{
      return v.json()
    }).then(v=>{
      switch(v.msg){
        case "success":
          store.getAllquestion(store.currentPaperId)
          break
        case "fail":
          window.alert(v)
          break
        default: window.alert(v)
      }
    }).catch(err=>{
      console.log(err)
    })
  }
  //增加题目
  function addQuestion(){
    fetch(`/api/addquestion`,{
      method: 'post', 
      headers: new Headers({
        'Authorization': localStorage.getItem("token")!,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        //pid,description,type,answer
        pid:store.currentPaperId,
        description:"",
        type:"select",
        answer:""
      })
    }).then(v=>{
      return v.json()
    }).then(v=>{
      switch(v.msg){
        case "success":
          store.getAllquestion(store.currentPaperId)
          break
        case "fail":
          window.alert(v)
          break
        default: window.alert(v)
      }
    }).catch(err=>{
      console.log(err)
    })
  }
  //删除试卷
  function removePaper(){
    if(window.confirm("是否删除试卷?")){
      fetch(`/api/removepaper`,{
        method: 'post', 
        headers: new Headers({
          'Authorization': localStorage.getItem("token")!,
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          id:store.currentPaperId
        })
      }).then(v=>{
        return v.json()
      }).then(v=>{
        switch(v.msg){
          case "success":
            store.getAllPaper()
            break
          case "fail":
            window.alert("删除失败")
            break
          default: window.alert(v)
        }
      }).catch(err=>{
        console.log(err)
      })
    }
  }
  //更新试卷信息
  function changePaper(){
    if(window.confirm("是否确认修改试卷信息?")){
      fetch(`/api/changepaper`,{
        method: 'post', 
        headers: new Headers({
          'Authorization': localStorage.getItem("token")!,
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          title:store.papers[store.getPaperPage(store.currentPaperId)].title,
          releaseTime:store.papers[store.getPaperPage(store.currentPaperId)].releaseTime,
          timeLimit:store.papers[store.getPaperPage(store.currentPaperId)].timeLimit,
          type:store.papers[store.getPaperPage(store.currentPaperId)].type,
          maxTimes:store.papers[store.getPaperPage(store.currentPaperId)].maxTimes,
          id:store.currentPaperId
        })
      }).then(v=>{
        return v.json()
      }).then(v=>{
        switch(v.msg){
          case "success":
            store.getAllPaper()
            break
          case "fail":
            window.alert("删除失败")
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
  <div class="edit-paper-container">
    <h1>edit-paper</h1>
    <div class="paper-setting">
      <div>试卷编号：</div>
      <div>{{store.papers[store.getPaperPage(store.currentPaperId)].id}}</div>
    </div>
    <div class="paper-setting">
      <div>出题人编号：</div>
      <div>{{store.papers[store.getPaperPage(store.currentPaperId)].tid}}</div>
    </div>
    <div class="paper-setting">
      <div>试卷题目</div>
      <input type="text" v-model="store.papers[store.getPaperPage(store.currentPaperId)].title">
    </div>
    <div class="paper-setting">
      <div>发布时间</div>
      <input type="text" v-model="store.papers[store.getPaperPage(store.currentPaperId)].releaseTime">
    </div>
    <div class="paper-setting">
      <div>时间限制</div>
      <input type="text" v-model="store.papers[store.getPaperPage(store.currentPaperId)].timeLimit">
    </div>
    <div class="paper-setting">
      <div>次数限制</div>
      <input type="text" v-model="store.papers[store.getPaperPage(store.currentPaperId)].maxTimes">
    </div>
    <div class="paper-setting">
      <div>类型</div>
      <input type="radio" id="exam" value="exam" v-model="store.papers[store.getPaperPage(store.currentPaperId)].type"/>
      <label for="exam">考试</label>
      <input type="radio" id="exercise" value="exercise" v-model="store.papers[store.getPaperPage(store.currentPaperId)].type" />
      <label for="exercise">练习</label>
    </div>
    <button @click="removePaper">删除试卷</button>
    <button @click="changePaper">保存试卷信息</button>
    <div class="question-container" >
      <div v-for="question in store.questions">
        <div>
          <div>题号</div>
          <div>{{question.id}}</div>
        </div>
        <div>
          <div>试卷号</div>
          <div>{{question.pid}}</div>
        </div>
        <div>
          <div>题干：</div>
          <input type="text" v-model="question.description">
        </div>
        <div>
          <div>答案：</div>
          <input type="text" v-model="question.answer">
        </div>
        <div>
          <div>题目类型</div>
          <input type="radio" id="select" value="select" v-model="question.type"/>
          <label for="select">选择题</label>
          <input type="radio" id="blank" value="blank" v-model="question.type" />
          <label for="eblank">填空题</label>
        </div>
        <button @click="removeQuestion(question.id)">删除题目</button>
      </div>
    </div>
    <button @click="addQuestion">增加题目</button>
    <button @click="saveAllQuestion">保存修改</button>
  </div>
</template>

<style scoped lang="less">
  @import "../assets/base.less";
  
</style>