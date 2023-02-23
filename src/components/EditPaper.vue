<script setup lang="ts">
  import { mainStore } from "../stores/main"
  import { ref,watch } from "vue"
  const store = mainStore()
  watch(() => store.currentItem, (n) => {
    store.getAllquestion(n)
  });
  //查找对应的页面
  function getPaperPage(id:number):number{
    for (let i = 0; i < store.papers.length; i++) {
      if(store.papers[i].id == store.currentPaperId){
        return i
      }
    }
    return 0
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
          //title=?,releaseTime=?,timeLimit=?,type=? WHERE id=?;
          title:store.papers[getPaperPage(store.currentPaperId)].title,
          releaseTime:store.papers[getPaperPage(store.currentPaperId)].releaseTime,
          timeLimit:store.papers[getPaperPage(store.currentPaperId)].timeLimit,
          type:store.papers[getPaperPage(store.currentPaperId)].type,
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
      <div>{{store.papers[getPaperPage(store.currentPaperId)].id}}</div>
    </div>
    <div class="paper-setting">
      <div>出题人编号：</div>
      <div>{{store.papers[getPaperPage(store.currentPaperId)].tid}}</div>
    </div>
    <div class="paper-setting">
      <div>试卷题目</div>
      <input type="text" v-model="store.papers[getPaperPage(store.currentPaperId)].title">
    </div>
    <div class="paper-setting">
      <div>发布时间</div>
      <input type="text" v-model="store.papers[getPaperPage(store.currentPaperId)].releaseTime">
    </div>
    <div class="paper-setting">
      <div>时间限制</div>
      <input type="text" v-model="store.papers[getPaperPage(store.currentPaperId)].timeLimit">
    </div>
    <div class="paper-setting">
      <div>类型</div>
      <input type="radio" id="exam" value="exam" v-model="store.papers[getPaperPage(store.currentPaperId)].type"/>
      <label for="exam">考试</label>
      <input type="radio" id="exercise" value="exercise" v-model="store.papers[getPaperPage(store.currentPaperId)].type" />
      <label for="exercise">练习</label>
    </div>
    <button @click="removePaper">删除试卷</button>
    <button @click="changePaper">保存试卷信息</button>
    <button @click="">增加题目</button>
    <button @click="">保存修改</button>
  </div>
</template>

<style scoped lang="less">
  @import "../assets/base.less";
  
</style>