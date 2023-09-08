import Vue from 'vue';
export type Obj = {
    [p: string]: any;
};
export declare const ElSelectMixinOptions: {
    model: {
        prop: string;
        event: string;
    };
    props: {
        name: StringConstructor;
        id: StringConstructor;
        value: {
            required: boolean;
        };
        autocomplete: StringConstructor;
        autoComplete: StringConstructor;
        automaticDropdown: BooleanConstructor;
        size: StringConstructor;
        disabled: BooleanConstructor;
        clearable: BooleanConstructor;
        filterable: BooleanConstructor;
        allowCreate: BooleanConstructor;
        loading: BooleanConstructor;
        popperClass: StringConstructor;
        remote: BooleanConstructor;
        loadingText: StringConstructor;
        noMatchText: StringConstructor;
        noDataText: StringConstructor;
        remoteMethod: FunctionConstructor;
        filterMethod: FunctionConstructor;
        multiple: BooleanConstructor;
        multipleLimit: NumberConstructor;
        placeholder: StringConstructor;
        defaultFirstOption: BooleanConstructor;
        reserveKeyword: BooleanConstructor;
        valueKey: StringConstructor;
        collapseTags: BooleanConstructor;
        popperAppendToBody: {
            type: BooleanConstructor;
            default: boolean;
        };
    };
};
export declare const ElSelectMixin: import("vue/types/vue").ExtendedVue<Vue<Record<string, any>, Record<string, any>, never, never, (event: string, ...args: any[]) => Vue<Record<string, any>, Record<string, any>, never, never, any>>, unknown, unknown, unknown, {
    name: string;
    id: string;
    value: unknown;
    autocomplete: string;
    autoComplete: string;
    automaticDropdown: boolean;
    size: string;
    disabled: boolean;
    clearable: boolean;
    filterable: boolean;
    allowCreate: boolean;
    loading: boolean;
    popperClass: string;
    remote: boolean;
    loadingText: string;
    noMatchText: string;
    noDataText: string;
    remoteMethod: Function;
    filterMethod: Function;
    multiple: boolean;
    multipleLimit: number;
    placeholder: string;
    defaultFirstOption: boolean;
    reserveKeyword: boolean;
    valueKey: string;
    collapseTags: boolean;
    popperAppendToBody: boolean;
}, {}, import("vue/types/v3-component-options").ComponentOptionsMixin, import("vue/types/v3-component-options").ComponentOptionsMixin>;
export declare const ElTreeMixinOptions: {
    props: {
        data: {
            type: ArrayConstructor;
            default: () => never[];
        };
        emptyText: StringConstructor;
        renderAfterExpand: {
            type: BooleanConstructor;
            default: boolean;
        };
        nodeKey: StringConstructor;
        checkStrictly: BooleanConstructor;
        defaultExpandAll: BooleanConstructor;
        checkDescendants: BooleanConstructor;
        autoExpandParent: {
            type: BooleanConstructor;
            default: boolean;
        };
        defaultCheckedKeys: ArrayConstructor;
        defaultExpandedKeys: ArrayConstructor;
        currentNodeKey: (NumberConstructor | StringConstructor)[];
        renderContent: FunctionConstructor;
        showCheckbox: BooleanConstructor;
        props: ObjectConstructor;
        lazy: BooleanConstructor;
        highlightCurrent: BooleanConstructor;
        load: FunctionConstructor;
        accordion: BooleanConstructor;
        indent: NumberConstructor;
        iconClass: StringConstructor;
    };
};
export declare const ElTreeMixin: import("vue/types/vue").ExtendedVue<Vue<Record<string, any>, Record<string, any>, never, never, (event: string, ...args: any[]) => Vue<Record<string, any>, Record<string, any>, never, never, any>>, unknown, unknown, unknown, {
    data: unknown[];
    emptyText: string;
    renderAfterExpand: boolean;
    nodeKey: string;
    checkStrictly: boolean;
    defaultExpandAll: boolean;
    checkDescendants: boolean;
    autoExpandParent: boolean;
    defaultCheckedKeys: unknown[];
    defaultExpandedKeys: unknown[];
    currentNodeKey: string | number;
    renderContent: Function;
    showCheckbox: boolean;
    props: any;
    lazy: boolean;
    highlightCurrent: boolean;
    load: Function;
    accordion: boolean;
    indent: number;
    iconClass: string;
}, {}, import("vue/types/v3-component-options").ComponentOptionsMixin, import("vue/types/v3-component-options").ComponentOptionsMixin>;
export declare function propsPick(props: Obj, keys: string[]): Obj;
export declare function toArr(val: any): any[];
export declare function isValidArr(val: any): number | false;
export declare function getParentKeys(currentKeys: (number | string)[], data: Obj[], getValByProp: (prop: 'value' | 'children', data: Obj) => any): (string | number)[];
type Value = string | number | (string | number)[];
export declare function cloneValue(val: Value): string | number | (string | number)[];
export declare function isEqualsValue(val1: Value, val2: Value): boolean;
type TreeCallback<T extends Obj, R> = (data: T, index: number, array: T[], parent?: T) => R;
export declare function treeEach<T extends Obj>(treeData: T[], callback: TreeCallback<T, void>, getChildren: (data: T) => T[], parent?: T): void;
export {};
