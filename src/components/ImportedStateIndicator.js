"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const App_1 = require("@libs/actions/App");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Button_1 = require("./Button");
function ImportedStateIndicator() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [isUsingImportedState] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_USING_IMPORTED_STATE);
    if (!isUsingImportedState) {
        return null;
    }
    return (<react_native_1.View style={[styles.buttonDanger]}>
            <Button_1.default danger small shouldRemoveLeftBorderRadius shouldRemoveRightBorderRadius text={translate('initialSettingsPage.troubleshoot.usingImportedState')} onPress={() => (0, App_1.clearOnyxAndResetApp)(true)} textStyles={[styles.fontWeightNormal]}/>
        </react_native_1.View>);
}
exports.default = ImportedStateIndicator;
