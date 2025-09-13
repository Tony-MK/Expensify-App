"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
/**
 * Sets the selected tab for a given tab ID
 */
function setSelectedTab(id, index) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.SELECTED_TAB}${id}`, index);
}
exports.default = {
    setSelectedTab,
};
