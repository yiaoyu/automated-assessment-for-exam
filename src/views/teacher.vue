<script setup lang="ts">
  import Header from "../components/Header.vue"
  import NavigationBar from "../components/NavigationBar.vue"
  import Section from "../components/Section.vue"
  import { mainStore } from "../stores/main"
  const store = mainStore()
</script>

<template>
  <div>
    教师页面
  </div>
  <Header type="teacher" />
  <NavigationBar :class="store.currentNav" />
  <Section id="0" />
</template>

<style>
</style>
