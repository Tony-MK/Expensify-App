"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = usePreferredEmojiSkinTone;
var react_1 = require("react");
var User_1 = require("@userActions/User");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var useOnyx_1 = require("./useOnyx");
function usePreferredEmojiSkinTone() {
    var preferredSkinTone = (0, useOnyx_1.default)(ONYXKEYS_1.default.PREFERRED_EMOJI_SKIN_TONE, { canBeMissing: true })[0];
    var updatePreferredSkinTone = (0, react_1.useCallback)(function (skinTone) {
        if (Number(preferredSkinTone) === Number(skinTone)) {
            return;
        }
        (0, User_1.updatePreferredSkinTone)(skinTone);
    }, [preferredSkinTone]);
    return [preferredSkinTone, updatePreferredSkinTone];
}
