import Vue, { VNode, CreateElement } from 'vue'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import to from 'await-to-js';
import omit from 'lodash/omit'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import AxiosPlugin from '@/plugin/axios'
import ElTableTs from './el-table-ts'

interface Ipath {
  // data的解析路径,不指定就按照标准格式路径去解析
  dataPath?: string
  // 不指定就默认dataName为data
  dataName?: string
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

  // 在组件挂载时将渲染方法暴露出去，由用户自行决定渲染表格时机
  mounted(){
    this.$emit('render', this.expostApi())
  }

  // 决定要暴露出去的
  private expostApi(){
    return {
      render: this.getData,
    }
  }

  public async getData(){
    console.log(this.netWork, '配置项')
    // 取出请求参数
    const { data, pag } = this.netWork
    this.requsetData = data
    this.pag = pag
    this.data = await this.initHttp()
  }

  // 判断使用那种方式进行请求
  private decideUseWhichMode() {

    // 如果method存在且为get或者post，那么使用matchHttpMethods结果发起请求
    // 否则就使用initAxios发起请求
    const { method, url, httpConfig, createConfig} = this.netWork

    const http = new AxiosPlugin(createConfig)
    const { initAxios, initPost, initGet } = http
    // 匹配内置的请求方法
    const matchHttpMethods: ImatchHttpMethods = {
      get: initGet,
      post: initPost
    }


    const data = this.requsetData
    console.log(data, '请求数据')
    if (method && method !== '') {
      const match = matchHttpMethods[method.toLowerCase()]
      if (match) return match(url, data, httpConfig)
      return initAxios(httpConfig as AxiosRequestConfig)
    }
    return initAxios(httpConfig as AxiosRequestConfig)
  }

  // 发起请求
  private async initHttp() {
    const http = this.decideUseWhichMode()
    // 发起接口请求
    const [err, res] = await to<any>(http);
    console.log(res, '数据')
    if (err) console.error(err, 'ElTable http error')
    // data的解析路径（从axios response.data之后开始算）
    // 取解析路径配置项
    let { path } = this.netWork
    if(!path) path = {dataPath: 'data', dataName: 'data'}
    let { dataPath, dataName } = path as Ipath

    // 默认值取值路径为data
    if(!dataPath) dataPath = 'data'
    // 默认取值字段为data
    if(!dataName) dataName = 'data'
    // 找到表格数据所在位置（数据仓库）
    const dataDepository = res[dataPath as string]
    // 从数据仓库中取表格值，分页参数等
    // 取表格数据
    const tableData = dataDepository[dataName as string]

    return tableData
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
    this.data = await this.initHttp()
    return {
      [pageSizeName]: this.pageSize,
      [pageNoName]: this.currentPage
    }
  }

  @Emit('size-change')
  private async emitSizeChangeEvent() {
    const { pageSizeName, pageNoName } = this.pag
    this.requsetData[pageSizeName] = this.pageSize
    this.data = await this.initHttp()
    return {
      [pageSizeName]: this.pageSize,
      [pageNoName]: this.currentPage
    }
  }

  // 外界传递的data将失去作用
  private render(h: CreateElement): VNode {
    // 移除掉外部data属性防止干扰内部
    const attrs = omit(this.$attrs, ['data'])
    // console.log(this.$listeners, '监听器')

    // 拦截分页事件
    const tableListeners = omit(this.$listeners, ['page-change', 'size-change'])

    return this.data && <el-table-ts
      data={this.data}
      {...{ attrs }}
      {...{
        // todo props不起效果
        // props: attrs,
        on: {
          ...tableListeners,
          'page-change': this.currentChange,
          'size-change': this.pageSizeChange
        },
        scopedSlots: this.$scopedSlots
      }}

    />
  }
}
