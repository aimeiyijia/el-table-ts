
import Vue from 'vue'
import { AxiosRequestConfig } from 'axios'
export declare class Path {
  // data的解析路径,不指定就按照默认路径去解析
  dataPath: string
  // 不指定就默认dataName为data
  dataName: string
}

export declare class Pag {
  // 条数指示器名称
  pageSizeName: string
  // 页码参数名称
  pageNoName: string
}
export declare class NetWork {
  method?: string
  url?: string
  data?: any
  createConfig?: AxiosRequestConfig
  httpConfig?: AxiosRequestConfig
  path?: Path
  pag?: Pag
}

// for future
// export interface InstallationOptions {}
// export function install (vue: typeof Vue, options: InstallationOptions): void

// now
export function install(vue: typeof Vue): void
