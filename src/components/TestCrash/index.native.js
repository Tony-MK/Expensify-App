"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const TestToolRow_1 = require("@components/TestToolRow");
const useLocalize_1 = require("@hooks/useLocalize");
const testCrash_1 = require("@libs/testCrash");
const firebase_json_1 = require("../../../firebase.json");
/**
 * Adds a button in native dev builds to test the crashlytics integration with user info.
 */
function TestCrash() {
    const { translate } = (0, useLocalize_1.default)();
    const isCrashlyticsDebugEnabled = firebase_json_1.default?.['react-native']?.crashlytics_debug_enabled ?? false;
    const toolRowTitle = translate('initialSettingsPage.troubleshoot.testCrash');
    return (<react_native_1.View>
            {isCrashlyticsDebugEnabled || !__DEV__ ? (<TestToolRow_1.default title={toolRowTitle}>
                    <Button_1.default small text={toolRowTitle} onPress={testCrash_1.default}/>
                </TestToolRow_1.default>) : null}
        </react_native_1.View>);
}
exports.default = TestCrash;
