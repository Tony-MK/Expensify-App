"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const ImageBehaviorContextProvider_1 = require("@components/Image/ImageBehaviorContextProvider");
const MoneyRequestConfirmationList_1 = require("@components/MoneyRequestConfirmationList");
const MoneyRequestHeaderStatusBar_1 = require("@components/MoneyRequestHeaderStatusBar");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const IOU_1 = require("@libs/actions/IOU");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const Parser_1 = require("@libs/Parser");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const withReportAndReportActionOrNotFound_1 = require("@pages/home/report/withReportAndReportActionOrNotFound");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function SplitBillDetailsPage({ route, report, reportAction }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const reportID = report?.reportID;
    const originalMessage = reportAction && (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction) ? (0, ReportActionsUtils_1.getOriginalMessage)(reportAction) : undefined;
    const IOUTransactionID = originalMessage?.IOUTransactionID;
    const participantAccountIDs = originalMessage?.participantAccountIDs ?? [];
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(IOUTransactionID)}`, { canBeMissing: true });
    const [draftTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${IOUTransactionID}`, { canBeMissing: true });
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: true });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const [reportAttributesDerived] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: (val) => val?.reports });
    // In case this is workspace split expense, we manually add the workspace as the second participant of the split expense
    // because we don't save any accountID in the report action's originalMessage other than the payee's accountID
    let participants;
    if ((0, ReportUtils_1.isPolicyExpenseChat)(report)) {
        participants = [
            (0, OptionsListUtils_1.getParticipantsOption)({ accountID: participantAccountIDs.at(0), selected: true, reportID: '' }, personalDetails),
            (0, OptionsListUtils_1.getPolicyExpenseReportOption)({ ...report, selected: true, reportID }, reportAttributesDerived),
        ];
    }
    else {
        participants = participantAccountIDs.map((accountID) => (0, OptionsListUtils_1.getParticipantsOption)({ accountID, selected: true, reportID: '' }, personalDetails));
    }
    const actorAccountID = reportAction?.actorAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const payeePersonalDetails = personalDetails?.[actorAccountID];
    const participantsExcludingPayee = participants.filter((participant) => participant.accountID !== reportAction?.actorAccountID);
    const hasSmartScanFailed = (0, TransactionUtils_1.hasReceipt)(transaction) && transaction?.receipt?.state === CONST_1.default.IOU.RECEIPT_STATE.SCAN_FAILED;
    const isEditingSplitBill = session?.accountID === actorAccountID && (0, TransactionUtils_1.areRequiredFieldsEmpty)(transaction);
    const isDistanceRequest = (0, TransactionUtils_1.isDistanceRequest)(transaction);
    const isManualDistanceRequest = (0, TransactionUtils_1.isManualDistanceRequest)(transaction);
    const isMapDistanceRequest = isDistanceRequest && !isManualDistanceRequest;
    const [isConfirmed, setIsConfirmed] = (0, react_1.useState)(false);
    const { amount: splitAmount, currency: splitCurrency, comment: splitComment, merchant: splitMerchant, created: splitCreated, category: splitCategory, billable: splitBillable, } = (0, ReportUtils_1.getTransactionDetails)(isEditingSplitBill && draftTransaction ? draftTransaction : transaction) ?? {};
    const onConfirm = (0, react_1.useCallback)(() => {
        setIsConfirmed(true);
        (0, IOU_1.completeSplitBill)(reportID, reportAction, draftTransaction, session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, session?.email);
    }, [reportID, reportAction, draftTransaction, session?.accountID, session?.email]);
    return (<ScreenWrapper_1.default testID={SplitBillDetailsPage.displayName}>
            <FullPageNotFoundView_1.default shouldShow={!reportID || (0, EmptyObject_1.isEmptyObject)(reportAction) || (0, EmptyObject_1.isEmptyObject)(transaction)}>
                <HeaderWithBackButton_1.default title={translate('common.details')} onBackButtonPress={() => Navigation_1.default.goBack(route.params.backTo)}/>
                <react_native_1.View style={[styles.containerWithSpaceBetween, styles.pointerEventsBoxNone]}>
                    {(0, TransactionUtils_1.isScanning)(transaction) && (<react_native_1.View style={[styles.ph5, styles.pb3, styles.borderBottom]}>
                            <MoneyRequestHeaderStatusBar_1.default icon={<Icon_1.default src={Expensicons.ReceiptScan} height={variables_1.default.iconSizeSmall} width={variables_1.default.iconSizeSmall} fill={theme.icon}/>} description={translate('iou.receiptScanInProgressDescription')} shouldStyleFlexGrow={false}/>
                        </react_native_1.View>)}
                    <ImageBehaviorContextProvider_1.ImageBehaviorContextProvider shouldSetAspectRatioInStyle={!isMapDistanceRequest}>
                        {!!participants.length && (<MoneyRequestConfirmationList_1.default payeePersonalDetails={payeePersonalDetails} selectedParticipants={participantsExcludingPayee} iouAmount={splitAmount ?? 0} iouCurrencyCode={splitCurrency} iouComment={Parser_1.default.htmlToMarkdown(splitComment ?? '')} iouCreated={splitCreated} shouldDisplayReceipt iouMerchant={splitMerchant} iouCategory={splitCategory} iouIsBillable={splitBillable} iouType={CONST_1.default.IOU.TYPE.SPLIT} isReadOnly={!isEditingSplitBill} shouldShowSmartScanFields receiptPath={transaction?.receipt?.source} receiptFilename={transaction?.filename} isDistanceRequest={isDistanceRequest} isManualDistanceRequest={isManualDistanceRequest} isEditingSplitBill={isEditingSplitBill} hasSmartScanFailed={hasSmartScanFailed} reportID={reportID} reportActionID={reportAction?.reportActionID} transaction={isEditingSplitBill && draftTransaction ? draftTransaction : transaction} onConfirm={onConfirm} isPolicyExpenseChat={(0, ReportUtils_1.isPolicyExpenseChat)(report)} policyID={(0, ReportUtils_1.isPolicyExpenseChat)(report) ? report?.policyID : undefined} action={isEditingSplitBill ? CONST_1.default.IOU.ACTION.EDIT : CONST_1.default.IOU.ACTION.CREATE} onToggleBillable={(billable) => {
                (0, IOU_1.setDraftSplitTransaction)(transaction?.transactionID, { billable });
            }} isConfirmed={isConfirmed}/>)}
                    </ImageBehaviorContextProvider_1.ImageBehaviorContextProvider>
                </react_native_1.View>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
SplitBillDetailsPage.displayName = 'SplitBillDetailsPage';
exports.default = (0, withReportAndReportActionOrNotFound_1.default)(SplitBillDetailsPage);
