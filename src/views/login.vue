<script setup lang="ts">
  import { RouterLink} from "vue-router";
</script>

<template>
  <div>
    <h1>This is a login page</h1>
  </div>
  <nav>
    <RouterLink to="/student">学生界面</RouterLink>
    <RouterLink to="/teacher">教师界面</RouterLink>
  </nav>
</template>