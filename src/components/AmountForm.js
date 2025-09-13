"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CurrencyUtils_1 = require("@libs/CurrencyUtils");
var CONST_1 = require("@src/CONST");
var NumberWithSymbolForm_1 = require("./NumberWithSymbolForm");
/**
 * Wrapper around NumberWithSymbolForm with currency handling.
 */
function AmountForm(_a) {
    var _b;
    var value = _a.value, _c = _a.currency, currency = _c === void 0 ? CONST_1.default.CURRENCY.USD : _c, amountMaxLength = _a.amountMaxLength, errorText = _a.errorText, onInputChange = _a.onInputChange, onCurrencyButtonPress = _a.onCurrencyButtonPress, _d = _a.displayAsTextInput, displayAsTextInput = _d === void 0 ? false : _d, _e = _a.isCurrencyPressable, isCurrencyPressable = _e === void 0 ? true : _e, label = _a.label, decimalsProp = _a.decimals, _f = _a.hideCurrencySymbol, hideCurrencySymbol = _f === void 0 ? false : _f, autoFocus = _a.autoFocus, autoGrowExtraSpace = _a.autoGrowExtraSpace, autoGrowMarginSide = _a.autoGrowMarginSide, ref = _a.ref;
    var styles = (0, useThemeStyles_1.default)();
    var decimals = decimalsProp !== null && decimalsProp !== void 0 ? decimalsProp : (0, CurrencyUtils_1.getCurrencyDecimals)(currency);
    return (<NumberWithSymbolForm_1.default label={label} value={value} decimals={decimals} displayAsTextInput={displayAsTextInput} onInputChange={onInputChange} onSymbolButtonPress={onCurrencyButtonPress} ref={function (newRef) {
            if (typeof ref === 'function') {
                ref(newRef);
            }
            else if (ref && 'current' in ref) {
                // eslint-disable-next-line no-param-reassign
                ref.current = newRef;
            }
        }} symbol={(_b = (0, CurrencyUtils_1.getLocalizedCurrencySymbol)(currency)) !== null && _b !== void 0 ? _b : ''} symbolPosition={CONST_1.default.TEXT_INPUT_SYMBOL_POSITION.PREFIX} isSymbolPressable={isCurrencyPressable} hideSymbol={hideCurrencySymbol} maxLength={amountMaxLength} errorText={errorText} style={displayAsTextInput ? undefined : styles.iouAmountTextInput} containerStyle={displayAsTextInput ? undefined : styles.iouAmountTextInputContainer} touchableInputWrapperStyle={displayAsTextInput ? undefined : styles.heightUndefined} autoFocus={autoFocus} autoGrowExtraSpace={autoGrowExtraSpace} autoGrowMarginSide={autoGrowMarginSide}/>);
}
AmountForm.displayName = 'AmountForm';
exports.default = AmountForm;
