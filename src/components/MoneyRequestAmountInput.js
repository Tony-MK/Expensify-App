"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const CONST_1 = require("@src/CONST");
const NumberWithSymbolForm_1 = require("./NumberWithSymbolForm");
const isTextInputFocused_1 = require("./TextInput/BaseTextInput/isTextInputFocused");
const defaultOnFormatAmount = (amount, currency) => (0, CurrencyUtils_1.convertToFrontendAmountAsString)(amount, currency ?? CONST_1.default.CURRENCY.USD);
/**
 * Specialized money amount input with currency and money amount formatting.
 */
function MoneyRequestAmountInput({ amount = 0, currency = CONST_1.default.CURRENCY.USD, isCurrencyPressable = true, onCurrencyButtonPress, onAmountChange, prefixCharacter = '', hideCurrencySymbol = false, moneyRequestAmountInputRef, disableKeyboard = true, onFormatAmount = defaultOnFormatAmount, formatAmountOnBlur, maxLength, hideFocusedState = true, shouldKeepUserInput = false, shouldShowBigNumberPad = false, inputStyle, autoGrow = true, autoGrowExtraSpace, contentWidth, testID, submitBehavior, shouldApplyPaddingToContainer = false, shouldUseDefaultLineHeightForPrefix = true, shouldWrapInputInContainer = true, ref, ...props }) {
    const textInput = (0, react_1.useRef)(null);
    const numberFormRef = (0, react_1.useRef)(null);
    const decimals = (0, CurrencyUtils_1.getCurrencyDecimals)(currency);
    (0, react_1.useEffect)(() => {
        if ((!currency || typeof amount !== 'number' || (formatAmountOnBlur && (0, isTextInputFocused_1.default)(textInput))) ?? shouldKeepUserInput) {
            return;
        }
        const frontendAmount = onFormatAmount(amount, currency);
        // Only update selection if the amount prop was changed from the outside and is not the same as the current amount we just computed
        // In the line below the currentAmount is not immediately updated, it should still hold the previous value.
        if (frontendAmount !== numberFormRef.current?.getNumber()) {
            numberFormRef.current?.updateNumber(frontendAmount);
        }
        // we want to re-initialize the state only when the amount changes
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [amount, shouldKeepUserInput]);
    const formatAmount = (0, react_1.useCallback)(() => {
        if (!formatAmountOnBlur) {
            return;
        }
        const formattedAmount = onFormatAmount(amount, currency);
        if (maxLength && formattedAmount.length > maxLength) {
            return;
        }
        numberFormRef.current?.updateNumber(formattedAmount);
    }, [amount, currency, onFormatAmount, formatAmountOnBlur, maxLength]);
    const inputOnBlur = (e) => {
        props.onBlur?.(e);
        formatAmount();
    };
    return (<NumberWithSymbolForm_1.default value={onFormatAmount(amount, currency)} decimals={decimals} onSymbolButtonPress={onCurrencyButtonPress} onInputChange={onAmountChange} onBlur={inputOnBlur} ref={(newRef) => {
            if (typeof ref === 'function') {
                ref(newRef);
            }
            else if (ref?.current) {
                // eslint-disable-next-line no-param-reassign
                ref.current = newRef;
            }
            // eslint-disable-next-line react-compiler/react-compiler
            textInput.current = newRef;
        }} numberFormRef={(newRef) => {
            if (typeof moneyRequestAmountInputRef === 'function') {
                moneyRequestAmountInputRef(newRef);
            }
            else if (moneyRequestAmountInputRef && 'current' in moneyRequestAmountInputRef) {
                // eslint-disable-next-line react-compiler/react-compiler, no-param-reassign
                moneyRequestAmountInputRef.current = newRef;
            }
            numberFormRef.current = newRef;
        }} symbol={(0, CurrencyUtils_1.getLocalizedCurrencySymbol)(currency) ?? ''} symbolPosition={CONST_1.default.TEXT_INPUT_SYMBOL_POSITION.PREFIX} hideSymbol={hideCurrencySymbol} isSymbolPressable={isCurrencyPressable} shouldShowBigNumberPad={shouldShowBigNumberPad} style={inputStyle} autoGrow={autoGrow} disableKeyboard={disableKeyboard} prefixCharacter={prefixCharacter} hideFocusedState={hideFocusedState} shouldApplyPaddingToContainer={shouldApplyPaddingToContainer} shouldUseDefaultLineHeightForPrefix={shouldUseDefaultLineHeightForPrefix} shouldWrapInputInContainer={shouldWrapInputInContainer} containerStyle={props.containerStyle} prefixStyle={props.prefixStyle} prefixContainerStyle={props.prefixContainerStyle} touchableInputWrapperStyle={props.touchableInputWrapperStyle} contentWidth={contentWidth} testID={testID} errorText={props.errorText} footer={props.footer} autoGrowExtraSpace={autoGrowExtraSpace} submitBehavior={submitBehavior} onFocus={props.onFocus}/>);
}
MoneyRequestAmountInput.displayName = 'MoneyRequestAmountInput';
exports.default = MoneyRequestAmountInput;
