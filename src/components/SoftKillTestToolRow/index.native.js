"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SoftKillTestToolRow;
var react_native_1 = require("react-native");
var Button_1 = require("@components/Button");
var TestToolRow_1 = require("@components/TestToolRow");
var useLocalize_1 = require("@hooks/useLocalize");
function SoftKillTestToolRow() {
    var translate = (0, useLocalize_1.default)().translate;
    return (<TestToolRow_1.default title={translate('initialSettingsPage.troubleshoot.softKillTheApp')}>
            <Button_1.default small text={translate('initialSettingsPage.troubleshoot.kill')} onPress={function () { return react_native_1.NativeModules.TestToolsBridge.softKillApp(); }}/>
        </TestToolRow_1.default>);
}
