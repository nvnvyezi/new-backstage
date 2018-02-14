<template>
  <div class="box">
    <div class="utitle">
      <h1>
        {{ utitle }}
      </h1>
    </div>
    <div class="tab">
      <Table border :columns="columns7" :data="data6"></Table>
    </div>
    <div class="button">
      <el-button-group>
        <el-button v-on:click="leftPage" type="text" round icon="el-icon-arrow-left" size="large">上一页</el-button>
        <el-button v-on:click="rightPage" type="text" size="medium" round>下一页
          <i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
      </el-button-group>
    </div>
    <div class="newuser">
      <h2>添加新用户</h2>
      <input type="text" name="adminName" id="adminName" placeholder="用户名">
      <input type="password" name="password" id="password" placeholder="新密码">
      <input type="password" name="againPassword" id="againPassword" placeholder="请再次输入新密码">
      <input type="button" @click="addAdmin" class="button" value="提交">
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import { hexSha1 } from '../encryption/sha1'
  let arr = []
  let counter = 0
  export default {
    name: 'info',
    data() {
      return {
        utitle: '管理员信息',
        columns7: [
          {
            title: 'UserName',
            key: 'username',
            align: 'center'
          },
          {
            title: 'Action',
            key: 'action',
            width: 550,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                }, 'View'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.changePw(params.index)
                    }
                  }
                }, '更改密码'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                }, 'Delete')
              ])
            }
          }
        ],
        data6: [
        ]
      }
    },
    methods: {
      addAdmin () {
        let that = this;
        let username = $('#adminName').val();
        let password = $('#password').val();
        let newPassword = $('#againPassword').val();
        let reg = /^[A-Za-z0-9]+$/;
        let patrn = /^(\w){6,20}$/;
        if (!reg.exec(username) || username === '') {
          that.$notify.error({
            title: '错误',
            message: '用户名格式错误'
          });
        } else {
          if (!patrn.exec(password) || password === '') {
            that.$notify.error({
              title: '错误',
              message: '密码格式错误'
            });
          } else {
            // console.log(password);
            // console.log(newPassword);
            if (password !== newPassword) {
              that.$notify.error({
                title: '错误',
                message: '两次密码不一致'
              });
            } else {
              $.ajax({
                type: "GET",
                url: 'http://127.0.0.1:3000/addAdmin',
                dataType: "json",
                xhrFields: { withCredentials: true },
                data: {
                  username: username,
                  password: password
                },
                success: function (response) {
                  if (response.Error) {
                    that.$notify.error({
                      title: '错误',
                      message: response.Result
                    });
                  } else {
                    that.$notify({
                      title: '成功',
                      message: response.Result,
                      type: 'success'
                    })
                  }
                },
                error: function (err) {
                  that.$notify.error({
                    title: '错误',
                    message: '报名失败'
                  });
                }
              });
            }
          }
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      changePw () {
        let that = this
        this.$prompt('请输入新密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(\w){6,20}$/,
          inputErrorMessage: '密码格式不正确'
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '你的新密码是: ' + value
          });
          $.ajax({
            type: 'GET',
            url: 'http://127.0.0.1:3000/adminChange',
            data: {
              username: that.data6[index].username,
              password: hexSha1(value)
            },
            xhrFields: { withCredentials: true },
            dataType: 'json',
            success: function (response) {
              // console.log(response)
              // console.log(that.data6)
              if (response.Error) {
                that.$alert(response.Result, '提示', {
                  confirmButtonText: '确定'
                })
              } else {
                that.$alert('更改成功', '提示', {
                  confirmButtonText: '确定'
                })
              }
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      show(index) {
        this.$Modal.info({
          title: 'User Info',
          content: `Name：${this.data6[index].username}`
        })
      },
      remove(index) {
        let that = this
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $.ajax({
            type: 'GET',
            url: 'http://127.0.0.1:3000/adminDel',
            data: {
              id: that.data6[index].id
            },
            xhrFields: { withCredentials: true },
            dataType: 'json',
            success: function (response) {
              if (response.Error) {
                that.$alert(response.Result, '提示', {
                  confirmButtonText: '确定'
                })
              } else {
                that.$alert('删除成功', '提示', {
                  confirmButtonText: '确定'
                })
              }
            }
          });
          that.data6.splice(index, 1)
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      leftPage() {
        if (counter === 0) {
          this.$alert('已经是第一页', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: `action: ${action}`
              })
            }
          })
        } else {
          counter--
          this.data6 = arr[counter]
        }
      },
      rightPage() {
        if (counter === arr.length - 1) {
          this.$alert('已经是最后一页', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: `action: ${action}`
              })
            }
          })
        } else {
          counter++
          this.data6 = arr[counter]
        }
      }
    },
    mounted() {
      var that = this
      $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:3000/adminInfoAll',
        dataType: 'json',
        xhrFields: { withCredentials: true },
        success: function (response) {
          // console.log(response)
          // console.log(that.data6)
          if (response.Error) {
            that.$alert(response.Result, '提示', {
              confirmButtonText: '确定'
            })
          } else {
            arr[0] = []
            let j = 0
            arr[j].push(response.Result[0])
            for (let i = 1; i < response.Result.length; i++) {
              if (i % 3 === 0) {
                j++
                arr[j] = []
              }
              arr[j].push(response.Result[i])
            }
            // console.log(arr)
            that.data6 = arr[0]
          }
        }
      })
    }
  }
</script>

<style lang="less" scoped>
  * {
    margin: 0;
    padding: 0;
  }

  .box {
    /* box-sizing: border-box; */
    /* width: calc(100%-55px); */
    box-sizing: border-box;
    border-left: 275px solid transparent;
    border-right: 220px solid transparent;
    height: 100%;
    /* border-top: 60px solid transparent; */
    /* height: calc(100%-100px); */
  }

  .utitle {
    width: 200px;
    height: 40px;
    /* background-color: rgba(224, 219, 219, 0.842); */
    margin: 40px 0;
    min-width: 1000px;
  }
  .tab {
    min-width: 1000px;
  }

  .button {
    width: 210px;
    height: 50px;
    /* background-color: aqua; */
    margin: 50px auto;
    overflow: hidden;
    vertical-align: middle;
  }
  .newuser {
    width: 100%;
    min-width: 1000px;
    h2 {
      text-align: center;
      font-weight: 600;
      letter-spacing: 2px;
      padding-bottom: 20px;
    }
    #adminName,
    #password,
    #againPassword {
      margin-top: 20px;
      width: 100%;
      height: 40px;
      border: 0;
      color: rgb(0, 1, 7);
      border-radius: 5px;
      font-size: 16px;
      font-weight: 500;
      // background-color: transparent;
      // background-color: rgba(255, 255, 255, 0.383);
      border: 1px solid rgba(107, 6, 6, 0.3); /*边框半透明*/
      box-shadow: inset 0 0 14px rgba(255,255,255,0.2),0 0 14px rgba(255,255,255,0.2);/*内外渐变阴影*/
      font-size: 1.2em;
      padding-left: 12px;
    }
    .button {
      width: 100%;
      height: 43px;
      border: 0;
      border-radius: 5px;
      margin-top: 10px;
      font-size: 1.25em;
      font-weight: bold;
      background-color: #66d0faf5;
      color: #808080;
    }
    .button:hover {
      color: #f9fafce8;
      background-color: rgb(53, 160, 248);
    }
    .button:active {
      -webkit-transform: translateY(2px);
      -moz-transform: translateY(2px);
    }
    input:focus {
      outline: none;
      // border: 1px solid red;
      background-color: rgb(156, 220, 245);
    }
    input::-webkit-input-placeholder {
      color: rgba(2, 15, 26, 0.733);
      font-weight: 400;
      font-size: 16px;
      letter-spacing: 2px;
      text-align: center;
    }
  }
</style>