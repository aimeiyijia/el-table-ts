import Vue, { CreateElement } from 'vue';
import type { TableColumn } from 'element-ui';
import './index.scss';
export type EditFormConfig = {
    value?: any;
    editComponent?: string;
    options?: {
        value: number | string;
        label: number | string;
    }[];
    on?: any;
    scopedSlots?: object;
};
export default class editableCell extends Vue {
    readonly value: any;
    readonly toolTipContent: string;
    readonly toolTipDelay: number;
    readonly toolTipPlacement: string;
    readonly editMode: boolean;
    readonly editFormConfig: EditFormConfig;
    readonly row: any;
    readonly column: TableColumn;
    private editing;
    private fieldValue;
    created(): void;
    render(h: CreateElement): JSX.Element;
}
