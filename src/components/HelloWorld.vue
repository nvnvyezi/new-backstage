<template>
  <div class="back">
    <div class="box">
      <h1>登录</h1>
      <form action="/" method="post" id="login_form">
        <input type="text" name="userid" placeholder="Username" id="userid">
        <input type="password" name="password" placeholder="Password" id="password">
        <input type="button" value="Login" id="login" v-on:click = 'getAjax' class="button">
      </form>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import {setCookie} from '../js/cookie'
import { hexSha1 } from '../encryption/sha1'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    getAjax () {
      const message = {}
      message.id = $('#userid').val()
      message.password = $('#password').val()
      let reg = /^[A-Za-z0-9]+$/;
      let patrn = /^(\w){6,20}$/;
      if (reg.exec(message.id) && message.id.length <= 20 && patrn.exec(message.password) && message.password.length <= 20) {
        message.password = hexSha1($('#password').val())
        // console.log(message.password);
        // console.log(message.password);
        $.ajax({
          type: 'GET',
          // url: 'http://127.0.0.1:3000/nvnvyezi',
          url: 'http://193.112.4.143:3001/nvnvyezi',
          dataType: 'json',
          data: {
            message
          },
          xhrFields: { withCredentials: true },
          success: function (response) {
            // console.log(response)
            if (!response.Err) {
              // const path = '/' + response.Path
              setCookie('token', response.token, 1)
              setCookie('username', response.name, 1)
              window.location.reload();
            } else {
              alert(response.Data)
            }
          },
          error: function (err) {
            console.log(err)
          }
        })
      } else {
        alert('用户名和密码长度小于21')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import '../less/login.less';
</style>
