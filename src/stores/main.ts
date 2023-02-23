import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import type * as entity from "../stores/entity"
export const mainStore = defineStore("main", () => {
  const currentNav = ref("")//当前导航栏
  const currentItem = ref(0)//当前导航选项
  const userName=ref("")
  const userId=ref(0)
  const userSchool=ref("")
  const userClass=ref("")
  const userDepartment=ref("")
  const userType=ref("")
  const papers:entity.paper[] = reactive([])
  const currentPaperId = ref(0)
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
          console.log(v.data)
          break
        case "fail":
          break
        default: window.alert(v)
      }
    }).catch(err=>{
      console.log(err)
    })
  }
  return { 
    userName,
    userId,
    userSchool,
    userClass,
    userDepartment,
    userType,
    currentNav,
    currentItem,
    currentPaperId,
    papers,
    hasIllegalChar,
    tokenCheck,
    loadLocalStore,
    getAllPaper,
    getAllquestion
   }
});
