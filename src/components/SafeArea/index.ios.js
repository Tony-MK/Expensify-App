"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function SafeArea({ children }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_safe_area_context_1.SafeAreaView style={[styles.iPhoneXSafeArea]} edges={['left', 'right']}>
            {children}
        </react_native_safe_area_context_1.SafeAreaView>);
}
SafeArea.displayName = 'SafeArea';
exports.default = SafeArea;
