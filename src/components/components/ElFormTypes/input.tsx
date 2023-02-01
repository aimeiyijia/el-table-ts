import Vue, { VNode, CreateElement } from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class InputPlus extends Vue {
  render(h: CreateElement): VNode {
    // 组装插槽及作用域插槽
    const scopedSlots: any = this.$scopedSlots
    const slots = []
    const customScopedSlots: any = {}
    for (const slot in scopedSlots) {
      // el-input内部使用了 v-if="$slots.[slotName]"来判断是否有插槽
      // 因此这一步是骗它有插槽，然后再用scopedSlots来实现自定义渲染函数渲染插槽内容
      slots.push({ name: slot, value: [h('template')] })
      // 插槽额外增加h函数，便于生成vnode
      customScopedSlots[slot] = () => {
        return scopedSlots[slot]({ h, value: this.$attrs.value })
      }
    }
    return (
      <el-input
        {...{
          attrs: this.$attrs,
          props: this.$attrs,
          on: this.$listeners,
          scopedSlots: customScopedSlots,
        }}
      >
        {slots.map(o => {
          return <template slot={o.name}>{o.value}</template>
        })}
      </el-input>
    )
  }
}
