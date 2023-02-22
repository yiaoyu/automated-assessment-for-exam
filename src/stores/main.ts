import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const mainStore = defineStore("main", () => {
  const currentNav = ref("")//当前导航栏
  const currentItem = ref(0)//当前导航选项
  const userName=ref("")
  const userId=ref(0)
  const userSchool=ref("")
  const userClass=ref("")
  const userDepartment=ref("")
  const userType=ref("")
  function hasIllegalChar(str:string):boolean{
    let pattern = /[^\w\u4e00-\u9fa5]/
    return pattern.test(str)
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
    hasIllegalChar
   }
});
