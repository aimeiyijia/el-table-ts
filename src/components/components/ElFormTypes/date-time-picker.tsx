import Vue, { VNode, CreateElement } from 'vue'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'

@Component
export default class DateTimePickerPlus extends Vue {
  render(h: CreateElement): VNode {
    return (
      <el-date-picker
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
