export function omit(obj: any, fields: any[]) {
  const shallowCopy = Object.assign({}, obj)
  for (let i = 0; i < fields.length; i += 1) {
    const key = fields[i]
    delete shallowCopy[key]
  }
  return shallowCopy
}

export function isPlainObject(obj: any): boolean {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function deepClone(val: any) {
  if (isPlainObject(val)) {
    const res: any = {}
    for (const key in val) {
      res[key] = deepClone(val[key])
    }
    return res
  } else if (Array.isArray(val)) {
    return val.slice()
  } else {
    return val
  }
}

export function setValueByPath(obj: any, path: string, value: any) {
  let i
  const paths = path.split('.')
  for (i = 0; i < paths.length - 1; i++) {
    obj = obj[paths[i]]
  }

  obj[paths[i]] = value
}

// 深度查询
export function deepQuery(
  tree: any,
  value: string,
  matchMark = 'value',
  children = 'children'
): any {
  let isGet = false
  let target = null
  function deepSearch(tree: any, value: string) {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i][children] && tree[i][children].length > 0) {
        deepSearch(tree[i][children], value)
      }
      if (value === tree[i][matchMark] || isGet) {
        isGet || (target = tree[i])
        isGet = true
        break
      }
    }
  }
  deepSearch(tree, value)
  return target
}

// 金额格式化(保留两位小数)
export function formatMoney(num: any) {
  if (num || num === 0) {
    if (isNaN(num)) {
      console.error('金额中含有不能识别的字符')
      return
    }
    num = typeof num === 'string' ? parseFloat(num) : num
    num = num.toFixed(2)
    num = parseFloat(num) // 转成数字
    num = num.toLocaleString() // 转成金额显示模式
    // 判断是否有小数
    if (num.indexOf('.') === -1) {
      num = num + '.00'
    } else {
      num = num.split('.')[1].length < 2 ? num + '0' : num
    }
    return num
  }
}

export function floatMultiply(arg1?: any, arg2?: any): any {
  if (arg1 == null || arg2 == null) {
    return null
  }
  let n1 = 1
  let n2 = 1
  let r1, r2 // 小数位数
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  n1 = Number(arg1.toString().replace('.', ''))
  n2 = Number(arg2.toString().replace('.', ''))
  return (n1 * n2) / Math.pow(10, r1 + r2)
}
export function digitUppercase(n: any) {
  const fraction = ['角', '分']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ]
  const head = n < 0 ? '欠' : ''
  n = Math.abs(n)
  let s = ''
  for (let i = 0; i < fraction.length; i++) {
    // @ts-ignore
    s += (
      digit[
        Math.floor(floatMultiply(floatMultiply(n, 10), Math.pow(10, i))) % 10
      ] + fraction[i]
    ).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  return (
    head +
    s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整')
  )
}
