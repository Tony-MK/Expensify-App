"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const MoneyRequestAmountInput_1 = require("@components/MoneyRequestAmountInput");
const ScrollView_1 = require("@components/ScrollView");
const SettlementButton_1 = require("@components/SettlementButton");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const Navigation_1 = require("@libs/Navigation/Navigation");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const isAmountInvalid = (amount) => !amount.length || parseFloat(amount) < 0.01;
const isTaxAmountInvalid = (currentAmount, taxAmount, isTaxAmountForm, currency) => isTaxAmountForm && Number.parseFloat(currentAmount) > (0, CurrencyUtils_1.convertToFrontendAmountAsInteger)(Math.abs(taxAmount), currency);
/**
 * Wrapper around MoneyRequestAmountInput with money request flow-specific logics.
 */
function MoneyRequestAmountForm({ amount = 0, taxAmount = 0, currency = CONST_1.default.CURRENCY.USD, isCurrencyPressable = true, isEditing = false, skipConfirmation = false, iouType = CONST_1.default.IOU.TYPE.SUBMIT, policyID = '', onCurrencyButtonPress, onSubmitButtonPress, selectedTab = CONST_1.default.TAB_REQUEST.MANUAL, shouldKeepUserInput = false, chatReportID, hideCurrencySymbol = false, ref, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { isExtraSmallScreenHeight } = (0, useResponsiveLayout_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const textInput = (0, react_1.useRef)(null);
    const moneyRequestAmountInputRef = (0, react_1.useRef)(null);
    const [formError, setFormError] = (0, react_1.useState)('');
    const formattedTaxAmount = (0, CurrencyUtils_1.convertToDisplayString)(Math.abs(taxAmount), currency);
    const initializeAmount = (0, react_1.useCallback)((newAmount) => {
        const frontendAmount = newAmount ? (0, CurrencyUtils_1.convertToFrontendAmountAsString)(newAmount, currency) : '';
        moneyRequestAmountInputRef.current?.updateNumber(frontendAmount);
    }, [currency]);
    (0, react_1.useEffect)(() => {
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
    const submitAndNavigateToNextPage = (0, react_1.useCallback)((iouPaymentType) => {
        const isTaxAmountForm = Navigation_1.default.getActiveRoute().includes('taxAmount');
        // Skip the check for tax amount form as 0 is a valid input
        const currentAmount = moneyRequestAmountInputRef.current?.getNumber() ?? '';
        if (!currentAmount.length || (!isTaxAmountForm && isAmountInvalid(currentAmount))) {
            setFormError(translate('iou.error.invalidAmount'));
            return;
        }
        if (isTaxAmountInvalid(currentAmount, taxAmount, isTaxAmountForm, currency)) {
            setFormError(translate('iou.error.invalidTaxAmount', { amount: formattedTaxAmount }));
            return;
        }
        onSubmitButtonPress({ amount: currentAmount, currency, paymentMethod: iouPaymentType });
    }, [taxAmount, onSubmitButtonPress, currency, translate, formattedTaxAmount]);
    const buttonText = (0, react_1.useMemo)(() => {
        if (skipConfirmation) {
            if (iouType === CONST_1.default.IOU.TYPE.SPLIT) {
                return translate('iou.splitExpense');
            }
            return translate('iou.createExpense');
        }
        return isEditing ? translate('common.save') : translate('common.next');
    }, [skipConfirmation, iouType, isEditing, translate]);
    const canUseTouchScreen = (0, DeviceCapabilities_1.canUseTouchScreen)();
    (0, react_1.useEffect)(() => {
        setFormError('');
    }, [selectedTab]);
    const footer = (0, react_1.useMemo)(() => (<react_native_1.View style={styles.w100}>
                {iouType === CONST_1.default.IOU.TYPE.PAY && skipConfirmation ? (<SettlementButton_1.default pressOnEnter onPress={submitAndNavigateToNextPage} enablePaymentsRoute={ROUTES_1.default.IOU_SEND_ENABLE_PAYMENTS} addDebitCardRoute={ROUTES_1.default.IOU_SEND_ADD_DEBIT_CARD} currency={currency ?? CONST_1.default.CURRENCY.USD} policyID={policyID} style={[styles.w100, canUseTouchScreen ? styles.mt5 : styles.mt0]} buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.LARGE} kycWallAnchorAlignment={{
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
            }} paymentMethodDropdownAnchorAlignment={{
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
            }} shouldShowPersonalBankAccountOption enterKeyEventListenerPriority={1} chatReportID={chatReportID}/>) : (<Button_1.default success 
        // Prevent bubbling on edit amount Page to prevent double page submission when two CTA are stacked.
        allowBubble={!isEditing} pressOnEnter medium={isExtraSmallScreenHeight} large={!isExtraSmallScreenHeight} style={[styles.w100, canUseTouchScreen ? styles.mt5 : styles.mt0]} onPress={() => submitAndNavigateToNextPage()} text={buttonText} testID="next-button"/>)}
            </react_native_1.View>), [
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
            <MoneyRequestAmountInput_1.default amount={amount} autoGrowExtraSpace={variables_1.default.w80} hideCurrencySymbol={hideCurrencySymbol} currency={currency} isCurrencyPressable={isCurrencyPressable} onCurrencyButtonPress={onCurrencyButtonPress} onAmountChange={() => {
            if (!formError) {
                return;
            }
            setFormError('');
        }} shouldShowBigNumberPad={canUseTouchScreen} ref={(newRef) => {
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
