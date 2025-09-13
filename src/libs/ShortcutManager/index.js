"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const { ShortcutManager } = react_native_1.NativeModules;
exports.default = ShortcutManager ||
    {
        removeAllDynamicShortcuts: () => { },
    };
