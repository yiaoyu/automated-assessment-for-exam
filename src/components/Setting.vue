<script setup lang="ts">
  import { mainStore } from "../stores/main"
  import { ref } from "vue"
  import { Base64 } from 'js-base64';
  const store = mainStore()
  const newName = ref(store.userName)
  const newSchool = ref(store.userSchool)
  const newDepartment = ref(store.userDepartment)
  const newClass = ref(store.userClass)
  const currentPwd = ref("")
  const newPwd = ref("")
  //修改个人信息
  function changeInfo(){
    if(newName.value==""){
      window.alert("请输入名称")
      return
    }else if(store.hasIllegalChar(newName.value)){
      window.alert("名称包含非法字符")
      return
    }
    if(store.hasIllegalChar(newSchool.value)){
      window.alert("学校包含非法字符")
      return
    }
    if(store.hasIllegalChar(newDepartment.value)){
      window.alert("部门包含非法字符")
      return
    }
    if(store.hasIllegalChar(newClass.value)){
      window.alert("班级包含非法字符")
      return
    }
    
    fetch(`/api/changeinfo`, { 
      method: 'post', 
      headers: new Headers({
        'Content-Type': 'application/json'
      }), 
      body: JSON.stringify({
        id: store.userId,
        school: newSchool.value,
        department: newDepartment.value,
        class: newClass.value,
        type: store.userType,
        name: newName.value,
    })
    }).then(v=>{
      return v.json()
    }).then(v=>{
      switch(v.msg){
        case "success":
          store.userName = v.name
          store.userSchool = v.school
          if(v.department){
            store.userDepartment = v.department
          }
          if(v.class){
            store.userClass = v.class
          }
          window.alert("修改成功")
          break
        case "ER_DUP_ENTRY":
          window.alert("该名称已被使用！")
          break
        case "fail":
          window.alert("修改失败")
          break
        default: window.alert(v)
      }
      localStorage.setItem("name",v.name)
      localStorage.setItem("school",v.school)
      localStorage.setItem("class",v.class)
      localStorage.setItem("department",v.department)
      newName.value = store.userName
      newSchool.value = store.userSchool
      newDepartment.value = store.userDepartment
      newClass.value = store.userClass
    }).catch(err=>{
      console.log(err);
    });
  }
  //修改密码
  function changePwd(){
    if(newPwd.value==""){
      window.alert("请输入密码")
      return
    }else if(store.hasIllegalChar(newPwd.value)){
      window.alert("密码包含非法字符")
      return
    }
    fetch(`/api/changepwd`, { 
      method: 'post', 
      headers: new Headers({
        'Content-Type': 'application/json'
      }), 
      body: JSON.stringify({
        id: store.userId,
        type: store.userType,
        currentPwd: currentPwd.value,
        newPwd: newPwd.value
    })
    }).then(v=>{
      return v.json()
    }).then(v=>{
      switch(v.msg){
        case "success":
          window.alert("修改成功")
          break
        case "wrong_pwd":
          window.alert("密码错误")
          break
        case "fail":
          window.alert("修改失败")
          break
        default: window.alert(v)
      }
      localStorage.setItem("userPwd",Base64.encode(v.newPwd))
      currentPwd.value = ""
      newPwd.value = ""
    }).catch(err=>{
      console.log(err);
    });
  }
</script>

<template>
  <div class="setting-container" id="student-setting1" v-if="store.currentNav=='studentInfo'&&store.currentItem==0">
    <div class="change-info">
      <div class="title">修改个人信息</div>
      <div>用户序号：{{store.userId}}</div>
      <div>
        <span>姓名：</span>
        <input type="text" v-model="newName">
      </div>
      <div>
        <span>学校：</span>
        <input type="text" v-model="newSchool">
      </div>
      <div>
        <span>班级：</span>
        <input type="text" v-model="newClass">
      </div>
      <div class="confirm-container">
        <button @click="changeInfo" class="confirm">确认修改</button>
      </div>
    </div>
    <hr/>
    <div class="change-pwd">
      <div class="title">修改密码</div>
      <div>
        <span>请输入旧密码：</span>
        <input type="password" v-model="currentPwd">
      </div>
      <div>
        <span>请输入新密码：</span>
        <input type="password" v-model="newPwd">
      </div>
      <div class="confirm-container">
        <button @click="changePwd" class="confirm">确认修改</button>
      </div>
    </div>
  </div>
  <div class="setting-container" id="teacher-setting1" v-if="store.currentNav=='teacherInfo'&&store.currentItem==0">
    <div class="change-info">
      <div class="title">修改个人信息</div>
      <div>用户序号：{{store.userId}}</div>
      <div>
        <span>姓名：</span>
        <input type="text" v-model="newName">
      </div>
      <div>
        <span>学校：</span>
        <input type="text" v-model="newSchool">
      </div>
      <div>
        <span>部门：</span>
        <input type="text" v-model="newDepartment">
      </div>
      <div class="confirm-container">
        <button @click="changeInfo" class="confirm">确认修改</button>
      </div>
    </div>
    <hr/>
    <div class="change-pwd">
      <div class="title">修改密码</div>
      <div>
        <span>请输入旧密码：</span>
        <input type="password" v-model="currentPwd">
      </div>
      <div>
        <span>请输入新密码：</span>
        <input type="password" v-model="newPwd">
      </div>
      <div class="confirm-container">
        <button @click="changePwd" class="confirm">确认修改</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  @import "../assets/base.less";
  .setting-container{
    padding: 1rem;
    .change-info, .change-pwd{
      display:flex;
      flex-direction: column;
      align-items: center;
      div{
        padding-bottom: 1rem;
      }
    }
    .title{
      text-align: center;
    }
    .confirm-container{
      .confirm{
        width: 6rem;
      }
    }
    input{
      background-color: @background-color-light;
      width: 24rem;
    }
  }
</style>