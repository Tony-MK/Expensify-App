"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const MoneyRequestUtils_1 = require("@libs/MoneyRequestUtils");
const CONST_1 = require("@src/CONST");
const TextInput_1 = require("./TextInput");
function PercentageForm({ value: amount, errorText, onInputChange, label, ...rest }, forwardedRef) {
    const { toLocaleDigit, numberFormat } = (0, useLocalize_1.default)();
    const textInput = (0, react_1.useRef)(null);
    const currentAmount = (0, react_1.useMemo)(() => (typeof amount === 'string' ? amount : ''), [amount]);
    /**
     * Sets the selection and the amount accordingly to the value passed to the input
     * @param newAmount - Changed amount from user input
     */
    const setNewAmount = (0, react_1.useCallback)((newAmount) => {
        // Remove spaces from the newAmount value because Safari on iOS adds spaces when pasting a copied value
        // More info: https://github.com/Expensify/App/issues/16974
        const newAmountWithoutSpaces = (0, MoneyRequestUtils_1.stripSpacesFromAmount)(newAmount);
        // Use a shallow copy of selection to trigger setSelection
        // More info: https://github.com/Expensify/App/issues/16385
        if (!(0, MoneyRequestUtils_1.validatePercentage)(newAmountWithoutSpaces)) {
            return;
        }
        const strippedAmount = (0, MoneyRequestUtils_1.stripCommaFromAmount)(newAmountWithoutSpaces);
        onInputChange?.(strippedAmount);
    }, [onInputChange]);
    const formattedAmount = (0, MoneyRequestUtils_1.replaceAllDigits)(currentAmount, toLocaleDigit);
    return (<TextInput_1.default label={label} value={formattedAmount} onChangeText={setNewAmount} placeholder={numberFormat(0)} ref={(ref) => {
            if (typeof forwardedRef === 'function') {
                forwardedRef(ref);
            }
            else if (forwardedRef && 'current' in forwardedRef) {
                // eslint-disable-next-line no-param-reassign
                forwardedRef.current = ref;
            }
            textInput.current = ref;
        }} suffixCharacter="%" keyboardType={CONST_1.default.KEYBOARD_TYPE.DECIMAL_PAD} 
    // On android autoCapitalize="words" is necessary when keyboardType="decimal-pad" or inputMode="decimal" to prevent input lag.
    // See https://github.com/Expensify/App/issues/51868 for more information
    autoCapitalize="words" 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>);
}
PercentageForm.displayName = 'PercentageForm';
exports.default = (0, react_1.forwardRef)(PercentageForm);
