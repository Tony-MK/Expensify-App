"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const FocusTrapForScreen_1 = require("./FocusTrap/FocusTrapForScreen");
function OnboardingWrapper({ children }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<FocusTrapForScreen_1.default>
            <react_native_1.View style={styles.h100}>{children}</react_native_1.View>
        </FocusTrapForScreen_1.default>);
}
OnboardingWrapper.displayName = 'OnboardingWrapper';
exports.default = OnboardingWrapper;
