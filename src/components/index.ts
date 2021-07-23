import ElTableTs from './el-table-ts'
import ElTableHttp from './el-table-http'
import _Vue, { PluginFunction } from 'vue'

interface InstallFunction extends PluginFunction<any> {
  installed?: boolean;
}

const install: InstallFunction = (Vue: typeof _Vue) => {
  if (install.installed) return

  Vue.component(ElTableTs.name, ElTableTs)
  Vue.component(ElTableHttp.name, ElTableHttp)
  install.installed = true
}

export default install


// export default {
//   install(Vue: typeof _Vue) {
//     Vue.component(ElTableTs.name, ElTableTs)
//     Vue.component(ElTableHttp.name, ElTableHttp)
//   },
// }
