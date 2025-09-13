"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sortBy_1 = require("lodash/sortBy");
const react_1 = require("react");
const react_native_1 = require("react-native");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const PopoverAnchorTooltip_1 = require("@components/Tooltip/PopoverAnchorTooltip");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const EmojiUtils_1 = require("@libs/EmojiUtils");
const ReportScreenContext_1 = require("@pages/home/ReportScreenContext");
const CONST_1 = require("@src/CONST");
const AddReactionBubble_1 = require("./AddReactionBubble");
const EmojiReactionBubble_1 = require("./EmojiReactionBubble");
const ReactionTooltipContent_1 = require("./ReactionTooltipContent");
function ReportActionItemEmojiReactions({ reportAction, currentUserPersonalDetails, toggleReaction, emojiReactions = {}, shouldBlockReactions = false, preferredLocale = CONST_1.default.LOCALES.DEFAULT, setIsEmojiPickerActive, }) {
    const styles = (0, useThemeStyles_1.default)();
    const reactionListRef = (0, react_1.useContext)(ReportScreenContext_1.ReactionListContext);
    const popoverReactionListAnchors = (0, react_1.useRef)({});
    const reportActionID = reportAction.reportActionID;
    // Each emoji is sorted by the oldest timestamp of user reactions so that they will always appear in the same order for everyone
    const formattedReactions = (0, sortBy_1.default)(Object.entries(emojiReactions ?? {}).map(([emojiName, emojiReaction]) => {
        const { emoji, emojiCodes, reactionCount, hasUserReacted, userAccountIDs, oldestTimestamp } = (0, EmojiUtils_1.getEmojiReactionDetails)(emojiName, emojiReaction, currentUserPersonalDetails.accountID);
        if (reactionCount === 0) {
            return null;
        }
        const onPress = () => {
            toggleReaction(emoji, true);
        };
        const onReactionListOpen = (event) => {
            reactionListRef?.current?.showReactionList(event, popoverReactionListAnchors.current[emojiName], emojiName, reportActionID);
        };
        return {
            emojiCodes,
            userAccountIDs,
            reactionCount,
            hasUserReacted,
            oldestTimestamp,
            onPress,
            onReactionListOpen,
            reactionEmojiName: emojiName,
            pendingAction: emojiReaction.pendingAction,
        };
    }), ['oldestTimestamp']);
    const totalReactionCount = formattedReactions.reduce((prev, curr) => (curr === null ? prev : prev + curr.reactionCount), 0);
    return (totalReactionCount > 0 && (<react_native_1.View style={[styles.flexRow, styles.flexWrap, styles.gap1, styles.mt2]}>
                {formattedReactions.map((reaction) => {
            if (reaction === null) {
                return;
            }
            return (<PopoverAnchorTooltip_1.default renderTooltipContent={() => (<ReactionTooltipContent_1.default emojiName={(0, EmojiUtils_1.getLocalizedEmojiName)(reaction.reactionEmojiName, preferredLocale)} emojiCodes={reaction.emojiCodes} accountIDs={reaction.userAccountIDs} currentUserPersonalDetails={currentUserPersonalDetails}/>)} renderTooltipContentKey={[...reaction.userAccountIDs.map(String), ...reaction.emojiCodes]} key={reaction.reactionEmojiName}>
                            <react_native_1.View>
                                <OfflineWithFeedback_1.default pendingAction={reaction.pendingAction} shouldDisableOpacity={!!reportAction.pendingAction}>
                                    <EmojiReactionBubble_1.default ref={(ref) => {
                    popoverReactionListAnchors.current[reaction.reactionEmojiName] = ref ?? null;
                }} count={reaction.reactionCount} emojiCodes={reaction.emojiCodes} onPress={reaction.onPress} hasUserReacted={reaction.hasUserReacted} onReactionListOpen={reaction.onReactionListOpen} shouldBlockReactions={shouldBlockReactions}/>
                                </OfflineWithFeedback_1.default>
                            </react_native_1.View>
                        </PopoverAnchorTooltip_1.default>);
        })}
                {!shouldBlockReactions && (<AddReactionBubble_1.default onSelectEmoji={toggleReaction} reportAction={reportAction} setIsEmojiPickerActive={setIsEmojiPickerActive}/>)}
            </react_native_1.View>));
}
ReportActionItemEmojiReactions.displayName = 'ReportActionItemReactions';
exports.default = (0, withCurrentUserPersonalDetails_1.default)(ReportActionItemEmojiReactions);
