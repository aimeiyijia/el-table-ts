<template>
  <div id="app">
    <el-table-ts
      :data="list"
      :columns="columns"
      @row-click="rowClickHandle"
      @sort-change="sortChangeHandle"
      stripe
      border
      :pagination="pagination"
      :total="100"
      @page-change="pageChangeHandle"
      @size-change="sizeChangeHandle"
      @scroll="scroll"
      @select="select"
    >
      <template #handle="{cellValue, row, column}">
        <el-button
          type="primary"
          @click="detailHandle({cellValue, row, column})"
        >
          查看详情
        </el-button>
        <el-button type="danger" @lick="this.delHandle(row)">删除</el-button>
      </template>
    </el-table-ts>
  </div>
</template>

<script>
import { $post } from '@/http'
import AxiosPlugin from '@/plugin/axios'
const listData = JSON.parse(
  '{"code":200,"message":"success","data":[{"id":50745,"name":"rtBNhgqCDR","storage":8620,"member":{"id":50961,"userId":"51262","email":"Nu87YypnB@AK22e.rgu","projectRole":"Qa4ohl6qhT"},"mount":[{"mountType":"M8Rhh2Ntp6","mountName":"bFTDHyixr3","mountPath":"uwDTMtnbCW","userName":"nYIE5YoQve"},{"mountType":"8pUyKzNPjL","mountName":"TVaV7bjr1y","mountPath":"HoazVStmm5","userName":"nbGzaRjLjK"},{"mountType":"nD3hnojrY0","mountName":"vtJvtG05Jw","mountPath":"p5VWi1ptsi","userName":"8ERyVxGL3R"}],"gmtCreate":34327},{"id":51414,"name":"1A6ogTNZl1","storage":36580,"member":{"id":51767,"userId":"52603","email":"606UKO@AgasP.qmt","projectRole":"q8KkeQyD8f"},"mount":[{"mountType":"VG3JPYd4n5","mountName":"ijPznKZnUQ","mountPath":"SiQIq2ypee","userName":"rAhVP1UTUQ"},{"mountType":"B900pSNnAf","mountName":"MGFUwpuZq2","mountPath":"RQJOgsV806","userName":"acfdNaETLA"},{"mountType":"L81aEPhXWJ","mountName":"7hWszN6MpP","mountPath":"e99n7mLoHe","userName":"t2d5oVwRqV"}],"gmtCreate":78533},{"id":52659,"name":"srO0gfnHho","storage":46240,"member":{"id":52998,"userId":"53927","email":"M37YXor@949Y0.acq","projectRole":"2ikIgsSabL"},"mount":[{"mountType":"YjxjSNSyOv","mountName":"lRsFRwSWgc","mountPath":"Z1rMIGu0cR","userName":"CoUSbae92N"},{"mountType":"N716xNCa4q","mountName":"uxYPo7TGcG","mountPath":"pXyJpuZ1CX","userName":"oiubmGJ4dQ"},{"mountType":"r3PqYBkT9y","mountName":"Pp6B1yZXhi","mountPath":"SjbANI8SmS","userName":"9h8k3elmdM"}],"gmtCreate":98416}]}'
).data
export default {
  name: 'app',
  data() {
    return {
      pagination: {
        pageSizes: [10, 20, 50, 70],
        pageSize: 10,
        layout: 'prev, pager, next, sizes, jumper, ->, total',
        background: true,
        currentPage: 3,
        small: true,
      },
      list: listData,
      columns: [
        {
          align: 'center',
          type: 'selection',
          prop: 'selection',
        },
        {
          label: '序号',
          align: 'center',
          type: 'index',
          prop: 'index',
        },
        {
          label: '1',
          type: 'expand',
          prop: 'expand',
          customRender: ({ cellValue, row, column }) => {
            return (
              <div>
                {row.name}、{row.storage}
              </div>
            )
          },
          customTitle: ({ $index }) => {
            return $index + 1
          },
        },
        {
          label: 'ID',
          prop: 'id',
          width: '80px',
        },
        { label: '存储卷名', prop: 'name', type: 'copy' },
        { label: '总容量', prop: 'storage' },
        {
          label: '创建人',
          prop: 'member.userId',
          type: 'el-tag',
          sortable: 'custom',
          'sort-orders': ['ascending', 'descending'],
        },
        { label: '邮箱', prop: 'member.email' },
        { label: '创建时间', prop: 'gmtCreate' },
        {
          label: '操作',
          fixed: 'right',
          prop: 'handle',
          scopedSlots: {
            // slot name
            customRender: 'handle',
            customTitle: 'handleTitle',
          },
          // customRender: ({cellValue, row, column, $index, h}) => h('el-button', '查看详情')
          // customRender: ({cellValue, row, column, $index}) => {
          //   return (<div>
          //     <el-button type="primary" onClick={() => this.detailHandle(row)}>查看详情</el-button>
          //     <el-button type="danger" onClick={() => this.delHandle(row)}>删除</el-button>
          //   </div>)
          // }
        },
      ],
    }
  },
  mounted() {
    // const timer = setTimeout(() =>{
    //   console.log('分页变化')
    //   this.pagination.pageSize = 20
    // }, 2000)
    // $post('/broke/meetingManagement/list', {})
  },
  methods: {
    select(selection, row){
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
