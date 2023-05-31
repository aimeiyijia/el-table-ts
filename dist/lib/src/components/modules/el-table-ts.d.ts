import Vue, { VNode, CreateElement } from 'vue';
import '../directives/height-adaptive';
import { Pagination, TableColumn } from 'element-ui';
import '../styles/index.scss';
declare interface IDirectives {
    heightAdaptive?: {
        container?: string | Element;
        bottomOffset?: number;
    };
}
declare interface ITableColumn extends TableColumn {
    children: ITableColumn[];
    editable?: boolean;
    editMode?: boolean;
    customEdit?: boolean;
    editFormConfig?: object;
    hidden: boolean | ((columns: ITableColumn) => boolean);
    mask?: boolean;
}
export default class ElTableTs extends Vue {
    readonly directives: boolean | IDirectives | undefined;
    readonly columns: ITableColumn[];
    readonly colAttrs?: ITableColumn;
    readonly autoToTop?: boolean;
    readonly autoDoLayout?: boolean;
    readonly falseyRender?: boolean;
    readonly data: any[];
    readonly pagination: Pagination | undefined | boolean;
    readonly total: number | undefined;
    readonly container?: string | Element;
    isShowPag: boolean;
    private defPagination;
    onPaginationChanged(): void;
    get tableInstance(): any;
    get tableBodyWrapper(): HTMLElement;
    get columnsAttrs(): ITableColumn | undefined;
    mounted(): void;
    updated(): void;
    setPagination(): void;
    setTableScrollListener(): void;
    setTableScrollToTop(): void;
    pageSizeChange(pageSize: number): void;
    currentChange(currentPage: number): void;
    tableScroll(e: Event): Event;
    emitPageChangeEvent(): {
        pageSize: number;
        currentPage: number;
    };
    emitSizeChangeEvent(): {
        pageSize: number;
        currentPage: number;
    };
    emitPrevClick(): {
        pageSize: number;
        currentPage: number;
    };
    emitNextClick(): {
        pageSize: number;
        currentPage: number;
    };
    getheightAdaptiveValue(): number;
    splitDirectives(): {
        allowHeightAdaptive: boolean;
        directives: {
            name: string;
            value: {
                container: string | Element | undefined;
                bottomOffset: number;
            };
        }[];
    };
    render(h: CreateElement): VNode;
}
export {};
