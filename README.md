# el-table-ts
[组件使用文档](https://ame.cool/pages/28073c/)

#### 封装axios
组件直接使用的是axios，是以axios(config)形式进行组装
使用内部的axios时，可根据http请求自动显示loading
不使用时，需自行控制loading状态

#### 校验数据来源
data 直接指定data配置项
promise 传入一个promise时，内部会按照特定方式解析，
传入axios配置项，帮你发起请求，并做内部解析

优先级 
data > axios(config) data既是是空, 其内部优先级也比axios(config)高


? 直接封装一层  暴露出 get post请求
