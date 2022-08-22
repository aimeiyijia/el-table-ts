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
