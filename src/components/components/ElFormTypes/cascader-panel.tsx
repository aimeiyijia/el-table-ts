import Vue, { VNode, CreateElement } from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class CascaderPanelPlus extends Vue {

  render(h: CreateElement): VNode {
    return (
      <el-cascader-panel
        {...{
          attrs: this.$attrs,
          props: this.$attrs,
          on: this.$listeners,
          scopedSlots: this.$scopedSlots
        }}
      />
    )
  }
}
