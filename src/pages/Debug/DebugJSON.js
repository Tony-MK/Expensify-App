"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Expensicons = require("@components/Icon/Expensicons");
const ScrollView_1 = require("@components/ScrollView");
const SwipeInterceptPanResponder_1 = require("@components/SwipeInterceptPanResponder");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useThrottledButtonState_1 = require("@hooks/useThrottledButtonState");
const Clipboard_1 = require("@libs/Clipboard");
const DebugUtils_1 = require("@libs/DebugUtils");
function DebugJSON({ data }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [isThrottledButtonActive, setThrottledButtonInactive] = (0, useThrottledButtonState_1.default)();
    const json = (0, react_1.useMemo)(() => DebugUtils_1.default.stringifyJSON(data), [data]);
    return (<ScrollView_1.default style={styles.mt5} contentContainerStyle={[styles.gap5, styles.ph5]}>
            <Button_1.default isDisabled={!isThrottledButtonActive} text={isThrottledButtonActive ? translate('reportActionContextMenu.copyOnyxData') : translate('reportActionContextMenu.copied')} onPress={() => {
            Clipboard_1.default.setString(json);
            setThrottledButtonInactive();
        }} icon={Expensicons.Copy}/>
            <react_native_1.View 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...SwipeInterceptPanResponder_1.default.panHandlers}>
                <Text_1.default style={[styles.textLabel, styles.mb5, styles.border, styles.p2]}>{json}</Text_1.default>
            </react_native_1.View>
        </ScrollView_1.default>);
}
DebugJSON.displayName = 'DebugJSON';
exports.default = DebugJSON;
