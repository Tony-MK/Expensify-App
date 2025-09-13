"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function SidebarSpacerWrapper({ children }) {
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    return <react_native_1.View style={styles.rootNavigatorContainerStyles(shouldUseNarrowLayout)}>{children}</react_native_1.View>;
}
SidebarSpacerWrapper.displayName = 'SidebarSpacerWrapper';
exports.default = SidebarSpacerWrapper;
