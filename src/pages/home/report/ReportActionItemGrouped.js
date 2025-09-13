"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function ReportActionItemGrouped({ wrapperStyle, children }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={[styles.chatItem, wrapperStyle]}>
            <react_native_1.View style={styles.chatItemRightGrouped}>{children}</react_native_1.View>
        </react_native_1.View>);
}
ReportActionItemGrouped.displayName = 'ReportActionItemGrouped';
exports.default = ReportActionItemGrouped;
