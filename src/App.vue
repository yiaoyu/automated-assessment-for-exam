<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted } from 'vue'
onMounted(() => {
  //`/api/offlinemsg?cid=${that.friendList[i].fid}&method=friend`
  fetch(`/api/get`).then(v=>{
    return v.json()
  }).then(v=>{
    console.log(v)
  }).catch(err=>{
    console.log(err);
  });
})
</script>

<template>
  <RouterView />
</template>

<style scoped lang="less">

</style>
