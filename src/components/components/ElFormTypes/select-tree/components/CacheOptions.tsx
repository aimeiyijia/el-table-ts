import Vue, { VNode } from 'vue';
import { Component, Inject, Prop, Watch } from 'vue-property-decorator'
import { Fragment } from 'vue-frag';

export type CacheOption = {
  value: string | number | boolean | object
  currentLabel: string | number
  isDisabled: boolean
};

export type SelectCache = {
  cachedOptions: CacheOption[]
  setSelected: Function
}

@Component({
  components: { Fragment },
})
export class CacheOptions extends Vue {
  @Inject() readonly select!: SelectCache
  @Prop({ type: Array, default: () => [] }) data!: CacheOption[]

  @Watch('data', { deep: true, immediate: true })
  dataChange() {
    this.data.forEach((item) => {
      const isHas = this.select.cachedOptions.some(
        (cache) => cache.value === item.value
      )
      if (!isHas) {
        this.select.cachedOptions.push(item);
      }
      this.select.setSelected();
    });
  }

  render(): VNode {
    return <fragment></fragment>
  }
}

export default CacheOptions;
