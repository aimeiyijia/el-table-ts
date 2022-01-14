<template>
  <div id="app">
    <!-- <el-table-ts></el-table-ts> -->
    <el-table-http></el-table-http>
  </div>
</template>

<script type="typescript">
import Vue, { VNode, CreateElement } from 'vue'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import ElTableHttp from './testViews/elTableHttp'
import ElTableTs from './testViews/elTableTs'
@Component({
  name: 'App',
  components: {
    ElTableHttp,
    ElTableTs
  }
})
export default class extends Vue {

}
</script>
<style lang="scss">
html,
body,
#app {
  height: 100%;
}
</style>
