import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import HelloWorld from '@/components/HelloWorld'
import admin from '@/components/admin'
import info from '@/Subcomponent/infoAll'
import home from '@/Subcomponent/home'
import infoOne from '@/Subcomponent/infoOne'
import account from '@/Subcomponent/account'

Vue.use(Router)
Vue.use(iView)
Vue.use(ElementUI)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'HelloWorld',
      component: HelloWorld,
      meta: { boolean: true }
    },
    {
      path: '/nvnvyeziMan',
      name: 'admin',
      component: admin,
      children: [
        {
          path: '/',
          name: 'home',
          component: home
        },
        {
          path: '/info',
          component: info,
          name: 'info'
        },
        {
          path: '/infoOne',
          component: infoOne,
          name: 'infoOne'
        },
        {
          path: '/account',
          component: account,
          name: 'account'
        }
      ]
    }
  ]
})
