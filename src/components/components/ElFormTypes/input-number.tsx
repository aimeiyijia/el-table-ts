import Vue, { VNode, CreateElement } from 'vue'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'

@Component
export default class InputNumberPlus extends Vue {
  render(h: CreateElement): VNode {
    return (
      <el-input-number
        {...{
          attrs: this.$attrs,
          props: this.$attrs,
          on: {
            ...this.$listeners,
            change: (currentValue: number, oldValue: number) => {
              this.$emit('input', currentValue)
              this.$emit('change', currentValue, oldValue)
            },
          },
        }}
      />
    )
  }
}
