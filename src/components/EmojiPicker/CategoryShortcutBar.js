"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CategoryShortcutButton_1 = require("./CategoryShortcutButton");
function CategoryShortcutBar({ onPress, headerEmojis }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={[styles.ph4, styles.flexRow]}>
            {headerEmojis.map((headerEmoji) => (<CategoryShortcutButton_1.default icon={headerEmoji.icon} onPress={() => onPress(headerEmoji.index)} key={`categoryShortcut${headerEmoji.index}`} code={headerEmoji.code}/>))}
        </react_native_1.View>);
}
CategoryShortcutBar.displayName = 'CategoryShortcutBar';
exports.default = CategoryShortcutBar;
