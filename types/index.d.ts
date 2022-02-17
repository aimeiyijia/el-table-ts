
import Vue, { CreateElement, VNode } from 'vue'
import { AxiosRequestConfig } from 'axios'
import { ElTableColumn } from 'element-ui/types/table-column'


// 默认分页
export declare interface IDefPagination {
  currentPage: number
  pageSizes: number[]
  pageSize: number
  layout: string
  background: boolean
}

// 指令
export declare interface IDirectives {
  heightAdaptive?: {
    bottomOffset: number
  }
}

export declare interface IPagEventCallbackParams {
  pageSize: number
  currentPage: number
}

export declare interface IPath {
  // data的解析路径,不指定就按照默认路径去解析
  dataPath: string
  // 不指定就默认dataName为data
  dataName: string
}

export declare interface IPag {
  // 条数指示器名称
  pageSizeName: string
  // 页码参数名称
  pageNoName: string
}
export declare interface INetWork {
  method?: string
  url?: string
  data?: any
  createConfig?: AxiosRequestConfig
  httpConfig?: AxiosRequestConfig
  path?: IPath
  pag?: IPag
}

// for future
// export interface InstallationOptions {}
// export function install (vue: typeof Vue, options: InstallationOptions): void

// now
export function install(vue: typeof Vue): void


export declare class ElTableTsColumn extends ElTableColumn {
  customRender?: (cellValue: any,
    row: object,
    column: ElTableColumn,
    $index: number,
    h: CreateElement,
    store: any,
    _self: VNode) => any

  customTitle?: (cellValue: any,
    row: object,
    column: ElTableColumn,
    $index: number,
    h: CreateElement,
    store: any,
    _self: VNode) => any

    scopedSlots?: {
      customRender?: string
      customTitle?: string
    }
}
