import Vue from 'vue'
import App from './app.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import ElTablePlus from '../dist/el-table-plus.common.js'
Vue.use(ElTablePlus)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
