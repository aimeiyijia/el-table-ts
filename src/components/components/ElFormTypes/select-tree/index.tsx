import Vue, { VNode, CreateElement } from 'vue'
import { Component } from 'vue-property-decorator'
import SelectTree from './components'
@Component
export default class CascaderPlus extends Vue {
  render(h: CreateElement): VNode {

    return (
      <SelectTree
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
