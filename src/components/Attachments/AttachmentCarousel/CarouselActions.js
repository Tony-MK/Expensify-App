"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const KeyboardShortcut_1 = require("@libs/KeyboardShortcut");
const CONST_1 = require("@src/CONST");
function CarouselActions({ onCycleThroughAttachments }) {
    (0, react_1.useEffect)(() => {
        const shortcutLeftConfig = CONST_1.default.KEYBOARD_SHORTCUTS.ARROW_LEFT;
        const unsubscribeLeftKey = KeyboardShortcut_1.default.subscribe(shortcutLeftConfig.shortcutKey, (event) => {
            if (event?.target instanceof HTMLElement) {
                // prevents focus from highlighting around the modal
                event.target.blur();
            }
            onCycleThroughAttachments(-1);
        }, shortcutLeftConfig.descriptionKey, shortcutLeftConfig.modifiers);
        const shortcutRightConfig = CONST_1.default.KEYBOARD_SHORTCUTS.ARROW_RIGHT;
        const unsubscribeRightKey = KeyboardShortcut_1.default.subscribe(shortcutRightConfig.shortcutKey, (event) => {
            if (event?.target instanceof HTMLElement) {
                // prevents focus from highlighting around the modal
                event.target.blur();
            }
            onCycleThroughAttachments(1);
        }, shortcutRightConfig.descriptionKey, shortcutRightConfig.modifiers);
        return () => {
            unsubscribeLeftKey();
            unsubscribeRightKey();
        };
    }, [onCycleThroughAttachments]);
    return null;
}
exports.default = CarouselActions;
