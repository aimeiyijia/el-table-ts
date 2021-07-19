import Vue, { VNode, CreateElement } from 'vue'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import {
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
import AxiosPlugin from '@/plugin/axios'

interface IhttpConfig {
  method?: string
  url?: string
  data?: any
  createConfig?: AxiosRequestConfig
  httpConfig?: AxiosRequestConfig

}

@Component
export default class ElTableHttp extends Vue {
  // http请求配置
  @Prop({ type: [Boolean, Object], default: () => { return { method: 'get' } } }) readonly httpConfig: IhttpConfig | undefined | boolean
}
