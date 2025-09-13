"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var CurrencyUtils_1 = require("@libs/CurrencyUtils");
var CONST_1 = require("@src/CONST");
var NumberWithSymbolForm_1 = require("./NumberWithSymbolForm");
var isTextInputFocused_1 = require("./TextInput/BaseTextInput/isTextInputFocused");
var defaultOnFormatAmount = function (amount, currency) { return (0, CurrencyUtils_1.convertToFrontendAmountAsString)(amount, currency !== null && currency !== void 0 ? currency : CONST_1.default.CURRENCY.USD); };
/**
 * Specialized money amount input with currency and money amount formatting.
 */
function MoneyRequestAmountInput(_a) {
    var _b;
    var _c = _a.amount, amount = _c === void 0 ? 0 : _c, _d = _a.currency, currency = _d === void 0 ? CONST_1.default.CURRENCY.USD : _d, _e = _a.isCurrencyPressable, isCurrencyPressable = _e === void 0 ? true : _e, onCurrencyButtonPress = _a.onCurrencyButtonPress, onAmountChange = _a.onAmountChange, _f = _a.prefixCharacter, prefixCharacter = _f === void 0 ? '' : _f, _g = _a.hideCurrencySymbol, hideCurrencySymbol = _g === void 0 ? false : _g, moneyRequestAmountInputRef = _a.moneyRequestAmountInputRef, _h = _a.disableKeyboard, disableKeyboard = _h === void 0 ? true : _h, _j = _a.onFormatAmount, onFormatAmount = _j === void 0 ? defaultOnFormatAmount : _j, formatAmountOnBlur = _a.formatAmountOnBlur, maxLength = _a.maxLength, _k = _a.hideFocusedState, hideFocusedState = _k === void 0 ? true : _k, _l = _a.shouldKeepUserInput, shouldKeepUserInput = _l === void 0 ? false : _l, _m = _a.shouldShowBigNumberPad, shouldShowBigNumberPad = _m === void 0 ? false : _m, inputStyle = _a.inputStyle, _o = _a.autoGrow, autoGrow = _o === void 0 ? true : _o, autoGrowExtraSpace = _a.autoGrowExtraSpace, contentWidth = _a.contentWidth, testID = _a.testID, submitBehavior = _a.submitBehavior, _p = _a.shouldApplyPaddingToContainer, shouldApplyPaddingToContainer = _p === void 0 ? false : _p, _q = _a.shouldUseDefaultLineHeightForPrefix, shouldUseDefaultLineHeightForPrefix = _q === void 0 ? true : _q, _r = _a.shouldWrapInputInContainer, shouldWrapInputInContainer = _r === void 0 ? true : _r, ref = _a.ref, props = __rest(_a, ["amount", "currency", "isCurrencyPressable", "onCurrencyButtonPress", "onAmountChange", "prefixCharacter", "hideCurrencySymbol", "moneyRequestAmountInputRef", "disableKeyboard", "onFormatAmount", "formatAmountOnBlur", "maxLength", "hideFocusedState", "shouldKeepUserInput", "shouldShowBigNumberPad", "inputStyle", "autoGrow", "autoGrowExtraSpace", "contentWidth", "testID", "submitBehavior", "shouldApplyPaddingToContainer", "shouldUseDefaultLineHeightForPrefix", "shouldWrapInputInContainer", "ref"]);
    var textInput = (0, react_1.useRef)(null);
    var numberFormRef = (0, react_1.useRef)(null);
    var decimals = (0, CurrencyUtils_1.getCurrencyDecimals)(currency);
    (0, react_1.useEffect)(function () {
        var _a, _b, _c;
        if ((_a = (!currency || typeof amount !== 'number' || (formatAmountOnBlur && (0, isTextInputFocused_1.default)(textInput)))) !== null && _a !== void 0 ? _a : shouldKeepUserInput) {
            return;
        }
        var frontendAmount = onFormatAmount(amount, currency);
        // Only update selection if the amount prop was changed from the outside and is not the same as the current amount we just computed
        // In the line below the currentAmount is not immediately updated, it should still hold the previous value.
        if (frontendAmount !== ((_b = numberFormRef.current) === null || _b === void 0 ? void 0 : _b.getNumber())) {
            (_c = numberFormRef.current) === null || _c === void 0 ? void 0 : _c.updateNumber(frontendAmount);
        }
        // we want to re-initialize the state only when the amount changes
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [amount, shouldKeepUserInput]);
    var formatAmount = (0, react_1.useCallback)(function () {
        var _a;
        if (!formatAmountOnBlur) {
            return;
        }
        var formattedAmount = onFormatAmount(amount, currency);
        if (maxLength && formattedAmount.length > maxLength) {
            return;
        }
        (_a = numberFormRef.current) === null || _a === void 0 ? void 0 : _a.updateNumber(formattedAmount);
    }, [amount, currency, onFormatAmount, formatAmountOnBlur, maxLength]);
    var inputOnBlur = function (e) {
        var _a;
        (_a = props.onBlur) === null || _a === void 0 ? void 0 : _a.call(props, e);
        formatAmount();
    };
    return (<NumberWithSymbolForm_1.default value={onFormatAmount(amount, currency)} decimals={decimals} onSymbolButtonPress={onCurrencyButtonPress} onInputChange={onAmountChange} onBlur={inputOnBlur} ref={function (newRef) {
            if (typeof ref === 'function') {
                ref(newRef);
            }
            else if (ref === null || ref === void 0 ? void 0 : ref.current) {
                // eslint-disable-next-line no-param-reassign
                ref.current = newRef;
            }
            // eslint-disable-next-line react-compiler/react-compiler
            textInput.current = newRef;
        }} numberFormRef={function (newRef) {
            if (typeof moneyRequestAmountInputRef === 'function') {
                moneyRequestAmountInputRef(newRef);
            }
            else if (moneyRequestAmountInputRef && 'current' in moneyRequestAmountInputRef) {
                // eslint-disable-next-line react-compiler/react-compiler, no-param-reassign
                moneyRequestAmountInputRef.current = newRef;
            }
            numberFormRef.current = newRef;
        }} symbol={(_b = (0, CurrencyUtils_1.getLocalizedCurrencySymbol)(currency)) !== null && _b !== void 0 ? _b : ''} symbolPosition={CONST_1.default.TEXT_INPUT_SYMBOL_POSITION.PREFIX} hideSymbol={hideCurrencySymbol} isSymbolPressable={isCurrencyPressable} shouldShowBigNumberPad={shouldShowBigNumberPad} style={inputStyle} autoGrow={autoGrow} disableKeyboard={disableKeyboard} prefixCharacter={prefixCharacter} hideFocusedState={hideFocusedState} shouldApplyPaddingToContainer={shouldApplyPaddingToContainer} shouldUseDefaultLineHeightForPrefix={shouldUseDefaultLineHeightForPrefix} shouldWrapInputInContainer={shouldWrapInputInContainer} containerStyle={props.containerStyle} prefixStyle={props.prefixStyle} prefixContainerStyle={props.prefixContainerStyle} touchableInputWrapperStyle={props.touchableInputWrapperStyle} contentWidth={contentWidth} testID={testID} errorText={props.errorText} footer={props.footer} autoGrowExtraSpace={autoGrowExtraSpace} submitBehavior={submitBehavior} onFocus={props.onFocus}/>);
}
MoneyRequestAmountInput.displayName = 'MoneyRequestAmountInput';
exports.default = MoneyRequestAmountInput;
