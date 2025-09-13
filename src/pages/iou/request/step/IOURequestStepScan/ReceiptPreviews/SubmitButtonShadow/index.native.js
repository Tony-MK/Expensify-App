"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function SubmitButtonShadow({ children }) {
    const styles = (0, useThemeStyles_1.default)();
    return <react_native_1.View style={[styles.receiptsSubmitButton, styles.buttonShadowContainer, styles.buttonShadow]}>{children}</react_native_1.View>;
}
exports.default = SubmitButtonShadow;
