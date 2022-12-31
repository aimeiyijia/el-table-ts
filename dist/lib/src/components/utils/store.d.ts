declare class PagStore {
    static instance: PagStore;
    currentPage: number;
    pageSize: number;
    [key: string]: any;
    constructor();
    static getInstance(): PagStore;
    setCurrentPage(page: number): void;
    setPageSize(size: number): void;
}
declare const _default: PagStore;
export default _default;
