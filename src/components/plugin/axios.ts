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
  (url: string, data: any, httpConfig?: AxiosRequestConfig): AxiosPromise
}

interface IinitAxios {
  (httpConfig: AxiosRequestConfig): AxiosPromise
}
class AxiosPlugin {
  // 创建axios实例时传入的参数
  public cCfg: AxiosRequestConfig = {
    // 默认超时时间为6s
    timeout: 60000,
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
    instance.interceptors.request.use(
      config => {
        return config
      },
      error => {
        Promise.reject(error)
      }
    )

    instance.interceptors.response.use(response => {
      return response.data
    })
    return instance
  }

  // 自定义http请求
  public initAxios: IinitAxios = (httpConfig: AxiosRequestConfig) => {
    return this.http(httpConfig)
  }

  // 以下为请求快捷方式
  public initPost: HTTPRequestConfig = (url, data, httpConfig = {}) => {
    const http = this.http
    return http({
      method: 'post',
      url: url,
      data: data,
      ...httpConfig
    })
  }

  public initGet: HTTPRequestConfig = (url, data, httpConfig = {}) => {
    const http = this.http
    return http({
      method: 'get',
      url: url,
      params: data,
      ...httpConfig
    })
  }

}

export default AxiosPlugin
