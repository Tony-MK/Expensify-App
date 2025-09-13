"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const BaseMiniContextMenuItem_1 = require("@components/BaseMiniContextMenuItem");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const EmojiUtils_1 = require("@libs/EmojiUtils");
const getButtonState_1 = require("@libs/getButtonState");
const variables_1 = require("@styles/variables");
const EmojiPickerAction_1 = require("@userActions/EmojiPickerAction");
const Session_1 = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
/**
 * Shows the four common quick reactions and a
 * emoji picker icon button. This is used for the mini
 * context menu which we just show on web, when hovering
 * a message.
 */
function MiniQuickEmojiReactions({ reportAction, reportActionID, onEmojiSelected, onPressOpenPicker = () => { }, onEmojiPickerClosed = () => { } }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const ref = (0, react_1.useRef)(null);
    const { translate, preferredLocale } = (0, useLocalize_1.default)();
    const [preferredSkinTone = CONST_1.default.EMOJI_DEFAULT_SKIN_TONE] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PREFERRED_EMOJI_SKIN_TONE, { canBeMissing: true });
    const [emojiReactions = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${reportActionID}`, { canBeMissing: true });
    const openEmojiPicker = () => {
        onPressOpenPicker();
        (0, EmojiPickerAction_1.showEmojiPicker)(onEmojiPickerClosed, (emojiCode, emojiObject) => {
            onEmojiSelected(emojiObject, emojiReactions);
        }, ref, undefined, () => { }, reportAction.reportActionID);
    };
    return (<react_native_1.View style={styles.flexRow}>
            {CONST_1.default.QUICK_REACTIONS.slice(0, 3).map((emoji) => (<BaseMiniContextMenuItem_1.default key={emoji.name} isDelayButtonStateComplete={false} tooltipText={`:${(0, EmojiUtils_1.getLocalizedEmojiName)(emoji.name, preferredLocale)}:`} onPress={(0, Session_1.callFunctionIfActionIsAllowed)(() => onEmojiSelected(emoji, emojiReactions))}>
                    <Text_1.default style={[styles.miniQuickEmojiReactionText, styles.userSelectNone]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
                        {(0, EmojiUtils_1.getPreferredEmojiCode)(emoji, preferredSkinTone)}
                    </Text_1.default>
                </BaseMiniContextMenuItem_1.default>))}
            <BaseMiniContextMenuItem_1.default ref={ref} onPress={(0, Session_1.callFunctionIfActionIsAllowed)(() => {
            if (!EmojiPickerAction_1.emojiPickerRef.current?.isEmojiPickerVisible) {
                openEmojiPicker();
            }
            else {
                EmojiPickerAction_1.emojiPickerRef.current?.hideEmojiPicker();
            }
        })} isDelayButtonStateComplete={false} tooltipText={translate('emojiReactions.addReactionTooltip')}>
                {({ hovered, pressed }) => (<Icon_1.default width={variables_1.default.iconSizeMedium} height={variables_1.default.iconSizeMedium} src={Expensicons.AddReaction} fill={StyleUtils.getIconFillColor((0, getButtonState_1.default)(hovered, pressed, false))}/>)}
            </BaseMiniContextMenuItem_1.default>
        </react_native_1.View>);
}
MiniQuickEmojiReactions.displayName = 'MiniQuickEmojiReactions';
exports.default = MiniQuickEmojiReactions;
