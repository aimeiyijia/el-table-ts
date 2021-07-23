import ElTableTs from './el-table-ts'
import ElTableHttp from './el-table-http'
import _Vue, { PluginFunction, VueConstructor } from 'vue'

interface InstallFunction extends PluginFunction<any> {
  installed?: boolean;
}

const Components: { [key: string]: VueConstructor } = {
  ElTableTs: ElTableTs,
  ElTableHttp: ElTableHttp,
}

const install: InstallFunction = (Vue: typeof _Vue) => {
  if (install.installed) return

  Object.keys(Components).forEach((name: any) => {
    Vue.component(name, Components[name]) // X
  })

  install.installed = true
}

export default install

// export default {
//   install(Vue: typeof _Vue) {
//     Vue.component(ElTableTs.name, ElTableTs)
//     Vue.component(ElTableHttp.name, ElTableHttp)
//   },
// }
