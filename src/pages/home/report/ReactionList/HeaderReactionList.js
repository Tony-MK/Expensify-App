"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const EmojiUtils = require("@libs/EmojiUtils");
function HeaderReactionList({ emojiCodes, emojiCount, emojiName, hasUserReacted = false }) {
    const { flexRow, justifyContentBetween, alignItemsCenter, emojiReactionListHeader, pt4, emojiReactionListHeaderBubble, miniQuickEmojiReactionText, reactionCounterText, reactionListHeaderText, } = (0, useThemeStyles_1.default)();
    const { getEmojiReactionBubbleStyle, getEmojiReactionBubbleTextStyle, getEmojiReactionCounterTextStyle } = (0, useStyleUtils_1.default)();
    const { preferredLocale } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    return (<react_native_1.View style={[flexRow, justifyContentBetween, alignItemsCenter, emojiReactionListHeader, !shouldUseNarrowLayout && pt4]}>
            <react_native_1.View style={flexRow}>
                <react_native_1.View style={[emojiReactionListHeaderBubble, getEmojiReactionBubbleStyle(false, hasUserReacted)]}>
                    <Text_1.default style={[miniQuickEmojiReactionText, getEmojiReactionBubbleTextStyle(true)]}>{emojiCodes.join('')}</Text_1.default>
                    <Text_1.default style={[reactionCounterText, getEmojiReactionCounterTextStyle(hasUserReacted)]}>{emojiCount}</Text_1.default>
                </react_native_1.View>
                <Text_1.default style={reactionListHeaderText}>{`:${EmojiUtils.getLocalizedEmojiName(emojiName, preferredLocale)}:`}</Text_1.default>
            </react_native_1.View>
        </react_native_1.View>);
}
HeaderReactionList.displayName = 'HeaderReactionList';
exports.default = HeaderReactionList;
