"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryFrequentlyUsed = exports.skinTones = exports.importEmojiLocale = exports.localeEmojis = exports.emojiCodeTableWithSkinTones = exports.emojiNameTable = void 0;
const common_1 = require("./common");
const emojiNameTable = common_1.default.reduce((prev, cur) => {
    const newValue = prev;
    if (!('header' in cur) && cur.name) {
        newValue[cur.name] = cur;
    }
    return newValue;
}, {});
exports.emojiNameTable = emojiNameTable;
const emojiCodeTableWithSkinTones = common_1.default.reduce((prev, cur) => {
    const newValue = prev;
    if (!('header' in cur)) {
        newValue[cur.code] = cur;
    }
    if ('types' in cur && cur.types) {
        cur.types.forEach((type) => {
            newValue[type] = cur;
        });
    }
    return newValue;
}, {});
exports.emojiCodeTableWithSkinTones = emojiCodeTableWithSkinTones;
const localeEmojis = {
    en: undefined,
    es: undefined,
};
exports.localeEmojis = localeEmojis;
const importEmojiLocale = (locale) => {
    if (!localeEmojis[locale]) {
        const emojiImportPromise = locale === 'en' ? Promise.resolve().then(() => require('./en')) : Promise.resolve().then(() => require('./es'));
        return emojiImportPromise.then((esEmojiModule) => {
            // it is needed because in jest test the modules are imported in double nested default object
            localeEmojis[locale] = esEmojiModule.default.default ? esEmojiModule.default.default : esEmojiModule.default;
        });
    }
    return Promise.resolve();
};
exports.importEmojiLocale = importEmojiLocale;
exports.default = common_1.default;
var common_2 = require("./common");
Object.defineProperty(exports, "skinTones", { enumerable: true, get: function () { return common_2.skinTones; } });
Object.defineProperty(exports, "categoryFrequentlyUsed", { enumerable: true, get: function () { return common_2.categoryFrequentlyUsed; } });
