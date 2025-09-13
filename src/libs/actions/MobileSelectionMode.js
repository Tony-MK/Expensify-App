"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.turnOffMobileSelectionMode = exports.turnOnMobileSelectionMode = void 0;
const react_native_onyx_1 = require("react-native-onyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const turnOnMobileSelectionMode = () => {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.MOBILE_SELECTION_MODE, true);
};
exports.turnOnMobileSelectionMode = turnOnMobileSelectionMode;
const turnOffMobileSelectionMode = () => {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.MOBILE_SELECTION_MODE, false);
};
exports.turnOffMobileSelectionMode = turnOffMobileSelectionMode;
