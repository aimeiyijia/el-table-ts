import Vue, { DirectiveOptions, VNode } from 'vue'
import { DirectiveBinding } from 'vue/types/options'
// @ts-ignore
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';
import { debounce } from 'ts-debounce'

interface HTMLElement {
  __resizeListener: () => void
}

interface IOffset {
  bottomOffset: number
  topOffset: number
}

// 表格从页面底部开始的高度。

const calcTableHeight = (element: HTMLElement, offset: IOffset) => {
  const wiH = window.innerHeight || 400

  const elOB = offset.bottomOffset || 40

  const height = wiH - elOB
  return height
}

const doTableResize = (el: HTMLElement, binding: DirectiveBinding, vnode: VNode) => {
  const { componentInstance } = vnode

  // todo ts 报 Table里面没有layout属性，但是在原型链上可以看到
  const $table = componentInstance as any
  const { value } = binding
  if (!$table.height) {
    throw new Error(
      "el-table must set the height. Such as height='10px' or height='0'"
    )
  }

  if (!$table) return
  const height = calcTableHeight(el, value)
  $table.$nextTick(() => {
    $table.layout.setHeight(height)
    $table.doLayout()
  })
}

const directive: DirectiveOptions = {
  bind(el, binding, vnode) {
    const elType = el as unknown as HTMLElement
    elType.__resizeListener = () => {
      doTableResize(elType, binding, vnode)
    }
    const f = debounce(elType.__resizeListener, 200)
    addResizeListener(el, f)
    window.addEventListener('resize', f)
    // 立刻执行一次
    doTableResize(elType, binding, vnode)
  },
  update(el, binding, vnode) {
    doTableResize(el as unknown as HTMLElement, binding, vnode)
  },
  unbind(el) {
    const elType = el as unknown as HTMLElement
    removeResizeListener(el, elType.__resizeListener)
    window.removeEventListener('resize', elType.__resizeListener)
  },
}

Vue.directive('height-adaptive', directive)
