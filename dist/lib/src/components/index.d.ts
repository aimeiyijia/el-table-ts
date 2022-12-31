import { PluginFunction } from 'vue';
interface InstallFunction extends PluginFunction<any> {
    installed?: boolean;
}
declare const install: InstallFunction;
export default install;
