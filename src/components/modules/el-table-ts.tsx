import Vue, { VNode, CreateElement } from 'vue'
import '../directives/height-adaptive.ts'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { generateUUID } from '../utils/uuid'
import { isBoolean, isString, isObject, isUndefined } from '../utils/types'
import { omit } from '../utils/opera'

import { Table, Pagination, TableColumn } from 'element-ui'
// 样式
import '../styles/index.scss'

import PagStore from '../utils/store'
import { setTimeout } from 'timers'

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
  @Prop({ type: [Boolean, Object], default: () => { return { heightAdaptive: { bottomOffset: 40 } } } }) readonly directives: boolean | IDirectives | undefined
  // 表格每列配置项
  @Prop({ type: Array, default: () => [] }) readonly columns!: TableColumn[]

  // 更加统一化的列配置项
  @Prop({ type: Object, default: () => { } }) readonly colAttrs?: TableColumn
  @Prop({ type: Boolean, default: true }) readonly autoToTop?: boolean

  // 数据相关
  @Prop({ type: Array, default: () => [] }) readonly data!: any[]

  // 分页
  @Prop({ type: [Boolean, Object], default: () => { return { pageSize: 10, currentPage: 1 } } }) readonly pagination: Pagination | undefined | boolean
  @Prop({ type: Number, default: 0 }) readonly total: number | undefined

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

  // 内置指令

  @Watch('pagination', { deep: true })
  onPaginationChanged() {
    this.setPagination()
  }

  get tableInstance() {
    return this.$refs['ElTableTsRef'] as Table | any
  }

  get tableBodyWrapper() {
    return this.tableInstance.bodyWrapper as HTMLElement
  }

  // 将来留作拦截掉一些不支持统一配置的配置项
  get columnsAttrs() {
    return this.colAttrs
  }

  mounted() {

    this.setPagination()

    this.setTableScrollListener()

    this.$emit('render-complete', {
      tableInstance: this.tableInstance
    })
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
      PagStore.setCurrentPage(currentPage)
      PagStore.setPageSize(pageSize)
    }
  }

  // 设置表格滚动监听器
  setTableScrollListener() {
    this.tableBodyWrapper.addEventListener('scroll', this.tableScroll)
    this.$once('hook:beforeDestroy', () => {
      this.tableBodyWrapper.removeEventListener('scroll', this.tableScroll)
    })
  }

  setTableScrollToTop() {
    if (isUndefined(this.autoToTop) || (isBoolean(this.autoToTop) && this.autoToTop)) {
      this.tableBodyWrapper.scrollTop = 0
    }
  }

  pageSizeChange(pageSize: number): void {
    PagStore.pageSize = pageSize
    this.emitSizeChangeEvent()
  }

  currentChange(currentPage: number): void {
    PagStore.setCurrentPage(currentPage)
    this.emitPageChangeEvent()
  }


  @Emit('scroll')
  tableScroll(e: Event) {
    e.preventDefault()
    return e
  }


  @Emit('page-change')
  emitPageChangeEvent() {
    return {
      pageSize: PagStore.pageSize,
      currentPage: PagStore.currentPage
    }
  }

  @Emit('size-change')
  emitSizeChangeEvent() {
    return {
      pageSize: PagStore.pageSize,
      currentPage: PagStore.currentPage
    }
  }

  @Emit('prev-click')
  emitPrevClick() {
    return {
      pageSize: PagStore.pageSize,
      currentPage: PagStore.currentPage - 1
    }
  }

  @Emit('next-click')
  emitNextClick() {
    return {
      pageSize: PagStore.pageSize,
      currentPage: PagStore.currentPage + 1
    }
  }

  getheightAdaptiveValue() {
    const defaultBottomOffset = 40
    const { heightAdaptive } = this.directives as IDirectives

    if (heightAdaptive) {
      const { bottomOffset } = heightAdaptive
      if (bottomOffset || bottomOffset === 0) {
        return bottomOffset
      }
      return defaultBottomOffset
    }
    return defaultBottomOffset
  }

  // 组件支持多种指令
  splitDirectives() {
    // 如果直接配置了directives="false"，那么指令都将失去作用
    if (isBoolean(this.directives) && !this.directives) return []
    const { heightAdaptive } = this.directives as IDirectives
    if (isBoolean(heightAdaptive) && !heightAdaptive) return []
    return [
      { name: 'height-adaptive', value: { bottomOffset: this.getheightAdaptiveValue() } }
    ]
  }

  render(h: CreateElement): VNode {
    // 高度自适应指令
    const directives = this.splitDirectives()

    // 移除不支持自定义插槽的列类型 type[index/selection]
    const noSlots = ['index', 'selection']

    // 移除分页事件，防止事件冲突
    const tableListeners = omit(this.$listeners, ['page-change', 'current-change', 'size-change', 'prev-click', 'next-click'])
    // 从插槽中移除内置的插槽 pagination，empty，append
    const customScopedSlots = omit(this.$scopedSlots, ['pagination', 'empty', 'append'])
    const { empty, append } = this.$scopedSlots
    // 内置插槽
    const inScopedSlots = {
      scopedSlots: {
        empty,
        append: () => {
          return append && append(this.data)
        }
      }
    }

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
          ref="ElTableTsRef"
          height="0"
          data={this.data}
          {...{ directives }}
          {...{ props: this.$attrs, on: tableListeners, ...inScopedSlots }}
        >
          {renderColumns(this.columns)}

          {/* 为了适配el-table中v-if="$slots.append" */}
          <template slot="append">{append && append(this.data)}</template>
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
            {renderPageSlot() && <span class="el-pagination__slot">{renderPageSlot()}</span>}
          </el-pagination>
        )}
      </div>
    )
  }
}
