import Vue, { VNode, CreateElement } from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class TimeSelectPlus extends Vue {
  render(h: CreateElement): VNode {
    return <el-time-select {...{ attrs: this.$attrs, props: this.$attrs, on: this.$listeners }} />
  }
}
