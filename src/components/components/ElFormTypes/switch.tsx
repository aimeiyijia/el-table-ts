import Vue, { VNode, CreateElement } from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class SwitchPlus extends Vue {
  render(h: CreateElement): VNode {
    return (
      <el-switch {...{ attrs: this.$attrs, props: this.$attrs, on: this.$listeners }} />
    )
  }
}
