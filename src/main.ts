import Vue from 'vue'
import '../mock/index'

import 'normalize.css'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'

import ElTableTs from './components/index.js'

import App from './app.vue'

Vue.use(ElementUI)
Vue.use(ElTableTs)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
