"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fast_equals_1 = require("fast-equals");
const react_1 = require("react");
const react_native_1 = require("react-native");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const RenderHTML_1 = require("@components/RenderHTML");
const MoneyReportView_1 = require("@components/ReportActionItem/MoneyReportView");
const MoneyRequestView_1 = require("@components/ReportActionItem/MoneyRequestView");
const TaskView_1 = require("@components/ReportActionItem/TaskView");
const ShowContextMenuContext_1 = require("@components/ShowContextMenuContext");
const SpacerView_1 = require("@components/SpacerView");
const UnreadActionIndicator_1 = require("@components/UnreadActionIndicator");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const AnimatedEmptyStateBackground_1 = require("./AnimatedEmptyStateBackground");
const ReportActionItemCreated_1 = require("./ReportActionItemCreated");
const ReportActionItemSingle_1 = require("./ReportActionItemSingle");
function ReportActionItemContentCreated({ contextValue, allReports, parentReport, parentReportAction, transactionID, draftMessage, shouldHideThreadDividerLine, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { report, action, transactionThreadReport } = contextValue;
    const policy = (0, usePolicy_1.default)(report?.policyID === CONST_1.default.POLICY.OWNER_EMAIL_FAKE ? undefined : report?.policyID);
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, { canBeMissing: true });
    const transactionCurrency = (0, TransactionUtils_1.getCurrency)(transaction);
    const renderThreadDivider = (0, react_1.useMemo)(() => shouldHideThreadDividerLine ? (<UnreadActionIndicator_1.default reportActionID={report?.reportID} shouldHideThreadDividerLine={shouldHideThreadDividerLine}/>) : (<SpacerView_1.default shouldShow={!shouldHideThreadDividerLine} style={[!shouldHideThreadDividerLine ? styles.reportHorizontalRule : {}]}/>), [shouldHideThreadDividerLine, report?.reportID, styles.reportHorizontalRule]);
    const contextMenuValue = (0, react_1.useMemo)(() => ({ ...contextValue, isDisabled: true }), [contextValue]);
    if ((0, ReportActionsUtils_1.isTransactionThread)(parentReportAction)) {
        const isReversedTransaction = (0, ReportActionsUtils_1.isReversedTransaction)(parentReportAction);
        if ((0, ReportActionsUtils_1.isMessageDeleted)(parentReportAction) || isReversedTransaction) {
            let message;
            if (isReversedTransaction) {
                message = 'parentReportAction.reversedTransaction';
            }
            else {
                message = 'parentReportAction.deletedExpense';
            }
            return (<react_native_1.View style={[styles.pRelative]}>
                    <AnimatedEmptyStateBackground_1.default />
                    <OfflineWithFeedback_1.default pendingAction={parentReportAction?.pendingAction ?? null}>
                        <ReportActionItemSingle_1.default action={parentReportAction} showHeader report={report}>
                            <RenderHTML_1.default html={`<deleted-action ${CONST_1.default.REVERSED_TRANSACTION_ATTRIBUTE}="${isReversedTransaction}">${translate(message)}</deleted-action>`}/>
                        </ReportActionItemSingle_1.default>
                        <react_native_1.View style={styles.threadDividerLine}/>
                    </OfflineWithFeedback_1.default>
                </react_native_1.View>);
        }
        return (<OfflineWithFeedback_1.default pendingAction={action?.pendingAction}>
                <ShowContextMenuContext_1.ShowContextMenuContext.Provider value={contextMenuValue}>
                    <react_native_1.View>
                        <MoneyRequestView_1.default allReports={allReports} report={report} policy={policy} shouldShowAnimatedBackground/>
                        {renderThreadDivider}
                    </react_native_1.View>
                </ShowContextMenuContext_1.ShowContextMenuContext.Provider>
            </OfflineWithFeedback_1.default>);
    }
    if ((0, ReportUtils_1.isTaskReport)(report)) {
        if ((0, ReportUtils_1.isCanceledTaskReport)(report, parentReportAction)) {
            return (<react_native_1.View style={[styles.pRelative]}>
                    <AnimatedEmptyStateBackground_1.default />
                    <OfflineWithFeedback_1.default pendingAction={parentReportAction?.pendingAction}>
                        <ReportActionItemSingle_1.default action={parentReportAction} showHeader={draftMessage === undefined} report={report}>
                            <RenderHTML_1.default html={`<deleted-action>${translate('parentReportAction.deletedTask')}</deleted-action>`}/>
                        </ReportActionItemSingle_1.default>
                    </OfflineWithFeedback_1.default>
                    <react_native_1.View style={styles.reportHorizontalRule}/>
                </react_native_1.View>);
        }
        return (<react_native_1.View style={[styles.pRelative]}>
                <AnimatedEmptyStateBackground_1.default />
                <react_native_1.View>
                    <TaskView_1.default report={report} parentReport={parentReport} action={action}/>
                    {renderThreadDivider}
                </react_native_1.View>
            </react_native_1.View>);
    }
    if ((0, ReportUtils_1.isExpenseReport)(report) || (0, ReportUtils_1.isIOUReport)(report) || (0, ReportUtils_1.isInvoiceReport)(report)) {
        return (<OfflineWithFeedback_1.default pendingAction={action?.pendingAction}>
                {!(0, EmptyObject_1.isEmptyObject)(transactionThreadReport?.reportID) ? (<>
                        <MoneyReportView_1.default report={report} policy={policy} isCombinedReport pendingAction={action?.pendingAction} shouldShowTotal={transaction ? transactionCurrency !== report?.currency : false} shouldHideThreadDividerLine={false}/>
                        <ShowContextMenuContext_1.ShowContextMenuContext.Provider value={contextMenuValue}>
                            <react_native_1.View>
                                <MoneyRequestView_1.default allReports={allReports} report={transactionThreadReport} policy={policy} shouldShowAnimatedBackground={false}/>
                                {renderThreadDivider}
                            </react_native_1.View>
                        </ShowContextMenuContext_1.ShowContextMenuContext.Provider>
                    </>) : (<MoneyReportView_1.default report={report} policy={policy} pendingAction={action?.pendingAction} shouldHideThreadDividerLine={shouldHideThreadDividerLine}/>)}
            </OfflineWithFeedback_1.default>);
    }
    return (<ReportActionItemCreated_1.default reportID={report?.reportID} policyID={report?.policyID}/>);
}
ReportActionItemContentCreated.displayName = 'ReportActionItemContentCreated';
exports.default = (0, react_1.memo)(ReportActionItemContentCreated, (prevProps, nextProps) => (0, fast_equals_1.deepEqual)(prevProps.contextValue, nextProps.contextValue) &&
    (0, fast_equals_1.deepEqual)(prevProps.parentReportAction, nextProps.parentReportAction) &&
    prevProps.transactionID === nextProps.transactionID &&
    prevProps.draftMessage === nextProps.draftMessage &&
    prevProps.shouldHideThreadDividerLine === nextProps.shouldHideThreadDividerLine);
