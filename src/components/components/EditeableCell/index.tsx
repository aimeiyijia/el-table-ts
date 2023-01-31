import Vue, { VNode, CreateElement } from 'vue'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'

import { Input } from 'element-ui'

import './index.scss'

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

  // 进入编辑状态时使用的编辑组件
  @Prop({ type: String, default: 'el-input' }) readonly editableComponent!: string

  private editing = false

  private fieldValue: any

  created() {
    this.fieldValue = this.value
  }

  onFieldClick(e: MouseEvent) {
    this.editing = true
    this.$nextTick(() => {
      const inputRef = this.$refs.input as Input
      if (inputRef && inputRef.focus) {
        inputRef.focus()
      }
    })
    e.stopPropagation()
  }

  onFieldFoucs(e: PointerEvent){
    this.$emit('focus', e)
  }

  onFieldInput(val: any) {
    this.fieldValue = val
    this.$emit('input', this.fieldValue)
  }

  onFieldChange(val: any) {
    this.$emit('change', val)
  }

  onFieldBlur(e: PointerEvent) {
    this.editing = false
    this.$emit('blur', e)
  }

  onInputExit() {
    this.editing = false
  }



  // handleKeyDown(event: KeyboardEvent) {
  //   console.log('User pressed: ', event.key);

  //   if (event.key === 'Enter') {
  //     // 👇️ your logic here
  //     console.log('Enter key pressed ✅');
  //   }
  // }

  render(h: CreateElement) {
    return (
      <div class="edit-cell edit-enabled-cell" onClick={this.onFieldClick}>
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
            <this.editableComponent
              ref="input"
              {...{
                props: {
                  ...this.$attrs,
                  value: this.fieldValue
                },
                on: {
                  input: this.onFieldInput,
                  change: this.onFieldChange,
                  focus: this.onFieldFoucs,
                  blur: this.onFieldBlur
                },
              }}
            >
            </this.editableComponent>
          )
        }
      </div>
    )
  }
}
