<script setup lang="ts">
  import Header from "../components/Header.vue"
  import NavigationBar from "../components/NavigationBar.vue"
  import Content from "../components/Content.vue"
  import { mainStore } from "../stores/main"
  import { onBeforeMount } from "vue"
  const store = mainStore()
  onBeforeMount(() => {
    store.userId = parseInt(localStorage.getItem("id")!)
    store.userName = localStorage.getItem("name")!
    store.userSchool = localStorage.getItem("school")!
    store.userClass = localStorage.getItem("class")!
    store.userDepartment = localStorage.getItem("department")!
    if(localStorage.getItem("token")){
      fetch(`/api/verify`, { 
        method: 'post', 
        headers: new Headers({
          'Authorization': localStorage.getItem("token")!,
          'Content-Type': 'application/json'
        }), 
        body: JSON.stringify({type:'student'})
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
        console.log(err);
      });
    }else{
      window.location.replace("http://localhost:5500")
    }
  })
</script>
  
<template>
  <div class="display">
    <Header type="student" />
    <div class="row-display">
      <NavigationBar :class="store.currentNav" />
      <Content id="0" />
    </div>
  </div>
</template>

<style scoped lang="less">
  @import "../assets/base.less";
  .display{
    min-height: 50rem;
    background-color: @background-color;
    .row-display{
      display: flex;
    }
  }
</style>
