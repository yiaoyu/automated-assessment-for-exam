<script setup lang="ts">
  import { mainStore } from "../stores/main"
  import { reactive,watch } from "vue"
  import * as entity from "../stores/entity"
  const store = mainStore()
  //切换试卷时修改题目
  watch(() => store.currentPaperId, (pid) => {
    store.getAllquestion(pid)
  });
  //增加标准答案对象
  function addAnswerOBJ(index:number,type:string){
    switch(type){
      case 'choice':
        store.questions[index].answerOBJ = new entity.Choice('radio',['A.','B.','C.','D.'],[true,false,false,false],0);
        break;
      case 'blank':
        store.questions[index].answerOBJ = new entity.Blank([[""]],[0]);
        break;
      case 'code':
        store.questions[index].answerOBJ = new entity.Code(["text"],[""],[""],[0])
        break;
    }
  }
  //增加和减少选项
  function addChoice(i:number){
    store.questions[i].answerOBJ.choices.push("")
    store.questions[i].answerOBJ.trueAnswers.push(false)
  }
  function removeChoice(i:number){
    store.questions[i].answerOBJ.choices.pop()
    store.questions[i].answerOBJ.trueAnswers.pop()
  }
  //增加和减少填空
  function addBlank(i:number){
    store.questions[i].answerOBJ.trueAnswers.push([""])
    store.questions[i].answerOBJ.scores.push(0)
  }
  function removeBlank(i:number){
    store.questions[i].answerOBJ.trueAnswers.pop()
    store.questions[i].answerOBJ.scores.pop()
  }
  //增加和减少填空中可供匹配的答案数量
  function addBlankAnswer(i:number,j:number){
    store.questions[i].answerOBJ.trueAnswers[j].push("")
  }
  function removeBlankAnswer(i:number,j:number){
    store.questions[i].answerOBJ.trueAnswers[j].pop()
  }
  //增加和减少代码检测块
  function addCodeCheck(i:number){
    store.questions[i].answerOBJ.modules.push("text")
    store.questions[i].answerOBJ.scores.push(0)
    store.questions[i].answerOBJ.trueAnswers.push("")
    store.questions[i].answerOBJ.comments.push("")
  }
  function removeCodeCheck(i:number){
    store.questions[i].answerOBJ.modules.pop()
    store.questions[i].answerOBJ.scores.pop()
    store.questions[i].answerOBJ.trueAnswers.pop()
    store.questions[i].answerOBJ.comments.pop()
  }
  //保存修改 *需要添加事务*
  async function saveAllQuestion(){
    store.OBJToAnswer()
    for(let i=0;i<store.questions.length;i++){
      await fetch(`/api/changequestion`,{
        method: 'post', 
        headers: new Headers({
          'Authorization': localStorage.getItem("token")!,
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          description:store.questions[i].description,
          type:store.questions[i].type,
          answer:store.questions[i].answer,
          score:store.questions[i].score,
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
  }
  //删除题目
  function removeQuestion(id:number){
    saveAllQuestion()
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
    saveAllQuestion()
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
        type:"choice",
        answer:"",
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
      <div>试卷类型</div>
      <input type="radio" id="exam" value="exam" v-model="store.papers[store.getPaperPage(store.currentPaperId)].type"/>
      <label for="exam">考试</label>
      <input type="radio" id="exercise" value="exercise" v-model="store.papers[store.getPaperPage(store.currentPaperId)].type" />
      <label for="exercise">练习</label>
    </div>
    <button @click="removePaper">删除试卷</button>
    <button @click="changePaper">保存试卷信息</button>
    <div class="question-container" >
      <div v-for="question,index in store.questions">
        <div>
          <div>题号</div>
          <div>{{question.id}}</div>
        </div>
        <div>
          <div>试卷号</div>
          <div>{{question.pid}}</div>
        </div>
        <div>
          <div>该题分数</div>
          <input type="number" v-model="question.score">
        </div>
        <div>
          <div>题目类型</div>
          <select v-model="question.type" @change="addAnswerOBJ(index,question.type)">
            <option value="choice">选择题</option>
            <option value="blank">填空题</option>
            <option value="code">编程题</option>
          </select>
        </div>
        <div>
          <div>题干：</div>
          <textarea v-model="question.description" @keydown.tab.prevent="store.onTab"></textarea>
        </div>
        <div class="choice-container" v-if="question.type=='choice'&&store.questions[index].answerOBJ !== undefined">
          <div>选择题</div>
          <div v-for="_,i in store.questions[index].answerOBJ.choices">
            <input type="text" v-model="store.questions[index].answerOBJ.choices[i]">
            <input type="checkbox" v-model="store.questions[index].answerOBJ.trueAnswers[i]">
          </div>
          <button @click="addChoice(index)">增加选项</button>
          <button @click="removeChoice(index)">减少选项</button>
          <div>
            <span>选不全得分:</span>
            <input type="number" v-model="store.questions[index].answerOBJ.scorePart">
          </div>
        </div>
        <div class="blank-container" v-if="question.type=='blank'&&store.questions[index].answerOBJ !== undefined">
          <div>填空题</div>
          <div v-for="_,i in store.questions[index].answerOBJ.trueAnswers">
            <span>分数：</span>
            <input class="blank-score" type="number" v-model="store.questions[index].answerOBJ.scores[i]">
            <span>正确答案：</span>
            <div v-for="_,j in store.questions[index].answerOBJ.trueAnswers[i]" class="blank-input-container">
              <input class="blank-input" type="text" v-model="store.questions[index].answerOBJ.trueAnswers[i][j]">
            </div>
            <button class="blank-answer-btn" @click="addBlankAnswer(index,i)">+</button>
            <button class="blank-answer-btn" @click="removeBlankAnswer(index,i)">-</button>
          </div>
          <button class="blank-btn" @click="addBlank(index)">增加选项</button>
          <button class="blank-btn" @click="removeBlank(index)">减少选项</button>
        </div>
        <div class="code-container" v-if="question.type=='code'&&store.questions[index].answerOBJ !== undefined">
          <div>编程题</div>
          <div v-for="_,i in store.questions[index].answerOBJ.trueAnswers">
            <span>类型选择：</span>
            <select v-model="store.questions[index].answerOBJ.modules[i]">
              <option value="text">文本匹配</option>
              <option value="reg">正则表达式</option>
              <option value="ast">抽象语法树</option>
            </select>
            <span>分数：</span>
            <input class="blank-score" type="number" v-model="store.questions[index].answerOBJ.scores[i]">
            <span>错误提示：</span>
            <input type="text" v-model="store.questions[index].answerOBJ.comments[i]">
            <div>输入检测内容：</div>
            <textarea v-model="store.questions[index].answerOBJ.trueAnswers[i]" @keydown.tab.prevent="store.onTab"></textarea>
          </div>
          <button class="blank-btn" @click="addCodeCheck(index)">增加检测</button>
          <button class="blank-btn" @click="removeCodeCheck(index)">减少检测</button>
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
  .blank-input-container{
    display: inline;
  }
  .blank-input{
    display: inline;
    background-color: azure;
  }
  .blank-score{
    display: inline;
    width: 3rem;
    background-color: azure;
  }
  .blank-answer-btn{
    display: inline;
    width: 1rem;
  }
</style>