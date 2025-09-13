"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Text_1 = require("@components/Text");
const UserDetailsTooltip_1 = require("@components/UserDetailsTooltip");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const EmojiUtils_1 = require("@libs/EmojiUtils");
function ReportActionItemMessageHeaderSender({ fragmentText, accountID, delegateAccountID, actorIcon, isSingleLine, shouldShowTooltip }) {
    const styles = (0, useThemeStyles_1.default)();
    const processedTextArray = (0, react_1.useMemo)(() => (0, EmojiUtils_1.splitTextWithEmojis)(fragmentText), [fragmentText]);
    return (<UserDetailsTooltip_1.default accountID={accountID} delegateAccountID={delegateAccountID} icon={actorIcon} shouldRender={shouldShowTooltip}>
            <Text_1.default numberOfLines={isSingleLine ? 1 : undefined} style={[styles.chatItemMessageHeaderSender, isSingleLine ? styles.pre : styles.preWrap]}>
                {processedTextArray.length !== 0 ? (0, EmojiUtils_1.getProcessedText)(processedTextArray, styles.emojisWithTextFontSize) : fragmentText}
            </Text_1.default>
        </UserDetailsTooltip_1.default>);
}
ReportActionItemMessageHeaderSender.displayName = 'ReportActionItemMessageHeaderSender';
exports.default = ReportActionItemMessageHeaderSender;
