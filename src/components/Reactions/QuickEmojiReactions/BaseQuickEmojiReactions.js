"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AddReactionBubble_1 = require("@components/Reactions/AddReactionBubble");
const EmojiReactionBubble_1 = require("@components/Reactions/EmojiReactionBubble");
const Tooltip_1 = require("@components/Tooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const EmojiUtils_1 = require("@libs/EmojiUtils");
const Session_1 = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function BaseQuickEmojiReactions({ reportAction, reportActionID, onEmojiSelected, onPressOpenPicker = () => { }, onWillShowPicker = () => { }, setIsEmojiPickerActive, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { preferredLocale } = (0, useLocalize_1.default)();
    const [preferredSkinTone = CONST_1.default.EMOJI_DEFAULT_SKIN_TONE] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PREFERRED_EMOJI_SKIN_TONE, { canBeMissing: true });
    const [emojiReactions = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${reportActionID}`, { canBeMissing: true });
    return (<react_native_1.View style={styles.quickReactionsContainer}>
            {CONST_1.default.QUICK_REACTIONS.map((emoji) => (<Tooltip_1.default text={`:${(0, EmojiUtils_1.getLocalizedEmojiName)(emoji.name, preferredLocale)}:`} key={emoji.name}>
                    <react_native_1.View>
                        <EmojiReactionBubble_1.default emojiCodes={[(0, EmojiUtils_1.getPreferredEmojiCode)(emoji, preferredSkinTone)]} isContextMenu onPress={(0, Session_1.callFunctionIfActionIsAllowed)(() => onEmojiSelected(emoji, emojiReactions))}/>
                    </react_native_1.View>
                </Tooltip_1.default>))}
            <AddReactionBubble_1.default isContextMenu onPressOpenPicker={onPressOpenPicker} onWillShowPicker={onWillShowPicker} onSelectEmoji={(emoji) => onEmojiSelected(emoji, emojiReactions)} reportAction={reportAction} setIsEmojiPickerActive={setIsEmojiPickerActive}/>
        </react_native_1.View>);
}
BaseQuickEmojiReactions.displayName = 'BaseQuickEmojiReactions';
exports.default = BaseQuickEmojiReactions;
