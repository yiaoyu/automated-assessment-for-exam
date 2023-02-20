import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/login.vue"),
    },
    {
      path: "/student",
      name: "student",
      component: () => import("../views/student.vue"),
    },
    {
      path: "/teacher",
      name: "teacher",
      component: () => import("../views/teacher.vue"),
    },
  ],
});

export default router;
