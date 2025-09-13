"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const KeyboardShortcut_1 = require("@libs/KeyboardShortcut");
const TestTool_1 = require("@userActions/TestTool");
const CONST_1 = require("@src/CONST");
function useDebugShortcut() {
    (0, react_1.useEffect)(() => {
        const debugShortcutConfig = CONST_1.default.KEYBOARD_SHORTCUTS.DEBUG;
        const unsubscribeDebugShortcut = KeyboardShortcut_1.default.subscribe(debugShortcutConfig.shortcutKey, () => (0, TestTool_1.default)(), debugShortcutConfig.descriptionKey, debugShortcutConfig.modifiers, true);
        return () => {
            unsubscribeDebugShortcut();
        };
        // Rule disabled because this effect is only for component did mount & will component unmount lifecycle event
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
}
exports.default = useDebugShortcut;
