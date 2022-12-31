import Vue, { CreateElement } from 'vue';
import './index.scss';
export default class editableCell extends Vue {
    readonly value: any;
    readonly toolTipContent: string;
    readonly toolTipDelay: number;
    readonly toolTipPlacement: string;
    readonly editMode: boolean;
    readonly editableComponent: string;
    private editing;
    private fieldValue;
    created(): void;
    onFieldClick(): void;
    onFieldInput(val: string): void;
    onInputExit(): void;
    onFieldChange(val: string | number): void;
    onFieldBlur(): void;
    render(h: CreateElement): JSX.Element;
}
