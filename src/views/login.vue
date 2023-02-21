<script setup lang="ts">
  import { RouterLink} from "vue-router";
  import { ref } from "vue";
  const currentLoginOption = ref("student");
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
          <input>
        </div>
        <div class="input-container">
          <span>密码：</span>
          <input type="password">
        </div>
        <div class="input-control">
          <input type="checkbox" class="remember">
          <label for="remember">保存账户</label>
          <input type="checkbox" class="show-pwd">
          <label for="show-pwd">显示密码</label>
        </div>
        <button class="confirm-btn" v-if="currentLoginOption=='student'">登录</button>
        <button id="teacher-login-btn" class="confirm-btn" v-if="currentLoginOption=='teacher'">教师登录</button>
      </div>
      <div id="register-input-view" class="login-input-view" v-if="currentLoginOption=='register'" >
        <div class="input-container">
          <span>名称：</span>
          <input>
        </div>
        <div class="input-container">
          <span>密码：</span>
          <input type="password">
        </div>
        <div class="input-container">
          <span>确认密码：</span>
          <input type="password" id="confirmPwd">
        </div>
        <button class="confirm-btn">注册</button>
      </div>
    </section>
  </div>
  <div class="console">
    <nav>
      <RouterLink to="/student">学生界面</RouterLink>
      <RouterLink to="/teacher">教师界面</RouterLink>
    </nav>
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
    height: 50rem;
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
    #login-box:hover{
      box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
    }
    .register{
      height: 30rem;
    }
  }

</style>