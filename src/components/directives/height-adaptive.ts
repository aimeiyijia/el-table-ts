import Vue, { DirectiveOptions, VNode } from 'vue'
import { DirectiveBinding } from 'vue/types/options'
import { Table } from 'element-ui'
import { debounce } from 'ts-debounce'

interface HTMLElement {
  __resizeListener: () => void;
}

interface IOffset {
  bottomOffset: number
  offsetTop: number
}

// 表格从页面底部开始的高度。

const calcTableHeight = (element: HTMLElement, offset: IOffset) => {

  return (
    window.innerHeight - offset.offsetTop - offset.bottomOffset
  )
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
  const offset: IOffset = {
    bottomOffset: (value && value.bottomOffset) || 10,
    offsetTop: (value && value.offsetTop) || 10,
  }

  if (!$table) return
  const height = calcTableHeight(el, offset)
  $table.$nextTick(() => {
    $table.layout.setHeight(height)
    $table.doLayout()
  })
}

const directive: DirectiveOptions ={
  bind(el, binding, vnode) {
    const elType = el as unknown as HTMLElement
    elType.__resizeListener = () => {
      doTableResize(elType, binding, vnode)
    }

    window.addEventListener('resize', debounce(elType.__resizeListener))
  },
  update(el, binding, vnode) {
    doTableResize(el as unknown as HTMLElement, binding, vnode)
  },
  unbind(el) {
    window.removeEventListener('resize', (el as unknown as HTMLElement).__resizeListener)
  },
}

Vue.directive('height-adaptive', directive)
