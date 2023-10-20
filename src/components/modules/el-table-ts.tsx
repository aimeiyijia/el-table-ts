import Vue, { VNode, CreateElement } from 'vue'
import '../directives/height-adaptive'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { generateUUID } from '../utils/uuid'
import { judgeAndMask } from '../utils/maskData'
import {
  isBoolean,
  isString,
  isObject,
  isArray,
  isUndefined,
  isFunction
} from '../utils/types'
import { omit, setValueByPath, deepQuery, formatMoney } from '../utils/opera'

import {
  Table,
  Pagination,
  TableColumn,
  Form,
  FormItem,
  Select,
  Option,
  Input
} from 'element-ui'
import EditeableCell from '../components/EditeableCell/index'
// 样式
import '../styles/index.scss'

import PagStore from '../utils/store'

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
    container?: string | Element
    bottomOffset?: number
  }
}

declare interface ITableColumn extends TableColumn {
  children: ITableColumn[]
  editable?: boolean
  editMode?: boolean
  customEdit?: boolean
  editFormConfig?: object
  hidden: boolean | ((columns: ITableColumn) => boolean)
  // 是否是金额类 列
  // 是：数据均居右，且保留两位小数点
  money?: boolean
  // 是否敏感信息脱敏
  // 默认支持 手机、座机、身份证号、银行卡、邮箱
  mask?: boolean
}

@Component({
  components: {
    EditeableCell,
    ElTable: Table,
    ElTableColumn: TableColumn,
    ElForm: Form,
    ElFormItem: FormItem,
    ElSelect: Select,
    ElOption: Option,
    ElInput: Input,
    ElPagination: Pagination
  }
})
export default class ElTableTs extends Vue {
  // 内置指令的配置项
  @Prop({
    type: [Boolean, Object],
    default: () => {
      return { heightAdaptive: { bottomOffset: 0 } }
    }
  })
  readonly directives: boolean | IDirectives | undefined

  // 表格每列配置项
  @Prop({ type: Array, default: () => [] }) readonly columns!: ITableColumn[]

  // 更加统一化的列配置项
  @Prop({ type: Object, default: () => {} }) readonly colAttrs?: ITableColumn

  // 是否在数据重渲染后自动滚动到顶部
  @Prop({ type: Boolean, default: true }) readonly autoToTop?: boolean

  // 是否在数据更新后重新布局el-table，可能能解决一些异常
  @Prop({ type: Boolean, default: true }) readonly autoDoLayout?: boolean

  // falsey 假值是否渲染，默认渲染
  // false, 0或者-0, 0n(BigInt), "" 或者 ''或者 ``, undefined, NaN, null,
  @Prop({ type: Boolean, default: true }) readonly falseyRender?: boolean

  // 数据相关
  @Prop({ type: Array, default: () => [] }) readonly data!: any[]

  // 分页
  @Prop({
    type: [Boolean, Object],
    default: () => {
      return { pageSize: 10, currentPage: 1 }
    }
  })
  readonly pagination: Pagination | undefined | boolean

  @Prop({ type: Number, default: 0 }) readonly total: number | undefined

  // 表格所在的容器元素ID或Element，必须指定容器的高度
  @Prop({ type: [String, Object], default: '' }) readonly container?:
    | string
    | Element

  // 是否展示分页器
  isShowPag = true

  // 默认分页配置
  private defPagination: ElTableTsDefPagination = {
    currentPage: 1,
    pageSizes: [10, 20, 30, 50],
    pageSize: 10,
    layout: 'prev, pager, next, sizes, total',
    background: true
  }

  // 内置指令

  @Watch('pagination', { deep: true })
  onPaginationChanged() {
    this.setPagination()
  }

  get tableInstance() {
    return this.$refs.ElTableTsRef as Table | any
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

  updated() {
    if (
      this.autoDoLayout &&
      this.tableInstance &&
      this.tableInstance.doLayout
    ) {
      this.tableInstance.doLayout()
    }
  }

  // 设置分页配置
  setPagination() {
    const pagination = this.pagination
    if (isBoolean(pagination)) {
      this.isShowPag = pagination as boolean
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
    if (this.autoToTop) {
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
    this.setTableScrollToTop()
    return {
      pageSize: PagStore.pageSize,
      currentPage: PagStore.currentPage
    }
  }

  @Emit('size-change')
  emitSizeChangeEvent() {
    this.setTableScrollToTop()
    return {
      pageSize: PagStore.pageSize,
      currentPage: PagStore.currentPage
    }
  }

  @Emit('prev-click')
  emitPrevClick() {
    this.setTableScrollToTop()
    return {
      pageSize: PagStore.pageSize,
      currentPage: PagStore.currentPage - 1
    }
  }

  @Emit('next-click')
  emitNextClick() {
    this.setTableScrollToTop()
    return {
      pageSize: PagStore.pageSize,
      currentPage: PagStore.currentPage + 1
    }
  }

  getPaginationSpaceHeight() {
    const pagEl = document.querySelector('.el-table-ts__bottom')
    if (pagEl) {
      const { marginTop, marginBottom } = getComputedStyle(pagEl)
      const mt = parseFloat(marginTop)
      const mb = parseFloat(marginBottom)
      return (pagEl as HTMLElement).offsetHeight + mt + mb
    }
    return 0
  }

  getheightAdaptiveValue() {
    const pagHeight = this.getPaginationSpaceHeight()
    const defaultBottomOffset = this.pagination ? pagHeight : 0
    const { heightAdaptive } = this.directives as IDirectives

    if (heightAdaptive) {
      const { bottomOffset } = heightAdaptive
      if (bottomOffset) {
        return bottomOffset
      }
      return defaultBottomOffset
    }
    return defaultBottomOffset
  }

  // 组件支持多种指令
  splitDirectives() {
    // 如果直接配置了directives="false"，那么指令都将失去作用
    if (isBoolean(this.directives) && !this.directives) {
      return {
        allowHeightAdaptive: false,
        directives: []
      }
    }
    const { heightAdaptive } = this.directives as IDirectives
    if (isBoolean(heightAdaptive) && !heightAdaptive) {
      return {
        allowHeightAdaptive: false,
        directives: []
      }
    }
    return {
      allowHeightAdaptive: true,
      directives: [
        {
          name: 'height-adaptive',
          value: {
            container: this.container,
            bottomOffset: this.getheightAdaptiveValue()
          }
        }
      ]
    }
  }

  render(h: CreateElement): VNode {
    // 高度自适应指令
    const { allowHeightAdaptive, directives } = this.splitDirectives()

    const $attrs = allowHeightAdaptive
      ? Object.assign({ height: '0' }, this.$attrs)
      : this.$attrs
    const attrs = omit($attrs, ['header-cell-class-name', 'cell-class-name'])
    // 移除不支持自定义插槽的列类型 type[index/selection]
    const noSlots = ['index', 'selection']

    // 移除分页事件，防止事件冲突
    const $tableListeners = omit(this.$listeners, [
      'page-change',
      'current-change',
      'size-change',
      'prev-click',
      'next-click'
    ])
    // 从插槽中移除内置的插槽 pagination，empty，append
    const customScopedSlots = omit(this.$scopedSlots, [
      'pagination',
      'empty',
      'append'
    ])
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

    const getCellValue = (column: ITableColumn, row: any) => {
      const { mask = true, prop } = column
      const value = prop.split('.').reduce((obj, cur) => {
        if (obj) {
          return obj[cur]
        }
      }, row)

      const maskValue = mask ? judgeAndMask(value) : value

      if (this.falseyRender) {
        return maskValue
      }
      if (maskValue) return maskValue
    }

    const renderChildrenColumns = (childrenColumns: ITableColumn[]) => {
      if (!isArray(childrenColumns)) {
        console.error('The children configuration item must be an array')
        return []
      }
      return renderColumns(childrenColumns)
    }

    const renderColumns = (columns: ITableColumn[]) =>
      columns
        .map(c => {
          const {
            hidden,
            children,
            editable: colEditable,
            editMode: colEditMode,
            customEdit = false,
            editFormConfig = {}
          } = c
          let willHidden = false
          if (isFunction(hidden)) {
            willHidden = (hidden as Function)(c)
          } else {
            willHidden = isBoolean(hidden) ? (hidden as boolean) : false
          }
          if (willHidden) return
          const options = Object.assign(
            { ...this.columnsAttrs, scopedSlots: {}, prop: '' },
            c
          )
          let sampleScopedSlots = {}

          const scopedSlots = {
            default: ({
              row,
              column: elColumn,
              $index,
              store,
              _self
            }: {
              row: any
              column: TableColumn
              $index: number
              store: any
              _self: any
            }) => {
              const { editable: rowEditable, editMode: rowEditMode } = row
              const column: any = Object.assign({}, options, elColumn)

              // 获取单元格的原始值
              const cellValue = getCellValue(column, row)

              if (
                column.scopedSlots &&
                column.scopedSlots.customRender &&
                !isString(column.scopedSlots.customRender)
              ) {
                console.error('slotName must be string')
                return
              }

              // 自定义单元格 指定slot name的优先级比自定义渲染函数优先级低
              column.customRender =
                column.customRender ||
                customScopedSlots[column.scopedSlots.customRender]

              let cellContent
              if (column.customRender) {
                cellContent = column.customRender({
                  cellValue,
                  row,
                  column,
                  $index,
                  h,
                  store,
                  _self
                })
              } else {
                cellContent = cellValue
              }

              const { money } = options
              if (!column.customRender && money) {
                cellContent = formatMoney(cellContent)
              }

              return !customEdit && colEditable && rowEditable ? (
                <editeable-cell
                  {...{
                    props: {
                      value: cellContent,
                      editMode:
                        colEditable &&
                        rowEditable &&
                        colEditMode &&
                        rowEditMode,
                      editFormConfig,
                      row,
                      column
                    }
                  }}
                  {...{
                    on: {
                      input: (val: any) => {
                        setValueByPath(row, column.prop, val)
                      }
                    }
                  }}
                >
                  <template>{cellContent}</template>
                </editeable-cell>
              ) : (
                cellContent
              )
            },
            header: ({
              column: elColumn,
              $index,
              store,
              _self
            }: {
              column: ITableColumn
              $index: number
              store: any
              _self: any
            }) => {
              const column: any = Object.assign({}, options, elColumn)

              if (
                column.scopedSlots &&
                column.scopedSlots.customTitle &&
                !isString(column.scopedSlots.customTitle)
              ) {
                console.error('slotName must be string')
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
            >
              {children && renderChildrenColumns(children)}
            </el-table-column>
          )
        })
        .filter(o => o)

    const hasPaginationLeftSlot = Object.prototype.hasOwnProperty.call(
      this.$scopedSlots,
      'paginationLeft'
    )
    const renderPaginationLeftSlot = () => {
      if (hasPaginationLeftSlot) {
        // @ts-ignore
        return this.$scopedSlots.paginationLeft()
      }
      return ''
    }

    const renderPageSlot = () => {
      if (
        Object.prototype.hasOwnProperty.call(this.$scopedSlots, 'pagination')
      ) {
        // @ts-ignore
        return this.$scopedSlots.pagination({
          total: this.total,
          config: omit(this.defPagination, ['pageSize', 'currentPage'])
        })
      }
      return ''
    }

    // const interceptAttrs = {
    //   'header-cell-class-name': $attrs['header-cell-class-name'],
    //   'cell-class-name': $attrs['cell-class-name']
    // }
    const interceptAttrs = {
      headerCellClassName: ({
        row,
        column,
        rowIndex,
        columnIndex
      }: {
        row: any
        column: any
        rowIndex: number
        columnIndex: number
      }): string => {
        const headerCellClassName = $attrs[
          'header-cell-class-name'
        ] as Table['headerCellClassName']
        const customHeaderCellClassName = headerCellClassName
          ? isFunction(headerCellClassName)
            ? (headerCellClassName as Function)({
                row,
                column,
                rowIndex,
                columnIndex
              })
            : headerCellClassName
          : ''
        const option = this.columns[columnIndex] || {}
        const { money } = option
        if (money) {
          return 'el-table-header__cell-money ' + customHeaderCellClassName
        }
        return customHeaderCellClassName
      },
      // 'cell-class-name': $attrs['cell-class-name']
      cellClassName: ({
        row,
        column,
        rowIndex,
        columnIndex
      }: {
        row: any
        column: any
        rowIndex: number
        columnIndex: number
      }): string => {
        const cellClassName = $attrs[
          'cell-class-name'
        ] as Table['cellClassName']
        const customCellClassName = cellClassName
          ? isFunction(cellClassName)
            ? (cellClassName as Function)({
                row,
                column,
                rowIndex,
                columnIndex
              })
            : cellClassName
          : ''
        const option = deepQuery(this.columns, column.property, 'prop') || {}
        const { money = false } = option
        if (money) {
          return 'el-table-body__cell-money ' + customCellClassName
        }
        return customCellClassName
      }
    }
    return (
      <div class="el-table-ts">
        <el-table
          ref="ElTableTsRef"
          data={this.data}
          {...{ directives }}
          {...{
            props: { ...attrs, ...interceptAttrs },
            on: $tableListeners,
            ...inScopedSlots
          }}
        >
          {renderColumns(this.columns)}

          {/* 为了适配el-table中v-if="$slots.append" */}
          <template slot="append">{append && append(this.data)}</template>
        </el-table>
        <div
          class={{
            'el-table-ts__bottom': true,
            'el-table-ts__bottom-has-leftslot': hasPaginationLeftSlot
          }}
        >
          {hasPaginationLeftSlot && <div>{renderPaginationLeftSlot()}</div>}
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
              {renderPageSlot() && (
                <span class="el-pagination__slot">{renderPageSlot()}</span>
              )}
            </el-pagination>
          )}
        </div>
      </div>
    )
  }
}
