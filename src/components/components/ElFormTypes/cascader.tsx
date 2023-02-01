import Vue, { VNode, CreateElement } from 'vue'
import { Component } from 'vue-property-decorator'
import dataMap from './data'
@Component
export default class CascaderPlus extends Vue {
  render(h: CreateElement): VNode {
    const { shortcut } = this.$attrs
    // 省市区联动快捷方式
    if (shortcut && shortcut === 'area') {
      Object.assign(this.$attrs, {
        options: dataMap[shortcut],
      })
    }

    return (
      <el-cascader
        {...{
          attrs: this.$attrs,
          props: this.$attrs,
          on: this.$listeners,
          scopedSlots: this.$scopedSlots,
        }}
      />
    )
  }
}
