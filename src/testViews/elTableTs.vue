<template>
  <div class="elTable-container" id="elTableContainer">
    <el-button type="danger" @click="handleDelete">删除</el-button>
    <!-- container="#elTableContainer" -->
    <el-table-ts
      ref="elTableTs"
      :data="list"
      :columns="columns"
      stripe
      border
      auto-to-top
      auto-do-layout
      :falsey-render="true"
      :directives="directives"
      :col-attrs="{align: 'center'}"
      :pagination="pagination"
      :total="100"
      :header-cell-class-name="headerCellClassName"
      :cell-class-name="cellClassName"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      @scroll="handleScroll"
      @select="handleSelect"
      @row-click="handleRowClick"
      @sort-change="handleSortChange"
      @render-complete="handleRender"
    >
      <template #paginationLeft>分页的左侧，通过插槽设置</template>
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
import { deepClone } from '../components/utils/opera.ts'

console.log(MockData.data, '数据')
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
        currentPage: 1
      },
      list: MockData.data,
      // 设置多级表头后，border将一直未true
      columns: [
        {
          align: 'center',
          type: 'selection'
          // selectable: () => {
          //   return false
          // }
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
          }
        },
        {
          label: '序号',
          align: 'center',
          type: 'index',
          width: '80px'
        },

        {
          label: 'ID',
          prop: 'id'
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
          children: [
            {
              label: '曾用名',
              prop: 'oldName'
            },
            {
              label: '现用名',
              prop: 'name'
            }
          ]
        },
        {
          label: '年龄',
          prop: 'age',
          // 内置的formatter不支持，请使用customRender
          customRender: ({ cellValue }) => {
            return `${cellValue}岁`
          }
        },
        {
          label: '出生日期',
          prop: 'birth',
          width: '240px',
          // 初始状态下是否直接进入编辑，默认为false，需要在editable: true时点击单元格进入编辑
          // 行与列设置平等
          editMode: true,
          editable: true,
          editFormConfig: {
            editComponent: 'DatePicker',
            // 必须指定，表格值无法直接渲染date类型
            valueFormat: 'yyyy-MM-dd',
            valueSeparator: '  123  ',
            type: 'daterange',
            on: {}
          }
        },
        {
          label: '存款',
          prop: 'money',
          money: true
        },
        {
          label: '是否结婚',
          prop: 'married',
          // 初始状态下是否直接进入编辑，默认为false，需要在editable: true时点击单元格进入编辑
          // 行与列设置平等
          editMode: true,
          editable: true,
          editFormConfig: {
            editComponent: 'Radio',
            options: [
              { value: 0, label: '否' },
              { value: 1, label: '是' }
            ],
            on: {}
          }
          // 是否是自定义的edit，默认为false
          // customEdit: true
        },
        {
          label: '描述.身高',
          prop: 'desc.height'
        },
        // 脱敏默认支持 手机、座机、身份证号、银行卡、邮箱
        {
          label: '邮箱(脱敏列)',
          prop: 'email'
          // mask: true
        },
        {
          label: '操作',
          fixed: 'right',
          prop: 'handle',
          width: '240',
          scopedSlots: {
            // slot name
            customRender: 'handle',
            customTitle: 'handleTitle'
          }
          // customRender: ({cellValue, row, column, $index, h}) => h('el-button', '查看详情')
          // customRender: ({cellValue, row, column, $index}) => {
          //   return (<div>
          //     <el-button type="primary" onClick={() => this.handleDetail(row)}>查看详情</el-button>
          //     <el-button type="danger" onClick={() => this.handleDel(row)}>删除</el-button>
          //   </div>)
          // }
        }
      ],
      // 内置指令配置项
      directives: {
        // 高度自适应指令配置项
        heightAdaptive: {}
      }
    }
  },
  created() {
    // setTimeout(() => {
    //   this.columns.splice(1,1)
    // }, 2000)
  },
  methods: {
    headerCellClassName({ row, column, rowIndex, columnIndex }) {
      // console.log(row, 'row')
      // console.log(column, 'column')
      // console.log(rowIndex, 'rowIndex')
      // console.log(columnIndex, 'columnIndex')
      return '我是头单元格class'
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      // console.log(row, 'row')
      // console.log(column, 'column')
      // console.log(rowIndex, 'rowIndex')
      // console.log(columnIndex, 'columnIndex')
      return '我是单元格class'
    },
    handleRender(instance) {
      console.log(instance, '表格实例')
    },
    handleSelect(selection, row) {
      console.log(selection, 'selection')
      console.log(row, 'row')
    },
    handleDelete() {
      const list1 = deepClone(this.list)
      const selection = this.$refs.elTableTs.tableInstance.selection
      selection.forEach(o => {
        const index = this.list.findIndex(m => m.id === o.id)
        if (index > -1) {
          list1.splice(index, 1)
        }
      })
      this.list = list1
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
    }
  }
}
</script>
<style lang="scss">
#elTableContainer {
  /* height: 600px; */
  /* position: relative; */
}
.el-pagination {
  padding: 24px 5px;
}
</style>
