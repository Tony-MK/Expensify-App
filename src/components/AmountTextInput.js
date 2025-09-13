"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CONST_1 = require("@src/CONST");
const TextInput_1 = require("./TextInput");
function AmountTextInput({ formattedAmount, onChangeAmount, placeholder, selection, onSelectionChange, style, touchableInputWrapperStyle, onKeyPress, containerStyle, disableKeyboard = true, hideFocusedState = true, shouldApplyPaddingToContainer = false, ref, ...rest }) {
    return (<TextInput_1.default autoGrow hideFocusedState={hideFocusedState} shouldInterceptSwipe disableKeyboard={disableKeyboard} inputStyle={style} textInputContainerStyles={containerStyle} onChangeText={onChangeAmount} ref={ref} value={formattedAmount} placeholder={placeholder} inputMode={CONST_1.default.INPUT_MODE.DECIMAL} 
    // On android autoCapitalize="words" is necessary when keyboardType="decimal-pad" or inputMode="decimal" to prevent input lag.
    // See https://github.com/Expensify/App/issues/51868 for more information
    autoCapitalize="words" blurOnSubmit={false} selection={selection} onSelectionChange={onSelectionChange} role={CONST_1.default.ROLE.PRESENTATION} onKeyPress={onKeyPress} touchableInputWrapperStyle={touchableInputWrapperStyle} 
    // On iPad, even if the soft keyboard is hidden, the keyboard suggestion is still shown.
    // Setting both autoCorrect and spellCheck to false will hide the suggestion.
    autoCorrect={false} spellCheck={false} disableKeyboardShortcuts shouldUseFullInputHeight shouldApplyPaddingToContainer={shouldApplyPaddingToContainer} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>);
}
AmountTextInput.displayName = 'AmountTextInput';
exports.default = AmountTextInput;
