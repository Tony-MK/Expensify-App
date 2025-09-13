"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var Button_1 = require("@components/Button");
var NumberWithSymbolForm_1 = require("@components/NumberWithSymbolForm");
var withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var usePolicy_1 = require("@hooks/usePolicy");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var IOU_1 = require("@libs/actions/IOU");
var DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
var DistanceRequestUtils_1 = require("@libs/DistanceRequestUtils");
var IOUUtils_1 = require("@libs/IOUUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var NumberUtils_1 = require("@libs/NumberUtils");
var OptionsListUtils_1 = require("@libs/OptionsListUtils");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var variables_1 = require("@styles/variables");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
var StepScreenWrapper_1 = require("./StepScreenWrapper");
var withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
var withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepDistanceManual(_a) {
    var _b, _c;
    var report = _a.report, _d = _a.route.params, action = _d.action, iouType = _d.iouType, reportID = _d.reportID, transactionID = _d.transactionID, backTo = _d.backTo, backToReport = _d.backToReport, transaction = _a.transaction, currentUserPersonalDetails = _a.currentUserPersonalDetails;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var isExtraSmallScreenHeight = (0, useResponsiveLayout_1.default)().isExtraSmallScreenHeight;
    var textInput = (0, react_1.useRef)(null);
    var numberFormRef = (0, react_1.useRef)(null);
    var focusTimeoutRef = (0, react_1.useRef)(null);
    var _e = (0, react_1.useState)(''), formError = _e[0], setFormError = _e[1];
    var reportNameValuePairs = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS).concat(report === null || report === void 0 ? void 0 : report.reportID), { canBeMissing: true })[0];
    var _f = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.SELECTED_TAB).concat(CONST_1.default.TAB.DISTANCE_REQUEST_TYPE), { canBeMissing: true }), selectedTab = _f[0], selectedTabResult = _f[1];
    var isLoadingSelectedTab = (0, isLoadingOnyxValue_1.default)(selectedTabResult);
    var policy = (0, usePolicy_1.default)(report === null || report === void 0 ? void 0 : report.policyID);
    var personalDetails = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false })[0];
    var activePolicyID = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: false })[0];
    var activePolicy = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(activePolicyID), { canBeMissing: false })[0];
    var skipConfirmation = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.SKIP_CONFIRMATION).concat(transactionID), { canBeMissing: true })[0];
    var lastSelectedDistanceRates = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_SELECTED_DISTANCE_RATES, { canBeMissing: true })[0];
    var reportAttributesDerived = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: function (val) { return val === null || val === void 0 ? void 0 : val.reports; } })[0];
    var isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    var isSplitBill = iouType === CONST_1.default.IOU.TYPE.SPLIT;
    var isCreatingNewRequest = !(backTo || isEditing);
    var customUnitRateID = (0, TransactionUtils_1.getRateID)(transaction);
    var unit = DistanceRequestUtils_1.default.getRate({ transaction: transaction, policy: policy }).unit;
    var distance = ((_c = (_b = transaction === null || transaction === void 0 ? void 0 : transaction.comment) === null || _b === void 0 ? void 0 : _b.customUnit) === null || _c === void 0 ? void 0 : _c.quantity) ? (0, NumberUtils_1.roundToTwoDecimalPlaces)(transaction.comment.customUnit.quantity) : undefined;
    (0, react_1.useEffect)(function () {
        var _a, _b, _c;
        if (numberFormRef.current && ((_a = numberFormRef.current) === null || _a === void 0 ? void 0 : _a.getNumber()) === (distance === null || distance === void 0 ? void 0 : distance.toString())) {
            return;
        }
        (_b = numberFormRef.current) === null || _b === void 0 ? void 0 : _b.updateNumber((_c = distance === null || distance === void 0 ? void 0 : distance.toString()) !== null && _c !== void 0 ? _c : '');
    }, [distance]);
    var shouldSkipConfirmation = (0, react_1.useMemo)(function () {
        if (isSplitBill || !skipConfirmation || !(report === null || report === void 0 ? void 0 : report.reportID)) {
            return false;
        }
        return !((0, ReportUtils_1.isArchivedReport)(reportNameValuePairs) || (0, ReportUtils_1.isPolicyExpenseChat)(report));
    }, [report, isSplitBill, skipConfirmation, reportNameValuePairs]);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(function () {
        focusTimeoutRef.current = setTimeout(function () { var _a; return (_a = textInput.current) === null || _a === void 0 ? void 0 : _a.focus(); }, CONST_1.default.ANIMATED_TRANSITION);
        return function () {
            if (!focusTimeoutRef.current) {
                return;
            }
            clearTimeout(focusTimeoutRef.current);
        };
    }, []));
    var navigateBack = (0, react_1.useCallback)(function () {
        Navigation_1.default.goBack(backTo);
    }, [backTo]);
    var buttonText = (0, react_1.useMemo)(function () {
        if (shouldSkipConfirmation) {
            if (iouType === CONST_1.default.IOU.TYPE.SPLIT) {
                return translate('iou.split');
            }
            return translate('iou.createExpense');
        }
        return isCreatingNewRequest ? translate('common.next') : translate('common.save');
    }, [shouldSkipConfirmation, translate, isCreatingNewRequest, iouType]);
    var navigateToConfirmationPage = (0, react_1.useCallback)(function () {
        switch (iouType) {
            case CONST_1.default.IOU.TYPE.REQUEST:
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, CONST_1.default.IOU.TYPE.SUBMIT, transactionID, reportID, backToReport));
                break;
            default:
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, transactionID, reportID, backToReport));
        }
    }, [iouType, transactionID, reportID, backToReport]);
    var navigateToNextPage = (0, react_1.useCallback)(function (amount) {
        var _a, _b, _c, _d, _e, _f;
        var distanceAsFloat = (0, NumberUtils_1.roundToTwoDecimalPlaces)(parseFloat(amount));
        (0, IOU_1.setMoneyRequestDistance)(transactionID, distanceAsFloat, isCreatingNewRequest);
        if (backTo) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        if ((report === null || report === void 0 ? void 0 : report.reportID) && !(0, ReportUtils_1.isArchivedReport)(reportNameValuePairs) && iouType !== CONST_1.default.IOU.TYPE.CREATE) {
            var selectedParticipants = (0, IOU_1.getMoneyRequestParticipantsFromReport)(report);
            var participants = selectedParticipants.map(function (participant) {
                var _a;
                var participantAccountID = (_a = participant === null || participant === void 0 ? void 0 : participant.accountID) !== null && _a !== void 0 ? _a : CONST_1.default.DEFAULT_NUMBER_ID;
                return participantAccountID ? (0, OptionsListUtils_1.getParticipantsOption)(participant, personalDetails) : (0, OptionsListUtils_1.getReportOption)(participant, reportAttributesDerived);
            });
            if (shouldSkipConfirmation) {
                (0, IOU_1.setMoneyRequestPendingFields)(transactionID, { waypoints: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD });
                (0, IOU_1.setMoneyRequestMerchant)(transactionID, translate('iou.fieldPending'), false);
                var participant = participants.at(0);
                if (iouType === CONST_1.default.IOU.TYPE.TRACK && participant) {
                    (0, IOU_1.trackExpense)({
                        report: report,
                        isDraftPolicy: false,
                        participantParams: {
                            payeeEmail: currentUserPersonalDetails.login,
                            payeeAccountID: currentUserPersonalDetails.accountID,
                            participant: participant,
                        },
                        policyParams: {
                            policy: policy,
                        },
                        transactionParams: {
                            amount: 0,
                            distance: distanceAsFloat,
                            currency: (_a = transaction === null || transaction === void 0 ? void 0 : transaction.currency) !== null && _a !== void 0 ? _a : 'USD',
                            created: (_b = transaction === null || transaction === void 0 ? void 0 : transaction.created) !== null && _b !== void 0 ? _b : '',
                            merchant: translate('iou.fieldPending'),
                            receipt: {},
                            billable: false,
                            customUnitRateID: customUnitRateID,
                            attendees: (_c = transaction === null || transaction === void 0 ? void 0 : transaction.comment) === null || _c === void 0 ? void 0 : _c.attendees,
                        },
                    });
                    return;
                }
                var isPolicyExpenseChat = !!(participant === null || participant === void 0 ? void 0 : participant.isPolicyExpenseChat);
                (0, IOU_1.createDistanceRequest)({
                    report: report,
                    participants: participants,
                    currentUserLogin: currentUserPersonalDetails.login,
                    currentUserAccountID: currentUserPersonalDetails.accountID,
                    iouType: iouType,
                    existingTransaction: transaction,
                    transactionParams: {
                        amount: 0,
                        distance: distanceAsFloat,
                        comment: '',
                        created: (_d = transaction === null || transaction === void 0 ? void 0 : transaction.created) !== null && _d !== void 0 ? _d : '',
                        currency: (_e = transaction === null || transaction === void 0 ? void 0 : transaction.currency) !== null && _e !== void 0 ? _e : 'USD',
                        merchant: translate('iou.fieldPending'),
                        billable: !!(policy === null || policy === void 0 ? void 0 : policy.defaultBillable),
                        customUnitRateID: DistanceRequestUtils_1.default.getCustomUnitRateID({ reportID: report.reportID, isPolicyExpenseChat: isPolicyExpenseChat, policy: policy, lastSelectedDistanceRates: lastSelectedDistanceRates }),
                        splitShares: transaction === null || transaction === void 0 ? void 0 : transaction.splitShares,
                        attendees: (_f = transaction === null || transaction === void 0 ? void 0 : transaction.comment) === null || _f === void 0 ? void 0 : _f.attendees,
                    },
                    backToReport: backToReport,
                });
                return;
            }
            (0, IOU_1.setMoneyRequestParticipantsFromReport)(transactionID, report).then(function () {
                navigateToConfirmationPage();
            });
            return;
        }
        // If there was no reportID, then that means the user started this flow from the global menu
        // and an optimistic reportID was generated. In that case, the next step is to select the participants for this expense.
        if (iouType === CONST_1.default.IOU.TYPE.CREATE && (0, PolicyUtils_1.isPaidGroupPolicy)(activePolicy) && (activePolicy === null || activePolicy === void 0 ? void 0 : activePolicy.isPolicyExpenseChatEnabled) && !(0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(activePolicy.id)) {
            var activePolicyExpenseChat_1 = (0, ReportUtils_1.getPolicyExpenseChat)(currentUserPersonalDetails.accountID, activePolicy === null || activePolicy === void 0 ? void 0 : activePolicy.id);
            var rateID = DistanceRequestUtils_1.default.getCustomUnitRateID({
                reportID: activePolicyExpenseChat_1 === null || activePolicyExpenseChat_1 === void 0 ? void 0 : activePolicyExpenseChat_1.reportID,
                isPolicyExpenseChat: true,
                policy: activePolicy,
                lastSelectedDistanceRates: lastSelectedDistanceRates,
            });
            (0, IOU_1.setCustomUnitRateID)(transactionID, rateID);
            (0, IOU_1.setMoneyRequestParticipantsFromReport)(transactionID, activePolicyExpenseChat_1).then(function () {
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType === CONST_1.default.IOU.TYPE.CREATE ? CONST_1.default.IOU.TYPE.SUBMIT : iouType, transactionID, activePolicyExpenseChat_1 === null || activePolicyExpenseChat_1 === void 0 ? void 0 : activePolicyExpenseChat_1.reportID));
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
    var submitAndNavigateToNextPage = (0, react_1.useCallback)(function () {
        var _a, _b;
        var value = (_b = (_a = numberFormRef.current) === null || _a === void 0 ? void 0 : _a.getNumber()) !== null && _b !== void 0 ? _b : '';
        if (!value.length || parseFloat(value) < 0.01) {
            setFormError(translate('iou.error.invalidDistance'));
            return;
        }
        navigateToNextPage(value);
    }, [navigateToNextPage, translate]);
    (0, react_1.useEffect)(function () {
        if (isLoadingSelectedTab) {
            return;
        }
        setFormError('');
    }, [selectedTab, isLoadingSelectedTab]);
    return (<StepScreenWrapper_1.default headerTitle={translate('common.distance')} onBackButtonPress={navigateBack} testID={IOURequestStepDistanceManual.displayName} shouldShowNotFoundPage={false} shouldShowWrapper={!isCreatingNewRequest} includeSafeAreaPaddingBottom>
            <NumberWithSymbolForm_1.default ref={textInput} numberFormRef={numberFormRef} value={distance === null || distance === void 0 ? void 0 : distance.toString()} onInputChange={function () {
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
var IOURequestStepDistanceManualWithOnyx = IOURequestStepDistanceManual;
var IOURequestStepDistanceManualWithCurrentUserPersonalDetails = (0, withCurrentUserPersonalDetails_1.default)(IOURequestStepDistanceManualWithOnyx);
// eslint-disable-next-line rulesdir/no-negated-variables
var IOURequestStepDistanceManualWithWritableReportOrNotFound = (0, withWritableReportOrNotFound_1.default)(IOURequestStepDistanceManualWithCurrentUserPersonalDetails, true);
// eslint-disable-next-line rulesdir/no-negated-variables
var IOURequestStepDistanceManualWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepDistanceManualWithWritableReportOrNotFound);
exports.default = IOURequestStepDistanceManualWithFullTransactionOrNotFound;
