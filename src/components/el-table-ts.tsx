import Vue, { VNode, CreateElement } from 'vue'
import './directives.js'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import omit from 'lodash/omit'
import isString from 'lodash/isString'
import isBoolean from 'lodash/isBoolean'
import isObject from 'lodash/isObject'
import { Pagination, TableColumn } from 'element-ui'
// 样式
import './index.scss'
// 默认分页配置
declare class ElTableTsDefPagination {
  currentPage: number
  pageSizes: number[]
  pageSize: number
  layout: string
  background: boolean
}

@Component
export default class ElTableTs extends Vue {
  // 数据加载提示
  @Prop(Boolean) readonly loading: boolean | undefined

  // 表格每列配置项
  @Prop({ type: Array, default: () => [] }) readonly columns!: TableColumn[]

  // 数据相关
  @Prop({ type: Array, default: undefined }) readonly data!: undefined[] | undefined

  // 分页
  @Prop({ type: [Boolean, Object], default: () => { return { pageSize: 10, currentPage: 1 } } }) readonly pagination: Pagination | undefined | boolean
  @Prop({ type: Number, default: 0 }) readonly total: number | undefined



  // 表格组件的 bodyWrapper元素
  private tableWrap: any = null

  // 是否展示分页器
  isShowPag: boolean = true

  // 默认分页配置
  private defPagination: ElTableTsDefPagination = {
    currentPage: 1,
    pageSizes: [10, 20, 30, 50],
    pageSize: 10,
    layout: 'prev, pager, next, sizes, total',
    background: true,
  }

  private tableData: undefined[] | undefined = []

  // 传递给外部的分页指示参数
  private pageSize: number = 0

  private currentPage: number = 0

  @Watch('pagination', { deep: true })
  onPaginationChanged(val: Pagination) {
    this.setPagination()
  }

  mounted() {

    this.tableData = this.data

    this.setPagination()

    this.setTableScrollListener()

  }

  // 设置分页配置
  setPagination() {
    const pagination = this.pagination
    if (isBoolean(pagination)) {
      this.isShowPag = (pagination as boolean)
    }
    if (isObject(pagination)) {
      this.isShowPag = true
      Object.assign(this.defPagination, pagination)
      const { pageSize, currentPage } = this.defPagination
      this.pageSize = pageSize
      this.currentPage = currentPage
    }
  }

  // 设置表格滚动监听器
  setTableScrollListener() {
    const table: any = this.$refs.table
    this.tableWrap = table.bodyWrapper

    table.bodyWrapper.addEventListener('scroll', this.tableScroll)
    this.$once('hook:beforeDestroy', () => {
      this.tableWrap.removeEventListener('scroll', this.tableScroll)
    })
  }

  pageSizeChange(pageSize: number): void {
    this.pageSize = pageSize
    this.emitSizeChangeEvent()
  }

  currentChange(currentPage: number): void {
    this.currentPage = currentPage
    this.emitPageChangeEvent()
  }


  @Emit('scroll')
  tableScroll(e: MouseEvent) {
    e.preventDefault()
    return e
  }


  @Emit('page-change')
  emitPageChangeEvent() {
    return {
      pageSize: this.pageSize,
      currentPage: this.currentPage
    }
  }

  @Emit('size-change')
  emitSizeChangeEvent() {
    return {
      pageSize: this.pageSize,
      currentPage: this.currentPage
    }
  }

  render(h: CreateElement): VNode {

    const directives = [
      { name: 'height-adaptive', value: { topOffset: 10, bottomOffset: 10, hOffset: 50 } }
    ]

    // 移除分页事件
    const tableListeners = omit(this.$listeners, ['page-change', 'size-change'])

    const getCellValue = (column: TableColumn, row: any) =>
      column.prop.split('.').reduce((obj, cur) => obj[cur], row)

    const renderColumns = (columns: TableColumn[]) =>
      columns
        .filter((i: any) => !i.hidden)
        .map(c => {
          const options = Object.assign({ scopedSlots: {}, prop: '' }, c)

          const scopedSlots = {
            default: ({ row, column: elColumn, $index, store, _self }: { row: any, column: TableColumn, $index: number, store: any, _self: any }) => {
              const column: any = Object.assign({}, options, elColumn)
              // 支持链式. 如：xxx.xxx
              const cellValue = getCellValue(column, row)

              if (column.scopedSlots && column.scopedSlots.customRender && !isString(column.scopedSlots.customRender)) {
                console.error("插槽名必须是String类型")
                return
              }

              // 自定义组件 指定slot name的优先级比直接指定自定义渲染函数优先级高
              column.customRender =
                column.customRender ||
                this.$scopedSlots[column.scopedSlots.customRender]
              if (column.customRender) {
                return column.customRender({
                  cellValue,
                  row,
                  column,
                  $index,
                  h,
                  store,
                  _self
                })
              }
              // 兼容element-ui formatter属性 因为formatter是格式化cellValue的，所以需要拦截下
              if (column.formatter) {
                return column.formatter({
                  cellValue,
                  row,
                  column,
                  $index,
                  store,
                  _self
                })
              }

              return cellValue
            },
            header: ({ column: elColumn, $index, store, _self }: { column: TableColumn, $index: number, store: any, _self: any }) => {
              const column: any = Object.assign({}, options, elColumn)

              if (column.scopedSlots && column.scopedSlots.customTitle && !isString(column.scopedSlots.customTitle)) {
                console.error("插槽名必须是String类型")
                return
              }

              column.customTitle =
                column.customTitle ||
                this.$scopedSlots[column.scopedSlots.customTitle]
              if (column.customTitle) {
                return column.customTitle({
                  column,
                  $index,
                  store,
                  _self
                })
              }
              return column.label
            }
          }

          return (
            <el-table-column
              key={options.prop}
              {...{ props: options }}
              scopedSlots={scopedSlots}
            />
          )
        })

    return (
      <div class="el-table-ts" v-loading={this.loading}>
        <el-table
          ref="table"
          height="0"
          data={this.tableData}
          {...{ directives }}
          {...{ props: this.$attrs, on: tableListeners }}
        >
          {renderColumns(this.columns)}
        </el-table>
        {this.isShowPag && (
          <el-pagination
            {...{ props: this.defPagination }}
            total={this.total}
            on-size-change={this.pageSizeChange}
            on-current-change={this.currentChange}
          />
        )}
      </div>
    )
  }
}
