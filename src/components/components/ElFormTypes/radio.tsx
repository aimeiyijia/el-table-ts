import Vue, { VNode, CreateElement } from 'vue'
import { Component } from 'vue-property-decorator'
import { omit } from '@/components/utils/opera'
import { Fragment } from 'vue-frag'

@Component({
  components: { Fragment },
})
export default class RadioPlus extends Vue {

  render(h: CreateElement): VNode {
    // 取出Radio渲染数组
    const { options = [], group = true } = this.$attrs
    // 获取出除options, options之外的配置项
    const attrs = omit(this.$attrs, ['options', 'type'])

    // 单选框
    const renderSingleRadio = () => {
      const Radios = (options as any).map((o: any) => {
        const { label, value, type } = o
        const restAttrs = omit(o, ['label', 'value', 'type'])
        let RadioTypeChild = 'el-radio'
        if (type === "button") { RadioTypeChild = 'el-Radio-button' }
        return (
          // @ts-ignore
          <RadioTypeChild
            {...{ attrs, props: { ...attrs, label: value, ...restAttrs }, on: this.$listeners }}
          >
            {label}
          </RadioTypeChild>
        )
      })
      return Radios
    }

    // 单选框组
    const renderGroupRadios = () => {
      return (
        <el-Radio-group
          {...{ attrs, props: { ...attrs }, on: this.$listeners }}>
          {renderSingleRadio()}
        </el-Radio-group>
      )
    }

    const renderRadios = () => {
      // 如果value为数组类型，则渲染为多选框组
      if (group) {
        return renderGroupRadios()
      }
      return renderSingleRadio()
    }

    return <fragment>{renderRadios()}</fragment>
  }
}
