import ElTableTs from './modules/el-table-ts';
import ElTableHttp from './modules/el-table-http';
import { PluginFunction } from 'vue';
interface InstallFunction extends PluginFunction<any> {
    installed?: boolean;
}
declare const install: InstallFunction;
export { ElTableTs, ElTableHttp };
export default install;
