import { createWebHistory, createRouter } from "vue-router";
import HomePage  from "@/views/HomePage.vue";
import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import SearchPage from "@/views/SearchPage.vue";
import LibraryPage from "@/views/LibraryPage.vue";

const routes = [
  {
    path: "/",
    name: "bookborrowstore",
    component: HomePage,
  },

  {
    path: '/login', 
    name: "Login",
    component: LoginPage ,
  },

  {
    path: '/register', 
    name: "Register",
    component: RegisterPage,
  },

  {
    path: '/library', 
    name: "Library",
    component: LibraryPage,
  },

  {
    path: '/search', 
    name: "SearchPage",
    component: SearchPage,
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