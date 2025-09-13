"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useAccountTabIndicatorStatus_1 = require("@hooks/useAccountTabIndicatorStatus");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function Indicator() {
    const styles = (0, useThemeStyles_1.default)();
    const { indicatorColor, status } = (0, useAccountTabIndicatorStatus_1.default)();
    const indicatorStyles = [styles.alignItemsCenter, styles.justifyContentCenter, styles.statusIndicator(indicatorColor)];
    return !!status && <react_native_1.View style={react_native_1.StyleSheet.flatten(indicatorStyles)}/>;
}
Indicator.displayName = 'Indicator';
exports.default = Indicator;
