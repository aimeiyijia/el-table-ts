import Vue, { VNode, CreateElement } from 'vue'
import { Component, Emit } from 'vue-property-decorator'
import { omit } from '@/components/utils/opera'
import { isFunction } from '@/components/utils/types'

@Component
export default class UploadPlus extends Vue {
  @Emit('input')
  changeToInputEvent(fileList: object[]) {
    return fileList
  }

  render(h: CreateElement): VNode {
    const attrs = omit(this.$attrs, ['onChange'])
    // 组装插槽及作用域插槽
    const scopedSlots: any = this.$scopedSlots
    const slots = []
    for (const slot in scopedSlots) {
      slots.push({
        name: slot,
        value: scopedSlots[slot]({ h, value: this.$attrs.value }),
      })
    }

    // 拦截onChange事件，捕获到变更的文件列表
    const onChange = (file: object, fileList: object[]) => {
      const origOnChangeF = this.$attrs.onChange as unknown as Function
      if (!origOnChangeF) return
      if (isFunction(origOnChangeF)) {
        // eslint-disable-next-line no-useless-call
        origOnChangeF.call(null, file, fileList)
      } else {
        console.error(`onChange必须是函数`)
      }
      this.changeToInputEvent(fileList)
    }
    return (
      <el-upload
        {...{
          attrs: attrs,
          props: { ...attrs, onChange: onChange },
        }}
      >
        {slots.map(o => {
          return <template slot={o.name}>{o.value}</template>
        })}
      </el-upload>
    )
  }
}
