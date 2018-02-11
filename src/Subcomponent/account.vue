<template>
  <div class="box">
    <div class="utitle">
      <h1>
        {{ utitle }}
      </h1>
    </div>
    <div>
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
    <div>
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="ruleForm2.age"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
          <el-button @click="resetForm('ruleForm2')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import { getCookie } from '../js/cookie'
  // import { hexSha1 } from '../encryption/sha1'
  const token = getCookie('token')
  let arr = []
  let counter = 0
  export default {
    name: 'info',
    data() {
      let checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm2: {
          pass: '',
          checkPass: '',
          age: ''
        },
        rules2: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          age: [
            { validator: checkAge, trigger: 'blur' }
          ]
        },
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
                }, 'success'),
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
              password: hexSha1(value),
              token: token
            },
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
        $.ajax({
          type: 'GET',
          url: 'http://127.0.0.1:3000/adminDel',
          data: {
            id: that.data6[index].id,
            token: token
          },
          dataType: 'json',
          success: function (response) {
            // console.log(response)
            // console.log(that.data6)
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
        })
        this.data6.splice(index, 1)
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
        data: {
          token: token
        },
        success: function (response) {
          // console.log(response)
          // console.log(that.data6)
          arr[0] = []
          let j = 0
          arr[j].push(response.Result[0])
          for (let i = 1; i < response.Result.length; i++) {
            if (i % 12 === 0) {
              j++
              arr[j] = []
            }
            arr[j].push(response.Result[i])
          }
          // console.log(arr)
          that.data6 = arr[0]
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
  }

  .button {
    width: 210px;
    height: 50px;
    /* background-color: aqua; */
    margin: 50px auto;
    overflow: hidden;
    vertical-align: middle;
  }
</style>