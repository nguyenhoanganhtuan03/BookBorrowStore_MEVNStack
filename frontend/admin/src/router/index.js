import { createWebHistory, createRouter } from "vue-router";
import HomePage  from "@/views/HomePage.vue";

const routes = [
  {
    path: "/",
    name: "bookborrowstore",
    component: HomePage,
  },

  {
    path: "/adminlogin",
    name: "adminlogin",
    component: () => import("@/views/AdminLogin.vue"),
  },

  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
  },

];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;  