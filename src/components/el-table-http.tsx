import Vue, { VNode, CreateElement } from 'vue'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import to from 'await-to-js';
import omit from 'lodash/omit'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import AxiosPlugin from '@/plugin/axios'
import ElTableTs from './el-table-ts'

interface Ipath {
  // data的解析路径,不指定就按照标准格式路径去解析
  dataPath?: string,
  // 不指定就默认dataName为data
  dataName?: string,
  // 分页解析路径 默认dataname同级
  pagPath?: string,
  // 页码名称 默认pageNo
  pageNoName?: string,
  // 每页显示条数指示器名称 默认pageSize
  pageSizeName?: string
}
interface InetWork {
  method: string
  url?: string
  data?: any
  createConfig?: AxiosRequestConfig
  httpConfig?: AxiosRequestConfig
  path?: Ipath
}
interface ImatchHttpMethods {
  [key: string]: any,
}

@Component({
  components: {
    ElTableTs
  }
})
export default class ElTableHttp extends Vue {
  // http请求配置
  @Prop({ type: [Object], default: () => { return { method: 'get' } } }) readonly netWork!: InetWork

  // 接口请求来的data
  private data: any = null

  // 传递给外部的分页指示参数
  private pageSize = 0

  private currentPage = 0

  async created() {
    console.log(this.netWork, '配置项')
    this.data = await this.initHttp()
  }

  // 判断使用那种方式进行请求
  public decideUseWhichMode() {
    const http = new AxiosPlugin()
    const { initAxios, initPost, initGet } = http
    // 匹配内置的请求方法
    const matchHttpMethods: ImatchHttpMethods = {
      get: initGet,
      post: initPost
    }

    // 如果method存在且为get或者post，那么使用matchHttpMethods结果发起请求
    // 否则就使用initAxios发起请求
    const { method, url, data, httpConfig } = this.netWork
    if (method && method !== '') {
      const match = matchHttpMethods[method.toLowerCase()]
      if (match) return match(url, data, httpConfig)
      return initAxios(httpConfig as AxiosRequestConfig)
    }
    return initAxios(httpConfig as AxiosRequestConfig)
  }

  // 发起请求
  public async initHttp() {
    const http = this.decideUseWhichMode()
    // 发起接口请求
    const [err, res] = await to<any>(http);
    console.log(res, '数据')
    if (err) console.error(err, 'ElTable http error')
    // data的解析路径（从axios response.data之后开始算）
    // 取配置项
    const { path } = this.netWork
    const { dataPath, dataName, pagPath, pageNoName, pageSizeName } = path as Ipath
    // 找到表格数据所在位置（数据仓库）
    const dataDepository = res[dataPath as string]
    // 从数据仓库中取表格值，分页参数等
    // 取表格数据
    const tableData = dataDepository[dataName as string]
    // // 取分页数据 页码
    // const pageNo = dataDepository[pageNoName as string]
    // // 每页显示条数
    // const pageSize = dataDepository[pageSizeName as string]

    return tableData
  }

  pageSizeChange(pageSize: number): void {
    this.pageSize = pageSize
    this.emitSizeChangeEvent()
  }

  currentChange(currentPage: number): void {
    console.log(1)
    this.currentPage = currentPage
    this.emitPageChangeEvent()
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

  // 外界传递的data将失去作用
  render(h: CreateElement): VNode {
    // 移除掉外部data属性防止干扰内部
    const attrs = omit(this.$attrs, ['data'])
    console.log(this.$listeners, '监听器')

    // 拦截分页事件
    const tableListeners = omit(this.$listeners, ['page-change', 'size-change'])

    return this.data && <el-table-ts
      data={this.data}
      on-size-change={this.pageSizeChange}
      on-current-change={this.currentChange}
      {...{ attrs }}
      {...{
        // todo props不起效果
        // props: attrs,
        on: tableListeners,
        scopedSlots: this.$scopedSlots
      }}

    />
  }
}
