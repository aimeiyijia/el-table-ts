import ElTableTs from './modules/el-table-ts'
import ElTableHttp from './modules/el-table-http'
import _Vue, { PluginFunction, VueConstructor } from 'vue'

interface InstallFunction extends PluginFunction<any> {
  installed?: boolean;
}

const Components: { [key: string]: VueConstructor } = {
  ElTableTs: ElTableTs,
  ElTableHttp: ElTableHttp,
}

const installer: InstallFunction = (Vue: typeof _Vue) => {
  if (installer.installed) return

  Object.keys(Components).forEach((name: any) => {
    Vue.component(name, Components[name])
  })

  installer.installed = true
}

export default installer
