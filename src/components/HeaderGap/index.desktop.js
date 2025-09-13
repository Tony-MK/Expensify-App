"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function HeaderGap({ styles }) {
    const themeStyles = (0, useThemeStyles_1.default)();
    return <react_native_1.View style={[themeStyles.headerGap, styles]}/>;
}
HeaderGap.displayName = 'HeaderGap';
exports.default = (0, react_1.memo)(HeaderGap);
