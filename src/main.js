// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import {getCookie} from './js/cookie'

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  const token = getCookie('token')
  if (to.meta.boolean) {
    // console.log(1)
    if (token === 'e537173980dbc9363cd70f11edc26a6c606d4066') {
      // console.log(2)
      next('/nvnvyeziMan')
    }
    next()
  } else {
    // console.log(token)
    if (token === 'e537173980dbc9363cd70f11edc26a6c606d4066') {
      next()
    } else {
      next('/')
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
