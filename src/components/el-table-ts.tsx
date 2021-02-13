import Vue, { VNode, CreateElement } from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'
import omit from 'lodash/omit'
import keys from 'lodash/keys'
import { Pagination as ElPagination, Table as ElTable, TableColumn as ElTableColumn } from 'element-ui';

interface ICustomColumn {
  customRender: any,
  customTitle: any,
  formatter: any,
  scopedSlots: {
    customRender: any
  }
}

@Component
export default class ElTableTs extends Vue {
  // 数据加载提示
  @Prop(Boolean) readonly loading: boolean | undefined
  // 数据相关
  @Prop({ type: Array, default: () => [] }) readonly data!: undefined[]
  @Prop({ type: Array, default: () => [] }) readonly columns!: ElTableColumn[]
  // 分页
  @Prop({ type: Object, default: () => { } }) readonly pagination: ElPagination | undefined
  @Prop({ type: Number, default: 0 }) readonly total: number | undefined

  private tableWrap: any = null

  private pageSize: number = 10

  private currentPage: number = 1


  mounted() {
    // 分页相关
    if (this.pagination && this.pagination.pageSize) {
      this.pageSize = this.pagination.pageSize
    }
    if (this.pagination && this.pagination.currentPage) {
      this.currentPage = this.pagination.currentPage
    }


    const table: any = this.$refs.table
    this.tableWrap = table.bodyWrapper

    table.bodyWrapper.addEventListener('scroll', this.tableScroll)
    this.$once('hook:beforeDestroy', () => {
      this.tableWrap.removeEventListener('scroll', this.tableScroll)
    })
  }

  tableScroll(e: MouseEvent) {
    e.preventDefault()
    this.$emit('scroll', e)
  }

  pageSizeChange(pageSize: number): void {
    this.pageSize = pageSize
    this.emitPageChangeEvent()
  }

  currentChange(currentPage: number): void {
    this.currentPage = currentPage
    this.emitPageChangeEvent()
  }

  emitPageChangeEvent() {
    this.$emit('page-change', {
      pageSize: this.pageSize,
      currentPage: this.currentPage,
    })
  }
  render(h: CreateElement): VNode {
    const tableListeners = omit(this.$listeners, ['page-change'])

    const getCellValue = (column: ElTableColumn, row: any) =>
      column.prop.split('.').reduce((obj, cur) => obj[cur], row)

    const renderColumns = (columns: ElTableColumn[]) =>
      columns
        .filter((i: any) => !i.hidden)
        .map(c => {
          const options = Object.assign({ scopedSlots: {}, prop: '' }, c)

          const scopedSlots = {
            default: ({ row, column: elColumn, $index }: { row: any, column: ElTableColumn, $index: number }) => {
              const column: any = Object.assign({}, options, elColumn)
              // 支持链式. 如：xxx.xxx
              const cellValue = getCellValue(column, row)

              // 自定义组件
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
                })
              }
              // 兼容element-ui formatter属性 因为formatter是格式化cellValue的，所以需要拦截下
              if (column.formatter) {
                return column.formatter({
                  row,
                  column,
                  cellValue,
                  $index,
                })
              }

              return cellValue
            },
            header: ({ column: elColumn, $index }: { column: ElTableColumn, $index: number }) => {
              const column: any = Object.assign({}, options, elColumn)

              column.customTitle =
                column.customTitle ||
                this.$scopedSlots[column.scopedSlots.customTitle]
              if (column.customTitle) {
                return column.customTitle({ column, $index })
              }
              return column.label
            },
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
      <div class="el-table-plus" v-loading={this.loading}>
        <el-table
          ref="table"
          data={this.data}
          {...{ props: this.$attrs, on: tableListeners }}
        >
          {renderColumns(this.columns)}
        </el-table>
        {this.pagination && keys(this.pagination).length > 0 && (
          <el-pagination
            {...{ props: this.pagination }}
            total={this.total}
            on-size-change={this.pageSizeChange}
            on-current-change={this.currentChange}
          />
        )}
      </div>
    )
  }
}