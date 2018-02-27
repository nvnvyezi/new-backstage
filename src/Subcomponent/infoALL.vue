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
  </div>
</template>

<script>
import $ from 'jquery'
// import { getCookie } from '../js/cookie'
// const token = getCookie('token')
let arr = []
let counter = 0
export default {
  name: 'info',
  data () {
    return {
      utitle: '报名人员信息',
      columns7: [
        {
          title: 'Name',
          key: 'name',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('strong', params.row.name)
            ])
          }
        },
        {
          title: 'Id',
          key: 'id'
        },
        {
          title: 'Sex',
          key: 'sex'
        },
        {
          title: 'Class',
          key: 'class'
        },
        {
          title: 'Phone',
          key: 'phone'
        },
        {
          title: 'Email',
          key: 'email'
        },
        {
          title: 'Words',
          key: 'words'
        },
        {
          title: 'Direction',
          key: 'direction'
        },
        {
          title: 'State',
          key: 'state'
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
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
    show (index) {
      this.$Modal.info({
        title: 'User Info',
        content: `Name：${this.data6[index].name}<br>Id：${this.data6[index].id}<br>Sex：${this.data6[index].sex}<br>Class：${this.data6[index].class}<br>Phone：${this.data6[index].phone}<br>Email：${this.data6[index].email}<br>Words：${this.data6[index].words}<br>Direction：${this.data6[index].direction}<br>State：${this.data6[index].state}`
      })
    },
    remove (index) {
      let that = this
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $.ajax({
          type: 'GET',
          // url: 'http://127.0.0.1:3000/Delete',
          url: 'http://193.112.4.143:3001/Delete',
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
    leftPage () {
      if (counter === 0) {
        this.$alert('已经是第一页', '提示', {
          confirmButtonText: '确定'
        })
      } else {
        counter--
        this.data6 = arr[counter]
      }
    },
    rightPage () {
      if (counter === arr.length - 1) {
        this.$alert('已经是最后一页', '提示', {
          confirmButtonText: '确定'
        })
      } else {
        counter++
        this.data6 = arr[counter]
      }
    }
  },
  mounted () {
    let that = this
    $.ajax({
      type: 'GET',
      // url: 'http://127.0.0.1:3000/infoAll',
      url: 'http://193.112.4.143:3001/infoAll',
      xhrFields: { withCredentials: true },
      dataType: 'json',
      success: function (response) {
        if (response.Error) {
          that.$alert(response.Result, '提示', {
            confirmButtonText: '确定'
          })
        } else {
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
    border-left: 75px solid transparent;
    border-right: 20px solid transparent;
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
