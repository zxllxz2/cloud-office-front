import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import FriendChat from '../views/chat/FriendChat.vue'
import AdminInfo from '../views/AdminInfo.vue'

Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    hidden: true
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/chat',
        name: 'Online Chat',
        component: FriendChat
      },
      {
        path: '/userinfo',
        name: 'Profile',
        component: AdminInfo
      }
    ]
  }

  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})


export default router
