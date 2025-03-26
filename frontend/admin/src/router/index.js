import { createWebHistory, createRouter } from "vue-router";
import HomePage  from "@/views/HomePage.vue";
import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import SearchPage from "@/views/SearchPage.vue";
import LibraryPage from "@/views/LibraryPage.vue";
import BookPage from "@/views/BookPage.vue";
import UserDetailPage from "@/views/UserDetailPage.vue";
import BorrowPage from "@/views/BorrowPage.vue";
import BorrowListPage from "@/views/BorrowListPage.vue";
import StaffLogin from "@/views/StaffLogin.vue";
import AdminPage from "@/views/AdminPage.vue";
import StaffManagePage from "@/views/StaffManagePage.vue";
import UserManagePage from "@/views/UserManagePage.vue";
import BookManagePage from "@/views/BookManagePage.vue";
import BorrowManagePage from "@/views/BorrowManagePage.vue";
import PublisherManagePage from "@/views/PublisherManagePage.vue";

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
    path: '/library/:bookId', 
    name: "BookPage",
    component: BookPage,
    props: true
  },

  {
    path: '/userdetail/:userId',
    name: 'UserDetail',
    component: UserDetailPage,
    props: true  
  },
  
  {
    path: '/userdetail',
    name: 'UserDetailRedirect',
    component: UserDetailPage,
    props: true
  },

  {
    path: '/borrow/:bookId',
    name: 'BorrowPage',
    component: BorrowPage,
    props: true  
  },

  {
    path: '/borrow/:userId',
    name: 'BorrowListPage',
    component: BorrowListPage,
    props: true  
  },

  {
    path: '/staff/login',
    name: 'StaffLogin',
    component: StaffLogin,  
  },

  {
    path: '/admin',
    name: 'AdminPage',
    component: AdminPage,  
  },

  {
    path: '/admin/staff-manage',
    name: 'StaffManagePage',
    component: StaffManagePage,  
  },

  {
    path: '/admin/user-manage',
    name: 'UserManagePage',
    component: UserManagePage,  
  },

  {
    path: '/admin/book-manage',
    name: 'BookManagePage',
    component: BookManagePage,  
  },

  {
    path: '/admin/borrow-manage',
    name: 'BorrowManagePage',
    component: BorrowManagePage,  
  },

  {
    path: '/admin/publisher-manage',
    name: 'PublisherManagePage',
    component: PublisherManagePage,  
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