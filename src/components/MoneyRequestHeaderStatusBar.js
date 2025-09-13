"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Text_1 = require("./Text");
function MoneyRequestHeaderStatusBar({ icon, description, shouldStyleFlexGrow = true }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={[styles.dFlex, styles.flexRow, styles.alignItemsCenter, shouldStyleFlexGrow && styles.flexGrow1, styles.overflowHidden, styles.headerStatusBarContainer]}>
            <react_native_1.View style={styles.mr2}>{icon}</react_native_1.View>
            <react_native_1.View style={[styles.flexShrink1]}>
                <Text_1.default style={[styles.textLabelSupporting]}>{description}</Text_1.default>
            </react_native_1.View>
        </react_native_1.View>);
}
MoneyRequestHeaderStatusBar.displayName = 'MoneyRequestHeaderStatusBar';
exports.default = MoneyRequestHeaderStatusBar;
