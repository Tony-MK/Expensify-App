"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getOperatingSystem_1 = require("@libs/getOperatingSystem");
// eslint-disable-next-line no-restricted-imports
const fontWeight_1 = require("@styles/utils/FontUtils/fontWeight");
const CONST_1 = require("@src/CONST");
// In windows and ubuntu, we need some extra system fonts for emojis to work properly
// otherwise few of them will appear as black and white
const fontFamily = {
    SYSTEM: {
        fontFamily: 'System',
        fontStyle: 'normal',
        fontWeight: fontWeight_1.default.normal,
    },
    MONOSPACE: {
        fontFamily: 'Expensify Mono, Segoe UI Emoji, Noto Color Emoji',
        fontStyle: 'normal',
        fontWeight: fontWeight_1.default.normal,
    },
    MONOSPACE_BOLD: {
        fontFamily: 'Expensify Mono, Segoe UI Emoji, Noto Color Emoji',
        fontStyle: 'normal',
        fontWeight: fontWeight_1.default.bold,
    },
    MONOSPACE_ITALIC: {
        fontFamily: 'Expensify Mono, Segoe UI Emoji, Noto Color Emoji',
        fontStyle: 'italic',
        fontWeight: fontWeight_1.default.normal,
    },
    MONOSPACE_BOLD_ITALIC: {
        fontFamily: 'Expensify Mono, Segoe UI Emoji, Noto Color Emoji',
        fontStyle: 'italic',
        fontWeight: fontWeight_1.default.bold,
    },
    EXP_NEUE: {
        fontFamily: 'Expensify Neue, Segoe UI Emoji, Noto Color Emoji, Custom Emoji Font',
        fontStyle: 'normal',
        fontWeight: fontWeight_1.default.normal,
    },
    EXP_NEUE_BOLD: {
        fontFamily: 'Expensify Neue, Segoe UI Emoji, Noto Color Emoji, Custom Emoji Font',
        fontStyle: 'normal',
        fontWeight: fontWeight_1.default.bold,
    },
    EXP_NEUE_ITALIC: {
        fontFamily: 'Expensify Neue, Segoe UI Emoji, Noto Color Emoji',
        fontStyle: 'italic',
        fontWeight: fontWeight_1.default.normal,
    },
    EXP_NEUE_BOLD_ITALIC: {
        fontFamily: 'Expensify Neue, Segoe UI Emoji, Noto Color Emoji',
        fontStyle: 'italic',
        fontWeight: fontWeight_1.default.bold,
    },
    EXP_NEW_KANSAS_MEDIUM: {
        fontFamily: 'Expensify New Kansas, Segoe UI Emoji, Noto Color Emoji, Custom Emoji Font',
        fontStyle: 'normal',
        fontWeight: fontWeight_1.default.medium,
    },
    EXP_NEW_KANSAS_MEDIUM_ITALIC: {
        fontFamily: 'Expensify New Kansas, Segoe UI Emoji, Noto Color Emoji',
        fontStyle: 'italic',
        fontWeight: fontWeight_1.default.medium,
    },
    CUSTOM_EMOJI_FONT: {
        fontFamily: 'Custom Emoji Font',
    },
};
if ((0, getOperatingSystem_1.default)() === CONST_1.default.OS.WINDOWS) {
    Object.keys(fontFamily).forEach((key) => {
        fontFamily[key].fontFamily = fontFamily[key].fontFamily.replace('Segoe UI Emoji', 'Windows Segoe UI Emoji');
    });
}
exports.default = fontFamily;
