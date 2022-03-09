<template>
  <div class="elTable-container">
    <el-table-ts
      :data="list"
      :columns="columns"
      stripe
      border
      :col-attrs="{align: 'center'}"
      :pagination="pagination"
      :total="100"
      :directives="directives"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      @scroll="handleScroll"
      @select="handleSelect"
      @row-click="handleRowClick"
      @sort-change="handleSortChange"
    >
      <!-- <template slot="empty">普通插槽</template> -->
      <!-- <template #empty>作用域插槽</template> -->
      <!-- <template slot="append">普通append插槽</template> -->
      <!-- <template #append="data">{{data}}</template> -->
      <template #handle="{cellValue, row, column}">
        <el-button
          type="primary"
          @click="handleDetail({cellValue, row, column})"
        >
          查看详情
        </el-button>
        <el-button type="danger" @click="handleDel(row)">删除</el-button>
      </template>
      <template #handleTitle>我是自定义的操作标题</template>
      <template #pagination="{total}">
        <div>现在您在{{ pagination.currentPage }}页，共{{ total }}条</div>
      </template>
    </el-table-ts>
  </div>
</template>

<script>
import { MockData } from 'mock'
export default {
  name: 'app',
  data() {
    return {
      dialogVisible: false,
      pagination: {
        pageSizes: [10, 20, 50, 70],
        pageSize: 10,
        layout: 'slot, pager, sizes',
        background: true,
        currentPage: 1,
      },
      list: MockData.data,
      columns: [
        {
          align: 'center',
          type: 'selection',
        },
        {
          label: '1',
          type: 'expand',
          width: '110px',
          customRender: ({ cellValue, row, column }) => {
            return (
              <div>
                {row.name}、{row.storage}
              </div>
            )
          },
          customTitle: ({ $index }) => {
            return '你可以展开我'
          },
        },
        {
          label: '序号',
          align: 'center',
          type: 'index',
          width: '80px',
        },

        {
          label: 'ID',
          prop: 'id',
        },
        {
          label: '姓名',
          prop: 'name',
          sortable: true,
          sortOrders: ['ascending', 'descending'],
          sortMethod: (a, b) => {
            const { name: aName } = a
            const { name: bName } = b
            return aName.localeCompare(bName)
          },
        },
        {
          label: '年龄',
          prop: 'age',
          // 内置的formatter不支持，请使用customRender
          customRender: ({ cellValue }) => {
            return `${cellValue}岁`
          },
        },
        {
          label: '描述.身高',
          prop: 'desc.height',
        },
        {
          label: '操作',
          fixed: 'right',
          prop: 'handle',
          width: '240',
          scopedSlots: {
            // slot name
            customRender: 'handle',
            customTitle: 'handleTitle',
          },
          // customRender: ({cellValue, row, column, $index, h}) => h('el-button', '查看详情')
          // customRender: ({cellValue, row, column, $index}) => {
          //   return (<div>
          //     <el-button type="primary" onClick={() => this.handleDetail(row)}>查看详情</el-button>
          //     <el-button type="danger" onClick={() => this.handleDel(row)}>删除</el-button>
          //   </div>)
          // }
        },
      ],
      // 内置指令配置项
      directives: {
        // 高度自适应指令配置项
        heightAdaptive: {
          bottomOffset: 100,
        },
      },
    }
  },
  created() {
    // setTimeout(() => {
    //   this.directives.heightAdaptive.bottomOffset = 300
    //   console.log(this.directives, '变化')
    // }, 2000)
  },
  methods: {
    handleSelect(selection, row) {
      console.log(selection, row)
    },
    handleDetail({ row }) {
      console.log(row, `详情操作`)
      this.$message.success(`ID: ${row.id}`)
    },
    handleDel(row) {
      console.log(row, `删除操作`)
      this.$message.error(`ID: ${row.id}`)
    },

    handleRowClick(row, column, event) {
      console.log(row, column, event, '行点击')
    },
    handleSortChange(o) {
      // str.sort(function(a,b){return a.localeCompare(b)})
      console.log(o, '排序触发')
    },
    handlePageChange({ currentPage }) {
      console.log(currentPage, '触发分页')
    },
    handleSizeChange({ pageSize }) {
      console.log(pageSize, '触发页数变化')
    },
    handleScroll(e) {
      console.log(e)
      // console.log(pageSize, currentPage)
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
