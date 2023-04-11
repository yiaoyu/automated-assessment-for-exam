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
</script>

<template>
  <div class="result-container" v-if="store.questions.length!=0">
    <!-- store.questions.length!=0保证promise返回之后再加载页面 -->
    <div v-for="(answer, index) in store.studentAnswers">
      <div>
        <span :class="store.questions[index].score==store.studentAnswers[index].score?'correct':'incorrect'">
          <span>{{ answer.comment }}</span>
          <span>{{ '('+answer.score+')分----' }}</span>
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
        <div v-if="store.studentAnswers[index].score != store.questions[index].score" v-for="_,i of store.studentAnswers[index].answerOBJ.scores" class="incorrect">
          <span>{{ '(-'+store.questions[index].answerOBJ.scores[i]+')分--' }}</span>
          <span v-if="store.studentAnswers[index].answerOBJ.scores[i]==0">{{ store.questions[index].answerOBJ.comments[i] }}</span>
        </div>
      </div>
      <hr/>
    </div>
  </div>
</template>

<style scoped lang="less">
  @import "../assets/base.less";
  .correct{
    color: @main-color;
    span{
      color: @main-color;
    }
  }
  .incorrect{
    color: @warning-color;
    span{
      color: @warning-color;
    }
  }
</style>