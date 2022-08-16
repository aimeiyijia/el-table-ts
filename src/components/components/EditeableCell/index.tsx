import Vue, { VNode, CreateElement } from 'vue'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'

import { Input } from 'element-ui'

import './index.scss'

@Component({})
export default class editableCell extends Vue {
  @Prop({ default: '' }) readonly value!: any

  @Prop({ type: String, default: '点击进入编辑' }) readonly toolTipContent!: string

  @Prop({ type: Number, default: 500 }) readonly toolTipDelay!: number

  @Prop({ type: String, default: '点击进入编辑' }) readonly toolTipPlacement!: string

  @Prop({ type: Boolean, default: false }) readonly editable!: boolean

  // 是否初始化时就进入编辑状态
  @Prop({ type: Boolean, default: false }) readonly edit!: boolean

  // 进入编辑状态时使用的编辑组件
  @Prop({ type: String, default: 'el-input' }) readonly editableComponent!: string

  // 何种事件触发关闭编辑
  @Prop({ type: String, default: 'el-input' }) readonly closeEvent!: string

  private editMode = false

  get listeners() {
    return {
      [this.closeEvent]: this.onInputExit,
      ...this.$listeners,
    }
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

  onInputExit() {
    this.editMode = false
  }

  onInputChange(val: string | number) {
    this.$emit('input', val)
  }

  handleKeyDown(event: KeyboardEvent) {
    console.log('User pressed: ', event.key);

    if (event.key === 'Enter') {
      // 👇️ your logic here
      console.log('Enter key pressed ✅');
    }
  }

  render(h: CreateElement) {
    return (
      <div class="edit-cell edit-enabled-cell" onClick={this.onFieldClick}>
        {(!this.editMode && this.editable) && (
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
                this.$scopedSlots!.content({})
              }
            </div>

          </el-tooltip>
        )}
        {
          ((this.editMode && this.editable) || this.edit) && (
            <this.editableComponent
              ref="input"
              {...{
                props: {
                  is: this.editableComponent,
                  ...this.$attrs
                },
                on: {
                  focus: this.onFieldClick,
                  keyUp: this.onInputExit,
                  ...this.listeners
                },
              }}
            >
              {/* {this.$scopedSlots!.editComponentSlot({})} */}
            </this.editableComponent>
          )
        }
      </div>
    )
  }
}
