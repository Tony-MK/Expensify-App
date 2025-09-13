"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearError = clearError;
exports.setDefaultData = setDefaultData;
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
/**
 * Clear CloseAccount error message to hide modal
 */
function clearError() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.CLOSE_ACCOUNT_FORM, { errors: null });
}
/**
 * Set default Onyx data
 */
function setDefaultData() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.CLOSE_ACCOUNT_FORM, { ...CONST_1.default.DEFAULT_CLOSE_ACCOUNT_DATA });
}
