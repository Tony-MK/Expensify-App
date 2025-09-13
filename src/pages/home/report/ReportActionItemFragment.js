"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const RenderHTML_1 = require("@components/RenderHTML");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const convertToLTR_1 = require("@libs/convertToLTR");
const isReportMessageAttachment_1 = require("@libs/isReportMessageAttachment");
const CONST_1 = require("@src/CONST");
const AttachmentCommentFragment_1 = require("./comment/AttachmentCommentFragment");
const TextCommentFragment_1 = require("./comment/TextCommentFragment");
const ReportActionItemMessageHeaderSender_1 = require("./ReportActionItemMessageHeaderSender");
const MUTED_ACTIONS = [
    ...Object.values(CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG),
    CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
    CONST_1.default.REPORT.ACTIONS.TYPE.APPROVED,
    CONST_1.default.REPORT.ACTIONS.TYPE.FORWARDED,
    CONST_1.default.REPORT.ACTIONS.TYPE.UNAPPROVED,
    CONST_1.default.REPORT.ACTIONS.TYPE.MOVED,
    CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_JOIN_REQUEST,
];
function ReportActionItemFragment({ reportActionID, pendingAction, actionName, fragment, accountID, iouMessage = '', isSingleLine = false, source = '', style = [], delegateAccountID = 0, actorIcon, isThreadParentMessage = false, isApprovedOrSubmittedReportAction = false, isHoldReportAction = false, isFragmentContainingDisplayName = false, displayAsGroup = false, moderationDecision, shouldShowTooltip = true, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    switch (fragment?.type) {
        case 'COMMENT': {
            const isPendingDelete = pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
            // Threaded messages display "[Deleted message]" instead of being hidden altogether.
            // While offline we display the previous message with a strikethrough style. Once online we want to
            // immediately display "[Deleted message]" while the delete action is pending.
            if ((!isOffline && isThreadParentMessage && isPendingDelete) || fragment?.isDeletedParentAction) {
                return <RenderHTML_1.default html={`<deleted-action>${translate('parentReportAction.deletedMessage')}</deleted-action>`}/>;
            }
            if (isThreadParentMessage && moderationDecision === CONST_1.default.MODERATION.MODERATOR_DECISION_PENDING_REMOVE) {
                return <RenderHTML_1.default html={`<deleted-action ${CONST_1.default.HIDDEN_MESSAGE_ATTRIBUTE}="true">${translate('parentReportAction.hiddenMessage')}</deleted-action>`}/>;
            }
            if ((0, isReportMessageAttachment_1.isReportMessageAttachment)(fragment)) {
                return (<AttachmentCommentFragment_1.default reportActionID={reportActionID} source={source} html={fragment?.html ?? ''} addExtraMargin={!displayAsGroup} styleAsDeleted={!!(isOffline && isPendingDelete)}/>);
            }
            return (<TextCommentFragment_1.default reportActionID={reportActionID} source={source} fragment={fragment} styleAsDeleted={!!(isOffline && isPendingDelete)} styleAsMuted={!!actionName && MUTED_ACTIONS.includes(actionName)} iouMessage={iouMessage} displayAsGroup={displayAsGroup} style={style}/>);
        }
        case 'TEXT': {
            if (isApprovedOrSubmittedReportAction) {
                return (<Text_1.default numberOfLines={isSingleLine ? 1 : undefined} style={[styles.chatItemMessage, styles.colorMuted]}>
                        {isFragmentContainingDisplayName ? (0, convertToLTR_1.default)(fragment?.text ?? '') : fragment?.text}
                    </Text_1.default>);
            }
            if (isHoldReportAction) {
                return (<Text_1.default numberOfLines={isSingleLine ? 1 : undefined} style={[styles.chatItemMessage]}>
                        {isFragmentContainingDisplayName ? (0, convertToLTR_1.default)(fragment?.text ?? '') : fragment?.text}
                    </Text_1.default>);
            }
            return (<ReportActionItemMessageHeaderSender_1.default accountID={accountID} delegateAccountID={delegateAccountID} fragmentText={fragment.text} actorIcon={actorIcon} isSingleLine={isSingleLine} shouldShowTooltip={shouldShowTooltip}/>);
        }
        case 'LINK':
            return <Text_1.default>LINK</Text_1.default>;
        case 'INTEGRATION_COMMENT':
            return <Text_1.default>REPORT_LINK</Text_1.default>;
        case 'REPORT_LINK':
            return <Text_1.default>REPORT_LINK</Text_1.default>;
        case 'POLICY_LINK':
            return <Text_1.default>POLICY_LINK</Text_1.default>;
        // If we have a message fragment type of OLD_MESSAGE this means we have not yet converted this over to the
        // new data structure. So we simply set this message as inner html and render it like we did before.
        // This wil allow us to convert messages over to the new structure without needing to do it all at once.
        case 'OLD_MESSAGE':
            return <Text_1.default>OLD_MESSAGE</Text_1.default>;
        default:
            return <Text_1.default>fragment.text</Text_1.default>;
    }
}
ReportActionItemFragment.displayName = 'ReportActionItemFragment';
exports.default = (0, react_1.memo)(ReportActionItemFragment);
