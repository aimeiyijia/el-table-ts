import Vue, { VNode, CreateElement } from 'vue'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'

import { Input } from 'element-ui'

import './index.scss'

import { omit } from '@/components/utils/opera'

export type EditFormConfig = {
  value?: any
  editComponent?: string
  on?: any
  scopedSlots?: object
}

@Component({
  components: { ElInput: Input }
})
export default class editableCell extends Vue {
  @Prop({ default: '' }) readonly value!: any

  @Prop({ type: String, default: '点击编辑，点击外部取消编辑' }) readonly toolTipContent!: string

  @Prop({ type: Number, default: 500 }) readonly toolTipDelay!: number

  @Prop({ type: String, default: 'top' }) readonly toolTipPlacement!: string

  // 是否初始化时就进入编辑状态
  @Prop({ type: Boolean, default: false }) readonly editMode!: boolean

  // 编辑组件的配置项
  @Prop({ type: Object, default: () => { } }) readonly editFormConfig!: EditFormConfig

  // 进入编辑状态时使用的编辑组件
  @Prop({ type: String, default: 'el-input' }) readonly editableComponent!: string

  private editing = false

  private fieldValue: any

  created() {
    this.fieldValue = this.value
  }

  // handleKeyDown(event: KeyboardEvent) {
  //   console.log('User pressed: ', event.key);

  //   if (event.key === 'Enter') {
  //     // 👇️ your logic here
  //     console.log('Enter key pressed ✅');
  //   }
  // }

  render(h: CreateElement) {
    const { value, editComponent = 'el-input', on = {}, scopedSlots = {} } = this.editFormConfig
    const attrs = omit(this.editFormConfig, ['editComponent', 'on', 'scopedSlots'])

    const onFieldClick = (e: MouseEvent) => {
      this.editing = true
      this.$nextTick(() => {
        const inputRef = this.$refs.input as Input
        if (inputRef && inputRef.focus) {
          inputRef.focus()
        }
      })
      e.stopPropagation()
    }

    const onFieldInput = (val: any) => {
      this.fieldValue = val
      this.$emit('input', this.fieldValue)
      const { input } = on
      input && input(this.fieldValue)
    }

    const onFieldBlur = (e: PointerEvent) => {
      this.editing = false
      const { blur } = on
      blur && blur(e)
    }

    return (
      <div class="edit-cell edit-enabled-cell" onClick={onFieldClick}>
        {!this.editing && !this.editMode && (
          <el-tooltip
            {...{
              props: {
                placement: this.toolTipPlacement,
                openDelay: this.toolTipDelay,
                content: this.toolTipContent,
              },
            }}
          >
            <div class="cell-content">
              {
                // @ts-ignore
                this.fieldValue
              }
            </div>
          </el-tooltip>
        )}
        {
          (this.editing || this.editMode) && (
            <editComponent
              ref="input"
              {...{
                props: {
                  ...attrs,
                  value: value || this.fieldValue
                },
                on: {
                  ...on,
                  input: onFieldInput,
                  blur: onFieldBlur
                },
                scopedSlots
              }}
            >
            </editComponent>
          )
        }
      </div>
    )
  }
}
