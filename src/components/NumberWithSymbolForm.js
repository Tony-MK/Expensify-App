"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var react_native_1 = require("react-native");
var useLocalize_1 = require("@hooks/useLocalize");
var useMouseContext_1 = require("@hooks/useMouseContext");
var usePrevious_1 = require("@hooks/usePrevious");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Browser_1 = require("@libs/Browser");
var DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
var getOperatingSystem_1 = require("@libs/getOperatingSystem");
var MoneyRequestUtils_1 = require("@libs/MoneyRequestUtils");
var shouldIgnoreSelectionWhenUpdatedManually_1 = require("@libs/shouldIgnoreSelectionWhenUpdatedManually");
var CONST_1 = require("@src/CONST");
var BigNumberPad_1 = require("./BigNumberPad");
var FormHelpMessage_1 = require("./FormHelpMessage");
var TextInput_1 = require("./TextInput");
var isTextInputFocused_1 = require("./TextInput/BaseTextInput/isTextInputFocused");
var TextInputWithSymbol_1 = require("./TextInputWithSymbol");
var canUseTouchScreen = (0, DeviceCapabilities_1.canUseTouchScreen)();
/**
 * Returns the new selection object based on the updated number's length
 */
var getNewSelection = function (oldSelection, prevLength, newLength) {
    var cursorPosition = oldSelection.end + (newLength - prevLength);
    return { start: cursorPosition, end: cursorPosition };
};
var NUMBER_VIEW_ID = 'numberView';
var NUM_PAD_CONTAINER_VIEW_ID = 'numPadContainerView';
var NUM_PAD_VIEW_ID = 'numPadView';
/**
 * Generic number input form with symbol (currency or unit).
 *
 * Can render either a standard TextInput or a number input with BigNumberPad and symbol interaction.
 * Already handles number decimals and input validation.
 */
function NumberWithSymbolForm(_a) {
    var number = _a.value, _b = _a.symbol, symbol = _b === void 0 ? '' : _b, _c = _a.symbolPosition, symbolPosition = _c === void 0 ? CONST_1.default.TEXT_INPUT_SYMBOL_POSITION.PREFIX : _c, _d = _a.hideSymbol, hideSymbol = _d === void 0 ? false : _d, _e = _a.decimals, decimals = _e === void 0 ? 0 : _e, maxLength = _a.maxLength, errorText = _a.errorText, onInputChange = _a.onInputChange, onSymbolButtonPress = _a.onSymbolButtonPress, _f = _a.isSymbolPressable, isSymbolPressable = _f === void 0 ? true : _f, _g = _a.shouldShowBigNumberPad, shouldShowBigNumberPad = _g === void 0 ? canUseTouchScreen : _g, _h = _a.displayAsTextInput, displayAsTextInput = _h === void 0 ? false : _h, footer = _a.footer, numberFormRef = _a.numberFormRef, label = _a.label, style = _a.style, containerStyle = _a.containerStyle, symbolTextStyle = _a.symbolTextStyle, _j = _a.autoGrow, autoGrow = _j === void 0 ? true : _j, _k = _a.disableKeyboard, disableKeyboard = _k === void 0 ? true : _k, _l = _a.prefixCharacter, prefixCharacter = _l === void 0 ? '' : _l, _m = _a.hideFocusedState, hideFocusedState = _m === void 0 ? true : _m, _o = _a.shouldApplyPaddingToContainer, shouldApplyPaddingToContainer = _o === void 0 ? false : _o, _p = _a.shouldUseDefaultLineHeightForPrefix, shouldUseDefaultLineHeightForPrefix = _p === void 0 ? true : _p, _q = _a.shouldWrapInputInContainer, shouldWrapInputInContainer = _q === void 0 ? true : _q, ref = _a.ref, props = __rest(_a, ["value", "symbol", "symbolPosition", "hideSymbol", "decimals", "maxLength", "errorText", "onInputChange", "onSymbolButtonPress", "isSymbolPressable", "shouldShowBigNumberPad", "displayAsTextInput", "footer", "numberFormRef", "label", "style", "containerStyle", "symbolTextStyle", "autoGrow", "disableKeyboard", "prefixCharacter", "hideFocusedState", "shouldApplyPaddingToContainer", "shouldUseDefaultLineHeightForPrefix", "shouldWrapInputInContainer", "ref"]);
    var styles = (0, useThemeStyles_1.default)();
    var _r = (0, useLocalize_1.default)(), toLocaleDigit = _r.toLocaleDigit, numberFormat = _r.numberFormat;
    var textInput = (0, react_1.useRef)(null);
    var numberRef = (0, react_1.useRef)(undefined);
    var _s = (0, react_1.useState)(typeof number === 'string' ? number : ''), currentNumber = _s[0], setCurrentNumber = _s[1];
    var _t = (0, react_1.useState)(true), shouldUpdateSelection = _t[0], setShouldUpdateSelection = _t[1];
    var isFocused = (0, native_1.useIsFocused)();
    var wasFocused = (0, usePrevious_1.default)(isFocused);
    var _u = (0, react_1.useState)({
        start: currentNumber.length,
        end: currentNumber.length,
    }), selection = _u[0], setSelection = _u[1];
    var forwardDeletePressedRef = (0, react_1.useRef)(false);
    // The ref is used to ignore any onSelectionChange event that happens while we are updating the selection manually in setNewNumber
    var willSelectionBeUpdatedManually = (0, react_1.useRef)(false);
    var _v = (0, useMouseContext_1.useMouseContext)(), setMouseDown = _v.setMouseDown, setMouseUp = _v.setMouseUp;
    var handleMouseDown = function (e) {
        e.stopPropagation();
        setMouseDown();
    };
    var handleMouseUp = function (e) {
        e.stopPropagation();
        setMouseUp();
    };
    var clearSelection = (0, react_1.useCallback)(function () {
        setSelection({ start: selection.end, end: selection.end });
    }, [selection.end]);
    /**
     * Event occurs when a user presses a mouse button over an DOM element.
     */
    var focusTextInput = function (event, ids) {
        var _a, _b;
        var relatedTargetId = (_b = (_a = event.nativeEvent) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.id;
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
    var setNewNumber = (0, react_1.useCallback)(function (newNumber) {
        // Remove spaces from the newNumber number because Safari on iOS adds spaces when pasting a copied number
        // More info: https://github.com/Expensify/App/issues/16974
        var newNumberWithoutSpaces = (0, MoneyRequestUtils_1.stripSpacesFromAmount)(newNumber);
        var finalNumber = newNumberWithoutSpaces.includes('.') ? (0, MoneyRequestUtils_1.stripCommaFromAmount)(newNumberWithoutSpaces) : (0, MoneyRequestUtils_1.replaceCommasWithPeriod)(newNumberWithoutSpaces);
        // Use a shallow copy of selection to trigger setSelection
        // More info: https://github.com/Expensify/App/issues/16385
        if (!(0, MoneyRequestUtils_1.validateAmount)(finalNumber, decimals, maxLength)) {
            setSelection(function (prevSelection) { return (__assign({}, prevSelection)); });
            return;
        }
        willSelectionBeUpdatedManually.current = true;
        var hasSelectionBeenSet = false;
        var strippedNumber = (0, MoneyRequestUtils_1.stripCommaFromAmount)(finalNumber);
        numberRef.current = strippedNumber;
        setCurrentNumber(function (prevNumber) {
            var isForwardDelete = prevNumber.length > strippedNumber.length && forwardDeletePressedRef.current;
            if (!hasSelectionBeenSet) {
                hasSelectionBeenSet = true;
                setSelection(function (prevSelection) { return getNewSelection(prevSelection, isForwardDelete ? strippedNumber.length : prevNumber.length, strippedNumber.length); });
                willSelectionBeUpdatedManually.current = false;
            }
            return strippedNumber;
        });
        onInputChange === null || onInputChange === void 0 ? void 0 : onInputChange(strippedNumber);
    }, [decimals, maxLength, onInputChange]);
    /**
     * Set a new number number properly formatted, used for the TextInput
     * @param text - Changed text from user input
     */
    var setFormattedNumber = function (text) {
        // Remove spaces from the new number because Safari on iOS adds spaces when pasting a copied number
        // More info: https://github.com/Expensify/App/issues/16974
        var newNumberWithoutSpaces = (0, MoneyRequestUtils_1.stripSpacesFromAmount)(text);
        var replacedCommasNumber = (0, MoneyRequestUtils_1.replaceCommasWithPeriod)(newNumberWithoutSpaces);
        var withLeadingZero = (0, MoneyRequestUtils_1.addLeadingZero)(replacedCommasNumber);
        if (!(0, MoneyRequestUtils_1.validateAmount)(withLeadingZero, decimals, maxLength)) {
            setSelection(function (prevSelection) { return (__assign({}, prevSelection)); });
            return;
        }
        var strippedNumber = (0, MoneyRequestUtils_1.stripCommaFromAmount)(withLeadingZero);
        var isForwardDelete = currentNumber.length > strippedNumber.length && forwardDeletePressedRef.current;
        setCurrentNumber(strippedNumber);
        setSelection(getNewSelection(selection, isForwardDelete ? strippedNumber.length : currentNumber.length, strippedNumber.length));
        onInputChange === null || onInputChange === void 0 ? void 0 : onInputChange(strippedNumber);
    };
    // Clears text selection if user visits symbol (currency) selector and comes back
    (0, react_1.useEffect)(function () {
        if (!isFocused || wasFocused) {
            return;
        }
        clearSelection();
    }, [isFocused, wasFocused, clearSelection]);
    // Modifies the number to match changed decimals.
    (0, react_1.useEffect)(function () {
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
    var updateValueNumberPad = (0, react_1.useCallback)(function (key) {
        var _a;
        if (shouldUpdateSelection && !(0, isTextInputFocused_1.default)(textInput)) {
            (_a = textInput.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
        // Backspace button is pressed
        if (key === '<' || key === 'Backspace') {
            if (currentNumber.length > 0) {
                var selectionStart = selection.start === selection.end ? selection.start - 1 : selection.start;
                var newNumber_1 = "".concat(currentNumber.substring(0, selectionStart)).concat(currentNumber.substring(selection.end));
                setNewNumber((0, MoneyRequestUtils_1.addLeadingZero)(newNumber_1));
            }
            return;
        }
        var newNumber = (0, MoneyRequestUtils_1.addLeadingZero)("".concat(currentNumber.substring(0, selection.start)).concat(key).concat(currentNumber.substring(selection.end)));
        setNewNumber(newNumber);
    }, [currentNumber, selection, shouldUpdateSelection, setNewNumber]);
    /**
     * Update long press number, to remove items pressing on <
     *
     * @param value - Changed text from user input
     */
    var updateLongPressHandlerState = (0, react_1.useCallback)(function (value) {
        var _a;
        setShouldUpdateSelection(!value);
        if (!value && !(0, isTextInputFocused_1.default)(textInput)) {
            (_a = textInput.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }, []);
    /**
     * Input handler to check for a forward-delete key (or keyboard shortcut) press.
     */
    var textInputKeyPress = function (event) {
        var key = event.nativeEvent.key.toLowerCase();
        if ((0, Browser_1.isMobileSafari)() && key === CONST_1.default.PLATFORM_SPECIFIC_KEYS.CTRL.DEFAULT) {
            // Optimistically anticipate forward-delete on iOS Safari (in cases where the Mac Accessibility keyboard is being
            // used for input). If the Control-D shortcut doesn't get sent, the ref will still be reset on the next key press.
            forwardDeletePressedRef.current = true;
            return;
        }
        // Control-D on Mac is a keyboard shortcut for forward-delete. See https://support.apple.com/en-us/HT201236 for Mac keyboard shortcuts.
        // Also check for the keyboard shortcut on iOS in cases where a hardware keyboard may be connected to the device.
        var operatingSystem = (0, getOperatingSystem_1.default)();
        var allowedOS = [CONST_1.default.OS.MAC_OS, CONST_1.default.OS.IOS];
        forwardDeletePressedRef.current = key === 'delete' || (allowedOS.includes(operatingSystem !== null && operatingSystem !== void 0 ? operatingSystem : '') && event.nativeEvent.ctrlKey && key === 'd');
    };
    (0, react_1.useImperativeHandle)(numberFormRef, function () { return ({
        clearSelection: clearSelection,
        updateNumber: function (newNumber) {
            setCurrentNumber(newNumber);
            setSelection({ start: newNumber.length, end: newNumber.length });
        },
        getNumber: function () { return currentNumber; },
    }); });
    var formattedNumber = (0, MoneyRequestUtils_1.replaceAllDigits)(currentNumber, toLocaleDigit);
    if (displayAsTextInput) {
        return (<TextInput_1.default label={label} accessibilityLabel={label} value={formattedNumber} onChangeText={setFormattedNumber} ref={function (newRef) {
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
    var textInputComponent = (<TextInputWithSymbol_1.default formattedAmount={formattedNumber} onChangeAmount={setNewNumber} onSymbolButtonPress={onSymbolButtonPress} placeholder={numberFormat(0)} ref={function (newRef) {
            if (typeof ref === 'function') {
                ref(newRef);
            }
            else if (ref && 'current' in ref) {
                // eslint-disable-next-line no-param-reassign
                ref.current = newRef;
            }
            textInput.current = newRef;
        }} symbol={symbol} hideSymbol={hideSymbol} symbolPosition={symbolPosition} selection={selection} onSelectionChange={function (selectionStart, selectionEnd) {
            var _a, _b;
            if (shouldIgnoreSelectionWhenUpdatedManually_1.default && willSelectionBeUpdatedManually.current) {
                willSelectionBeUpdatedManually.current = false;
                return;
            }
            if (!shouldUpdateSelection) {
                return;
            }
            // When the number is updated in setNewNumber on iOS, in onSelectionChange formattedNumber stores the number before the update. Using numberRef allows us to read the updated number
            var maxSelection = (_b = (_a = numberRef.current) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : formattedNumber.length;
            numberRef.current = undefined;
            var start = Math.min(selectionStart, maxSelection);
            var end = Math.min(selectionEnd, maxSelection);
            setSelection({ start: start, end: end });
        }} onKeyPress={textInputKeyPress} isSymbolPressable={isSymbolPressable} symbolTextStyle={symbolTextStyle} style={style} containerStyle={containerStyle} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} autoFocus={props.autoFocus} autoGrow={autoGrow} disableKeyboard={disableKeyboard} prefixCharacter={prefixCharacter} hideFocusedState={hideFocusedState} shouldApplyPaddingToContainer={shouldApplyPaddingToContainer} shouldUseDefaultLineHeightForPrefix={shouldUseDefaultLineHeightForPrefix} autoGrowExtraSpace={props.autoGrowExtraSpace} autoGrowMarginSide={props.autoGrowMarginSide} contentWidth={props.contentWidth} onPress={props.onPress} onBlur={props.onBlur} submitBehavior={props.submitBehavior} testID={props.testID} prefixStyle={props.prefixStyle} prefixContainerStyle={props.prefixContainerStyle} touchableInputWrapperStyle={props.touchableInputWrapperStyle} onFocus={props.onFocus}/>);
    return (<>
            {shouldWrapInputInContainer ? (<react_native_1.View id={NUMBER_VIEW_ID} onMouseDown={function (event) { return focusTextInput(event, [NUMBER_VIEW_ID]); }} style={[styles.moneyRequestAmountContainer, styles.flex1, styles.flexRow, styles.w100, styles.alignItemsCenter, styles.justifyContentCenter]}>
                    {textInputComponent}
                    {!!errorText && (<FormHelpMessage_1.default style={[styles.pAbsolute, styles.b0, shouldShowBigNumberPad ? styles.mb0 : styles.mb3, styles.ph5, styles.w100]} isError message={errorText}/>)}
                </react_native_1.View>) : (textInputComponent)}
            {shouldShowBigNumberPad || !!footer ? (<react_native_1.View onMouseDown={function (event) { return focusTextInput(event, [NUM_PAD_CONTAINER_VIEW_ID, NUM_PAD_VIEW_ID]); }} style={[styles.w100, styles.justifyContentEnd, styles.pageWrapper, styles.pt0]} id={NUM_PAD_CONTAINER_VIEW_ID}>
                    {shouldShowBigNumberPad ? (<BigNumberPad_1.default id={NUM_PAD_VIEW_ID} numberPressed={updateValueNumberPad} longPressHandlerStateChanged={updateLongPressHandlerState}/>) : null}
                    {footer}
                </react_native_1.View>) : null}
        </>);
}
NumberWithSymbolForm.displayName = 'NumberWithSymbolForm';
exports.default = NumberWithSymbolForm;
