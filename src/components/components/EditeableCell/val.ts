import type { TableColumn } from 'element-ui'
import { isDate } from '@/components/utils/types'
import type { EditFormConfig } from './index'
interface ProcessFn {
  (value: any, config: EditFormConfig, row: any, column: TableColumn): any
}
// 日期类型转成字符串显示
const renderDate: ProcessFn = function(value, config, row, column) {
  if (isDate(value)) return value.toString()
  return value
}
// 处理select类型 options里取出label
const renderSelect: ProcessFn = function(value, config, row, column) {
  const { options = [] } = config
  const target = options.find(o => o.value === value)
  if (target) {
    return target.label || ''
  }
  return ''
}

const renderFn: { [key: string]: any } = {
  DatePicker: renderDate,
  Select: renderSelect
}

export default renderFn
