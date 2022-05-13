import Vue, { DirectiveOptions, VNode } from 'vue'
import { DirectiveBinding } from 'vue/types/options'
import { debounce } from 'ts-debounce'

// 用于存储全局性的resize事件
const globalEventListener = {
  f: () => {}
}

interface HTMLElement {
  f: () => void
  offsetTop: number
  offsetParent: HTMLElement
}

interface IOffset {
  bottomOffset?: number
  parentEl?: string | Element
}

function isWindow( obj ) {
  return obj != null && obj === obj.window;
}

function getInnerHeight(elem: any){
  const name = 'inner'
  if ( isWindow( elem ) ) {

    // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
    // isn't a whole lot we can do. See pull request at this URL for discussion:
    // https://github.com/jquery/jquery/pull/764
    return elem.document.documentElement[ "client" + name ];
  }

  // Get document width or height
  if ( elem.nodeType === 9 ) {
    const doc = elem.documentElement;

    // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
    // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
    return Math.max(
      elem.body[ "scroll" + name ], doc[ "scroll" + name ],
      elem.body[ "offset" + name ], doc[ "offset" + name ],
      doc[ "client" + name ]
    );
  }
}

function query(el: string | Element): Element {
  if (typeof el === 'string') {
    const selected = document.querySelector(el)
    if (!selected) {
      console.warn('Cannot find element: ' + el)
    }
    return selected as Element
  } else {
    return el
  }
}

//
function getOffsetTop(elem: HTMLElement): number {
  let top = elem.offsetTop;
  let parent = elem.offsetParent;
  while (parent) {
    top += parent.offsetTop;
    parent = parent.offsetParent;
  }
  return top;
}

// 表格从页面底部开始的高度。

const calcTableHeight = (element: HTMLElement, offset: IOffset) => {
  let parentEl: Element = document.body
  if(offset.parentEl){
    parentEl = query(offset.parentEl)
  }
  const wiH = parentEl.innerHeight || 400

  const offsetTop = getOffsetTop(element)

  const elOB = offset.bottomOffset || 40

  const height = wiH - elOB - offsetTop
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
