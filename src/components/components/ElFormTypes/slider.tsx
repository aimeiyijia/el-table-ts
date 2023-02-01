import Vue, { VNode, CreateElement } from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class SliderPlus extends Vue {
  render(h: CreateElement): VNode {
    return <el-slider {...{ attrs: this.$attrs, props: this.$attrs, on: this.$listeners }} />
  }
}
