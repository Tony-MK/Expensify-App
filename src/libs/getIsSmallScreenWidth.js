"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getIsSmallScreenWidth;
const react_native_1 = require("react-native");
const variables_1 = require("@styles/variables");
function getIsSmallScreenWidth(windowWidth = react_native_1.Dimensions.get('window').width) {
    return windowWidth <= variables_1.default.mobileResponsiveWidthBreakpoint;
}
