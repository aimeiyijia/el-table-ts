import Vue, { DirectiveOptions, VNode } from 'vue'
import { DirectiveBinding } from 'vue/types/options'
import { debounce } from 'ts-debounce'

// 用于存储全局性的resize事件
const globalEventListener = {
  f: () => { }
}

// interface CustomHTMLElement extends HTMLElement {
//   f: () => void
//   offsetTop: number
//   offsetParent: HTMLElement
// }

interface IOffset {
  bottomOffset?: number
  container?: string | HTMLElement
}

function getInnerHeight(elem: HTMLElement) {
  const computed = getComputedStyle(elem);
  const padding = parseInt(computed.paddingTop) + parseInt(computed.paddingBottom);

  return elem.clientHeight - padding
}

function query(el: string | HTMLElement): HTMLElement {
  if (typeof el === 'string') {
    const selected = document.querySelector(el)
    if (!selected) {
      console.warn('Cannot find element: ' + el)
    }
    return selected as HTMLElement
  } else {
    return el
  }
}

function getOffsetTop(elem: HTMLElement, inContainer: boolean): number {
  let top = elem.offsetTop;
  if (inContainer) return top

  let parent = elem.offsetParent as HTMLElement;
  while (parent) {
    top += parent.offsetTop;
    parent = parent.offsetParent as HTMLElement;
  }
  return top;
}

const calcTableHeight = (element: HTMLElement, offset: IOffset) => {
  const defaultHeight = 400

  let containerEl: HTMLElement = document.body
  if (offset.container) {
    const queryEl = query(offset.container)
    if (queryEl) {
      queryEl.style.position = 'relative'
      containerEl = queryEl
    }
  }

  const containerHeight = getInnerHeight(containerEl) || defaultHeight
  const topOffset = getOffsetTop(element, !!offset.container)

  const bottomOffset = offset.bottomOffset || 0

  let height = containerHeight - bottomOffset - topOffset

  // 高度是负数，将被设置为默认高度
  if (height <= 0) {
    console.warn('表格高度为负，已设置为默认高度(400)，请检查body元素或指定的容器元素高度')
    height = defaultHeight
  }

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
    const resizeListener = () => doTableResize(elType, binding, vnode)
    globalEventListener.f = debounce(resizeListener, 100)
    window.addEventListener('resize', globalEventListener.f)
    // 立刻执行一次
    doTableResize(elType, binding, vnode)
  },
  update(el, binding, vnode) {
    window.removeEventListener('resize', globalEventListener.f)

    const elType = el as unknown as HTMLElement
    const resizeListener = () => doTableResize(elType, binding, vnode)
    globalEventListener.f = debounce(resizeListener, 100)
    window.addEventListener('resize', globalEventListener.f)

    doTableResize(el as unknown as HTMLElement, binding, vnode)
  },
  unbind() {
    window.removeEventListener('resize', globalEventListener.f)
  },
}

Vue.directive('height-adaptive', directive)
