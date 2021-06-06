const Mock = require('mockjs')
Mock.mock('/api/data', { name: 'Jack', 'age|10-20': 10 })
