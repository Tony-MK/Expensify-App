"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MoneyRequestView_1 = require("@components/ReportActionItem/MoneyRequestView");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const ShowContextMenuContext_1 = require("@components/ShowContextMenuContext");
const Text_1 = require("@components/Text");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReviewDuplicatesNavigation_1 = require("@hooks/useReviewDuplicatesNavigation");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const Navigation_1 = require("@libs/Navigation/Navigation");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const IOU = require("@src/libs/actions/IOU");
const ReportActionsUtils = require("@src/libs/ReportActionsUtils");
const ReportUtils = require("@src/libs/ReportUtils");
const ReportUtils_1 = require("@src/libs/ReportUtils");
const TransactionUtils = require("@src/libs/TransactionUtils");
const TransactionUtils_1 = require("@src/libs/TransactionUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function Confirmation() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const route = (0, native_1.useRoute)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const [reviewDuplicates, reviewDuplicatesResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REVIEW_DUPLICATES, { canBeMissing: true });
    const newTransaction = (0, react_1.useMemo)(() => TransactionUtils.buildNewTransactionAfterReviewingDuplicates(reviewDuplicates), [reviewDuplicates]);
    const transactionID = TransactionUtils.getTransactionID(route.params.threadReportID);
    const [allReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false });
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, { canBeMissing: true });
    const [transactionViolations] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, {
        canBeMissing: false,
    });
    const allDuplicateIDs = (0, react_1.useMemo)(() => transactionViolations?.find((violation) => violation.name === CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION)?.data?.duplicates ?? [], [transactionViolations]);
    const [allDuplicates] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
        selector: (allTransactions) => allDuplicateIDs.map((id) => allTransactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${id}`]),
        canBeMissing: true,
    }, [allDuplicateIDs]);
    const compareResult = TransactionUtils.compareDuplicateTransactionFields(transaction, allDuplicates, reviewDuplicates?.reportID);
    const { goBack } = (0, useReviewDuplicatesNavigation_1.default)(Object.keys(compareResult.change ?? {}), 'confirmation', route.params.threadReportID, route.params.backTo);
    const [report, reportResult] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${route.params.threadReportID}`, { canBeMissing: true });
    const [iouReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${newTransaction?.reportID}`, { canBeMissing: true });
    const [reportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${newTransaction?.reportID}`, { canBeMissing: true });
    const reportAction = Object.values(reportActions ?? {}).find((action) => ReportActionsUtils.isMoneyRequestAction(action) && ReportActionsUtils.getOriginalMessage(action)?.IOUTransactionID === reviewDuplicates?.transactionID);
    const [duplicates] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
        selector: (allTransactions) => reviewDuplicates?.duplicates.map((id) => allTransactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${id}`]),
        canBeMissing: true,
    }, [reviewDuplicates?.duplicates]);
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.policyID}`, { canBeMissing: true });
    const transactionsMergeParams = (0, react_1.useMemo)(() => TransactionUtils.buildMergeDuplicatesParams(reviewDuplicates, duplicates ?? [], newTransaction), [duplicates, reviewDuplicates, newTransaction]);
    const isReportOwner = iouReport?.ownerAccountID === currentUserPersonalDetails?.accountID;
    const mergeDuplicates = (0, react_1.useCallback)(() => {
        const transactionThreadReportID = reportAction?.childReportID ?? (0, ReportUtils_1.generateReportID)();
        if (!reportAction?.childReportID) {
            transactionsMergeParams.transactionThreadReportID = transactionThreadReportID;
        }
        IOU.mergeDuplicates(transactionsMergeParams);
        Navigation_1.default.dismissModal();
    }, [reportAction?.childReportID, transactionsMergeParams]);
    const resolveDuplicates = (0, react_1.useCallback)(() => {
        IOU.resolveDuplicates(transactionsMergeParams);
        Navigation_1.default.dismissModal();
    }, [transactionsMergeParams]);
    const contextValue = (0, react_1.useMemo)(() => ({
        transactionThreadReport: report,
        action: reportAction,
        report,
        checkIfContextMenuActive: () => { },
        onShowContextMenu: () => { },
        isReportArchived: false,
        anchor: null,
        isDisabled: false,
    }), [report, reportAction]);
    const reportTransactionID = report?.reportID ? (0, TransactionUtils_1.getTransactionID)(report.reportID) : undefined;
    const doesTransactionBelongToReport = reviewDuplicates?.transactionID === reportTransactionID || (reportTransactionID && reviewDuplicates?.duplicates.includes(reportTransactionID));
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundPage = (0, EmptyObject_1.isEmptyObject)(report) ||
        !ReportUtils.isValidReport(report) ||
        ReportUtils.isReportNotFound(report) ||
        (reviewDuplicatesResult.status === 'loaded' && (!newTransaction?.transactionID || !doesTransactionBelongToReport));
    if ((0, isLoadingOnyxValue_1.default)(reviewDuplicatesResult, reportResult) || !newTransaction?.transactionID) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<ScreenWrapper_1.default testID={Confirmation.displayName} shouldShowOfflineIndicator>
            <FullPageNotFoundView_1.default shouldShow={shouldShowNotFoundPage}>
                <react_native_1.View style={[styles.flex1]}>
                    <HeaderWithBackButton_1.default title={translate('iou.reviewDuplicates')} onBackButtonPress={goBack}/>
                    <ScrollView_1.default>
                        <react_native_1.View style={[styles.ph5, styles.pb8]}>
                            <Text_1.default family="EXP_NEW_KANSAS_MEDIUM" fontSize={variables_1.default.fontSizeLarge} style={styles.pb5}>
                                {translate('violations.confirmDetails')}
                            </Text_1.default>
                            <Text_1.default>{translate('violations.confirmDuplicatesInfo')}</Text_1.default>
                        </react_native_1.View>
                        {/* We need that provider here because MoneyRequestView component requires that */}
                        <ShowContextMenuContext_1.ShowContextMenuContext.Provider value={contextValue}>
                            <MoneyRequestView_1.default allReports={allReports} report={report} policy={policy} shouldShowAnimatedBackground={false} readonly isFromReviewDuplicates updatedTransaction={newTransaction}/>
                        </ShowContextMenuContext_1.ShowContextMenuContext.Provider>
                    </ScrollView_1.default>
                    <FixedFooter_1.default style={styles.mtAuto}>
                        <Button_1.default text={translate('common.confirm')} success onPress={() => {
            if (!isReportOwner) {
                resolveDuplicates();
                return;
            }
            mergeDuplicates();
        }} large/>
                    </FixedFooter_1.default>
                </react_native_1.View>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
Confirmation.displayName = 'Confirmation';
exports.default = Confirmation;
