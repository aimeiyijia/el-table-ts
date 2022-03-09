import Vue, { VNode, CreateElement } from 'vue'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import to from 'await-to-js';
import { omit, deepClone } from '../utils/opera'
import { AxiosRequestConfig } from 'axios'
import AxiosPlugin from '../plugin/axios'
import ElTableTs from './el-table-ts'

import { Table } from 'element-ui'

interface Ipath {
  // data的解析路径,不指定就按照默认路径去解析
  dataPath: string
  // 不指定就默认dataName为data
  dataName: string
  // 总条数的取值字段 默认 total
  totalName: string
}

interface Ipag {
  // 条数指示器名称
  pageSizeName: string,
  // 页码参数名称
  pageNoName: string,
}

interface InetWork {
  method?: string
  url?: string
  data?: any
  createConfig?: AxiosRequestConfig
  httpConfig?: AxiosRequestConfig
  path?: Ipath
  pag?: Ipag
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

  // 发起接口请求的参数 也就是 netWork中的data字段
  private requsetData: any = null
  // 分页指示器字段名配置项
  private pag: any = null

  // 接口请求来的data
  private data: any = null

  // 分页指示参数
  private pageSize = 0

  private currentPage = 0

  // 总条数
  private total = 0

  @Emit('render-complete')
  renderComplete(tableInstance: any) {
    return {
      ...tableInstance,
      render: this.getData,
    }
  }

  public async getData() {
    // 取出请求参数
    const { data, pag } = this.netWork
    this.requsetData = deepClone(data)
    this.pag = deepClone(pag)
    await this.initHttp()
  }

  // 判断使用那种方式进行请求
  private decideUseWhichMode() {

    // 如果method存在且为get或者post，那么使用matchHttpMethods结果发起请求
    // 否则就使用initAxios发起请求

    const { method = "get", url, httpConfig = { method: "get" }, createConfig = {} } = this.netWork

    const http = new AxiosPlugin(createConfig)
    const { initAxios, initPost, initGet } = http

    // 内置请求方法匹配表
    const matchHttpMethods: ImatchHttpMethods = {
      get: initGet,
      post: initPost
    }

    const data = this.requsetData
    if (method && method !== '') {
      const match = matchHttpMethods[method.toLowerCase()]
      if (match) return match(url, data, httpConfig)
      return initAxios(httpConfig as AxiosRequestConfig)
    }
    return initAxios(httpConfig as AxiosRequestConfig)
  }

  // 发起请求以及处理错误
  private async sendRequest() {
    const http = this.decideUseWhichMode()
    // 发起接口请求
    const [err, res] = await to<any>(http);
    if (err) console.error(err, 'ElTable http error')
    return res
  }

  // 发起请求并解析出数据
  private async initHttp() {
    const res = await this.sendRequest();

    // data的解析路径（从axios response.data之后开始算）
    // 取解析路径配置项
    let { path = {} } = this.netWork

    let { dataPath = "data", dataName = "data", totalName = 'total' } = path as Ipath

    // 找到表格数据所在位置（数据仓库）
    const dataDepository = res[dataPath as string]
    // 从数据仓库中取表格值，分页参数等
    // 取表格数据
    this.data = dataDepository[dataName as string]
    this.total = dataDepository[totalName as string]
  }

  private pageSizeChange(page: any): void {
    this.pageSize = page.pageSize
    this.emitSizeChangeEvent()
  }

  private currentChange(page: any): void {
    this.currentPage = page.currentPage
    this.emitPageChangeEvent()
  }

  @Emit('page-change')
  private async emitPageChangeEvent() {
    const { pageSizeName, pageNoName } = this.pag
    this.requsetData[pageNoName] = this.currentPage
    await this.initHttp()
    return {
      [pageSizeName]: this.pageSize,
      [pageNoName]: this.currentPage
    }
  }

  @Emit('size-change')
  private async emitSizeChangeEvent() {
    const { pageSizeName, pageNoName } = this.pag
    this.requsetData[pageSizeName] = this.pageSize
    await this.initHttp()
    return {
      [pageSizeName]: this.pageSize,
      [pageNoName]: this.currentPage
    }
  }

  // 外界传递的data将失去作用
  private render(h: CreateElement): VNode {
    // 移除掉外部data属性防止干扰内部
    const attrs = omit(this.$attrs, ['data', 'total'])

    // 拦截分页事件
    const tableListeners = omit(this.$listeners, ['page-change', 'current-change', 'size-change', 'prev-click', 'next-click'])

    return <el-table-ts
      data={this.data}
      total={this.total}
      {...{ attrs }}
      {...{
        on: {
          ...tableListeners,
          'render-complete': this.renderComplete,
          'page-change': this.currentChange,
          'size-change': this.pageSizeChange
        },
        scopedSlots: this.$scopedSlots
      }}

    />
  }
}
