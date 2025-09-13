"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const PersonalDetailsUtils = require("@libs/PersonalDetailsUtils");
function ReactionTooltipContent({ accountIDs, currentUserPersonalDetails, emojiCodes, emojiName }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const users = (0, react_1.useMemo)(() => PersonalDetailsUtils.getPersonalDetailsByIDs({ accountIDs, currentUserAccountID: currentUserPersonalDetails.accountID, shouldChangeUserDisplayName: true }), [currentUserPersonalDetails.accountID, accountIDs]);
    const namesString = users
        .map((user) => user?.displayName)
        .filter((name) => name)
        .join(', ');
    return (<react_native_1.View style={[styles.alignItemsCenter, styles.ph2]}>
            <react_native_1.View style={styles.flexRow}>
                {emojiCodes.map((emojiCode) => (<Text_1.default key={emojiCode} style={styles.reactionEmojiTitle}>
                        {emojiCode}
                    </Text_1.default>))}
            </react_native_1.View>

            <Text_1.default style={[styles.mt1, styles.textMicroBold, styles.textReactionSenders, styles.textAlignCenter]}>{namesString}</Text_1.default>

            <Text_1.default style={[styles.textMicro, styles.fontColorReactionLabel]}>{`${translate('emojiReactions.reactedWith')} :${emojiName}:`}</Text_1.default>
        </react_native_1.View>);
}
ReactionTooltipContent.displayName = 'ReactionTooltipContent';
exports.default = react_1.default.memo(ReactionTooltipContent);
