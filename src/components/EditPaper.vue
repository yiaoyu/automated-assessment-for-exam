<script setup lang="ts">
  import { mainStore } from "../stores/main"
  import { reactive,watch } from "vue"
  import * as entity from "../stores/entity"
  const store = mainStore()
  //切换试卷时修改题目
  watch(() => store.currentPaperId, (pid) => {
    if(store.currentPaperId != -1){
      store.getAllquestion(pid)
    }
  });
  function addAnswerOBJ(index:number,type:string){
    switch(type){
      case 'choice':
        store.questions[index].answerOBJ = new entity.Choice('',['A.','B.','C.','D.'],[false,false,false,false],0);
        store.questions[index].currentAnswerType = 'choice'
        break;
      case 'blank':
        store.questions[index].answerOBJ = new entity.Blank([[""]],[0]);
        store.questions[index].currentAnswerType = 'blank'
        break;
      case 'code':
        store.questions[index].answerOBJ = new entity.Code(["text"],[""],[""],[""],[0],"")
        store.questions[index].currentAnswerType = 'code'
        break;
    }
  }
  //选择题增加和减少选项
  function addChoice(i:number){
    store.questions[i].answerOBJ.choices.push("")
    store.questions[i].answerOBJ.trueAnswers.push(false)
  }
  function removeChoice(i:number){
    store.questions[i].answerOBJ.choices.pop()
    store.questions[i].answerOBJ.trueAnswers.pop()
  }
  //选择题自动配置选项类型
  function changeChoiceModel(index:number){
    let count = 0
    for(let i=0;i<store.questions[index].answerOBJ.trueAnswers.length;i++){
      if(store.questions[index].answerOBJ.trueAnswers[i]){
        count++
      }
    }
    if(count<=1){
      store.questions[index].answerOBJ.model = 'radio';
    }else if(store.questions[index].answerOBJ.scorePart!=0){
      store.questions[index].answerOBJ.model = 'mulitiPart'
    }else{
      store.questions[index].answerOBJ.model = 'multiAll'
    }
  }
  //选择题检测选不全分数不超高总分
  function choiceScoreLimit(index:number){
    if(store.questions[index].score < store.questions[index].answerOBJ.scorePart){
      window.alert("选不全得分不能超过总分数！")
      store.questions[index].answerOBJ.scorePart = store.questions[index].score
    }
  }
  //填空题增加和减少填空
  function addBlank(i:number){
    store.questions[i].answerOBJ.trueAnswers.push([""])
    store.questions[i].answerOBJ.scores.push(0)
  }
  function removeBlank(i:number){
    store.questions[i].answerOBJ.trueAnswers.pop()
    store.questions[i].answerOBJ.scores.pop()
    countScore(i)
  }
  //填空题增加和减少填空中可供匹配的答案数量
  function addBlankAnswer(i:number,j:number){
    store.questions[i].answerOBJ.trueAnswers[j].push("")
  }
  function removeBlankAnswer(i:number,j:number){
    store.questions[i].answerOBJ.trueAnswers[j].pop()
  }
  //编程题增加和减少代码检测块
  function addCodeCheck(i:number){
    store.questions[i].answerOBJ.modules.push("text")
    store.questions[i].answerOBJ.checks.push("")
    store.questions[i].answerOBJ.trueAnswers.push("")
    store.questions[i].answerOBJ.comments.push("")
    store.questions[i].answerOBJ.scores.push(0)
  }
  function removeCodeCheck(i:number){
    store.questions[i].answerOBJ.modules.pop()
    store.questions[i].answerOBJ.checks.pop()
    store.questions[i].answerOBJ.trueAnswers.pop()
    store.questions[i].answerOBJ.comments.pop()
    store.questions[i].answerOBJ.scores.pop()
    countScore(i)
  }
  //计算总分
  function countScore(index:number){
    store.questions[index].score = 0
    for(let i=0;i<store.questions[index].answerOBJ.scores.length;i++){
      store.questions[index].score+=store.questions[index].answerOBJ.scores[i]
    }
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
        type:"",
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
          description:store.papers[store.getPaperPage(store.currentPaperId)].description,
          closed:store.papers[store.getPaperPage(store.currentPaperId)].closed,
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
  //发布试卷
  function publish(){
    store.papers[store.getPaperPage(store.currentPaperId)].closed='false'
    //mysql东八区要再加8小时
    let date = new Date(+new Date() + 8 * 3600 * 1000)
    store.papers[store.getPaperPage(store.currentPaperId)].releaseTime=date.toISOString().slice(0,19).replace('T',' ')
    changePaper()
  }
  //结束考试
  function suppress(){
    store.papers[store.getPaperPage(store.currentPaperId)].closed='true'
    changePaper()
  }
</script>

<template>
  <div class="edit-paper-container" v-if="store.currentPaperId!=-1">
    <div class="edit-console">
      <button @click="removePaper" class="delete">删除试卷</button>
      <button @click="changePaper">保存试卷信息</button>
      <button @click="addQuestion" v-if="store.papers[store.getPaperPage(store.currentPaperId)].releaseTime===null">增加题目</button>
      <button @click="saveAllQuestion">保存修改</button>
      <button @click="publish" v-if="store.papers[store.getPaperPage(store.currentPaperId)].closed==='true'||store.papers[store.getPaperPage(store.currentPaperId)].releaseTime === null">发布试卷</button>
      <button @click="suppress" v-if="store.papers[store.getPaperPage(store.currentPaperId)].closed==='false'" class="delete">结束考试</button>
    </div>
    <div class="paper-setting">
      <span>试卷编号：</span>
      <span>{{store.papers[store.getPaperPage(store.currentPaperId)].id}}</span>
    </div>
    <div class="paper-setting">
      <span>出题人编号：</span>
      <span>{{store.papers[store.getPaperPage(store.currentPaperId)].tid}}</span>
    </div>
    <div class="paper-setting">
      <span>试卷题目：</span>
      <input type="text" v-model="store.papers[store.getPaperPage(store.currentPaperId)].title">
    </div>
    <div class="paper-setting">
      <span>发布时间：</span>
      <span>{{ store.papers[store.getPaperPage(store.currentPaperId)].releaseTime }}</span>
    </div>
    <div class="paper-setting">
      <span>时间限制：</span>
      <input type="number" v-model="store.papers[store.getPaperPage(store.currentPaperId)].timeLimit">
    </div>
    <div class="paper-setting">
      <span>次数限制：</span>
      <input type="number" min="0" v-model="store.papers[store.getPaperPage(store.currentPaperId)].maxTimes">
    </div>
    <div class="paper-setting">
      <span>试卷类型：</span>
      <input type="radio" id="exam" value="exam" v-model="store.papers[store.getPaperPage(store.currentPaperId)].type"/>
      <label for="exam">考试</label>
      <input type="radio" id="exercise" value="exercise" v-model="store.papers[store.getPaperPage(store.currentPaperId)].type" />
      <label for="exercise">练习</label>
    </div>
    <div class="paper-setting">
      <div>试卷头：</div>
      <textarea v-model="store.papers[store.getPaperPage(store.currentPaperId)].description"></textarea>
    </div>
    <!-- 当前试卷未发布 -->
    <!-- 第一次发布之后无法改变题目数量 -->
    <!-- 第一次发布之后无法改变题目类型 -->
    <div class="question-container">
      <div v-for="question,index in store.questions">
        <hr/>
        <span class="question-setting">
          <span>题号：</span>
          <span>{{question.id}}</span>
        </span>
        <span class="question-setting">
          <span>试卷号：</span>
          <span>{{question.pid}}</span>
        </span>
        <span class="question-setting">
          <span>该题分数：</span>
          <span>{{ question.score }}</span>
        </span>
        <span class="question-setting">
          <button @click="removeQuestion(question.id)" v-if="store.papers[store.getPaperPage(store.currentPaperId)].releaseTime===null" class="delete">删除该题目</button>
        </span>
        <div>
          <div>题目类型</div>
          <div v-if="store.papers[store.getPaperPage(store.currentPaperId)].releaseTime!==null">{{ question.type }}</div>
          <select v-model="question.type" @change="addAnswerOBJ(index,question.type)" v-if="store.papers[store.getPaperPage(store.currentPaperId)].releaseTime===null">
            <option value="choice">选择题</option>
            <option value="blank">填空题</option>
            <option value="code">编程题</option>
          </select>
        </div>
        <div>
          <div>题干：</div>
          <textarea v-model="question.description" @keydown.tab.prevent="store.onTab"></textarea>
        </div>
        <!-- 选择题 -->
        <div class="choice-container" v-if="question.currentAnswerType=='choice'">
          <div class="choice-setting">
            <span>题目总分数：</span>
            <input class="input-number" min="0" type="number" v-model="store.questions[index].score">
          </div>
          <div class="choice-setting">
            <span>选不全得分：</span>
            <input class="input-number" type="number" v-model="store.questions[index].answerOBJ.scorePart" @change="choiceScoreLimit(index)">
          </div>
          <div v-for="_,i in store.questions[index].answerOBJ.choices"  class="choice-setting">
            <input class="input-check" type="checkbox" v-model="store.questions[index].answerOBJ.trueAnswers[i]" @change="changeChoiceModel(index)">
            <input class="input-text" type="text" v-model="store.questions[index].answerOBJ.choices[i]">
          </div>
          <button @click="addChoice(index)">增加选项</button>
          <button @click="removeChoice(index)" class="delete">减少选项</button>
        </div>
        <!-- 填空题 -->
        <div class="blank-container" v-if="question.currentAnswerType=='blank'">
          <div v-for="_,i in store.questions[index].answerOBJ.trueAnswers" class="blank-single">
            <span>分数：</span>
            <input min="0" class="blank-score" type="number" v-model="store.questions[index].answerOBJ.scores[i]" @change="countScore(index)">
            <span>正确答案：</span>
            <div v-for="_,j in store.questions[index].answerOBJ.trueAnswers[i]" class="blank-input-container">
              <input class="blank-input" type="text" v-model="store.questions[index].answerOBJ.trueAnswers[i][j]">
            </div>
            <button class="blank-answer-btn" @click="addBlankAnswer(index,i)">+</button>
            <button class="blank-answer-btn delete" @click="removeBlankAnswer(index,i)">-</button>
          </div>
          <button class="blank-btn" @click="addBlank(index)">增加选项</button>
          <button class="blank-btn delete" @click="removeBlank(index)">减少选项</button>
        </div>
        <!-- 编程题 -->
        <div class="code-container" v-if="question.currentAnswerType=='code'">
          <div>
            <div>回答框架</div>
            <textarea v-model="store.questions[index].answerOBJ.frame" @keydown.tab.prevent="store.onTab"></textarea>
          </div>
          <div v-for="_,i in store.questions[index].answerOBJ.trueAnswers">
            <span>类型选择：</span>
            <select v-model="store.questions[index].answerOBJ.modules[i]">
              <option value="text">文本匹配</option>
              <option value="reg">正则表达式</option>
              <option value="ast">抽象语法树</option>
            </select>
            <span>分数：</span>
            <input min="0" class="code-score" type="number" v-model="store.questions[index].answerOBJ.scores[i]" @change="countScore(index)">
            <span>错误提示：</span>
            <input class="code-warn" type="text" v-model="store.questions[index].answerOBJ.comments[i]">
            <div class="code-input-container">
              <div>
                <div>输入测试用例：</div>
                <textarea v-model="store.questions[index].answerOBJ.checks[i]" @keydown.tab.prevent="store.onTab"></textarea>
              </div>
              <div>
                <div>输入结果检测：</div>
                <textarea v-model="store.questions[index].answerOBJ.trueAnswers[i]" @keydown.tab.prevent="store.onTab"></textarea>
              </div>
            </div>
          </div>
          <button class="blank-btn" @click="addCodeCheck(index)">增加检测</button>
          <button class="blank-btn delete" @click="removeCodeCheck(index)">减少检测</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  @import "../assets/base.less";
  textarea{
    width: 20rem;
    height: 10rem;
  }
  input{
    background-color: @input-background-color;
  }
  .edit-paper-container{
    margin: 0.5rem;
    .paper-setting{
      margin-bottom: 0.5rem;
    }
    .edit-console{
      position: fixed;
      top: 15%;
      right: 5%;
      display: flex;
      flex-direction: column;
      button{
        width: 5rem;
        height: 6rem;
      }
    }
  }
  .question-container{
    .question-setting{
      margin-right: 2rem;
      button{
        width: 8rem;
      }
    }
  }
  .choice-container{
    .choice-setting{
      margin-bottom: 0.5rem;
      .input-number{
        width: 3rem;
      }
      .input-text{
        width: 30rem;
      }
      .input-check{
        margin-right: 1rem;
      }
    }
    button{
      margin-left: 4rem;
      width: 8rem;
    }
  }
  .blank-container{
    .blank-input-container{
      display: inline;
    }
    .blank-input{
      display: inline;
      width: 8rem;
      margin-right: 1rem;
      background-color: @input-background-color;
    }
    .blank-single{
      margin-bottom: 0.5rem;
    }
    .blank-score{
      display: inline;
      width: 3rem;
      background-color: @input-background-color;
    }
    .blank-answer-btn{
      margin-left: 0.5rem;
      display: inline;
      width: 1rem;
    }
    button{
      margin-left: 4rem;
      width: 8rem;
    }
  }
  .code-container{
    .code-input-container{
      display: flex;
    }
    .code-score{
      width: 3rem;
    }
    .code-warn{
      width: 18rem;
    }
    button{
      margin-left: 4rem;
      width: 8rem;
    }
  }
</style>