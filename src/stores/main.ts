import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const mainStore = defineStore("main", () => {
  const currentNav = ref("");
  const currentItem = ref("");
  return { currentNav,currentItem };
});
