<template>
  <div class="box">
    <div class="utitle">
      <h1>
        {{ oneTitle }}
      </h1>
    </div>
    <div class="button">
      <el-input
        id="username"
        autofocus
        placeholder="请输入内容"
        v-model="input10"
        clearable>
      </el-input>
      <el-button v-on:click="ajax_form">提交</el-button>
    </div>
    <div>
      <el-select id="stateForm" v-model="value4" clearable placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button v-on:click="state_form">提交</el-button>
    </div>
    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="cate" label="类别" width="180">
        </el-table-column>
        <el-table-column prop="message" label="信息">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
let name = ''
export default {
  data () {
    return {
      name: 'infoOne',
      options: [
        {
          value: '选项1',
          label: '一面通过'
        },
        {
          value: '选项2',
          label: '二面通过'
        }, {
          value: '选项3',
          label: '三面通过'
        }],
      value4: '状态',
      input10: '',
      oneTitle: '个人信息展示',
      tableData: []
    }
  },
  methods: {
    ajax_form () {
      this.tableData = []
      const that = this
      name = $('#username').val()
      $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:3000/infoOne',
        data: {
          id: name
        },
        xhrFields: { withCredentials: true },
        dataType: 'json',
        success: function (response) {
          // console.log(response)
          if (response.Error) {
            that.$alert(response.Result, '提示', {
              confirmButtonText: '确定'
            })
          } else {
            // console.log(response.Result[0])
            const res = response.Result[0]
            for (const index in res) {
              let arr = {}
              arr.cate = index
              arr.message = res[index]
              that.tableData.push(arr)
            }
          }
        }
      })
    },
    state_form () {
      const that = this
      let state = ''
      state = $('#stateForm').val()
      // console.log(state)
      this.$confirm('你将更改面试结果, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $.ajax({
          type: 'GET',
          url: 'http://127.0.0.1:3000/change',
          data: {
            id: name,
            state: state,
          },
          xhrFields: { withCredentials: true },
          dataType: 'json',
          success: function (response) {
            // console.log(response);
            if (response.Error) {
              that.$alert(response.Result, '提示', {
                confirmButtonText: '确定'
              })
            } else {
              // alert(1)
              that.$alert('更改成功', '提示', {
                confirmButtonText: '确定'
              })
              that.ajax_form();
            }
          }
        })
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已取消更改'
        });
      });
    }
  }
}
</script>

<style lang="less" scoped>
  .box {
    /* box-sizing: border-box; */
    /* width: calc(100%-55px); */
    box-sizing: border-box;
    border-left: 175px solid transparent;
    border-right: 120px solid transparent;
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
    width: 100%;
    height: 100px;
    margin-top: 50px;
    // background-color: aqua;
  }
</style>
