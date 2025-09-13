"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const CONST_1 = require("@src/CONST");
const NumberWithSymbolForm_1 = require("./NumberWithSymbolForm");
/**
 * Wrapper around NumberWithSymbolForm with currency handling.
 */
function AmountForm({ value, currency = CONST_1.default.CURRENCY.USD, amountMaxLength, errorText, onInputChange, onCurrencyButtonPress, displayAsTextInput = false, isCurrencyPressable = true, label, decimals: decimalsProp, hideCurrencySymbol = false, autoFocus, autoGrowExtraSpace, autoGrowMarginSide, ref, }) {
    const styles = (0, useThemeStyles_1.default)();
    const decimals = decimalsProp ?? (0, CurrencyUtils_1.getCurrencyDecimals)(currency);
    return (<NumberWithSymbolForm_1.default label={label} value={value} decimals={decimals} displayAsTextInput={displayAsTextInput} onInputChange={onInputChange} onSymbolButtonPress={onCurrencyButtonPress} ref={(newRef) => {
            if (typeof ref === 'function') {
                ref(newRef);
            }
            else if (ref && 'current' in ref) {
                // eslint-disable-next-line no-param-reassign
                ref.current = newRef;
            }
        }} symbol={(0, CurrencyUtils_1.getLocalizedCurrencySymbol)(currency) ?? ''} symbolPosition={CONST_1.default.TEXT_INPUT_SYMBOL_POSITION.PREFIX} isSymbolPressable={isCurrencyPressable} hideSymbol={hideCurrencySymbol} maxLength={amountMaxLength} errorText={errorText} style={displayAsTextInput ? undefined : styles.iouAmountTextInput} containerStyle={displayAsTextInput ? undefined : styles.iouAmountTextInputContainer} touchableInputWrapperStyle={displayAsTextInput ? undefined : styles.heightUndefined} autoFocus={autoFocus} autoGrowExtraSpace={autoGrowExtraSpace} autoGrowMarginSide={autoGrowMarginSide}/>);
}
AmountForm.displayName = 'AmountForm';
exports.default = AmountForm;
