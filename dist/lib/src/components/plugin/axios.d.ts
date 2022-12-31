import { AxiosRequestConfig, AxiosPromise, AxiosInstance } from 'axios';
interface HTTPRequestConfig {
    (url: string, data: any, httpConfig?: AxiosRequestConfig): AxiosPromise;
}
interface IinitAxios {
    (httpConfig: AxiosRequestConfig): AxiosPromise;
}
declare class AxiosPlugin {
    cCfg: AxiosRequestConfig;
    http: AxiosInstance;
    constructor(createConfig?: AxiosRequestConfig);
    private createAxios;
    initAxios: IinitAxios;
    initPost: HTTPRequestConfig;
    initGet: HTTPRequestConfig;
}
export default AxiosPlugin;
