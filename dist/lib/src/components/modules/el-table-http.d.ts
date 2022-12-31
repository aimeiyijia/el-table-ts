import Vue from 'vue';
import { AxiosRequestConfig } from 'axios';
interface Ipath {
    dataPath: string;
    dataName: string;
    totalName: string;
}
interface Ipag {
    pageSizeName: string;
    pageNoName: string;
}
interface InetWork {
    method?: string;
    url?: string;
    data?: any;
    createConfig?: AxiosRequestConfig;
    httpConfig?: AxiosRequestConfig;
    path?: Ipath;
    pag?: Ipag;
}
export default class ElTableHttp extends Vue {
    readonly netWork: InetWork;
    private requsetData;
    private pag;
    private data;
    private pageSize;
    private currentPage;
    private total;
    renderComplete(tableInstance: any): any;
    getData(): Promise<void>;
    private decideUseWhichMode;
    private sendRequest;
    private initHttp;
    private pageSizeChange;
    private currentChange;
    private emitPageChangeEvent;
    private emitSizeChangeEvent;
    private render;
}
export {};
