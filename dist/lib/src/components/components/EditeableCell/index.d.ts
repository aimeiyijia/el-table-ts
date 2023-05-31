import Vue, { CreateElement } from 'vue';
import './index.scss';
export type EditFormConfig = {
    value?: any;
    editComponent?: string;
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
    readonly editableComponent: string;
    private editing;
    private fieldValue;
    created(): void;
    render(h: CreateElement): JSX.Element;
}
