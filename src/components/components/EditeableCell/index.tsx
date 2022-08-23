import Vue, { VNode, CreateElement } from 'vue'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'

import { Input } from 'element-ui'

import './index.scss'

@Component({})
export default class editableCell extends Vue {
  @Prop({ default: '' }) readonly value!: any

  @Prop({ type: String, default: '点击编辑，点击外部取消编辑' }) readonly toolTipContent!: string

  @Prop({ type: Number, default: 500 }) readonly toolTipDelay!: number

  @Prop({ type: String, default: 'top' }) readonly toolTipPlacement!: string

  // 是否初始化时就进入编辑状态
  @Prop({ type: Boolean, default: false }) readonly edit!: boolean

  // 进入编辑状态时使用的编辑组件
  @Prop({ type: String, default: 'el-input' }) readonly editableComponent!: string

  private editMode = false

  private fieldValue = ''

  created() {
    this.fieldValue = this.value
  }

  onFieldClick() {
    this.editMode = true
    this.$nextTick(() => {
      const inputRef = this.$refs.input as Input
      if (inputRef && inputRef.focus) {
        inputRef.focus()
      }
    })
  }

  onFieldInput(val: string) {
    console.log(val, '输入变化')
    this.fieldValue = val
  }

  onInputExit() {
    this.editMode = false
  }

  onFieldChange(val: string | number) {
    this.$emit('input', val)
  }

  onFieldBlur() {
    this.editMode = false
    console.log('退出编辑')
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
        {!this.editMode && (
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
          (this.editMode || this.edit) && (
            <this.editableComponent
              ref="input"
              {...{
                props: {
                  ...this.$attrs,
                  value: this.fieldValue
                },
                on: {
                  ...this.$listeners,
                  input: this.onFieldInput,
                  change: this.onFieldChange,
                  focus: this.onFieldClick,
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
