"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Text_1 = require("./Text");
function TestToolRow({ title, children }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={styles.testRowContainer}>
            <react_native_1.View style={[styles.flexGrow1, styles.flexShrink1]}>
                <Text_1.default>{title}</Text_1.default>
            </react_native_1.View>
            <react_native_1.View style={[styles.flexGrow0, styles.flexShrink0, styles.alignItemsEnd]}>{children}</react_native_1.View>
        </react_native_1.View>);
}
TestToolRow.displayName = 'TestToolRow';
exports.default = TestToolRow;
