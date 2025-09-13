"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const ShowContextMenuContext_1 = require("@components/ShowContextMenuContext");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useTransactionViolations_1 = require("@hooks/useTransactionViolations");
const ControlSelection_1 = require("@libs/ControlSelection");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionPreviewUtils_1 = require("@libs/TransactionPreviewUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const PaymentMethods_1 = require("@userActions/PaymentMethods");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const TransactionPreviewContent_1 = require("./TransactionPreviewContent");
function TransactionPreview(props) {
    const { translate } = (0, useLocalize_1.default)();
    const { allReports, action, chatReportID, reportID, contextMenuAnchor, checkIfContextMenuActive = () => { }, shouldDisplayContextMenu, iouReportID, transactionID: transactionIDFromProps, onPreviewPressed, reportPreviewAction, contextAction, } = props;
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReportID}`];
    const route = (0, native_1.useRoute)();
    const isMoneyRequestAction = (0, ReportActionsUtils_1.isMoneyRequestAction)(action);
    const transactionID = transactionIDFromProps ?? (isMoneyRequestAction ? (0, ReportActionsUtils_1.getOriginalMessage)(action)?.IOUTransactionID : undefined);
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, { canBeMissing: true });
    const violations = (0, useTransactionViolations_1.default)(transaction?.transactionID);
    const [walletTerms] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_TERMS, { canBeMissing: true });
    const session = (0, OnyxListItemProvider_1.useSession)();
    const chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReportID}`];
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    // Get transaction violations for given transaction id from onyx, find duplicated transactions violations and get duplicates
    const allDuplicateIDs = (0, react_1.useMemo)(() => violations?.find((violation) => violation.name === CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION)?.data?.duplicates ?? [], [violations]);
    const [allDuplicates] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
        selector: (allTransactions) => allDuplicateIDs.map((id) => allTransactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${id}`]),
        canBeMissing: true,
    }, [allDuplicateIDs]);
    const duplicates = (0, react_1.useMemo)(() => (0, TransactionUtils_1.removeSettledAndApprovedTransactions)(allDuplicates ?? []), [allDuplicates]);
    const sessionAccountID = session?.accountID;
    const areThereDuplicates = allDuplicateIDs.length > 0 && duplicates.length > 0 && allDuplicateIDs.length === duplicates.length;
    const transactionDetails = (0, react_1.useMemo)(() => (0, ReportUtils_1.getTransactionDetails)(transaction), [transaction]);
    const { amount: requestAmount, currency: requestCurrency } = transactionDetails ?? {};
    const showContextMenu = (event) => {
        if (!shouldDisplayContextMenu) {
            return;
        }
        (0, ShowContextMenuContext_1.showContextMenuForReport)(event, contextMenuAnchor, contextAction ? chatReportID : reportID, contextAction ?? action, checkIfContextMenuActive);
    };
    const offlineWithFeedbackOnClose = (0, react_1.useCallback)(() => {
        (0, PaymentMethods_1.clearWalletTermsError)();
        (0, Report_1.clearIOUError)(chatReportID);
    }, [chatReportID]);
    const navigateToReviewFields = (0, react_1.useCallback)(() => {
        Navigation_1.default.navigate((0, TransactionPreviewUtils_1.getReviewNavigationRoute)(route, transaction, duplicates));
    }, [route, transaction, duplicates]);
    const transactionPreview = transaction;
    const { originalTransaction, isBillSplit } = (0, TransactionUtils_1.getOriginalTransactionWithSplitInfo)(transaction);
    const iouAction = action;
    // See description of `transactionRawAmount` prop for more context
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const transactionRawAmount = (transaction?.modifiedAmount || transaction?.amount) ?? 0;
    const shouldDisableOnPress = isBillSplit && (0, EmptyObject_1.isEmptyObject)(transaction);
    const isTransactionMadeWithCard = (0, TransactionUtils_1.isCardTransaction)(transaction);
    const showCashOrCardTranslation = isTransactionMadeWithCard ? 'iou.card' : 'iou.cash';
    const isReviewDuplicateTransactionPage = route.name === SCREENS_1.default.TRANSACTION_DUPLICATE.REVIEW;
    if (onPreviewPressed) {
        return (<PressableWithoutFeedback_1.default onPress={shouldDisableOnPress ? undefined : props.onPreviewPressed} onPressIn={() => (0, DeviceCapabilities_1.canUseTouchScreen)() && ControlSelection_1.default.block()} onPressOut={() => ControlSelection_1.default.unblock()} onLongPress={showContextMenu} shouldUseHapticsOnLongPress accessibilityLabel={isBillSplit ? translate('iou.split') : translate(showCashOrCardTranslation)} accessibilityHint={(0, CurrencyUtils_1.convertToDisplayString)(requestAmount, requestCurrency)}>
                <TransactionPreviewContent_1.default 
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...props} action={iouAction} isBillSplit={isBillSplit && !transaction?.comment?.originalTransactionID} chatReport={chatReport} personalDetails={personalDetails} transaction={transactionPreview} transactionRawAmount={transactionRawAmount} report={report} violations={violations} offlineWithFeedbackOnClose={offlineWithFeedbackOnClose} navigateToReviewFields={navigateToReviewFields} areThereDuplicates={areThereDuplicates} sessionAccountID={sessionAccountID} walletTermsErrors={walletTerms?.errors} routeName={route.name} isReviewDuplicateTransactionPage={isReviewDuplicateTransactionPage}/>
            </PressableWithoutFeedback_1.default>);
    }
    return (<TransactionPreviewContent_1.default 
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...props} action={iouAction} isBillSplit={isBillSplit} chatReport={chatReport} personalDetails={personalDetails} transaction={originalTransaction} transactionRawAmount={transactionRawAmount} report={report} violations={violations} offlineWithFeedbackOnClose={offlineWithFeedbackOnClose} navigateToReviewFields={navigateToReviewFields} areThereDuplicates={areThereDuplicates} sessionAccountID={sessionAccountID} walletTermsErrors={walletTerms?.errors} routeName={route.name} reportPreviewAction={reportPreviewAction} isReviewDuplicateTransactionPage={isReviewDuplicateTransactionPage}/>);
}
TransactionPreview.displayName = 'TransactionPreview';
exports.default = TransactionPreview;
