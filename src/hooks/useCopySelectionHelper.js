"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useCopySelectionHelper;
const react_1 = require("react");
const Clipboard_1 = require("@libs/Clipboard");
const KeyboardShortcut_1 = require("@libs/KeyboardShortcut");
const Parser_1 = require("@libs/Parser");
const SelectionScraper_1 = require("@libs/SelectionScraper");
const CONST_1 = require("@src/CONST");
function copySelectionToClipboard() {
    const selection = SelectionScraper_1.default.getCurrentSelection();
    if (!selection) {
        return;
    }
    if (!Clipboard_1.default.canSetHtml()) {
        Clipboard_1.default.setString(Parser_1.default.htmlToMarkdown(selection));
        return;
    }
    Clipboard_1.default.setHtml(selection, Parser_1.default.htmlToText(selection));
}
function useCopySelectionHelper() {
    (0, react_1.useEffect)(() => {
        const copyShortcutConfig = CONST_1.default.KEYBOARD_SHORTCUTS.COPY;
        const unsubscribeCopyShortcut = KeyboardShortcut_1.default.subscribe(copyShortcutConfig.shortcutKey, copySelectionToClipboard, copyShortcutConfig.descriptionKey, [...copyShortcutConfig.modifiers], false);
        return () => {
            unsubscribeCopyShortcut();
        };
    }, []);
}
