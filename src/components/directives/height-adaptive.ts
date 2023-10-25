import Vue, { DirectiveOptions, VNode } from 'vue'
import { DirectiveBinding } from 'vue/types/options'
import { debounce } from 'ts-debounce'
import {
  addResizeListener,
  removeResizeListener
} from 'element-ui/src/utils/resize-event.js'

interface IParams {
  bottomOffset?: number
  container?: string | HTMLElement
}

function getInnerHeight(elem: HTMLElement) {
  const computed = getComputedStyle(elem)
  const padding =
    parseInt(computed.paddingTop) + parseInt(computed.paddingBottom)

  return elem.clientHeight - padding
}

function query(el: string | HTMLElement): HTMLElement {
  if (typeof el === 'string') {
    const selected = document.querySelector(el)
    return selected as HTMLElement
  } else {
    return el
  }
}

function getOffsetTop(elem: HTMLElement, inContainer: boolean): number {
  let top = elem.offsetTop
  if (inContainer) return top
  let parent = elem.offsetParent as HTMLElement
  while (parent) {
    top += parent.offsetTop
    parent = parent.offsetParent as HTMLElement
  }
  return top
}

const calcTableHeight = (element: HTMLElement, params: IParams) => {
  const defaultHeight = 400

  let containerEl: HTMLElement = document.body
  if (params.container) {
    const queryEl = query(params.container)
    if (queryEl) {
      queryEl.style.position = 'relative'
      containerEl = queryEl
    }
  }

  const containerHeight = getInnerHeight(containerEl) || defaultHeight
  const topOffset = getOffsetTop(element, !!params.container)

  const bottomOffset = params.bottomOffset || 0

  let height = containerHeight - bottomOffset - topOffset

  // 高度是负数，将被设置为默认高度
  if (height <= 0) {
    height = defaultHeight
  }

  return height
}
const doTableResize = (
  el: HTMLElement,
  binding: DirectiveBinding,
  vnode: VNode
): any => {
  try {
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
      $table.layout &&
        $table.layout.setHeight &&
        $table.layout.setHeight(height)
      $table.doLayout && $table.doLayout()
    })
  } catch (error) {
    // console.log(error, '页面布局计算出错')
  }
}

const directive: DirectiveOptions = {
  bind(el: any, binding, vnode: any) {
    doTableResize(el, binding, vnode)
  },
  update(el: any, binding, vnode: any) {
    el.resizeListener && window.removeEventListener('resize', el.resizeListener)
    el.resizeListener = debounce(() => doTableResize(el, binding, vnode), 100)
    window.addEventListener('resize', el.resizeListener)
    doTableResize(el, binding, vnode)
  },
  unbind(el: any) {
    removeResizeListener(window.document.body, el.resizeListener)
  }
}

Vue.directive('height-adaptive', directive)
