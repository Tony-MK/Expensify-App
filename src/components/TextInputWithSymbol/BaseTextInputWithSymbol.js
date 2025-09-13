"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AmountTextInput_1 = require("@components/AmountTextInput");
const SymbolButton_1 = require("@components/SymbolButton");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const MoneyRequestUtils_1 = require("@libs/MoneyRequestUtils");
const CONST_1 = require("@src/CONST");
function BaseTextInputWithSymbol({ symbol, symbolPosition = CONST_1.default.TEXT_INPUT_SYMBOL_POSITION.PREFIX, onSymbolButtonPress = () => { }, onChangeAmount = () => { }, formattedAmount, placeholder, selection, onSelectionChange = () => { }, onKeyPress = () => { }, isSymbolPressable = true, hideSymbol = false, style, symbolTextStyle, ref, ...rest }) {
    const { fromLocaleDigit } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    /**
     * Set a new amount value properly formatted
     *
     * @param text - Changed text from user input
     */
    const setFormattedAmount = (text) => {
        const newAmount = (0, MoneyRequestUtils_1.addLeadingZero)((0, MoneyRequestUtils_1.replaceAllDigits)(text, fromLocaleDigit));
        onChangeAmount(newAmount);
    };
    return (<>
            {!hideSymbol && symbolPosition === CONST_1.default.TEXT_INPUT_SYMBOL_POSITION.PREFIX && (<SymbolButton_1.default symbol={symbol} onSymbolButtonPress={onSymbolButtonPress} isSymbolPressable={isSymbolPressable} textStyle={symbolTextStyle}/>)}
            <AmountTextInput_1.default formattedAmount={formattedAmount} onChangeAmount={setFormattedAmount} placeholder={placeholder} ref={ref} selection={selection} onSelectionChange={(event) => {
            onSelectionChange(event);
        }} onKeyPress={onKeyPress} style={[styles.pr1, style]} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>
            {!hideSymbol && symbolPosition === CONST_1.default.TEXT_INPUT_SYMBOL_POSITION.SUFFIX && (<SymbolButton_1.default symbol={symbol} onSymbolButtonPress={onSymbolButtonPress} isSymbolPressable={isSymbolPressable} textStyle={symbolTextStyle}/>)}
        </>);
}
BaseTextInputWithSymbol.displayName = 'BaseTextInputWithSymbol';
exports.default = BaseTextInputWithSymbol;
