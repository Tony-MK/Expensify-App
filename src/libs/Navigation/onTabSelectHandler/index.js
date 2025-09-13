"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * On web-based platforms we're calling `onTabSelect` since the `react-native-tab-view` (`PanResponderAdapter`) implementation does not call the function on mount, only on tab switch.
 */
function onTabSelectHandler(index, onTabSelect) {
    onTabSelect?.({ index });
}
exports.default = onTabSelectHandler;
