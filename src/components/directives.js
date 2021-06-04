import Vue from 'vue'

// 防抖
const debounce = fn => {
  let timeout = null // 创建一个标记用来存放定时器的返回值
  return function() {
    clearTimeout(timeout) // 每当用户输入的时候把前一个 setTimeout clear 掉
    timeout = setTimeout(() => {
      // 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
      fn.apply(this, arguments)
    }, 10)
  }
}

const calcTableHeight = (element, offset) => {
  console.log(window.innerHeight)
  console.log(offset)
  const elP = element.parentNode
  return (
    elP.clientHeight - offset.hOffset - offset.topOffset - offset.bottomOffset
  )
}
const calcHeight = (element, offset) => {
  // console.log(offset)
  const elP = element.parentNode
  // console.log(element.parentNode)
  // console.log(elP.clientHeight)
  return (
    elP.clientHeight - offset.hOffset - offset.topOffset - offset.bottomOffset
  )
}

const doTableResize = (el, binding, vnode) => {
  const { componentInstance: $table } = vnode
  const { value } = binding
  if (!$table.height) {
    throw new Error(
      "el-table must set the height. Such as height='100px' or height='0'"
    )
  }
  const offset = {
    topOffset: (value && value.topOffset) || 10,
    bottomOffset: (value && value.bottomOffset) || 10,
    hOffset: (value && value.hOffset) || 10,
  }

  if (!$table) return
  const height = calcTableHeight(el, offset)

  console.log(height, '计算的高')
  $table.$nextTick(() => {
    $table.layout.setHeight(height)
    $table.doLayout()
  })
  // const time = setTimeout(function() {
  //   $table.layout.setHeight(height);
  //   $table.doLayout();
  //   clearTimeout(time);
  // }, 1);
}

const checkTag = (el, binding, vnode) => {
  if (el.tagName === 'TABLE' || el.className.includes('el-table')) {
    doTableResize(el, binding, vnode)
  } else {
    const { value } = binding
    const offset = {
      topOffset: (value && value.topOffset) || 10,
      bottomOffset: (value && value.bottomOffset) || 10,
      hOffset: (value && value.hOffset) || 10,
    }
    el.style.overflow = 'auto'
    el.style.marginTop = offset.topOffset + 'px'
    el.style.marginBottom = offset.bottomOffset + 'px'
    el.style.height = calcHeight(el, offset) + 'px'
  }
}

Vue.directive('height-adaptive', {
  bind(el, binding, vnode) {
    el.resizeListener = () => {
      checkTag(el, binding, vnode)
    }

    window.addEventListener('resize', debounce(el.resizeListener))

    // var myEvent = new Event("resize");
    // window.dispatchEvent(myEvent);
  },
  update(el, binding, vnode) {
    checkTag(el, binding, vnode)
  },
  unbind(el) {
    window.removeEventListener('resize', el.resizeListener)
  },
})
