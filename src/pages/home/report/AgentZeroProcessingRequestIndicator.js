"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Text_1 = require("@components/Text");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function AgentZeroProcessingRequestIndicator({ reportID }) {
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [reportNameValuePairs] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${reportID}`, { canBeMissing: true });
    const [userTypingStatuses] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_USER_IS_TYPING}${reportID}`, { canBeMissing: true });
    // Check if anyone is currently typing
    const usersTyping = (0, react_1.useMemo)(() => Object.keys(userTypingStatuses ?? {}).filter((loginOrAccountID) => userTypingStatuses?.[loginOrAccountID]), [userTypingStatuses]);
    const isAnyoneTyping = usersTyping.length > 0;
    // Don't show if offline, if anyone is typing (typing indicator takes precedence), or if the indicator doesn't exist
    if (isOffline || isAnyoneTyping || !reportNameValuePairs?.agentZeroProcessingRequestIndicator) {
        return null;
    }
    return (<Text_1.default style={[styles.chatItemComposeSecondaryRowSubText, styles.chatItemComposeSecondaryRowOffset]} numberOfLines={1}>
            {reportNameValuePairs.agentZeroProcessingRequestIndicator}
        </Text_1.default>);
}
AgentZeroProcessingRequestIndicator.displayName = 'AgentZeroProcessingRequestIndicator';
exports.default = (0, react_1.memo)(AgentZeroProcessingRequestIndicator);
