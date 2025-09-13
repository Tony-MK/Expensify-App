"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Button_1 = require("@components/Button");
var MoneyRequestAmountInput_1 = require("@components/MoneyRequestAmountInput");
var ScrollView_1 = require("@components/ScrollView");
var SettlementButton_1 = require("@components/SettlementButton");
var useLocalize_1 = require("@hooks/useLocalize");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CurrencyUtils_1 = require("@libs/CurrencyUtils");
var DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
var Navigation_1 = require("@libs/Navigation/Navigation");
var variables_1 = require("@styles/variables");
var CONST_1 = require("@src/CONST");
var ROUTES_1 = require("@src/ROUTES");
var isAmountInvalid = function (amount) { return !amount.length || parseFloat(amount) < 0.01; };
var isTaxAmountInvalid = function (currentAmount, taxAmount, isTaxAmountForm, currency) {
    return isTaxAmountForm && Number.parseFloat(currentAmount) > (0, CurrencyUtils_1.convertToFrontendAmountAsInteger)(Math.abs(taxAmount), currency);
};
/**
 * Wrapper around MoneyRequestAmountInput with money request flow-specific logics.
 */
function MoneyRequestAmountForm(_a) {
    var _b = _a.amount, amount = _b === void 0 ? 0 : _b, _c = _a.taxAmount, taxAmount = _c === void 0 ? 0 : _c, _d = _a.currency, currency = _d === void 0 ? CONST_1.default.CURRENCY.USD : _d, _e = _a.isCurrencyPressable, isCurrencyPressable = _e === void 0 ? true : _e, _f = _a.isEditing, isEditing = _f === void 0 ? false : _f, _g = _a.skipConfirmation, skipConfirmation = _g === void 0 ? false : _g, _h = _a.iouType, iouType = _h === void 0 ? CONST_1.default.IOU.TYPE.SUBMIT : _h, _j = _a.policyID, policyID = _j === void 0 ? '' : _j, onCurrencyButtonPress = _a.onCurrencyButtonPress, onSubmitButtonPress = _a.onSubmitButtonPress, _k = _a.selectedTab, selectedTab = _k === void 0 ? CONST_1.default.TAB_REQUEST.MANUAL : _k, _l = _a.shouldKeepUserInput, shouldKeepUserInput = _l === void 0 ? false : _l, chatReportID = _a.chatReportID, _m = _a.hideCurrencySymbol, hideCurrencySymbol = _m === void 0 ? false : _m, ref = _a.ref;
    var styles = (0, useThemeStyles_1.default)();
    var isExtraSmallScreenHeight = (0, useResponsiveLayout_1.default)().isExtraSmallScreenHeight;
    var translate = (0, useLocalize_1.default)().translate;
    var textInput = (0, react_1.useRef)(null);
    var moneyRequestAmountInputRef = (0, react_1.useRef)(null);
    var _o = (0, react_1.useState)(''), formError = _o[0], setFormError = _o[1];
    var formattedTaxAmount = (0, CurrencyUtils_1.convertToDisplayString)(Math.abs(taxAmount), currency);
    var initializeAmount = (0, react_1.useCallback)(function (newAmount) {
        var _a;
        var frontendAmount = newAmount ? (0, CurrencyUtils_1.convertToFrontendAmountAsString)(newAmount, currency) : '';
        (_a = moneyRequestAmountInputRef.current) === null || _a === void 0 ? void 0 : _a.updateNumber(frontendAmount);
    }, [currency]);
    (0, react_1.useEffect)(function () {
        if (!currency || typeof amount !== 'number') {
            return;
        }
        initializeAmount(amount);
        // we want to re-initialize the state only when the selected tab
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [selectedTab]);
    /**
     * Submit amount and navigate to a proper page
     */
    var submitAndNavigateToNextPage = (0, react_1.useCallback)(function (iouPaymentType) {
        var _a, _b;
        var isTaxAmountForm = Navigation_1.default.getActiveRoute().includes('taxAmount');
        // Skip the check for tax amount form as 0 is a valid input
        var currentAmount = (_b = (_a = moneyRequestAmountInputRef.current) === null || _a === void 0 ? void 0 : _a.getNumber()) !== null && _b !== void 0 ? _b : '';
        if (!currentAmount.length || (!isTaxAmountForm && isAmountInvalid(currentAmount))) {
            setFormError(translate('iou.error.invalidAmount'));
            return;
        }
        if (isTaxAmountInvalid(currentAmount, taxAmount, isTaxAmountForm, currency)) {
            setFormError(translate('iou.error.invalidTaxAmount', { amount: formattedTaxAmount }));
            return;
        }
        onSubmitButtonPress({ amount: currentAmount, currency: currency, paymentMethod: iouPaymentType });
    }, [taxAmount, onSubmitButtonPress, currency, translate, formattedTaxAmount]);
    var buttonText = (0, react_1.useMemo)(function () {
        if (skipConfirmation) {
            if (iouType === CONST_1.default.IOU.TYPE.SPLIT) {
                return translate('iou.splitExpense');
            }
            return translate('iou.createExpense');
        }
        return isEditing ? translate('common.save') : translate('common.next');
    }, [skipConfirmation, iouType, isEditing, translate]);
    var canUseTouchScreen = (0, DeviceCapabilities_1.canUseTouchScreen)();
    (0, react_1.useEffect)(function () {
        setFormError('');
    }, [selectedTab]);
    var footer = (0, react_1.useMemo)(function () { return (<react_native_1.View style={styles.w100}>
                {iouType === CONST_1.default.IOU.TYPE.PAY && skipConfirmation ? (<SettlementButton_1.default pressOnEnter onPress={submitAndNavigateToNextPage} enablePaymentsRoute={ROUTES_1.default.IOU_SEND_ENABLE_PAYMENTS} addDebitCardRoute={ROUTES_1.default.IOU_SEND_ADD_DEBIT_CARD} currency={currency !== null && currency !== void 0 ? currency : CONST_1.default.CURRENCY.USD} policyID={policyID} style={[styles.w100, canUseTouchScreen ? styles.mt5 : styles.mt0]} buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.LARGE} kycWallAnchorAlignment={{
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
            }} paymentMethodDropdownAnchorAlignment={{
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
            }} shouldShowPersonalBankAccountOption enterKeyEventListenerPriority={1} chatReportID={chatReportID}/>) : (<Button_1.default success 
        // Prevent bubbling on edit amount Page to prevent double page submission when two CTA are stacked.
        allowBubble={!isEditing} pressOnEnter medium={isExtraSmallScreenHeight} large={!isExtraSmallScreenHeight} style={[styles.w100, canUseTouchScreen ? styles.mt5 : styles.mt0]} onPress={function () { return submitAndNavigateToNextPage(); }} text={buttonText} testID="next-button"/>)}
            </react_native_1.View>); }, [
        styles.w100,
        styles.mt5,
        styles.mt0,
        iouType,
        skipConfirmation,
        submitAndNavigateToNextPage,
        currency,
        policyID,
        canUseTouchScreen,
        chatReportID,
        isEditing,
        isExtraSmallScreenHeight,
        buttonText,
    ]);
    return (<ScrollView_1.default contentContainerStyle={styles.flexGrow1}>
            <MoneyRequestAmountInput_1.default amount={amount} autoGrowExtraSpace={variables_1.default.w80} hideCurrencySymbol={hideCurrencySymbol} currency={currency} isCurrencyPressable={isCurrencyPressable} onCurrencyButtonPress={onCurrencyButtonPress} onAmountChange={function () {
            if (!formError) {
                return;
            }
            setFormError('');
        }} shouldShowBigNumberPad={canUseTouchScreen} ref={function (newRef) {
            if (typeof ref === 'function') {
                ref(newRef);
            }
            else if (ref && 'current' in ref) {
                // eslint-disable-next-line no-param-reassign
                ref.current = newRef;
            }
            textInput.current = newRef;
        }} moneyRequestAmountInputRef={moneyRequestAmountInputRef} shouldKeepUserInput={shouldKeepUserInput} inputStyle={styles.iouAmountTextInput} containerStyle={styles.iouAmountTextInputContainer} touchableInputWrapperStyle={styles.heightUndefined} testID="moneyRequestAmountInput" errorText={formError} footer={footer}/>
        </ScrollView_1.default>);
}
MoneyRequestAmountForm.displayName = 'MoneyRequestAmountForm';
exports.default = MoneyRequestAmountForm;
