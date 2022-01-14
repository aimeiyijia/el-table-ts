<template>
  <div class="elTable-container">
    <el-table-http
      :netWork="httpConfig"
      :columns="columns"
      :directives="directives"
      stripe
      border
      @render="render"
    />
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      columns: [
        {
          label: '序号',
          type: 'index',
        },
        {
          label: '姓名',
          prop: 'name',
        },
        {
          label: '年龄',
          prop: 'age',
        },
      ],

      // 目前判断是否成功发起请求的唯一标识为  内部是否获取到关键数据
      httpConfig: {
        method: 'get',
        // 创建axios实例时传递的参数
        createConfig: {},

        // 发起请求时的额外参数，
        // 当已配置 method, url, data时，在httpConfig中这三个配置会失效
        httpConfig: {},

        // 发起请求时的额外数据
        data: {
          pageSizeTest: 10,
          pageNoTest: 1,
        },
        // 请求的url
        url: 'http://test.data',

        // 分页传参名称配置
        pag: {
          pageSizeName: 'pageSizeTest',
          pageNoName: 'pageNoTest',
        },

        // 解析路径
        // 标准格式为 {code, data: {[dataname]: 表格数据, total: 总条数}, msg }
        path: {
          // data的解析路径(对象取值语法data.data或data[data]),到data的目录为止，不需要包含[dataname]，例如在标准格式下 dataPath为 'data'
          // 不指定就按照标准格式路径去解析
          dataPath: 'data',
          // 不指定就默认dataName为data
          dataName: 'data',
          // 解析路径通dataPath, 数据总条数的属性名
          totalName: 'total',
        },
      },
      // 内置指令配置项
      directives: {
        // 高度自适应指令配置项
        heightAdaptive: {
          topOffset: 100,
          bottomOffset: 100,
        },
      },
    }
  },
  mounted() {
    // const timer = setTimeout(() =>{
    //   console.log('分页变化')
    //   this.pagination.pageSize = 20
    // }, 2000)
    // setInterval(() => {
    // this.httpConfig.method = 'post'
    // console.log(1)
    // this.columnsHttp.push({
    //   label: '出生日期' + new Date(),
    //   prop: 'birthday',
    // })
    // }, 2000)
  },
  methods: {
    open() {
      this.dialogVisible = true
    },
    render(api) {
      console.log(api, '组件')
      api.render()
      // const timer = setTimeout(() => {
      //   api.render()
      //   console.log('默认渲染数据')
      //   clearTimeout(timer)
      // }, 2000)
    },
    select(selection, row) {
      console.log(selection, row)
    },
    detailHandle({ row }) {
      console.log(row, '详情')
    },
    delHandle({ name }) {
      this.$message.error(`删除 ${name}`)
    },

    rowClickHandle(row, column, event) {
      console.log(column, '行点击')
      // console.log(row, column, event)
    },
    sortChangeHandle(o) {
      console.log(o)
    },
    prevClickHandle(e) {
      console.log(e, '上一')
      // console.log(pageSize, currentPage)
    },
    nextClickHandle(e) {
      console.log(e, '下一')
      // console.log(pageSize, currentPage)
    },
    pageChangeHandle(e) {
      console.log(e)
      // console.log(pageSize, currentPage)
    },
    sizeChangeHandle(e) {
      console.log(e)
      // console.log(pageSize, currentPage)
    },
    scroll(e) {
      console.log(e)
      // console.log(pageSize, currentPage)
    },

    // formatter
    formatter(row, column, cellValue, index) {
      console.log(row, column, cellValue, index)
      return 111
    },
  },
}
</script>
<style lang="scss">
html,
body,
#app {
  height: 100%;
}
</style>
