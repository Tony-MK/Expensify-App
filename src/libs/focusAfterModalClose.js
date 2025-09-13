"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComposerFocusManager_1 = require("./ComposerFocusManager");
const isWindowReadyToFocus_1 = require("./isWindowReadyToFocus");
function focusAfterModalClose(textInput) {
    if (!textInput) {
        return;
    }
    Promise.all([ComposerFocusManager_1.default.isReadyToFocus(), (0, isWindowReadyToFocus_1.default)()]).then(() => {
        textInput?.focus();
    });
}
exports.default = focusAfterModalClose;
