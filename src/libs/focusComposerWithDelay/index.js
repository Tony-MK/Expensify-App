"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComposerFocusManager_1 = require("@libs/ComposerFocusManager");
const isWindowReadyToFocus_1 = require("@libs/isWindowReadyToFocus");
const EmojiPickerAction = require("@userActions/EmojiPickerAction");
const CONST_1 = require("@src/CONST");
const setTextInputSelection_1 = require("./setTextInputSelection");
/**
 * Create a function that focuses the composer.
 */
function focusComposerWithDelay(textInput, delay = CONST_1.default.COMPOSER_FOCUS_DELAY) {
    /**
     * Focus the text input
     * @param [shouldDelay] Impose delay before focusing the text input
     * @param [forcedSelectionRange] Force selection range of text input
     */
    return (shouldDelay = false, forcedSelectionRange = undefined) => {
        // There could be other animations running while we trigger manual focus.
        // This prevents focus from making those animations janky.
        if (!textInput || EmojiPickerAction.isEmojiPickerVisible()) {
            return;
        }
        if (!shouldDelay) {
            textInput.focus();
            if (forcedSelectionRange) {
                (0, setTextInputSelection_1.default)(textInput, forcedSelectionRange);
            }
            return;
        }
        Promise.all([ComposerFocusManager_1.default.isReadyToFocus(), (0, isWindowReadyToFocus_1.default)()]).then(() => {
            if (!textInput) {
                return;
            }
            // When the closing modal has a focused text input focus() needs a delay to properly work.
            // Setting 150ms here is a temporary workaround for the Android HybridApp. It should be reverted once we identify the real root cause of this issue: https://github.com/Expensify/App/issues/56311.
            setTimeout(() => textInput.focus(), delay);
            if (forcedSelectionRange) {
                (0, setTextInputSelection_1.default)(textInput, forcedSelectionRange);
            }
        });
    };
}
exports.default = focusComposerWithDelay;
