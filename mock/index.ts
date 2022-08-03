import Mock from 'mockjs'

const dataTemplate = {
  // 属性 id 是一个自增数，起始值为 1，每次增 1
  'id|188888884587-888888879874': 60,
  'age|20-40': 20,
  name: '@cname',
  oldName: '@cname',
  desc: {
    'height|0-180': 0,
  },
}

export const MockData = Mock.mock({
  // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
  'data|13': [dataTemplate],
})

// Mock响应模板
Mock.mock(RegExp('http://test.data' + '.*'), {
  code: 200,
  msg: 'ok',
  data: {
    'data|16': [dataTemplate],
    total: 16,
    pageNo: 1,
    pageSize: 10,
  },
})
