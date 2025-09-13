"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fontFamily_1 = require("./fontFamily");
const multiFontFamily_1 = require("./fontFamily/multiFontFamily");
const singleFontFamily_1 = require("./fontFamily/singleFontFamily");
const fontWeight_1 = require("./fontWeight");
const FontUtils = {
    fontFamily: {
        /**
         * Set of font families that can either have fallback fonts (if web / desktop) or not (if native).
         */
        platform: fontFamily_1.default,
        /**
         * Set of font families that don't include any fallback fonts, normally used on native platforms.
         */
        single: singleFontFamily_1.default,
        /**
         * Set of font families that include fallback fonts, normally used on web / desktop platforms.
         */
        multi: multiFontFamily_1.default,
    },
    fontWeight: fontWeight_1.default,
};
exports.default = FontUtils;
