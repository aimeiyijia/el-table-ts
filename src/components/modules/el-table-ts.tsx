import Vue, { VNode, CreateElement } from 'vue'
import '../directives/height-adaptive.ts'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import omit from 'lodash/omit'
import isString from 'lodash/isString'
import isBoolean from 'lodash/isBoolean'
import isObject from 'lodash/isObject'
import { generateUUID } from '../utils/uuid'
import { Pagination, TableColumn } from 'element-ui'
// 样式
import '../styles/index.scss'

// 默认分页配置
declare class ElTableTsDefPagination {
  currentPage: number
  pageSizes: number[]
  pageSize: number
  layout: string
  background: boolean
}

declare interface IDirectives {
  heightAdaptive?: {
    bottomOffset: number;
    topOffset: number;
  }
}

@Component
export default class ElTableTs extends Vue {
  // 内置指令的配置项
  @Prop({ type: Object, default: () => { return { heightAdaptive: { bottomOffset: 40 } } } }) readonly directives: any | IDirectives
  // 表格每列配置项
  @Prop({ type: Array, default: () => [] }) readonly columns!: TableColumn[]

  // 更加统一化的列配置项
  @Prop({ type: Object, default: () => {} }) readonly colAttrs?: TableColumn

  // 数据相关
  @Prop({ type: Array, default: () => [] }) readonly data!: any[]

  // 分页
  @Prop({ type: [Boolean, Object], default: () => { return { pageSize: 10, currentPage: 1 } } }) readonly pagination: Pagination | undefined | boolean
  @Prop({ type: Number, default: 0 }) readonly total: number | undefined



  // 表格组件的 bodyWrapper元素
  private tableWrap: any = null

  // 是否展示分页器
  isShowPag = true

  // 默认分页配置
  private defPagination: ElTableTsDefPagination = {
    currentPage: 1,
    pageSizes: [10, 20, 30, 50],
    pageSize: 10,
    layout: 'prev, pager, next, sizes, total',
    background: true,
  }

  // 传递给外部的分页指示参数
  private pageSize = 0

  private currentPage = 0

  @Watch('pagination', { deep: true })
  onPaginationChanged(val: Pagination) {
    this.setPagination()
  }

  // 将来留作拦截掉一些不支持统一配置的配置项
  get columnsAttrs(){
    return this.colAttrs
  }

  mounted() {

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
  @Emit('current-change')
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

  @Emit('prev-click')
  emitPrevClick() {
    return {
      pageSize: this.pageSize,
      currentPage: this.currentPage - 1
    }
  }

  @Emit('next-click')
  emitNextClick() {
    return {
      pageSize: this.pageSize,
      currentPage: this.currentPage + 1
    }
  }

  getheightAdaptiveValue() {
    const defaultBottomOffset = 40
    const { heightAdaptive } = this.directives
    if (heightAdaptive) {
      const { bottomOffset } = heightAdaptive
      if (bottomOffset) {
        return bottomOffset
      }
      return defaultBottomOffset
    }
    return defaultBottomOffset
  }

  render(h: CreateElement): VNode {
    // 高度自适应指令
    const directives = [
      { name: 'height-adaptive', value: { bottomOffset: this.getheightAdaptiveValue(), topOffset: this.directives.heightAdaptive.topOffset } }
    ]


    // 移除不支持自定义插槽的列类型 type[index/selection]
    const noSlots = ['index', 'selection']

    // 移除分页事件，防止事件冲突
    const tableListeners = omit(this.$listeners, ['page-change', 'size-change', 'prev-click', 'next-click'])

    // 从插槽中移除内置的插槽 pagination
    const customScopedSlots = omit(this.$scopedSlots, ['pagination'])

    const getCellValue = (column: TableColumn, row: any) => {
      return column.prop.split('.').reduce((obj, cur) => {
        if (obj) {
          return obj[cur]
        }
      }, row)
    }


    const renderColumns = (columns: TableColumn[]) =>
      columns
        .filter((i: any) => !i.hidden)
        .map(c => {
          const options = Object.assign({ ...this.columnsAttrs, scopedSlots: {}, prop: '' }, c)
          let sampleScopedSlots = {}


          const scopedSlots = {
            default: ({ row, column: elColumn, $index, store, _self }: { row: any, column: TableColumn, $index: number, store: any, _self: any }) => {

              const column: any = Object.assign({}, options, elColumn)

              // 获取单元格的原始值
              const cellValue = getCellValue(column, row)

              if (column.scopedSlots && column.scopedSlots.customRender && !isString(column.scopedSlots.customRender)) {
                console.error("slotName must be string")
                return
              }

              // 自定义单元格 指定slot name的优先级比自定义渲染函数优先级低
              column.customRender =
                column.customRender ||
                customScopedSlots[column.scopedSlots.customRender]
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
              return cellValue
            },
            header: ({ column: elColumn, $index, store, _self }: { column: TableColumn, $index: number, store: any, _self: any }) => {
              const column: any = Object.assign({}, options, elColumn)

              if (column.scopedSlots && column.scopedSlots.customTitle && !isString(column.scopedSlots.customTitle)) {
                console.error("slotName must be string")
                return
              }

              column.customTitle =
                column.customTitle ||
                customScopedSlots[column.scopedSlots.customTitle]
              if (column.customTitle) {
                return column.customTitle({
                  column,
                  $index,
                  h,
                  store,
                  _self
                })
              }
              return column.label
            }
          }

          if (!noSlots.includes(options.type)) {
            sampleScopedSlots = {
              scopedSlots
            }
          }

          return (
            <el-table-column
              key={generateUUID()}
              {...{ props: options }}
              {...sampleScopedSlots}
            />
          )
        })

    const renderPageSlot = () => {
      if (!this.$scopedSlots.hasOwnProperty('pagination')) return
      return this.$scopedSlots.pagination!({
        total: this.total,
        config: omit(this.defPagination, ['pageSize', 'currentPage'])
      })
    }

    return (
      <div class="el-table-ts">
        <el-table
          ref="table"
          height="0"
          data={this.data}
          {...{ directives }}
          {...{ props: this.$attrs, on: tableListeners }}
        >
          {renderColumns(this.columns)}
        </el-table>
        {this.isShowPag && (
          <el-pagination
            {...{ props: this.defPagination }}
            total={this.total}
            {...{
              on: {
                'size-change': this.pageSizeChange,
                'current-change': this.currentChange,
                'prev-click': this.emitPrevClick,
                'next-click': this.emitNextClick
              }
            }}
          >
            <span class="el-pagination__slot">{renderPageSlot()}</span>
          </el-pagination>
        )}
      </div>
    )
  }
}
