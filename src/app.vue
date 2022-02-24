<template>
  <div id="app">
    <div>
      俄罗斯位于欧亚大陆北部的联邦共和国，国土横跨欧亚两大洲，拥有1,707万平方公里的面积，占地球陆地面积八分之一，为全世界领土面积最大的国家[10][11]；它也是世界上人口第九多的国家，拥有1.44亿人口，77%居住于其较为发达的欧洲部分。俄罗斯国土覆盖整个亚洲北部及东欧大部，横跨11个时区，涵盖广泛的环境和地形。拥有全世界最大的森林储备和含有约世界四分之一的淡水的湖泊[12]。俄罗斯有十四个陆上邻国（从西北方向起逆时针序）：挪威、芬兰、爱沙尼亚、拉脱维亚、立陶宛、波兰、白俄罗斯、乌克兰、格鲁吉亚[13]、阿塞拜疆、哈萨克斯坦、中国、蒙古和朝鲜（其中立陶宛和波兰仅与俄罗斯外飞地加里宁格勒州接壤）。俄罗斯还与日本、韩国、美国、加拿大、格陵兰（丹麦）、冰岛、瑞典、土耳其隔海相望。俄罗斯北部和东部分别为北冰洋和太平洋包围，西北和西南则分别可经由波罗的海达到大西洋，黑海则可以到地中海。
    </div>
    <el-table-ts></el-table-ts>
    <!-- <el-table-http></el-table-http> -->
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
    ElTableTs,
  },
})
export default class extends Vue {}
</script>
<style lang="scss">
html,
body,
#app {
  height: 100%;
}
body {
  overflow: hidden;
}
</style>
