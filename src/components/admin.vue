<template>
  <div class="box" id="admin">
    <header>
      <div class="logo">
        <strong>
          {{ title }}
        </strong>
      </div>
      <div class="rightname">
        <img src="../assets/head.png" alt="username">
        <div class="name">
          <strong>
            {{ username }}
          </strong>
        </div>
      </div>
    </header>
    <nav class="main-menu">
      <div class="settings"></div>
      <ul>
        <li>
          <router-link to="/nvnvyeziMan">
            <i class="fa fa-home"> </i>
              <span class="nav-text">
                {{ home }}
              </span>
          </router-link>
        </li>
        <li class="has-subnav">
          <router-link to="/info">
            <i class="fa fa-info"></i>
            <span class="nav-text">
              {{ info }}
            </span>
          </router-link>
        </li>
        <li class="has-subnav">
          <router-link to="/infoOne">
            <i class="fa fa-infoOne"></i>
            <span class="nav-text">
              {{ infoOne }}
            </span>
          </router-link>
        </li>
        <li class="has-subnav">
          <router-link to="/account">
            <i class="fa fa-admin"></i>
            <span class="nav-text">
              {{ admin }}
            </span>
          </router-link>
        </li>
        <li class="has-subnav" id="exit">
          <router-link to="/">
            <i class="fa fa-exit"></i>
            <span class="nav-text">
              {{ exit }}
            </span>
          </router-link>
        </li>
      </ul>
    </nav>
    <div>
      <router-view />
    </div>
  </div>
</template>

<script>
import { getCookie } from '../js/cookie'
export default {
  name: 'admin',
  data () {
    return {
      title: '3g 纳新网站后台管理',
      home: 'Home',
      info: 'inforALL',
      infoOne: 'infoOne',
      admin: 'admin',
      exit: '退出',
      username: getCookie('username')
    }
  }
}
</script>

<style lang="less" scoped>
@import '../less/admin.less';
</style>
