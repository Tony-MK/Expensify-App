"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const getAmountInputKeyboard_1 = require("@libs/getAmountInputKeyboard");
const MoneyRequestUtils_1 = require("@libs/MoneyRequestUtils");
const TextInput_1 = require("./TextInput");
function AmountWithoutCurrencyInput({ value: amount, shouldAllowNegative = false, inputID, name, defaultValue, accessibilityLabel, role, label, onInputChange, ...rest }, ref) {
    const { toLocaleDigit } = (0, useLocalize_1.default)();
    const separator = (0, react_1.useMemo)(() => (0, MoneyRequestUtils_1.replaceAllDigits)('1.1', toLocaleDigit)
        .split('')
        .filter((char) => char !== '1')
        .join(''), [toLocaleDigit]);
    /**
     * Sets the selection and the amount accordingly to the value passed to the input
     * @param newAmount - Changed amount from user input
     */
    const setNewAmount = (0, react_1.useCallback)((newAmount) => {
        // Remove spaces from the newAmount value because Safari on iOS adds spaces when pasting a copied value
        // More info: https://github.com/Expensify/App/issues/16974
        const newAmountWithoutSpaces = (0, MoneyRequestUtils_1.stripSpacesFromAmount)(newAmount);
        const replacedCommasAmount = (0, MoneyRequestUtils_1.replaceCommasWithPeriod)(newAmountWithoutSpaces);
        onInputChange?.(replacedCommasAmount);
    }, [onInputChange]);
    // Add custom notation for using '-' character in the mask.
    // If we only use '-' for characterSet instead of '0123456789.-'
    // then the first character has to be '-' optionally, but we also want to allow a digit in first position if the value is positive.
    // More info: https://github.com/IvanIhnatsiuk/react-native-advanced-input-mask?tab=readme-ov-file#custom-notations
    const customMask = [
        {
            character: '~',
            characterSet: '0123456789.-',
            isOptional: true,
        },
    ];
    const { keyboardType, inputMode } = (0, getAmountInputKeyboard_1.default)(shouldAllowNegative);
    return (<TextInput_1.default inputID={inputID} name={name} label={label} onChangeText={setNewAmount} defaultValue={defaultValue} accessibilityLabel={accessibilityLabel} role={role} ref={ref} keyboardType={keyboardType} inputMode={inputMode} type="mask" mask={shouldAllowNegative ? `[~][99999999]${separator}[09]` : `[09999999]${separator}[09]`} customNotations={customMask} allowedKeys="0123456789.,-" validationRegex={'^-?(?!.*[.,].*[.,])\\d{0,8}(?:[.,]\\d{0,2})?$'} 
    // On android autoCapitalize="words" is necessary when keyboardType="decimal-pad" or inputMode="decimal" to prevent input lag.
    // See https://github.com/Expensify/App/issues/51868 for more information
    autoCapitalize="words" 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>);
}
AmountWithoutCurrencyInput.displayName = 'AmountWithoutCurrencyInput';
exports.default = react_1.default.forwardRef(AmountWithoutCurrencyInput);
