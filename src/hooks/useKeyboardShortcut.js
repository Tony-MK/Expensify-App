"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useKeyboardShortcut;
const react_1 = require("react");
const KeyboardShortcut_1 = require("@libs/KeyboardShortcut");
const CONST_1 = require("@src/CONST");
/**
 * Register a keyboard shortcut handler.
 * Recommendation: To ensure stability, wrap the `callback` function with the useCallback hook before using it with this hook.
 */
function useKeyboardShortcut(shortcut, callback, config = {}) {
    const { captureOnInputs = true, shouldBubble = false, priority = 0, shouldPreventDefault = true, 
    // The "excludedNodes" array needs to be stable to prevent the "useEffect" hook from being recreated unnecessarily.
    // Hence the use of CONST.EMPTY_ARRAY.
    excludedNodes = CONST_1.default.EMPTY_ARRAY, isActive = true, 
    // This flag is used to prevent auto submit form when press enter key on selection modal.
    shouldStopPropagation = false, } = config;
    (0, react_1.useEffect)(() => {
        if (!isActive) {
            return () => { };
        }
        const unsubscribe = KeyboardShortcut_1.default.subscribe(shortcut.shortcutKey, callback, shortcut.descriptionKey ?? '', shortcut.modifiers, captureOnInputs, shouldBubble, priority, shouldPreventDefault, excludedNodes, shouldStopPropagation);
        return () => {
            unsubscribe();
        };
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isActive, callback, captureOnInputs, excludedNodes, priority, shortcut.descriptionKey, shortcut.modifiers.join(), shortcut.shortcutKey, shouldBubble, shouldPreventDefault]);
}
