import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import type * as entity from "../stores/entity"
export const mainStore = defineStore("main", () => {
  //flag
  const currentNav = ref("")//当前导航栏
  const currentItem = ref(0)//当前的设置选项（只在setting中使用）
  const currentPaperId = ref(0)//当前选择的试卷号
  //用户基本信息
  const userName=ref("")
  const userId=ref(0)
  const userSchool=ref("")
  const userClass=ref("")
  const userDepartment=ref("")
  const userType=ref("")
  //学生考试数据
  const currentExam:entity.exam = reactive({
    sid:0,
    pid:0,
    startTime:"",
    finishTime:"",
    score:0,
    public:"yes",
    times:0
  })
  const currentAnswers:entity.answer[] = reactive([])
  const hasCreatedAnswer=ref(false)
  //数据库数据
  const papers:entity.paper[] = reactive([])
  const questions:entity.question[] = reactive([])
  const answers:entity.answer[] = reactive([])
  const exams:entity.exam[] = reactive([])
  // 模板
  // function getAllPaper(){
  //   fetch(`/api/`,{
  //     method: 'post', 
  //     headers: new Headers({
  //       'Authorization': localStorage.getItem("token")!,
  //       'Content-Type': 'application/json'
  //     }),
  //     body: JSON.stringify({
  //     })
  //   }).then(v=>{
  //     return v.json()
  //   }).then(v=>{
  //     switch(v.msg){
  //       case "success":
  //         break
  //       case "fail":
  //         window.alert("")
  //         break
  //       default: window.alert(v)
  //     }
  //   }).catch(err=>{
  //     console.log(err)
  //   })
  // }
  
  function hasIllegalChar(str:string):boolean{
    //检测名称与密码中的非法字符
    let pattern = /[^\w\u4e00-\u9fa5]/
    return pattern.test(str)
  }

  async function tokenCheck(type:string){
    //检测用户身份
    if(localStorage.getItem("token")){
      await fetch(`/api/verify`, { 
        method: 'post', 
        headers: new Headers({
          'Authorization': localStorage.getItem("token")!,
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({type: type})
        //body 必须使用JSON格式
      }).then(v=>{
        return v.json()
      }).then(v=>{
        switch(v.msg){
          case "token_verify_success":
            //身份验证通过
            break
          case "token_verify_fail":
            window.location.replace("http://localhost:5500")
            break
          default: window.alert(v)
        }
      }).catch(err=>{
        console.log(err)
      })
    }else{
      window.location.replace("http://localhost:5500")
    }
  }

  function loadLocalStore(){
    //加载本地存储
    userId.value = parseInt(localStorage.getItem("id")!)
    userName.value = localStorage.getItem("name")!
    userSchool.value = localStorage.getItem("school")!
    userClass.value = localStorage.getItem("class")!
    userDepartment.value = localStorage.getItem("department")!
  }

  function getAllPaper(){
    //获取所有的试卷
    papers.length = 0//清空数组
    fetch(`/api/getallpaper`,{
      method: 'post', 
      headers: new Headers({
        'Authorization': localStorage.getItem("token")!,
        'Content-Type': 'application/json'
      })
    }).then(v=>{
      return v.json()
    }).then(v=>{
      switch(v.msg){
        case "success":
          papers.push(...v.data)
          // [] = push(...[])将另一个数组拆开后存入新数组
          break
        case "fail":
          window.alert("获取试卷信息失败")
          break
        default: window.alert(v)
      }
    }).catch(err=>{
      console.log(err)
    })
  }

  function getAllquestion(pid:number){
    //获取试卷中的题目
    questions.length = 0
    fetch(`/api/getallquestion`,{
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
          questions.push(...v.data)
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
  //查找对应的页面
  function getPaperPage(id:number):number{
    if(id == 0){
      return 0
    }
    for (let i = 0; i < papers.length; i++) {
      if(papers[i].id == id){
        return i
      }
    }
    console.log("getPaperPage:找不到对应页面！")
    return 0
  }
  //查找考试中的题目
  function getCurrentAnswer(id:number):number{
    for (let i = 0; i < currentAnswers.length; i++) {
      if(currentAnswers[i].qid == id){
        return i
      }
    }
    console.log("getCurrentAnswer:找不到对应页面！")
    return 0
  }
  //获取mysql格式的datetime
  function getDateTime():string{
    let date:string = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return date
  }
  //根据学生答案获取原题
  function getQuestionIdByAnswer(qid:number):number{
    for (let i = 0; i < questions.length; i++) {
      if(currentAnswers[i].qid == qid){
        return i
      }
    }
    console.log("main.ts getQuestionIdByAnswer:找不到对应题目！")
    return 0
  }
  return { 
    currentNav,
    currentItem,
    currentPaperId,
    userName,
    userId,
    userSchool,
    userClass,
    userDepartment,
    userType,
    currentExam,
    currentAnswers,
    hasCreatedAnswer,
    papers,
    questions,
    answers,
    exams,
    hasIllegalChar,
    tokenCheck,
    loadLocalStore,
    getAllPaper,
    getAllquestion,
    getPaperPage,
    getCurrentAnswer,
    getDateTime,
    getQuestionIdByAnswer
   }
});
