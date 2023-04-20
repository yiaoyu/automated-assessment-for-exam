<script setup lang="ts">
  import { RouterLink,useRouter } from "vue-router"
  import { ref,watch,onMounted,onBeforeUnmount,computed } from "vue"
  import { Base64 } from 'js-base64';
  import { mainStore } from "../stores/main"
  const store = mainStore()
  const router = useRouter()
  const currentLoginOption = ref("student")
  const userName=ref("")
  const userPwd=ref("")
  const regName=ref("")
  const regPwd=ref("")
  const confirmPwd=ref("")
  const regType=ref("")
  const regBtnName=computed(()=>{
    if(regType.value=="student"){
      return "学生注册"
    }else{
      return "教师注册"
    }
  })
  const remmeberAccount=ref(false)
  const showPwd=ref(false)
  //保存账户
  watch(remmeberAccount,saveAccount)
  function saveAccount(){
    if(remmeberAccount.value==true){
      localStorage.setItem("userName",Base64.encode(userName.value))
      localStorage.setItem("userPwd",Base64.encode(userPwd.value))
    }else{
      localStorage.removeItem("userName")
      localStorage.removeItem("userPwd")
    }
  }
  onMounted(() => {
    if(localStorage.getItem("userName")){
      userName.value = Base64.decode(localStorage.getItem("userName")!)
      userPwd.value = Base64.decode(localStorage.getItem("userPwd")!)
      remmeberAccount.value = true
    }
  })
  onBeforeUnmount(() => {
    if(remmeberAccount.value){
      localStorage.setItem("userName",Base64.encode(userName.value))
      localStorage.setItem("userPwd",Base64.encode(userPwd.value))
    }
  })
  //用户注册
  function register(){
    if(regName.value==""){
      window.alert("请输入名称")
      return
    }else if(store.hasIllegalChar(regName.value)){
      window.alert("名称包含非法字符")
      return
    }
    if(regPwd.value==""){
      window.alert("请输入密码")
      return
    }else if(store.hasIllegalChar(regPwd.value)){
      window.alert("密码包含非法字符")
      return
    }

    if(regPwd.value!==confirmPwd.value){
      window.alert("两次输入密码不一致，请重新输入")
      regPwd.value = ""
      confirmPwd.value = ""
      return
    }
    fetch(`/api/register?userName=${regName.value}&userPwd=${regPwd.value}&userType=${regType.value}`).then(v=>{
      return v.text()
    }).then(v=>{
      switch(v){
        case "success":window.alert("注册成功！");break;
        case "ER_DUP_ENTRY":window.alert("该名称已被使用！");break;
        default: window.alert(v)
      }
    }).catch(err=>{
      console.log(err);
    });
  }
  //登录
  function login(type:string){
    if(userName.value==""){
      window.alert("请输入名称")
      return
    }
    if(userPwd.value==""){
      window.alert("请输入密码")
      return
    }
    fetch(`/api/login?userName=${userName.value}&userPwd=${userPwd.value}&userType=${type}`).then(v=>{
      return v.json()
    }).then(v=>{
      switch(v.msg){
        case "success":
          localStorage.setItem("id",v.id)
          localStorage.setItem("name",v.name)
          localStorage.setItem("school",v.school)
          localStorage.setItem("class",v.class)
          localStorage.setItem("department",v.department)
          localStorage.setItem("token",v.token)
          if(type=="student"){
            store.userType = "student"
            router.push('/student')
          }else{
            store.userType = "teacher"
            router.push('/teacher')
          }
          break
        case "wrong_password":window.alert("密码错误");break;
        case "name_not_find":window.alert("找不到该用户");break;
        default: window.alert(v)
      }
    }).catch(err=>{
      console.log(err);
    });
  }
</script>

<template>
  <div class="display">
    <section class="login-box" :class="{register: currentLoginOption=='register'}">
      <nav id="login-nav-bar">
        <button id="L-btn" @click="currentLoginOption='student'" :class="{ active: currentLoginOption=='student' }">学生登录</button>
        <button @click="currentLoginOption='teacher'" :class="{ active: currentLoginOption=='teacher' }">教师登录</button>
        <button id="R-btn"  @click="currentLoginOption='register'" :class="{ active: currentLoginOption=='register' }">用户注册</button>
      </nav>
      <div class="login-input-view" v-if="currentLoginOption=='student'||currentLoginOption=='teacher'">
        <div class="input-container">
          <span>名称：</span>
          <input v-model="userName">
        </div>
        <div class="input-container">
          <span>密码：</span>
          <input type="password" v-model="userPwd" v-if="!showPwd">
          <input type="text" v-model="userPwd" v-if="showPwd">
        </div>
        <div class="input-control">
          <input type="checkbox" class="remember" v-model="remmeberAccount">
          <label for="remember">记住账户</label>
          <input type="checkbox" class="show-pwd" v-model="showPwd">
          <label for="show-pwd">显示密码</label>
        </div>
        <button class="confirm-btn" v-if="currentLoginOption=='student'" @click="login('student')">学生登录</button>
        <button id="teacher-login-btn" class="confirm-btn" v-if="currentLoginOption=='teacher'" @click="login('teacher')">教师登录</button>
      </div>
      <div id="register-input-view" class="login-input-view" v-if="currentLoginOption=='register'" >
        <div class="input-container">
          <span>名称：</span>
          <input v-model="regName">
        </div>
        <div class="input-container">
          <span>密码：</span>
          <input type="password" v-model="regPwd">
        </div>
        <div class="input-container">
          <span>确认密码：</span>
          <input type="password" id="confirmPwd" v-model="confirmPwd">
        </div>
        <div class="input-control">
          <input type="radio" id="isStudent" value="student" v-model="regType"/>
          <label for="isStudent">我是学生</label>
          <input type="radio" id="isTeacher" value="teacher" v-model="regType" />
          <label for="isTeacher">我是教师</label>
        </div>
        <button class="confirm-btn" @click="register" v-if="regType!=''">{{regBtnName}}</button>
      </div>
    </section>
  </div>
</template>

<style scoped lang="less">
  @import "../assets/base.less";
  .console{
    position:absolute;
    left: 0rem;
    top: 0rem;
    color: @font-color;
  }
  .display{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 54rem;
    background-color: @background-color;
    .login-box{
      height: 25rem;
      width: 30rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: @background-color-light;
      border-radius: 2rem;
      box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
      transition: 0.5s;
      #login-nav-bar{
        width:100%;
        height: 4rem;
        display:flex;
        justify-content: space-around;
        #L-btn{
          border-top-left-radius: 2rem;
        }
        #R-btn{
          border-top-right-radius: 2rem;
        }
        .active{
          background-color: @main-color;
        }
      }
      .login-input-view{
        width:100%;
        height: 21rem;
        border-bottom-right-radius: 2rem;
        border-bottom-left-radius: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: 0.5s;
        .confirm-btn{
          height: 3rem;
          width: 10rem;
          border-radius: 1rem;
          margin: 1rem;
        }
        #teacher-login-btn{
          background-color: @sec-color-light;
        }
        #teacher-login-btn:hover{
          background-color: @sec-color;
        }
        .input-container{
          background-color: @input-background-color;
          padding: 1rem;
          border-radius: 1rem;
          margin: 1rem;
          #confirmPwd{
            width: 10rem;
          }
        }
      }
      #register-input-view{
        height: 26rem;
      }
    }
    .login-box:hover{
      box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
    }
    .register{
      height: 30rem;
    }
  }

</style>