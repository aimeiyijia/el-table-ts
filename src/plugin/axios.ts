// Axios类，
// 传入请求方法，请求参数
// axios.create([config])
// axios(config)
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInterceptorManager,
  AxiosPromise,
  AxiosInstance,
  AxiosAdapter,
  Cancel,
  CancelToken,
  CancelTokenSource,
  Canceler,
} from 'axios'

interface HTTPRequestConfig {
  (url: string, data: any, contentType?: string): any
}

const AJSON = 'application/json'
const AFUE = 'application/x-www-form-urlencoded;charset=UTF-8'

export default class AxiosPlugin {
  // 创建axios实例时传入的参数
  public cCfg: AxiosRequestConfig = {
    // 默认超时时间为6s
    timeout: 60000,
    baseURL: "http://192.168.2.64:8080",
  }

  // 初始化实例
  public http: AxiosInstance

  constructor(
    createConfig: AxiosRequestConfig = {}
  ) {
    this.cCfg = Object.assign(this.cCfg, createConfig)

    this.http = this.createAxios()
  }

  // 创建axios实例，可分别传入request/response拦截函数
  private createAxios(): AxiosInstance {
    const instance = axios.create(this.cCfg)
    return instance
  }

  // 自定义http请求
  public initAxios(httpConfig: AxiosRequestConfig) {
    const http = this.createAxios()
    return http(httpConfig)
  }

  // 以下为请求快捷方式
  public initPost: HTTPRequestConfig = (url, data, contentType): AxiosPromise =>  {
    const ct = contentType || AJSON
    const http = this.http
    return http({
      method: 'post',
      url: url,
      data: data,
      headers: { 'Content-Type': ct }
    })
  }

  public initGet: HTTPRequestConfig = (url, data, contentType): AxiosPromise => {
    const ct = contentType || AFUE
    data = data || {}
    const http = this.http
    return http({
      method: 'get',
      url: url,
      params: data,
      headers: {
        'Content-Type': ct
      }
    })
  }

}

const a = new AxiosPlugin()
console.log(a.http, 'axios实例')
console.log(a.initPost('/broke/meetingManagement/list', {}))
