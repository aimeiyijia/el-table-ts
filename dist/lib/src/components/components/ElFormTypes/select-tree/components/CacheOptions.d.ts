import Vue, { VNode } from 'vue';
export type CacheOption = {
    value: string | number | boolean | object;
    currentLabel: string | number;
    isDisabled: boolean;
};
export type SelectCache = {
    cachedOptions: CacheOption[];
    setSelected: Function;
};
export declare class CacheOptions extends Vue {
    readonly select: SelectCache;
    data: CacheOption[];
    dataChange(): void;
    render(): VNode;
}
export default CacheOptions;
