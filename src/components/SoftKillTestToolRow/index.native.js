"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SoftKillTestToolRow;
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const TestToolRow_1 = require("@components/TestToolRow");
const useLocalize_1 = require("@hooks/useLocalize");
function SoftKillTestToolRow() {
    const { translate } = (0, useLocalize_1.default)();
    return (<TestToolRow_1.default title={translate('initialSettingsPage.troubleshoot.softKillTheApp')}>
            <Button_1.default small text={translate('initialSettingsPage.troubleshoot.kill')} onPress={() => react_native_1.NativeModules.TestToolsBridge.softKillApp()}/>
        </TestToolRow_1.default>);
}
