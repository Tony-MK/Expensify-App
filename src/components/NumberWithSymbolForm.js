"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useMouseContext_1 = require("@hooks/useMouseContext");
const usePrevious_1 = require("@hooks/usePrevious");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Browser_1 = require("@libs/Browser");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const getOperatingSystem_1 = require("@libs/getOperatingSystem");
const MoneyRequestUtils_1 = require("@libs/MoneyRequestUtils");
const shouldIgnoreSelectionWhenUpdatedManually_1 = require("@libs/shouldIgnoreSelectionWhenUpdatedManually");
const CONST_1 = require("@src/CONST");
const BigNumberPad_1 = require("./BigNumberPad");
const FormHelpMessage_1 = require("./FormHelpMessage");
const TextInput_1 = require("./TextInput");
const isTextInputFocused_1 = require("./TextInput/BaseTextInput/isTextInputFocused");
const TextInputWithSymbol_1 = require("./TextInputWithSymbol");
const canUseTouchScreen = (0, DeviceCapabilities_1.canUseTouchScreen)();
/**
 * Returns the new selection object based on the updated number's length
 */
const getNewSelection = (oldSelection, prevLength, newLength) => {
    const cursorPosition = oldSelection.end + (newLength - prevLength);
    return { start: cursorPosition, end: cursorPosition };
};
const NUMBER_VIEW_ID = 'numberView';
const NUM_PAD_CONTAINER_VIEW_ID = 'numPadContainerView';
const NUM_PAD_VIEW_ID = 'numPadView';
/**
 * Generic number input form with symbol (currency or unit).
 *
 * Can render either a standard TextInput or a number input with BigNumberPad and symbol interaction.
 * Already handles number decimals and input validation.
 */
function NumberWithSymbolForm({ value: number, symbol = '', symbolPosition = CONST_1.default.TEXT_INPUT_SYMBOL_POSITION.PREFIX, hideSymbol = false, decimals = 0, maxLength, errorText, onInputChange, onSymbolButtonPress, isSymbolPressable = true, shouldShowBigNumberPad = canUseTouchScreen, displayAsTextInput = false, footer, numberFormRef, label, style, containerStyle, symbolTextStyle, autoGrow = true, disableKeyboard = true, prefixCharacter = '', hideFocusedState = true, shouldApplyPaddingToContainer = false, shouldUseDefaultLineHeightForPrefix = true, shouldWrapInputInContainer = true, ref, ...props }) {
    const styles = (0, useThemeStyles_1.default)();
    const { toLocaleDigit, numberFormat } = (0, useLocalize_1.default)();
    const textInput = (0, react_1.useRef)(null);
    const numberRef = (0, react_1.useRef)(undefined);
    const [currentNumber, setCurrentNumber] = (0, react_1.useState)(typeof number === 'string' ? number : '');
    const [shouldUpdateSelection, setShouldUpdateSelection] = (0, react_1.useState)(true);
    const isFocused = (0, native_1.useIsFocused)();
    const wasFocused = (0, usePrevious_1.default)(isFocused);
    const [selection, setSelection] = (0, react_1.useState)({
        start: currentNumber.length,
        end: currentNumber.length,
    });
    const forwardDeletePressedRef = (0, react_1.useRef)(false);
    // The ref is used to ignore any onSelectionChange event that happens while we are updating the selection manually in setNewNumber
    const willSelectionBeUpdatedManually = (0, react_1.useRef)(false);
    const { setMouseDown, setMouseUp } = (0, useMouseContext_1.useMouseContext)();
    const handleMouseDown = (e) => {
        e.stopPropagation();
        setMouseDown();
    };
    const handleMouseUp = (e) => {
        e.stopPropagation();
        setMouseUp();
    };
    const clearSelection = (0, react_1.useCallback)(() => {
        setSelection({ start: selection.end, end: selection.end });
    }, [selection.end]);
    /**
     * Event occurs when a user presses a mouse button over an DOM element.
     */
    const focusTextInput = (event, ids) => {
        const relatedTargetId = event.nativeEvent?.target?.id;
        if (!ids.includes(relatedTargetId)) {
            return;
        }
        event.preventDefault();
        clearSelection();
        if (!textInput.current) {
            return;
        }
        if (!(0, isTextInputFocused_1.default)(textInput)) {
            textInput.current.focus();
        }
    };
    /**
     * Sets the selection and the number accordingly to the number passed to the input
     * @param newNumber - Changed number from user input
     */
    const setNewNumber = (0, react_1.useCallback)((newNumber) => {
        // Remove spaces from the newNumber number because Safari on iOS adds spaces when pasting a copied number
        // More info: https://github.com/Expensify/App/issues/16974
        const newNumberWithoutSpaces = (0, MoneyRequestUtils_1.stripSpacesFromAmount)(newNumber);
        const finalNumber = newNumberWithoutSpaces.includes('.') ? (0, MoneyRequestUtils_1.stripCommaFromAmount)(newNumberWithoutSpaces) : (0, MoneyRequestUtils_1.replaceCommasWithPeriod)(newNumberWithoutSpaces);
        // Use a shallow copy of selection to trigger setSelection
        // More info: https://github.com/Expensify/App/issues/16385
        if (!(0, MoneyRequestUtils_1.validateAmount)(finalNumber, decimals, maxLength)) {
            setSelection((prevSelection) => ({ ...prevSelection }));
            return;
        }
        willSelectionBeUpdatedManually.current = true;
        let hasSelectionBeenSet = false;
        const strippedNumber = (0, MoneyRequestUtils_1.stripCommaFromAmount)(finalNumber);
        numberRef.current = strippedNumber;
        setCurrentNumber((prevNumber) => {
            const isForwardDelete = prevNumber.length > strippedNumber.length && forwardDeletePressedRef.current;
            if (!hasSelectionBeenSet) {
                hasSelectionBeenSet = true;
                setSelection((prevSelection) => getNewSelection(prevSelection, isForwardDelete ? strippedNumber.length : prevNumber.length, strippedNumber.length));
                willSelectionBeUpdatedManually.current = false;
            }
            return strippedNumber;
        });
        onInputChange?.(strippedNumber);
    }, [decimals, maxLength, onInputChange]);
    /**
     * Set a new number number properly formatted, used for the TextInput
     * @param text - Changed text from user input
     */
    const setFormattedNumber = (text) => {
        // Remove spaces from the new number because Safari on iOS adds spaces when pasting a copied number
        // More info: https://github.com/Expensify/App/issues/16974
        const newNumberWithoutSpaces = (0, MoneyRequestUtils_1.stripSpacesFromAmount)(text);
        const replacedCommasNumber = (0, MoneyRequestUtils_1.replaceCommasWithPeriod)(newNumberWithoutSpaces);
        const withLeadingZero = (0, MoneyRequestUtils_1.addLeadingZero)(replacedCommasNumber);
        if (!(0, MoneyRequestUtils_1.validateAmount)(withLeadingZero, decimals, maxLength)) {
            setSelection((prevSelection) => ({ ...prevSelection }));
            return;
        }
        const strippedNumber = (0, MoneyRequestUtils_1.stripCommaFromAmount)(withLeadingZero);
        const isForwardDelete = currentNumber.length > strippedNumber.length && forwardDeletePressedRef.current;
        setCurrentNumber(strippedNumber);
        setSelection(getNewSelection(selection, isForwardDelete ? strippedNumber.length : currentNumber.length, strippedNumber.length));
        onInputChange?.(strippedNumber);
    };
    // Clears text selection if user visits symbol (currency) selector and comes back
    (0, react_1.useEffect)(() => {
        if (!isFocused || wasFocused) {
            return;
        }
        clearSelection();
    }, [isFocused, wasFocused, clearSelection]);
    // Modifies the number to match changed decimals.
    (0, react_1.useEffect)(() => {
        // If the number supports decimals, we can return
        if ((0, MoneyRequestUtils_1.validateAmount)(currentNumber, decimals, maxLength)) {
            return;
        }
        // If the number doesn't support decimals, we can strip the decimals
        setNewNumber((0, MoneyRequestUtils_1.stripDecimalsFromAmount)(currentNumber));
        // we want to update only when decimals change.
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [decimals]);
    /**
     * Update number with number or Backspace pressed for BigNumberPad.
     * Validate new number with decimal number regex up to 6 digits and 2 decimal digit to enable Next button
     */
    const updateValueNumberPad = (0, react_1.useCallback)((key) => {
        if (shouldUpdateSelection && !(0, isTextInputFocused_1.default)(textInput)) {
            textInput.current?.focus();
        }
        // Backspace button is pressed
        if (key === '<' || key === 'Backspace') {
            if (currentNumber.length > 0) {
                const selectionStart = selection.start === selection.end ? selection.start - 1 : selection.start;
                const newNumber = `${currentNumber.substring(0, selectionStart)}${currentNumber.substring(selection.end)}`;
                setNewNumber((0, MoneyRequestUtils_1.addLeadingZero)(newNumber));
            }
            return;
        }
        const newNumber = (0, MoneyRequestUtils_1.addLeadingZero)(`${currentNumber.substring(0, selection.start)}${key}${currentNumber.substring(selection.end)}`);
        setNewNumber(newNumber);
    }, [currentNumber, selection, shouldUpdateSelection, setNewNumber]);
    /**
     * Update long press number, to remove items pressing on <
     *
     * @param value - Changed text from user input
     */
    const updateLongPressHandlerState = (0, react_1.useCallback)((value) => {
        setShouldUpdateSelection(!value);
        if (!value && !(0, isTextInputFocused_1.default)(textInput)) {
            textInput.current?.focus();
        }
    }, []);
    /**
     * Input handler to check for a forward-delete key (or keyboard shortcut) press.
     */
    const textInputKeyPress = (event) => {
        const key = event.nativeEvent.key.toLowerCase();
        if ((0, Browser_1.isMobileSafari)() && key === CONST_1.default.PLATFORM_SPECIFIC_KEYS.CTRL.DEFAULT) {
            // Optimistically anticipate forward-delete on iOS Safari (in cases where the Mac Accessibility keyboard is being
            // used for input). If the Control-D shortcut doesn't get sent, the ref will still be reset on the next key press.
            forwardDeletePressedRef.current = true;
            return;
        }
        // Control-D on Mac is a keyboard shortcut for forward-delete. See https://support.apple.com/en-us/HT201236 for Mac keyboard shortcuts.
        // Also check for the keyboard shortcut on iOS in cases where a hardware keyboard may be connected to the device.
        const operatingSystem = (0, getOperatingSystem_1.default)();
        const allowedOS = [CONST_1.default.OS.MAC_OS, CONST_1.default.OS.IOS];
        forwardDeletePressedRef.current = key === 'delete' || (allowedOS.includes(operatingSystem ?? '') && event.nativeEvent.ctrlKey && key === 'd');
    };
    (0, react_1.useImperativeHandle)(numberFormRef, () => ({
        clearSelection,
        updateNumber: (newNumber) => {
            setCurrentNumber(newNumber);
            setSelection({ start: newNumber.length, end: newNumber.length });
        },
        getNumber: () => currentNumber,
    }));
    const formattedNumber = (0, MoneyRequestUtils_1.replaceAllDigits)(currentNumber, toLocaleDigit);
    if (displayAsTextInput) {
        return (<TextInput_1.default label={label} accessibilityLabel={label} value={formattedNumber} onChangeText={setFormattedNumber} ref={(newRef) => {
                if (typeof ref === 'function') {
                    ref(newRef);
                }
                else if (ref && 'current' in ref) {
                    // eslint-disable-next-line no-param-reassign
                    ref.current = newRef;
                }
            }} prefixCharacter={symbol} prefixStyle={styles.colorMuted} keyboardType={CONST_1.default.KEYBOARD_TYPE.DECIMAL_PAD} 
        // On android autoCapitalize="words" is necessary when keyboardType="decimal-pad" or inputMode="decimal" to prevent input lag.
        // See https://github.com/Expensify/App/issues/51868 for more information
        autoCapitalize="words" inputMode={CONST_1.default.INPUT_MODE.DECIMAL} errorText={errorText} style={style} autoFocus={props.autoFocus} autoGrowExtraSpace={props.autoGrowExtraSpace} autoGrowMarginSide={props.autoGrowMarginSide}/>);
    }
    const textInputComponent = (<TextInputWithSymbol_1.default formattedAmount={formattedNumber} onChangeAmount={setNewNumber} onSymbolButtonPress={onSymbolButtonPress} placeholder={numberFormat(0)} ref={(newRef) => {
            if (typeof ref === 'function') {
                ref(newRef);
            }
            else if (ref && 'current' in ref) {
                // eslint-disable-next-line no-param-reassign
                ref.current = newRef;
            }
            textInput.current = newRef;
        }} symbol={symbol} hideSymbol={hideSymbol} symbolPosition={symbolPosition} selection={selection} onSelectionChange={(selectionStart, selectionEnd) => {
            if (shouldIgnoreSelectionWhenUpdatedManually_1.default && willSelectionBeUpdatedManually.current) {
                willSelectionBeUpdatedManually.current = false;
                return;
            }
            if (!shouldUpdateSelection) {
                return;
            }
            // When the number is updated in setNewNumber on iOS, in onSelectionChange formattedNumber stores the number before the update. Using numberRef allows us to read the updated number
            const maxSelection = numberRef.current?.length ?? formattedNumber.length;
            numberRef.current = undefined;
            const start = Math.min(selectionStart, maxSelection);
            const end = Math.min(selectionEnd, maxSelection);
            setSelection({ start, end });
        }} onKeyPress={textInputKeyPress} isSymbolPressable={isSymbolPressable} symbolTextStyle={symbolTextStyle} style={style} containerStyle={containerStyle} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} autoFocus={props.autoFocus} autoGrow={autoGrow} disableKeyboard={disableKeyboard} prefixCharacter={prefixCharacter} hideFocusedState={hideFocusedState} shouldApplyPaddingToContainer={shouldApplyPaddingToContainer} shouldUseDefaultLineHeightForPrefix={shouldUseDefaultLineHeightForPrefix} autoGrowExtraSpace={props.autoGrowExtraSpace} autoGrowMarginSide={props.autoGrowMarginSide} contentWidth={props.contentWidth} onPress={props.onPress} onBlur={props.onBlur} submitBehavior={props.submitBehavior} testID={props.testID} prefixStyle={props.prefixStyle} prefixContainerStyle={props.prefixContainerStyle} touchableInputWrapperStyle={props.touchableInputWrapperStyle} onFocus={props.onFocus}/>);
    return (<>
            {shouldWrapInputInContainer ? (<react_native_1.View id={NUMBER_VIEW_ID} onMouseDown={(event) => focusTextInput(event, [NUMBER_VIEW_ID])} style={[styles.moneyRequestAmountContainer, styles.flex1, styles.flexRow, styles.w100, styles.alignItemsCenter, styles.justifyContentCenter]}>
                    {textInputComponent}
                    {!!errorText && (<FormHelpMessage_1.default style={[styles.pAbsolute, styles.b0, shouldShowBigNumberPad ? styles.mb0 : styles.mb3, styles.ph5, styles.w100]} isError message={errorText}/>)}
                </react_native_1.View>) : (textInputComponent)}
            {shouldShowBigNumberPad || !!footer ? (<react_native_1.View onMouseDown={(event) => focusTextInput(event, [NUM_PAD_CONTAINER_VIEW_ID, NUM_PAD_VIEW_ID])} style={[styles.w100, styles.justifyContentEnd, styles.pageWrapper, styles.pt0]} id={NUM_PAD_CONTAINER_VIEW_ID}>
                    {shouldShowBigNumberPad ? (<BigNumberPad_1.default id={NUM_PAD_VIEW_ID} numberPressed={updateValueNumberPad} longPressHandlerStateChanged={updateLongPressHandlerState}/>) : null}
                    {footer}
                </react_native_1.View>) : null}
        </>);
}
NumberWithSymbolForm.displayName = 'NumberWithSymbolForm';
exports.default = NumberWithSymbolForm;
