"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const focusEditAfterCancelDelete = (textInputRef) => {
    react_native_1.InteractionManager.runAfterInteractions(() => textInputRef?.focus());
};
exports.default = focusEditAfterCancelDelete;
