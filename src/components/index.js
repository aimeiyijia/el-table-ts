import component from './el-table-ts.tsx'

function install(Vue) {
  if (install.installed) return
  install.installed = true

  Vue.component('el-table-ts', component)
}
component.install = install

// auto plugin install
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.vue
}
if (GlobalVue) {
  GlobalVue.use(component)
}

// export default
export default component
