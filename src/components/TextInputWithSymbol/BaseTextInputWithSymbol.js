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
var AmountTextInput_1 = require("@components/AmountTextInput");
var SymbolButton_1 = require("@components/SymbolButton");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var MoneyRequestUtils_1 = require("@libs/MoneyRequestUtils");
var CONST_1 = require("@src/CONST");
function BaseTextInputWithSymbol(_a) {
    var symbol = _a.symbol, _b = _a.symbolPosition, symbolPosition = _b === void 0 ? CONST_1.default.TEXT_INPUT_SYMBOL_POSITION.PREFIX : _b, _c = _a.onSymbolButtonPress, onSymbolButtonPress = _c === void 0 ? function () { } : _c, _d = _a.onChangeAmount, onChangeAmount = _d === void 0 ? function () { } : _d, formattedAmount = _a.formattedAmount, placeholder = _a.placeholder, selection = _a.selection, _e = _a.onSelectionChange, onSelectionChange = _e === void 0 ? function () { } : _e, _f = _a.onKeyPress, onKeyPress = _f === void 0 ? function () { } : _f, _g = _a.isSymbolPressable, isSymbolPressable = _g === void 0 ? true : _g, _h = _a.hideSymbol, hideSymbol = _h === void 0 ? false : _h, style = _a.style, symbolTextStyle = _a.symbolTextStyle, ref = _a.ref, rest = __rest(_a, ["symbol", "symbolPosition", "onSymbolButtonPress", "onChangeAmount", "formattedAmount", "placeholder", "selection", "onSelectionChange", "onKeyPress", "isSymbolPressable", "hideSymbol", "style", "symbolTextStyle", "ref"]);
    var fromLocaleDigit = (0, useLocalize_1.default)().fromLocaleDigit;
    var styles = (0, useThemeStyles_1.default)();
    /**
     * Set a new amount value properly formatted
     *
     * @param text - Changed text from user input
     */
    var setFormattedAmount = function (text) {
        var newAmount = (0, MoneyRequestUtils_1.addLeadingZero)((0, MoneyRequestUtils_1.replaceAllDigits)(text, fromLocaleDigit));
        onChangeAmount(newAmount);
    };
    return (<>
            {!hideSymbol && symbolPosition === CONST_1.default.TEXT_INPUT_SYMBOL_POSITION.PREFIX && (<SymbolButton_1.default symbol={symbol} onSymbolButtonPress={onSymbolButtonPress} isSymbolPressable={isSymbolPressable} textStyle={symbolTextStyle}/>)}
            <AmountTextInput_1.default formattedAmount={formattedAmount} onChangeAmount={setFormattedAmount} placeholder={placeholder} ref={ref} selection={selection} onSelectionChange={function (event) {
            onSelectionChange(event);
        }} onKeyPress={onKeyPress} style={[styles.pr1, style]} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>
            {!hideSymbol && symbolPosition === CONST_1.default.TEXT_INPUT_SYMBOL_POSITION.SUFFIX && (<SymbolButton_1.default symbol={symbol} onSymbolButtonPress={onSymbolButtonPress} isSymbolPressable={isSymbolPressable} textStyle={symbolTextStyle}/>)}
        </>);
}
BaseTextInputWithSymbol.displayName = 'BaseTextInputWithSymbol';
exports.default = BaseTextInputWithSymbol;
