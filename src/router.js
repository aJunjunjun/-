import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import welcome from '@/views/Welcome.vue'
import user from '@/views/user/user.vue'
import rights from '@/views/rigth/rigth.vue'
import roles from '@/views/rigth/roles.vue'
import goods from '@/views/goods/goods.vue'
import List from '@/views/goods/list.vue'
import Add from '@/views/goods/add.vue'
Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: {
        name: 'Login'
      }
    },
    {
      name: 'Login',
      path: '/login',
      component: Login
    },
    {
      name: 'Home',
      path: '/home',
      component: Home,
      // 重定向
      redirect: {
        name: 'Welcome'
      },
      children: [
        {
          name: 'Welcome',
          path: 'welcome',
          component: welcome
        },
        {
          name: 'User',
          path: 'users',
          component: user
        },
        {
          name: 'Right',
          path: 'rights',
          component: rights
        },
        {
          name: 'Roles',
          path: 'roles',
          component: roles
        },
        {
          name: 'Goods',
          path: 'goods',
          component: goods,
          redirect: { name: 'List' },
          children: [
            {
              name: 'List',
              path: 'list',
              component: List
            }, {
              name: 'Add',
              path: 'add',
              component: Add
            }
          ]
        }
      ]
    }
  ]
})
