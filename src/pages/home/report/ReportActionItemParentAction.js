"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const onyxSubscribe_1 = require("@libs/onyxSubscribe");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const Report_1 = require("@userActions/Report");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const AnimatedEmptyStateBackground_1 = require("./AnimatedEmptyStateBackground");
const RepliesDivider_1 = require("./RepliesDivider");
const ReportActionItem_1 = require("./ReportActionItem");
const ThreadDivider_1 = require("./ThreadDivider");
function ReportActionItemParentAction({ allReports, policies, report, transactionThreadReport, reportActions, parentReportAction, index = 0, shouldHideThreadDividerLine = false, shouldDisplayReplyDivider, isFirstVisibleReportAction = false, shouldUseThreadDividerLine = false, userWalletTierName, isUserValidated, personalDetails, allDraftMessages, allEmojiReactions, linkedTransactionRouteError, userBillingFundID, isTryNewDotNVPDismissed = false, isReportArchived = false, }) {
    const styles = (0, useThemeStyles_1.default)();
    const ancestorIDs = (0, react_1.useRef)((0, ReportUtils_1.getAllAncestorReportActionIDs)(report));
    const ancestorReports = (0, react_1.useRef)({});
    const [allAncestors, setAllAncestors] = (0, react_1.useState)([]);
    const { isOffline } = (0, useNetwork_1.default)();
    const { isInNarrowPaneModal } = (0, useResponsiveLayout_1.default)();
    const [ancestorReportNameValuePairs] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS, {
        canBeMissing: true,
        selector: (allPairs) => {
            const ancestorIDsToSelect = new Set(ancestorIDs.current.reportIDs);
            return Object.fromEntries(Object.entries(allPairs ?? {}).filter(([key]) => {
                const id = key.split('_').at(1);
                return id && ancestorIDsToSelect.has(id);
            }));
        },
    });
    (0, react_1.useEffect)(() => {
        const unsubscribeReports = [];
        const unsubscribeReportActions = [];
        ancestorIDs.current.reportIDs.forEach((ancestorReportID) => {
            unsubscribeReports.push((0, onyxSubscribe_1.default)({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${ancestorReportID}`,
                callback: (val) => {
                    ancestorReports.current[ancestorReportID] = val;
                    //  getAllAncestorReportActions use getReportOrDraftReport to get parent reports which gets the report from allReports that
                    // holds the report collection. However, allReports is not updated by the time this current callback is called.
                    // Therefore we need to pass the up-to-date report to getAllAncestorReportActions so that it uses the up-to-date report value
                    // to calculate, for instance, unread marker.
                    setAllAncestors((0, ReportUtils_1.getAllAncestorReportActions)(report, val));
                },
            }));
            unsubscribeReportActions.push((0, onyxSubscribe_1.default)({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${ancestorReportID}`,
                callback: () => {
                    setAllAncestors((0, ReportUtils_1.getAllAncestorReportActions)(report));
                },
            }));
        });
        return () => {
            unsubscribeReports.forEach((unsubscribeReport) => unsubscribeReport());
            unsubscribeReportActions.forEach((unsubscribeReportAction) => unsubscribeReportAction());
        };
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    return (<react_native_1.View style={[styles.pRelative]}>
            <AnimatedEmptyStateBackground_1.default />
            {/* eslint-disable-next-line react-compiler/react-compiler */}
            {allAncestors.map((ancestor) => {
            const ancestorReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${ancestor.report.reportID}`];
            const canUserPerformWriteAction = (0, ReportUtils_1.canUserPerformWriteAction)(ancestorReport, isReportArchived);
            const shouldDisplayThreadDivider = !(0, ReportActionsUtils_1.isTripPreview)(ancestor.reportAction);
            const reportNameValuePair = ancestorReportNameValuePairs?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${ancestorReports.current?.[ancestor?.report?.reportID]?.reportID}`];
            const isAncestorReportArchived = (0, ReportUtils_1.isArchivedReport)(reportNameValuePair);
            const originalReportID = (0, ReportUtils_1.getOriginalReportID)(ancestor.report.reportID, ancestor.reportAction);
            const reportDraftMessages = originalReportID ? allDraftMessages?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}${originalReportID}`] : undefined;
            const matchingDraftMessage = reportDraftMessages?.[ancestor.reportAction.reportActionID];
            const matchingDraftMessageString = typeof matchingDraftMessage === 'string' ? matchingDraftMessage : matchingDraftMessage?.message;
            const actionEmojiReactions = allEmojiReactions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${ancestor.reportAction.reportActionID}`];
            return (<OfflineWithFeedback_1.default key={ancestor.reportAction.reportActionID} shouldDisableOpacity={!!ancestor.reportAction?.pendingAction} pendingAction={ancestor.report?.pendingFields?.addWorkspaceRoom ?? ancestor.report?.pendingFields?.createChat} errors={ancestor.report?.errorFields?.addWorkspaceRoom ?? ancestor.report?.errorFields?.createChat} errorRowStyles={[styles.ml10, styles.mr2]} onClose={() => (0, Report_1.navigateToConciergeChatAndDeleteReport)(ancestor.report.reportID)}>
                        {shouldDisplayThreadDivider && (<ThreadDivider_1.default ancestor={ancestor} isLinkDisabled={!(0, ReportUtils_1.canCurrentUserOpenReport)(ancestorReports.current?.[ancestor?.report?.reportID], isAncestorReportArchived)}/>)}
                        <ReportActionItem_1.default allReports={allReports} policies={policies} onPress={(0, ReportUtils_1.canCurrentUserOpenReport)(ancestorReports.current?.[ancestor?.report?.reportID], isAncestorReportArchived)
                    ? () => (0, ReportUtils_1.navigateToLinkedReportAction)(ancestor, isInNarrowPaneModal, canUserPerformWriteAction, isOffline)
                    : undefined} parentReportAction={parentReportAction} report={ancestor.report} reportActions={reportActions} transactionThreadReport={transactionThreadReport} action={ancestor.reportAction} displayAsGroup={false} isMostRecentIOUReportAction={false} shouldDisplayNewMarker={ancestor.shouldDisplayNewMarker} index={index} isFirstVisibleReportAction={isFirstVisibleReportAction} shouldUseThreadDividerLine={shouldUseThreadDividerLine} isThreadReportParentAction userWalletTierName={userWalletTierName} isUserValidated={isUserValidated} personalDetails={personalDetails} draftMessage={matchingDraftMessageString} emojiReactions={actionEmojiReactions} linkedTransactionRouteError={linkedTransactionRouteError} userBillingFundID={userBillingFundID} isTryNewDotNVPDismissed={isTryNewDotNVPDismissed}/>
                    </OfflineWithFeedback_1.default>);
        })}
            {shouldDisplayReplyDivider && <RepliesDivider_1.default shouldHideThreadDividerLine={shouldHideThreadDividerLine}/>}
        </react_native_1.View>);
}
ReportActionItemParentAction.displayName = 'ReportActionItemParentAction';
exports.default = ReportActionItemParentAction;
