import Vue from 'vue'
import VueRouter from 'vue-router'
import  Index from '../views/Index.vue'
import Register from '../views/Register.vue'
import NotFound from '../views/404.vue'
import Login from '../views/Login.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index',
  },
  {
    path:'/index',
    name: 'index',
    component : Index
  },
  {
    path:'/register',
    name: 'register',
    component : Register
  }, 
  {
    path:'/login',
    name: 'login',
    component : Login
  }, 
  {
    path:'*',
    name: '/404',
    component : NotFound
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next) =>{
  //判断本地存储的token是否存在，返回Boolean值，若存在，则返回true
  const isLogin = localStorage.eleToken ? true : false;
  if(to.path == '/login' || to.path == '/register'){
    next();
  }else{
    isLogin ? next() : next('/login');
  } 
})


export default router;
