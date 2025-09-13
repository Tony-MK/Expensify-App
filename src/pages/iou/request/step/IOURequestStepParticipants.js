"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@react-navigation/core");
const react_1 = require("react");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Transaction_1 = require("@libs/actions/Transaction");
const types_1 = require("@libs/API/types");
const Browser_1 = require("@libs/Browser");
const DistanceRequestUtils_1 = require("@libs/DistanceRequestUtils");
const getPlatform_1 = require("@libs/getPlatform");
const HttpUtils_1 = require("@libs/HttpUtils");
const IOUUtils_1 = require("@libs/IOUUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Performance_1 = require("@libs/Performance");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const MoneyRequestParticipantsSelector_1 = require("@pages/iou/request/MoneyRequestParticipantsSelector");
const IOU_1 = require("@userActions/IOU");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const keyboard_1 = require("@src/utils/keyboard");
const mapOnyxCollectionItems_1 = require("@src/utils/mapOnyxCollectionItems");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
const policySelector = (policy) => policy && {
    id: policy.id,
    name: policy.name,
    type: policy.type,
    role: policy.role,
    owner: policy.owner,
    outputCurrency: policy.outputCurrency,
    isPolicyExpenseChatEnabled: policy.isPolicyExpenseChatEnabled,
    customUnits: policy.customUnits,
};
function IOURequestStepParticipants({ route: { params: { iouType, reportID, transactionID: initialTransactionID, action, backTo }, }, transaction: initialTransaction, }) {
    const participants = initialTransaction?.participants;
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const isFocused = (0, core_1.useIsFocused)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const [skipConfirmation] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SKIP_CONFIRMATION}${initialTransactionID}`, { canBeMissing: true });
    const [optimisticTransactions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT, {
        selector: (items) => Object.values(items ?? {}),
        canBeMissing: true,
    });
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { selector: (policies) => (0, mapOnyxCollectionItems_1.default)(policies, policySelector), canBeMissing: true });
    const [lastSelectedDistanceRates] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_SELECTED_DISTANCE_RATES, { canBeMissing: true });
    const transactions = (0, react_1.useMemo)(() => {
        const allTransactions = optimisticTransactions && optimisticTransactions.length > 1 ? optimisticTransactions : [initialTransaction];
        return allTransactions.filter((transaction) => !!transaction);
    }, [initialTransaction, optimisticTransactions]);
    // Depend on transactions.length to avoid updating transactionIDs when only the transaction details change
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    const transactionIDs = (0, react_1.useMemo)(() => transactions?.map((transaction) => transaction.transactionID), [transactions.length]);
    // We need to set selectedReportID if user has navigated back from confirmation page and navigates to confirmation page with already selected participant
    const selectedReportID = (0, react_1.useRef)(participants?.length === 1 ? (participants.at(0)?.reportID ?? reportID) : reportID);
    const numberOfParticipants = (0, react_1.useRef)(participants?.length ?? 0);
    const iouRequestType = (0, TransactionUtils_1.getRequestType)(initialTransaction, isBetaEnabled(CONST_1.default.BETAS.MANUAL_DISTANCE));
    const isSplitRequest = iouType === CONST_1.default.IOU.TYPE.SPLIT;
    const isMovingTransactionFromTrackExpense = (0, IOUUtils_1.isMovingTransactionFromTrackExpense)(action);
    const headerTitle = (0, react_1.useMemo)(() => {
        if (action === CONST_1.default.IOU.ACTION.CATEGORIZE) {
            return translate('iou.categorize');
        }
        if (action === CONST_1.default.IOU.ACTION.SHARE) {
            return translate('iou.share');
        }
        if (isSplitRequest) {
            return translate('iou.splitExpense');
        }
        if (iouType === CONST_1.default.IOU.TYPE.PAY) {
            return translate('iou.paySomeone', {});
        }
        if (iouType === CONST_1.default.IOU.TYPE.INVOICE) {
            return translate('workspace.invoices.sendInvoice');
        }
        return translate('iou.chooseRecipient');
    }, [iouType, translate, isSplitRequest, action]);
    const selfDMReportID = (0, react_1.useMemo)(() => (0, ReportUtils_1.findSelfDMReportID)(), []);
    const [selfDMReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${selfDMReportID}`, { canBeMissing: true });
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: false });
    const [activePolicy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${activePolicyID}`, { canBeMissing: true });
    const isActivePolicyRequest = iouType === CONST_1.default.IOU.TYPE.CREATE && (0, PolicyUtils_1.isPaidGroupPolicy)(activePolicy) && activePolicy?.isPolicyExpenseChatEnabled && !(0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(activePolicy.id);
    const isAndroidNative = (0, getPlatform_1.default)() === CONST_1.default.PLATFORM.ANDROID;
    const isMobileSafari = (0, Browser_1.isMobileSafari)();
    (0, react_1.useEffect)(() => {
        Performance_1.default.markEnd(CONST_1.default.TIMING.OPEN_CREATE_EXPENSE_CONTACT);
    }, []);
    // When the component mounts, if there is a receipt, see if the image can be read from the disk. If not, redirect the user to the starting step of the flow.
    // This is because until the expense is saved, the receipt file is only stored in the browsers memory as a blob:// and if the browser is refreshed, then
    // the image ceases to exist. The best way for the user to recover from this is to start over from the start of the expense process.
    // skip this in case user is moving the transaction as the receipt path will be valid in that case
    (0, react_1.useEffect)(() => {
        if (isMovingTransactionFromTrackExpense) {
            return;
        }
        const firstReceiptFilename = initialTransaction?.filename ?? '';
        const firstReceiptPath = initialTransaction?.receipt?.source ?? '';
        const firstReceiptType = initialTransaction?.receipt?.type ?? '';
        (0, IOU_1.navigateToStartStepIfScanFileCannotBeRead)(firstReceiptFilename, firstReceiptPath, () => { }, iouRequestType, iouType, initialTransactionID, reportID, firstReceiptType);
    }, [iouRequestType, iouType, initialTransaction, initialTransactionID, reportID, isMovingTransactionFromTrackExpense]);
    // When the step opens, reset the draft transaction's custom unit if moved from Track Expense.
    // This resets the custom unit to the p2p rate when the destination workspace changes,
    // because we want to first check if the p2p rate exists on the workspace.
    // If it doesn't exist - we'll show an error message to force the user to choose a valid rate from the workspace.
    (0, react_1.useEffect)(() => {
        if (!isMovingTransactionFromTrackExpense) {
            return;
        }
        transactionIDs.forEach((transactionID) => (0, IOU_1.resetDraftTransactionsCustomUnit)(transactionID));
    }, [isFocused, isMovingTransactionFromTrackExpense, transactionIDs]);
    const waitForKeyboardDismiss = (0, react_1.useCallback)((callback) => {
        if (isAndroidNative || isMobileSafari) {
            keyboard_1.default.dismiss().then(() => {
                callback();
            });
        }
        else {
            callback();
        }
    }, [isAndroidNative, isMobileSafari]);
    const trackExpense = (0, react_1.useCallback)(() => {
        // If coming from the combined submit/track flow and the user proceeds to just track the expense,
        // we will use the track IOU type in the confirmation flow.
        if (!selfDMReportID) {
            return;
        }
        const rateID = CONST_1.default.CUSTOM_UNITS.FAKE_P2P_ID;
        transactions.forEach((transaction) => {
            (0, IOU_1.setCustomUnitRateID)(transaction.transactionID, rateID);
            const shouldSetParticipantAutoAssignment = iouType === CONST_1.default.IOU.TYPE.CREATE;
            (0, IOU_1.setMoneyRequestParticipantsFromReport)(transaction.transactionID, selfDMReport, shouldSetParticipantAutoAssignment ? isActivePolicyRequest : false);
            (0, Transaction_1.setTransactionReport)(transaction.transactionID, { reportID: selfDMReportID }, true);
        });
        const iouConfirmationPageRoute = ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(action, CONST_1.default.IOU.TYPE.TRACK, initialTransactionID, selfDMReportID);
        waitForKeyboardDismiss(() => {
            // If the backTo parameter is set, we should navigate back to the confirmation screen that is already on the stack.
            if (backTo) {
                // We don't want to compare params because we just changed the participants.
                Navigation_1.default.goBack(iouConfirmationPageRoute, { compareParams: false });
            }
            else {
                Navigation_1.default.navigate(iouConfirmationPageRoute);
            }
        });
    }, [selfDMReportID, transactions, action, initialTransactionID, waitForKeyboardDismiss, iouType, selfDMReport, isActivePolicyRequest, backTo]);
    const addParticipant = (0, react_1.useCallback)((val) => {
        HttpUtils_1.default.cancelPendingRequests(types_1.READ_COMMANDS.SEARCH_FOR_REPORTS);
        const firstParticipant = val.at(0);
        if (firstParticipant?.isSelfDM) {
            trackExpense();
            return;
        }
        const firstParticipantReportID = val.at(0)?.reportID;
        const isInvoice = iouType === CONST_1.default.IOU.TYPE.INVOICE && (0, ReportUtils_1.isInvoiceRoomWithID)(firstParticipantReportID);
        numberOfParticipants.current = val.length;
        transactions.forEach((transaction) => {
            (0, IOU_1.setMoneyRequestParticipants)(transaction.transactionID, val);
        });
        if (!isMovingTransactionFromTrackExpense) {
            // If not moving the transaction from track expense, select the default rate automatically.
            // Otherwise, keep the original p2p rate and let the user manually change it to the one they want from the workspace.
            const isPolicyExpenseChat = !!firstParticipant?.isPolicyExpenseChat;
            const policy = isPolicyExpenseChat && firstParticipant?.policyID ? allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${firstParticipant.policyID}`] : undefined;
            const rateID = DistanceRequestUtils_1.default.getCustomUnitRateID({ reportID: firstParticipantReportID, isPolicyExpenseChat, policy, lastSelectedDistanceRates });
            transactions.forEach((transaction) => {
                (0, IOU_1.setCustomUnitRateID)(transaction.transactionID, rateID);
            });
        }
        // When multiple participants are selected, the reportID is generated at the end of the confirmation step.
        // So we are resetting selectedReportID ref to the reportID coming from params.
        if (val.length !== 1 && !isInvoice) {
            selectedReportID.current = reportID;
            return;
        }
        // When a participant is selected, the reportID needs to be saved because that's the reportID that will be used in the confirmation step.
        // We use || to be sure that if the first participant doesn't have a reportID, we generate a new one.
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        selectedReportID.current = firstParticipantReportID || (0, ReportUtils_1.generateReportID)();
    }, [iouType, transactions, isMovingTransactionFromTrackExpense, reportID, trackExpense, allPolicies, lastSelectedDistanceRates]);
    const goToNextStep = (0, react_1.useCallback)(() => {
        const isCategorizing = action === CONST_1.default.IOU.ACTION.CATEGORIZE;
        const isShareAction = action === CONST_1.default.IOU.ACTION.SHARE;
        const isPolicyExpenseChat = participants?.some((participant) => participant.isPolicyExpenseChat);
        if (iouType === CONST_1.default.IOU.TYPE.SPLIT && !isPolicyExpenseChat && initialTransaction?.amount && initialTransaction?.currency) {
            const participantAccountIDs = participants?.map((participant) => participant.accountID);
            (0, IOU_1.setSplitShares)(initialTransaction, initialTransaction.amount, initialTransaction.currency, participantAccountIDs);
        }
        const newReportID = selectedReportID.current;
        transactions.forEach((transaction) => {
            (0, IOU_1.setMoneyRequestTag)(transaction.transactionID, '');
            (0, IOU_1.setMoneyRequestCategory)(transaction.transactionID, '');
            if (participants?.at(0)?.reportID !== newReportID) {
                (0, Transaction_1.setTransactionReport)(transaction.transactionID, { reportID: newReportID }, true);
            }
        });
        if ((isCategorizing || isShareAction) && numberOfParticipants.current === 0) {
            const { expenseChatReportID, policyID, policyName } = (0, Policy_1.createDraftWorkspace)();
            transactions.forEach((transaction) => {
                (0, IOU_1.setMoneyRequestParticipants)(transaction.transactionID, [
                    {
                        selected: true,
                        accountID: 0,
                        isPolicyExpenseChat: true,
                        reportID: expenseChatReportID,
                        policyID,
                        searchText: policyName,
                    },
                ]);
            });
            if (isCategorizing) {
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CATEGORY.getRoute(action, CONST_1.default.IOU.TYPE.SUBMIT, initialTransactionID, expenseChatReportID));
            }
            else {
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(action, CONST_1.default.IOU.TYPE.SUBMIT, initialTransactionID, expenseChatReportID, undefined, true));
            }
            return;
        }
        // If coming from the combined submit/track flow and the user proceeds to submit the expense
        // we will use the submit IOU type in the confirmation flow.
        const iouConfirmationPageRoute = ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(action, iouType === CONST_1.default.IOU.TYPE.CREATE ? CONST_1.default.IOU.TYPE.SUBMIT : iouType, initialTransactionID, newReportID, undefined, undefined, action === CONST_1.default.IOU.ACTION.SHARE ? Navigation_1.default.getActiveRoute() : undefined);
        const route = isCategorizing
            ? ROUTES_1.default.MONEY_REQUEST_STEP_CATEGORY.getRoute(action, iouType, initialTransactionID, selectedReportID.current || reportID, iouConfirmationPageRoute)
            : iouConfirmationPageRoute;
        Performance_1.default.markStart(CONST_1.default.TIMING.OPEN_CREATE_EXPENSE_APPROVE);
        waitForKeyboardDismiss(() => {
            // If the backTo parameter is set, we should navigate back to the confirmation screen that is already on the stack.
            if (backTo) {
                // We don't want to compare params because we just changed the participants.
                Navigation_1.default.goBack(route, { compareParams: false });
            }
            else {
                Navigation_1.default.navigate(route);
            }
        });
    }, [action, participants, iouType, initialTransaction, transactions, initialTransactionID, reportID, waitForKeyboardDismiss, backTo]);
    const navigateBack = (0, react_1.useCallback)(() => {
        if (backTo) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        (0, IOUUtils_1.navigateToStartMoneyRequestStep)(iouRequestType, iouType, initialTransactionID, reportID, action);
    }, [backTo, iouRequestType, iouType, initialTransactionID, reportID, action]);
    (0, react_1.useEffect)(() => {
        const isCategorizing = action === CONST_1.default.IOU.ACTION.CATEGORIZE;
        const isShareAction = action === CONST_1.default.IOU.ACTION.SHARE;
        if (isFocused && (isCategorizing || isShareAction)) {
            transactions.forEach((transaction) => {
                (0, IOU_1.setMoneyRequestParticipants)(transaction.transactionID, []);
            });
            numberOfParticipants.current = 0;
        }
        // We don't want to clear out participants every time the transactions change
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isFocused, action]);
    return (<StepScreenWrapper_1.default headerTitle={headerTitle} onBackButtonPress={navigateBack} shouldShowWrapper testID={IOURequestStepParticipants.displayName}>
            {!!skipConfirmation && (<FormHelpMessage_1.default style={[styles.ph4, styles.mb4]} isError={false} shouldShowRedDotIndicator={false} message={translate('quickAction.noLongerHaveReportAccess')}/>)}
            {transactions.length > 0 && (<MoneyRequestParticipantsSelector_1.default participants={isSplitRequest ? participants : []} onParticipantsAdded={addParticipant} onFinish={goToNextStep} iouType={iouType} action={action} isPerDiemRequest={(0, TransactionUtils_1.isPerDiemRequest)(initialTransaction)}/>)}
        </StepScreenWrapper_1.default>);
}
IOURequestStepParticipants.displayName = 'IOURequestStepParticipants';
exports.default = (0, withWritableReportOrNotFound_1.default)((0, withFullTransactionOrNotFound_1.default)(IOURequestStepParticipants));
