import Vue, { VNode, CreateElement } from 'vue'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import to from 'await-to-js';
import omit from 'lodash/omit'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import AxiosPlugin from '@/plugin/axios'
import ElTableTs from './el-table-ts'

interface IhttpConfig {
  method?: string
  url?: string
  data?: any
  createConfig?: AxiosRequestConfig
  httpConfig?: AxiosRequestConfig
}

@Component({
  components: {
    ElTableTs
  }
})
export default class ElTableHttp extends Vue {
  // http请求配置
  @Prop({ type: [Boolean, Object], default: () => { return { method: 'get' } } }) readonly httpConfig: IhttpConfig | undefined | boolean

  private data: any = null

  async created() {
    this.data = await this.initHttp()
    console.log(this.data, '接口数据')
  }

  // 发起请求
  public async initHttp() {
    const http = new AxiosPlugin()
    const p = http.initPost('/broke/meetingManagement/list', {})
    const [err, data] = await to(p);
    if (err) console.error('ElTable http error')
    return data!.data.data.records
  }

  // 外界传递的data将失去作用
  render(h: CreateElement): VNode {

    // 移除掉外部data属性防止干扰内部
    const attrs = omit(this.$attrs, ['data'])
    console.log(attrs, '实例属性')
    console.log({...{
      props: attrs,
      on: this.$listeners,
      scopedSlots: this.$scopedSlots
    }}, '实例属性')
    return this.data && <el-table-ts
      data={this.data}
      {...{ attrs }}
      {...{
        // todo props不起效果
        // props: attrs,
        on: this.$listeners,
        scopedSlots: this.$scopedSlots
      }}>

    </el-table-ts>
  }
}
