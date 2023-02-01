// adjust from from https://github.com/yujinpan/el-select-tree
import CacheOptions, { CacheOption } from './CacheOptions';
import Vue, { CreateElement } from 'vue';
import { Component, Mixins, Prop, Ref, Watch } from 'vue-property-decorator';
import {
  ElSelectMixin,
  ElTreeMixin,
  propsPick,
  ElSelectMixinOptions,
  ElTreeMixinOptions,
  toArr,
  isValidArr,
  Obj,
  getParentKeys,
  cloneValue,
  isEqualsValue,
  treeEach,
} from './utils';

import './index.scss'

import type { Select as ElSelectType, Tree as ElTreeType } from 'element-ui';
import type { TreeData, TreeNode, TreeStore } from 'element-ui/types/tree'
@Component({
  name: 'ElSelectTree',
})
export default class ElSelectTree extends Mixins(ElSelectMixin, ElTreeMixin) {
  @Prop({ type: Array, default: () => [] }) cacheData!: Obj[];

  @Ref('select') public select!: ElSelectType & Obj;
  @Ref('tree') public tree!: ElTreeType<any, any> & Obj;

  render(h: CreateElement) {
    if (
      !Vue.component('ElSelect') ||
      !Vue.component('ElTree') ||
      !Vue.component('ElOption')
    ) {
      throw new Error(`[ElSelectTree]: ElSelect/ElTree/ElOption unregistered.`);
    }

    const slots = [];
    this.$slots.prefix &&
      slots.push(h('template', { slot: 'prefix' }, this.$slots.prefix));
    this.$slots.empty &&
      slots.push(h('template', { slot: 'empty' }, this.$slots.empty));
    return h(
      'el-select',
      {
        ref: 'select',
        props: {
          ...this.propsElSelect,
          value: this.privateValue,
          popperClass: `el-select-tree__popper ${this.propsElSelect.popperClass || ''
            }`,
          filterMethod: this._filterMethod,
        },
        on: {
          ...this.$listeners,
          change: (val: any) => {
            this.privateValue = val;
          },
          'visible-change': this._visibleChange,
        },
      },
      [
        ...slots,
        h(CacheOptions, { props: { data: this.cacheOptions } }),
        h('el-tree', {
          ref: 'tree',
          props: {
            ...this.propsElTree,
            expandOnClickNode: !this.checkStrictly,
            filterNodeMethod: this._filterNodeMethod,
            nodeKey: this.propsMixin.value,
            defaultExpandedKeys: this._defaultExpandedKeys,
            renderContent: this._renderContent,
          },
          on: {
            ...this.$listeners,
            'node-click': this._nodeClick,
            check: this._check,
          },
        }),
      ]
    );
  }

  mounted() {
    // get ElTree/ElSelect all methods
    this.$nextTick(() => {
      ['focus', 'blur'].forEach((item) => {
        (this as Obj)[item] = this.select[item];
      });
      [
        'filter',
        'updateKeyChildren',
        'getCheckedNodes',
        'setCheckedNodes',
        'getCheckedKeys',
        'setCheckedKeys',
        'setChecked',
        'getHalfCheckedNodes',
        'getHalfCheckedKeys',
        'getCurrentKey',
        'getCurrentNode',
        'setCurrentKey',
        'setCurrentNode',
        'getNode',
        'remove',
        'append',
        'insertBefore',
        'insertAfter',
      ].forEach((item) => {
        (this as Obj)[item] = this.tree[item];
      });
    });
  }

  private get cacheOptions() {
    if (!this.renderAfterExpand && !this.lazy) return [];

    const options: CacheOption[] = [];

    treeEach(
      (this.data as Obj[]).concat(this.cacheData),
      (node) => {
        const value = this.getValByProp('value', node);
        options.push({
          value,
          currentLabel: this.getValByProp('label', node),
          isDisabled: this.getValByProp('disabled', node),
        });
      },
      (data) => this.getValByProp('children', data)
    );

    return options;
  }

  private get values() {
    return toArr(this.value);
  }

  /**
   * change from current component
   * @private
   */
  private privateValue: any = null;
  @Watch('privateValue')
  onPrivateValueChange(val: any) {
    // update when difference only
    if (!isEqualsValue(val, this.value as string)) {
      this.$emit('change', cloneValue(val));
    }

    if (this.showCheckbox) {
      this.$nextTick(() => {
        this.tree.setCheckedKeys(this.values);
      });
    }
  }

  /**
   * change from user assign value
   */
  @Watch('value', { deep: true, immediate: true })
  private onValueChange(val: any) {
    // update when difference only
    if (!isEqualsValue(val, this.privateValue)) {
      this.privateValue = cloneValue(val);
      this._updateDefaultExpandedKeys();
    }
  }

  // Expand the parent node of the selected node by default,
  // "default" is the value/data/defaultExpandedKeys
  // changed from user assign value, rather than current component
  private _defaultExpandedKeys: any = [];
  @Watch('data')
  @Watch('defaultExpandedKeys', { immediate: true })
  _updateDefaultExpandedKeys() {
    const parentKeys =
      isValidArr(this.values) && isValidArr(this.data)
        ? getParentKeys(this.values, this.data as Obj[], this.getValByProp)
        : [];
    return (this._defaultExpandedKeys = this.defaultExpandedKeys
      ? this.defaultExpandedKeys.concat(parentKeys)
      : parentKeys);
  }

  private get propsElSelect() {
    return propsPick(this.$props, Object.keys(ElSelectMixinOptions.props));
  }

  private get propsElTree() {
    return {
      ...propsPick(this.$props, Object.keys(ElTreeMixinOptions.props)),
      props: this.propsMixin,
    };
  }

  /**
   * 禁止直接引用，通过 getValByProp 获取节点值
   */
  private get propsMixin(): Record<
    'value' | 'label' | 'children' | 'disabled' | 'isLeaf',
    string | ((data: Obj, node?: Obj) => any)
  > {
    return {
      value: this.nodeKey || 'value',
      label: 'label',
      children: 'children',
      disabled: 'disabled',
      isLeaf: 'isLeaf',
      ...this.props,
    };
  }

  /**
   * 获取节点的 prop 对应的值
   */
  private getValByProp(
    prop: 'value' | 'label' | 'children' | 'disabled' | 'isLeaf',
    data: Obj
  ): any {
    const propVal = this.propsMixin[prop];
    if (propVal instanceof Function) {
      return propVal(
        data,
        this.tree?.getNode(this.getValByProp('value', data))
      );
    } else {
      return data[propVal];
    }
  }

  private _renderContent(
    h: CreateElement,
    { node, data, store }: { node: TreeNode<any, any>, data: TreeData, store: TreeStore<any, any> }
  ) {
    const ElSelectTreeOption = {
      extends: Vue.component('ElOption'),
      methods: {
        // 拦截点击事件，事件移至 node 节点上
        selectOptionClick() {
          // $parent === slot-scope
          // $parent.$parent === el-tree-node
          // @ts-ignore
          this.$parent.$parent.handleClick();
        },
      },
    };
    return h(
      ElSelectTreeOption,
      {
        props: {
          value: this.getValByProp('value', data),
          label: this.getValByProp('label', data),
          disabled: this.getValByProp('disabled', data),
        },
      },
      this.renderContent
        ? [this.renderContent(h, { node, data, store })]
        : this.$scopedSlots.default
          ? this.$scopedSlots.default({ node, data, store })
          : undefined
    );
  }

  // el-select 的 query 事件转发至 el-tree 中
  private _filterMethod(val = '') {
    this.filterMethod?.(val);

    // fix: `tree` reference is empty when component destroy
    // https://github.com/yujinpan/el-select-tree/issues/35
    this.$nextTick(() => {
      this.tree && this.tree.filter(val);
    });
  }

  private _filterNodeMethod(value: any, data: TreeData, node: TreeNode<any, any>) {
    // fix: https://github.com/yujinpan/el-select-tree/issues/35
    if (this.filterMethod) return this.filterMethod(value, data, node);
    if (!value) return true;
    return this.getValByProp('label', data)?.includes(value);
  }

  // can not select
  private _nodeClick(data: TreeData, node: TreeNode<any, any>, component: any) {
    (this.$listeners['node-click'] as Function)?.(...arguments);

    if (this.canSelect(node)) {
      if (!this.getValByProp('disabled', data)) {
        const elOptionSlot = component.$children.find(
          (item: any) => item.$options._componentTag === 'node-content'
        );
        if(!elOptionSlot) return
        const elOption: any = elOptionSlot.$children[0];
        elOption.dispatch('ElSelect', 'handleOptionClick', [elOption, true]);
      }
    } else {
      component.handleExpandIconClick();
    }
  }

  // clear filter text when visible change
  private _visibleChange(val: any) {
    (this.$listeners['visible-change'] as Function)?.(...arguments);

    if (this.filterable && val) {
      this._filterMethod();
    }
  }

  // set selected when check change
  private _check(data: TreeData, params: any) {
    (this.$listeners.check as Function)?.(...arguments);

    let { checkedKeys, checkedNodes } = params;

    // remove folder node when `checkStrictly` is false
    if (!this.checkStrictly) {
      checkedKeys = checkedNodes
        .filter((item: any) => !isValidArr(this.getValByProp('children', item)))
        .map((item: any) => this.getValByProp('value', item));
    }

    this.privateValue = this.multiple
      ? [...checkedKeys]
      : checkedKeys.includes(this.getValByProp('value', data))
        ? this.getValByProp('value', data)
        : undefined;
  }

  private canSelect(data: TreeData) {
    return this.checkStrictly || this.getValByProp('isLeaf', data);
  }
}
