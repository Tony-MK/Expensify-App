"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Emojis = require("@assets/emojis");
/**
 * Fetch the emoji code of selected skinTone
 */
function getSkinToneEmojiFromIndex(skinToneIndex) {
    return Emojis.skinTones.find((emoji) => emoji.skinTone === skinToneIndex) ?? Emojis.skinTones[0];
}
exports.default = getSkinToneEmojiFromIndex;
