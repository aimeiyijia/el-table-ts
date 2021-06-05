import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
// 定义request
class request {
  private config
  constructor(config: AxiosRequestConfig) {
    this.config = config
  }
  public initAxios(): Promise<AxiosResponse> {
    return axios(this.config)
  }
}

// 导出实例化
function instance(config: AxiosRequestConfig) {
  const requestInstance = new request(config)
  return requestInstance.initAxios()
}

export default instance
