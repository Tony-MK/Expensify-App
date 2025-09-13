"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = usePreferredEmojiSkinTone;
const react_1 = require("react");
const User_1 = require("@userActions/User");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
function usePreferredEmojiSkinTone() {
    const [preferredSkinTone] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PREFERRED_EMOJI_SKIN_TONE, { canBeMissing: true });
    const updatePreferredSkinTone = (0, react_1.useCallback)((skinTone) => {
        if (Number(preferredSkinTone) === Number(skinTone)) {
            return;
        }
        (0, User_1.updatePreferredSkinTone)(skinTone);
    }, [preferredSkinTone]);
    return [preferredSkinTone, updatePreferredSkinTone];
}
