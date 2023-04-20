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
        <span :class="store.questions[index].score==store.studentAnswers[index].score?'correct':'incorrect'">
          <span>{{ '('+answer.score+')分----' }}</span>
          <span>{{ answer.comment }}</span>
        </span>
        <span>{{ store.questionHead(index) }}</span>
      </div>
      <!-- 选择题 -->
      <div v-if="store.questions[index].type=='choice'">
        <div v-for="_,i in store.questions[index].answerOBJ.choices">
          <span v-if="store.studentAnswers[index].answerOBJ[i]" :class="store.questions[index].score==store.studentAnswers[index].score?'correct':'incorrect'">(√)</span>
          <span v-if="!store.studentAnswers[index].answerOBJ[i]" >---</span>
          <span v-if="store.questions[index].answerOBJ.trueAnswers[i]">(√)</span>
          <span v-if="!store.questions[index].answerOBJ.trueAnswers[i]">---</span>
          <span>{{ store.questions[index].answerOBJ.choices[i] }}</span>
        </div>
      </div>
      <!-- 填空题 -->
      <div v-if="store.questions[index].type=='blank'">
        <div v-for="_,i in store.studentAnswers[index].answerOBJ.blanks">
          <span>{{ '('+(i+1)+')' }}</span>
          <span :class="store.studentAnswers[index].answerOBJ.scores[i]!=0?'correct':'incorrect'">
            {{ store.studentAnswers[index].answerOBJ.blanks[i] }}
          </span>
          <span>----正确答案：</span>
          <span v-for="_,j in store.questions[index].answerOBJ.trueAnswers[i]">
            {{ store.questions[index].answerOBJ.trueAnswers[i][j] + ',' }}
          </span>
        </div>
      </div>
      <!-- 编程题 -->
      <div v-if="store.questions[index].type=='code'">
        <div>{{ store.studentAnswers[index].answerOBJ.code }}</div>
        <div v-if="store.studentAnswers[index].score == store.questions[index].score" class="correct">
          <span>{{ '('+store.studentAnswers[index].answerOBJ.scores.length+'/'+store.studentAnswers[index].answerOBJ.scores.length+')个用例通过' }}</span>
        </div>
        <div v-if="store.studentAnswers[index].score != store.questions[index].score" v-for="_,i in store.studentAnswers[index].answerOBJ.scores">
          <div v-if="store.studentAnswers[index].answerOBJ.scores[i]!=0" class="correct">
            <span>{{ '('+store.questions[index].answerOBJ.scores[i]+')分--' }}</span>
            <span>用例检测通过</span>
          </div>
          <div v-if="store.studentAnswers[index].answerOBJ.scores[i]==0" class="incorrect">
            <span>{{ '(-'+store.questions[index].answerOBJ.scores[i]+')分--' }}</span>
            <span>{{ store.questions[index].answerOBJ.comments[i] }}</span>
          </div>
        </div>
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
    padding: 0.5rem;
  }
</style>