"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const Button_1 = require("@components/Button");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ReportActionsSkeletonView_1 = require("@components/ReportActionsSkeletonView");
const ReportHeaderSkeletonView_1 = require("@components/ReportHeaderSkeletonView");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useTransactionViolations_1 = require("@hooks/useTransactionViolations");
const Report_1 = require("@libs/actions/Report");
const Transaction_1 = require("@libs/actions/Transaction");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const DuplicateTransactionsList_1 = require("./DuplicateTransactionsList");
function TransactionDuplicateReview() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const route = (0, native_1.useRoute)();
    const currentPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${route.params.threadReportID}`, { canBeMissing: true });
    const [reportMetadata] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${route.params.threadReportID}`, { canBeMissing: true });
    const reportAction = (0, ReportActionsUtils_1.getReportAction)(report?.parentReportID, report?.parentReportActionID);
    const transactionID = (0, ReportActionsUtils_1.getLinkedTransactionID)(reportAction, report?.reportID) ?? undefined;
    const transactionViolations = (0, useTransactionViolations_1.default)(transactionID);
    const duplicateTransactionIDs = (0, react_1.useMemo)(() => transactionViolations?.find((violation) => violation.name === CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION)?.data?.duplicates ?? [], [transactionViolations]);
    const transactionIDs = (0, react_1.useMemo)(() => (transactionID ? [transactionID, ...duplicateTransactionIDs] : duplicateTransactionIDs), [transactionID, duplicateTransactionIDs]);
    const transactionsSelector = (0, react_1.useCallback)((allTransactions) => transactionIDs
        .map((id) => allTransactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${id}`])
        .sort((a, b) => new Date(a?.created ?? '').getTime() - new Date(b?.created ?? '').getTime()), [transactionIDs]);
    const [transactions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
        selector: transactionsSelector,
        canBeMissing: true,
    }, [transactionIDs]);
    const keepAll = () => {
        (0, Transaction_1.dismissDuplicateTransactionViolation)(transactionIDs, currentPersonalDetails);
        Navigation_1.default.goBack();
    };
    const hasSettledOrApprovedTransaction = transactions?.some((transaction) => (0, ReportUtils_1.isSettled)(transaction?.reportID) || (0, ReportUtils_1.isReportIDApproved)(transaction?.reportID));
    (0, react_1.useEffect)(() => {
        if (!route.params.threadReportID || report?.reportID) {
            return;
        }
        (0, Report_1.openReport)(route.params.threadReportID);
    }, [report?.reportID, route.params.threadReportID]);
    const isLoadingPage = (!report?.reportID && reportMetadata?.isLoadingInitialReportActions !== false) || !reportAction?.reportActionID;
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFound = !isLoadingPage && !transactionID;
    if (isLoadingPage) {
        return (<ScreenWrapper_1.default testID={TransactionDuplicateReview.displayName}>
                <react_native_1.View style={[styles.flex1]}>
                    <react_native_1.View style={[styles.appContentHeader, styles.borderBottom]}>
                        <ReportHeaderSkeletonView_1.default onBackButtonPress={() => { }}/>
                    </react_native_1.View>
                    <ReportActionsSkeletonView_1.default />
                </react_native_1.View>
            </ScreenWrapper_1.default>);
    }
    return (<ScreenWrapper_1.default testID={TransactionDuplicateReview.displayName}>
            <FullPageNotFoundView_1.default shouldShow={shouldShowNotFound}>
                <HeaderWithBackButton_1.default title={translate('iou.reviewDuplicates')} onBackButtonPress={() => Navigation_1.default.goBack(route.params.backTo)}/>
                <react_native_1.View style={[styles.justifyContentCenter, styles.ph5, styles.pb3, styles.borderBottom]}>
                    <Button_1.default text={translate('iou.keepAll')} onPress={keepAll}/>
                    {!!hasSettledOrApprovedTransaction && <Text_1.default style={[styles.textNormal, styles.colorMuted, styles.mt3]}>{translate('iou.someDuplicatesArePaid')}</Text_1.default>}
                </react_native_1.View>
                <DuplicateTransactionsList_1.default transactions={transactions ?? []}/>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
TransactionDuplicateReview.displayName = 'TransactionDuplicateReview';
exports.default = TransactionDuplicateReview;
