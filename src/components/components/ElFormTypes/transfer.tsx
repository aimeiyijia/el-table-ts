import Vue, { VNode, CreateElement } from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class TransferPlus extends Vue {
  render(h: CreateElement): VNode {
    return (
      <el-transfer
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
