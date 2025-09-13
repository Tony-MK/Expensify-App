"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const Button_1 = require("@components/Button");
const NumberWithSymbolForm_1 = require("@components/NumberWithSymbolForm");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const IOU_1 = require("@libs/actions/IOU");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const DistanceRequestUtils_1 = require("@libs/DistanceRequestUtils");
const IOUUtils_1 = require("@libs/IOUUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const NumberUtils_1 = require("@libs/NumberUtils");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepDistanceManual({ report, route: { params: { action, iouType, reportID, transactionID, backTo, backToReport }, }, transaction, currentUserPersonalDetails, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isExtraSmallScreenHeight } = (0, useResponsiveLayout_1.default)();
    const textInput = (0, react_1.useRef)(null);
    const numberFormRef = (0, react_1.useRef)(null);
    const focusTimeoutRef = (0, react_1.useRef)(null);
    const [formError, setFormError] = (0, react_1.useState)('');
    const [reportNameValuePairs] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report?.reportID}`, { canBeMissing: true });
    const [selectedTab, selectedTabResult] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SELECTED_TAB}${CONST_1.default.TAB.DISTANCE_REQUEST_TYPE}`, { canBeMissing: true });
    const isLoadingSelectedTab = (0, isLoadingOnyxValue_1.default)(selectedTabResult);
    const policy = (0, usePolicy_1.default)(report?.policyID);
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: false });
    const [activePolicy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${activePolicyID}`, { canBeMissing: false });
    const [skipConfirmation] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SKIP_CONFIRMATION}${transactionID}`, { canBeMissing: true });
    const [lastSelectedDistanceRates] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_SELECTED_DISTANCE_RATES, { canBeMissing: true });
    const [reportAttributesDerived] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: (val) => val?.reports });
    const isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    const isSplitBill = iouType === CONST_1.default.IOU.TYPE.SPLIT;
    const isCreatingNewRequest = !(backTo || isEditing);
    const customUnitRateID = (0, TransactionUtils_1.getRateID)(transaction);
    const unit = DistanceRequestUtils_1.default.getRate({ transaction, policy }).unit;
    const distance = transaction?.comment?.customUnit?.quantity ? (0, NumberUtils_1.roundToTwoDecimalPlaces)(transaction.comment.customUnit.quantity) : undefined;
    (0, react_1.useEffect)(() => {
        if (numberFormRef.current && numberFormRef.current?.getNumber() === distance?.toString()) {
            return;
        }
        numberFormRef.current?.updateNumber(distance?.toString() ?? '');
    }, [distance]);
    const shouldSkipConfirmation = (0, react_1.useMemo)(() => {
        if (isSplitBill || !skipConfirmation || !report?.reportID) {
            return false;
        }
        return !((0, ReportUtils_1.isArchivedReport)(reportNameValuePairs) || (0, ReportUtils_1.isPolicyExpenseChat)(report));
    }, [report, isSplitBill, skipConfirmation, reportNameValuePairs]);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        focusTimeoutRef.current = setTimeout(() => textInput.current?.focus(), CONST_1.default.ANIMATED_TRANSITION);
        return () => {
            if (!focusTimeoutRef.current) {
                return;
            }
            clearTimeout(focusTimeoutRef.current);
        };
    }, []));
    const navigateBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo);
    }, [backTo]);
    const buttonText = (0, react_1.useMemo)(() => {
        if (shouldSkipConfirmation) {
            if (iouType === CONST_1.default.IOU.TYPE.SPLIT) {
                return translate('iou.split');
            }
            return translate('iou.createExpense');
        }
        return isCreatingNewRequest ? translate('common.next') : translate('common.save');
    }, [shouldSkipConfirmation, translate, isCreatingNewRequest, iouType]);
    const navigateToConfirmationPage = (0, react_1.useCallback)(() => {
        switch (iouType) {
            case CONST_1.default.IOU.TYPE.REQUEST:
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, CONST_1.default.IOU.TYPE.SUBMIT, transactionID, reportID, backToReport));
                break;
            default:
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, transactionID, reportID, backToReport));
        }
    }, [iouType, transactionID, reportID, backToReport]);
    const navigateToNextPage = (0, react_1.useCallback)((amount) => {
        const distanceAsFloat = (0, NumberUtils_1.roundToTwoDecimalPlaces)(parseFloat(amount));
        (0, IOU_1.setMoneyRequestDistance)(transactionID, distanceAsFloat, isCreatingNewRequest);
        if (backTo) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        if (report?.reportID && !(0, ReportUtils_1.isArchivedReport)(reportNameValuePairs) && iouType !== CONST_1.default.IOU.TYPE.CREATE) {
            const selectedParticipants = (0, IOU_1.getMoneyRequestParticipantsFromReport)(report);
            const participants = selectedParticipants.map((participant) => {
                const participantAccountID = participant?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
                return participantAccountID ? (0, OptionsListUtils_1.getParticipantsOption)(participant, personalDetails) : (0, OptionsListUtils_1.getReportOption)(participant, reportAttributesDerived);
            });
            if (shouldSkipConfirmation) {
                (0, IOU_1.setMoneyRequestPendingFields)(transactionID, { waypoints: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD });
                (0, IOU_1.setMoneyRequestMerchant)(transactionID, translate('iou.fieldPending'), false);
                const participant = participants.at(0);
                if (iouType === CONST_1.default.IOU.TYPE.TRACK && participant) {
                    (0, IOU_1.trackExpense)({
                        report,
                        isDraftPolicy: false,
                        participantParams: {
                            payeeEmail: currentUserPersonalDetails.login,
                            payeeAccountID: currentUserPersonalDetails.accountID,
                            participant,
                        },
                        policyParams: {
                            policy,
                        },
                        transactionParams: {
                            amount: 0,
                            distance: distanceAsFloat,
                            currency: transaction?.currency ?? 'USD',
                            created: transaction?.created ?? '',
                            merchant: translate('iou.fieldPending'),
                            receipt: {},
                            billable: false,
                            customUnitRateID,
                            attendees: transaction?.comment?.attendees,
                        },
                    });
                    return;
                }
                const isPolicyExpenseChat = !!participant?.isPolicyExpenseChat;
                (0, IOU_1.createDistanceRequest)({
                    report,
                    participants,
                    currentUserLogin: currentUserPersonalDetails.login,
                    currentUserAccountID: currentUserPersonalDetails.accountID,
                    iouType,
                    existingTransaction: transaction,
                    transactionParams: {
                        amount: 0,
                        distance: distanceAsFloat,
                        comment: '',
                        created: transaction?.created ?? '',
                        currency: transaction?.currency ?? 'USD',
                        merchant: translate('iou.fieldPending'),
                        billable: !!policy?.defaultBillable,
                        customUnitRateID: DistanceRequestUtils_1.default.getCustomUnitRateID({ reportID: report.reportID, isPolicyExpenseChat, policy, lastSelectedDistanceRates }),
                        splitShares: transaction?.splitShares,
                        attendees: transaction?.comment?.attendees,
                    },
                    backToReport,
                });
                return;
            }
            (0, IOU_1.setMoneyRequestParticipantsFromReport)(transactionID, report).then(() => {
                navigateToConfirmationPage();
            });
            return;
        }
        // If there was no reportID, then that means the user started this flow from the global menu
        // and an optimistic reportID was generated. In that case, the next step is to select the participants for this expense.
        if (iouType === CONST_1.default.IOU.TYPE.CREATE && (0, PolicyUtils_1.isPaidGroupPolicy)(activePolicy) && activePolicy?.isPolicyExpenseChatEnabled && !(0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(activePolicy.id)) {
            const activePolicyExpenseChat = (0, ReportUtils_1.getPolicyExpenseChat)(currentUserPersonalDetails.accountID, activePolicy?.id);
            const rateID = DistanceRequestUtils_1.default.getCustomUnitRateID({
                reportID: activePolicyExpenseChat?.reportID,
                isPolicyExpenseChat: true,
                policy: activePolicy,
                lastSelectedDistanceRates,
            });
            (0, IOU_1.setCustomUnitRateID)(transactionID, rateID);
            (0, IOU_1.setMoneyRequestParticipantsFromReport)(transactionID, activePolicyExpenseChat).then(() => {
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType === CONST_1.default.IOU.TYPE.CREATE ? CONST_1.default.IOU.TYPE.SUBMIT : iouType, transactionID, activePolicyExpenseChat?.reportID));
            });
        }
        else {
            (0, IOUUtils_1.navigateToParticipantPage)(iouType, transactionID, reportID);
        }
    }, [
        transactionID,
        reportID,
        transaction,
        report,
        backTo,
        backToReport,
        iouType,
        currentUserPersonalDetails.login,
        currentUserPersonalDetails.accountID,
        reportNameValuePairs,
        isCreatingNewRequest,
        activePolicy,
        shouldSkipConfirmation,
        personalDetails,
        reportAttributesDerived,
        policy,
        lastSelectedDistanceRates,
        customUnitRateID,
        translate,
        navigateToConfirmationPage,
    ]);
    const submitAndNavigateToNextPage = (0, react_1.useCallback)(() => {
        const value = numberFormRef.current?.getNumber() ?? '';
        if (!value.length || parseFloat(value) < 0.01) {
            setFormError(translate('iou.error.invalidDistance'));
            return;
        }
        navigateToNextPage(value);
    }, [navigateToNextPage, translate]);
    (0, react_1.useEffect)(() => {
        if (isLoadingSelectedTab) {
            return;
        }
        setFormError('');
    }, [selectedTab, isLoadingSelectedTab]);
    return (<StepScreenWrapper_1.default headerTitle={translate('common.distance')} onBackButtonPress={navigateBack} testID={IOURequestStepDistanceManual.displayName} shouldShowNotFoundPage={false} shouldShowWrapper={!isCreatingNewRequest} includeSafeAreaPaddingBottom>
            <NumberWithSymbolForm_1.default ref={textInput} numberFormRef={numberFormRef} value={distance?.toString()} onInputChange={() => {
            if (!formError) {
                return;
            }
            setFormError('');
        }} decimals={CONST_1.default.DISTANCE_DECIMAL_PLACES} symbol={unit} symbolPosition={CONST_1.default.TEXT_INPUT_SYMBOL_POSITION.SUFFIX} isSymbolPressable={false} symbolTextStyle={styles.textSupporting} style={styles.iouAmountTextInput} containerStyle={styles.iouAmountTextInputContainer} autoGrowExtraSpace={variables_1.default.w80} errorText={formError} footer={<Button_1.default success 
        // Prevent bubbling on edit amount Page to prevent double page submission when two CTA are stacked.
        allowBubble={!isEditing} pressOnEnter medium={isExtraSmallScreenHeight} large={!isExtraSmallScreenHeight} style={[styles.w100, (0, DeviceCapabilities_1.canUseTouchScreen)() ? styles.mt5 : styles.mt0]} onPress={submitAndNavigateToNextPage} text={buttonText} testID="next-button"/>}/>
        </StepScreenWrapper_1.default>);
}
IOURequestStepDistanceManual.displayName = 'IOURequestStepDistanceManual';
const IOURequestStepDistanceManualWithOnyx = IOURequestStepDistanceManual;
const IOURequestStepDistanceManualWithCurrentUserPersonalDetails = (0, withCurrentUserPersonalDetails_1.default)(IOURequestStepDistanceManualWithOnyx);
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepDistanceManualWithWritableReportOrNotFound = (0, withWritableReportOrNotFound_1.default)(IOURequestStepDistanceManualWithCurrentUserPersonalDetails, true);
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepDistanceManualWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepDistanceManualWithWritableReportOrNotFound);
exports.default = IOURequestStepDistanceManualWithFullTransactionOrNotFound;
