"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_collapsible_1 = require("react-native-collapsible");
function Collapsible({ isOpened = false, children }) {
    return <react_native_collapsible_1.default collapsed={!isOpened}>{children}</react_native_collapsible_1.default>;
}
Collapsible.displayName = 'Collapsible';
exports.default = Collapsible;
