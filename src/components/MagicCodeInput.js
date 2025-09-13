"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = require("react-native-reanimated");
const useNetwork_1 = require("@hooks/useNetwork");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Browser_1 = require("@libs/Browser");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const FormHelpMessage_1 = require("./FormHelpMessage");
const Text_1 = require("./Text");
const TextInput_1 = require("./TextInput");
const TEXT_INPUT_EMPTY_STATE = '';
/**
 * Trims whitespace from pasted magic codes
 */
const useMagicCodePaste = (inputRef, onChangeText) => {
    (0, react_1.useEffect)(() => {
        if (typeof document === 'undefined') {
            return;
        }
        const handlePaste = (event) => {
            if (!inputRef.current) {
                return;
            }
            const isFocused = inputRef.current?.isFocused?.() ?? false;
            if (!isFocused) {
                return;
            }
            event.preventDefault();
            const plainText = event.clipboardData?.getData('text/plain');
            if (plainText) {
                const trimmedText = plainText.trim();
                if (trimmedText && (0, ValidationUtils_1.isNumeric)(trimmedText)) {
                    onChangeText(trimmedText);
                }
            }
        };
        document.addEventListener('paste', handlePaste, true);
        return () => {
            document.removeEventListener('paste', handlePaste, true);
        };
    }, [inputRef, onChangeText]);
};
/**
 * Converts a given string into an array of numbers that must have the same
 * number of elements as the number of inputs.
 */
const decomposeString = (value, length) => {
    let arr = value
        .split('')
        .slice(0, length)
        .map((v) => ((0, ValidationUtils_1.isNumeric)(v) ? v : CONST_1.default.MAGIC_CODE_EMPTY_CHAR));
    if (arr.length < length) {
        arr = arr.concat(Array(length - arr.length).fill(CONST_1.default.MAGIC_CODE_EMPTY_CHAR));
    }
    return arr;
};
/**
 * Converts an array of strings into a single string. If there are undefined or
 * empty values, it will replace them with a space.
 */
const composeToString = (value) => value.map((v) => v ?? CONST_1.default.MAGIC_CODE_EMPTY_CHAR).join('');
const getInputPlaceholderSlots = (length) => Array.from(Array(length).keys());
function MagicCodeInput({ value = '', name = '', autoFocus = true, errorText = '', shouldSubmitOnComplete = true, onChangeText: onChangeTextProp = () => { }, onFocus: onFocusProps, maxLength = CONST_1.default.MAGIC_CODE_LENGTH, onFulfill = () => { }, isDisableKeyboard = false, lastPressedDigit = '', autoComplete, hasError = false, testID = '', }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const inputRef = (0, react_1.useRef)(null);
    const [input, setInput] = (0, react_1.useState)(TEXT_INPUT_EMPTY_STATE);
    const [focusedIndex, setFocusedIndex] = (0, react_1.useState)(autoFocus ? 0 : undefined);
    const editIndex = (0, react_1.useRef)(0);
    const [wasSubmitted, setWasSubmitted] = (0, react_1.useState)(false);
    const shouldFocusLast = (0, react_1.useRef)(false);
    const inputWidth = (0, react_1.useRef)(0);
    const lastFocusedIndex = (0, react_1.useRef)(0);
    const lastValue = (0, react_1.useRef)(TEXT_INPUT_EMPTY_STATE);
    const valueRef = (0, react_1.useRef)(value);
    useMagicCodePaste(inputRef, onChangeTextProp);
    (0, react_1.useEffect)(() => {
        lastValue.current = input.length;
    }, [input]);
    (0, react_1.useEffect)(() => {
        // Note: there are circumstances where the value state isn't updated yet
        // when e.g. onChangeText gets called the next time. In those cases its safer to access the value from a ref
        // to not have outdated values.
        valueRef.current = value;
    }, [value]);
    (0, react_1.useEffect)(() => {
        // Reset wasSubmitted when code becomes incomplete to allow retry attempts and fix issue where wasSubmitted didn't update on Android
        if (value.length >= maxLength) {
            return;
        }
        setWasSubmitted(false);
    }, [value, maxLength]);
    const blurMagicCodeInput = () => {
        inputRef.current?.blur();
        setFocusedIndex(undefined);
    };
    const focusMagicCodeInput = () => {
        setFocusedIndex(0);
        lastFocusedIndex.current = 0;
        editIndex.current = 0;
        inputRef.current?.focus();
    };
    const setInputAndIndex = (index) => {
        setInput(TEXT_INPUT_EMPTY_STATE);
        setFocusedIndex(index);
        editIndex.current = index;
    };
    (0, react_1.useImperativeHandle)(ref, () => ({
        focus() {
            focusMagicCodeInput();
        },
        focusLastSelected() {
            inputRef.current?.focus();
            setFocusedIndex(lastFocusedIndex.current);
        },
        resetFocus() {
            setInput(TEXT_INPUT_EMPTY_STATE);
            focusMagicCodeInput();
        },
        clear() {
            lastFocusedIndex.current = 0;
            setInputAndIndex(0);
            inputRef.current?.focus();
            onChangeTextProp('');
        },
        blur() {
            blurMagicCodeInput();
        },
    }));
    const validateAndSubmit = () => {
        const numbers = decomposeString(value, maxLength);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (wasSubmitted || !shouldSubmitOnComplete || numbers.filter((n) => (0, ValidationUtils_1.isNumeric)(n)).length !== maxLength || isOffline) {
            return;
        }
        if (!wasSubmitted) {
            setWasSubmitted(true);
        }
        // Blurs the input and removes focus from the last input and, if it should submit
        // on complete, it will call the onFulfill callback.
        blurMagicCodeInput();
        onFulfill(value);
        lastValue.current = '';
    };
    const { isOffline } = (0, useNetwork_1.default)({ onReconnect: validateAndSubmit });
    (0, react_1.useEffect)(() => {
        validateAndSubmit();
        // We have not added:
        // + the editIndex as the dependency because we don't want to run this logic after focusing on an input to edit it after the user has completed the code.
        // + the onFulfill as the dependency because onFulfill is changed when the preferred locale changed => avoid auto submit form when preferred locale changed.
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [value, shouldSubmitOnComplete]);
    /**
     * Focuses on the input when it is pressed.
     */
    const onFocus = (event) => {
        if (shouldFocusLast.current) {
            lastValue.current = TEXT_INPUT_EMPTY_STATE;
            setInputAndIndex(lastFocusedIndex.current);
        }
        onFocusProps?.();
        event.preventDefault();
    };
    /**
     * Tap gesture configuration, updates the indexes of the
     * currently focused input.
     */
    const tapGesture = react_native_gesture_handler_1.Gesture.Tap()
        .runOnJS(true)
        // eslint-disable-next-line react-compiler/react-compiler
        .onBegin((event) => {
        const index = Math.floor(event.x / (inputWidth.current / maxLength));
        shouldFocusLast.current = false;
        // TapGestureHandler works differently on mobile web and native app
        // On web gesture handler doesn't block interactions with textInput below so there is no need to run `focus()` manually
        if (!(0, Browser_1.isMobileChrome)() && !(0, Browser_1.isMobileSafari)()) {
            inputRef.current?.focus();
        }
        setInputAndIndex(index);
        lastFocusedIndex.current = index;
    });
    /**
     * Updates the magic inputs with the contents written in the
     * input. It spreads each number into each input and updates
     * the focused input on the next empty one, if exists.
     * It handles both fast typing and only one digit at a time
     * in a specific position.
     *
     * Note: this works under the assumption that the backing text input will always have a cleared text,
     * and entering text will exactly call onChangeText with one new character/digit.
     * When the OS is inserting one time passwords for example it will call this method successively with one more digit each time.
     * Thus, this method relies on an internal value ref to make sure to always use the latest value (as state updates are async, and
     * might happen later than the next call to onChangeText).
     */
    const onChangeText = (textValue) => {
        if (!textValue?.length || !(0, ValidationUtils_1.isNumeric)(textValue)) {
            return;
        }
        // Checks if one new character was added, or if the content was replaced
        const hasToSlice = typeof lastValue.current === 'string' && textValue.length - 1 === lastValue.current.length && textValue.slice(0, textValue.length - 1) === lastValue.current;
        // Gets the new textValue added by the user
        const addedValue = hasToSlice && typeof lastValue.current === 'string' ? textValue.slice(lastValue.current.length, textValue.length) : textValue;
        lastValue.current = textValue;
        // Updates the focused input taking into consideration the last input
        // edited and the number of digits added by the user.
        const numbersArr = addedValue
            .trim()
            .split('')
            .slice(0, maxLength - editIndex.current);
        const updatedFocusedIndex = Math.min(editIndex.current + (numbersArr.length - 1) + 1, maxLength - 1);
        let numbers = decomposeString(valueRef.current, maxLength);
        numbers = [...numbers.slice(0, editIndex.current), ...numbersArr, ...numbers.slice(numbersArr.length + editIndex.current, maxLength)];
        setInputAndIndex(updatedFocusedIndex);
        const finalInput = composeToString(numbers);
        onChangeTextProp(finalInput);
        valueRef.current = finalInput;
    };
    /**
     * Handles logic related to certain key presses.
     *
     * NOTE: when using Android Emulator, this can only be tested using
     * hardware keyboard inputs.
     */
    const onKeyPress = (event) => {
        const keyValue = event?.nativeEvent?.key;
        if (keyValue === 'Backspace' || keyValue === '<') {
            let numbers = decomposeString(value, maxLength);
            // If keyboard is disabled and no input is focused we need to remove
            // the last entered digit and focus on the correct input
            if (isDisableKeyboard && focusedIndex === undefined) {
                const curEditIndex = editIndex.current;
                const indexBeforeLastEditIndex = curEditIndex === 0 ? curEditIndex : curEditIndex - 1;
                const indexToFocus = numbers.at(curEditIndex) === CONST_1.default.MAGIC_CODE_EMPTY_CHAR ? indexBeforeLastEditIndex : curEditIndex;
                if (indexToFocus !== undefined) {
                    lastFocusedIndex.current = indexToFocus;
                    inputRef.current?.focus();
                }
                onChangeTextProp(value.substring(0, indexToFocus));
                return;
            }
            // If the currently focused index already has a value, it will delete
            // that value but maintain the focus on the same input.
            if (focusedIndex !== undefined && numbers?.at(focusedIndex) !== CONST_1.default.MAGIC_CODE_EMPTY_CHAR) {
                setInput(TEXT_INPUT_EMPTY_STATE);
                numbers = [...numbers.slice(0, focusedIndex), CONST_1.default.MAGIC_CODE_EMPTY_CHAR, ...numbers.slice(focusedIndex + 1, maxLength)];
                editIndex.current = focusedIndex;
                onChangeTextProp(composeToString(numbers));
                return;
            }
            const hasInputs = numbers.filter((n) => (0, ValidationUtils_1.isNumeric)(n)).length !== 0;
            // Fill the array with empty characters if there are no inputs.
            if (focusedIndex === 0 && !hasInputs) {
                numbers = Array(maxLength).fill(CONST_1.default.MAGIC_CODE_EMPTY_CHAR);
                // Deletes the value of the previous input and focuses on it.
            }
            else if (focusedIndex && focusedIndex !== 0) {
                numbers = [...numbers.slice(0, Math.max(0, focusedIndex - 1)), CONST_1.default.MAGIC_CODE_EMPTY_CHAR, ...numbers.slice(focusedIndex, maxLength)];
            }
            const newFocusedIndex = Math.max(0, (focusedIndex ?? 0) - 1);
            // Saves the input string so that it can compare to the change text
            // event that will be triggered, this is a workaround for mobile that
            // triggers the change text on the event after the key press.
            setInputAndIndex(newFocusedIndex);
            onChangeTextProp(composeToString(numbers));
            if (newFocusedIndex !== undefined) {
                lastFocusedIndex.current = newFocusedIndex;
                inputRef.current?.focus();
            }
        }
        if (keyValue === 'ArrowLeft' && focusedIndex !== undefined) {
            const newFocusedIndex = Math.max(0, focusedIndex - 1);
            setInputAndIndex(newFocusedIndex);
            inputRef.current?.focus();
        }
        else if (keyValue === 'ArrowRight' && focusedIndex !== undefined) {
            const newFocusedIndex = Math.min(focusedIndex + 1, maxLength - 1);
            setInputAndIndex(newFocusedIndex);
            inputRef.current?.focus();
        }
        else if (keyValue === 'Enter') {
            // We should prevent users from submitting when it's offline.
            if (isOffline) {
                return;
            }
            setInput(TEXT_INPUT_EMPTY_STATE);
            onFulfill(value);
        }
        else if (keyValue === 'Tab' && focusedIndex !== undefined) {
            const newFocusedIndex = event.shiftKey ? focusedIndex - 1 : focusedIndex + 1;
            if (newFocusedIndex >= 0 && newFocusedIndex < maxLength) {
                setInputAndIndex(newFocusedIndex);
                inputRef.current?.focus();
                if (event?.preventDefault) {
                    event.preventDefault();
                }
            }
        }
    };
    /**
     *  If isDisableKeyboard is true we will have to call onKeyPress and onChangeText manually
     *  as the press on digit pad will not trigger native events. We take lastPressedDigit from props
     *  as it stores the last pressed digit pressed on digit pad. We take only the first character
     *  as anything after that is added to differentiate between two same digits passed in a row.
     */
    (0, react_1.useEffect)(() => {
        if (!isDisableKeyboard) {
            return;
        }
        const textValue = lastPressedDigit.charAt(0);
        onKeyPress({ nativeEvent: { key: textValue } });
        onChangeText(textValue);
        // We have not added:
        // + the onChangeText and onKeyPress as the dependencies because we only want to run this when lastPressedDigit changes.
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [lastPressedDigit, isDisableKeyboard]);
    const cursorOpacity = (0, react_native_reanimated_1.useSharedValue)(1);
    (0, react_1.useEffect)(() => {
        cursorOpacity.set((0, react_native_reanimated_1.withRepeat)((0, react_native_reanimated_1.withSequence)((0, react_native_reanimated_1.withDelay)(500, (0, react_native_reanimated_1.withTiming)(0, { duration: 0 })), (0, react_native_reanimated_1.withDelay)(500, (0, react_native_reanimated_1.withTiming)(1, { duration: 0 }))), -1, false));
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    const animatedCursorStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        opacity: cursorOpacity.get(),
    }));
    return (<>
            <react_native_1.View style={[styles.magicCodeInputContainer]} fsClass={CONST_1.default.FULLSTORY.CLASS.MASK}>
                <react_native_gesture_handler_1.GestureDetector gesture={tapGesture}>
                    {/* Android does not handle touch on invisible Views so I created a wrapper around invisible TextInput just to handle taps */}
                    <react_native_1.View style={[react_native_1.StyleSheet.absoluteFillObject, styles.w100, styles.h100, styles.invisibleOverlay]} collapsable={false}>
                        <TextInput_1.default disableKeyboard={isDisableKeyboard} onLayout={(e) => {
            inputWidth.current = e.nativeEvent.layout.width;
        }} ref={(newRef) => {
            inputRef.current = newRef;
        }} autoFocus={autoFocus} inputMode="numeric" textContentType="oneTimeCode" name={name} maxLength={maxLength} value={input} hideFocusedState autoComplete={input.length === 0 ? autoComplete : undefined} keyboardType={CONST_1.default.KEYBOARD_TYPE.NUMBER_PAD} onChangeText={onChangeText} onKeyPress={onKeyPress} onFocus={onFocus} onBlur={() => {
            shouldFocusLast.current = true;
            lastFocusedIndex.current = focusedIndex ?? 0;
            setFocusedIndex(undefined);
        }} selectionColor="transparent" inputStyle={[styles.inputTransparent]} role={CONST_1.default.ROLE.PRESENTATION} style={[styles.inputTransparent]} textInputContainerStyles={[styles.borderTransparent, styles.bgTransparent]} testID={testID}/>
                    </react_native_1.View>
                </react_native_gesture_handler_1.GestureDetector>
                {getInputPlaceholderSlots(maxLength).map((index) => {
            const char = decomposeString(value, maxLength).at(index)?.trim() ?? '';
            const cursorMargin = char ? { marginLeft: 2 } : {};
            const isFocused = focusedIndex === index;
            return (<react_native_1.View key={index} style={maxLength === CONST_1.default.MAGIC_CODE_LENGTH ? [styles.w15] : [styles.flex1, index !== 0 && styles.ml3]}>
                            <react_native_1.View style={[
                    styles.textInputContainer,
                    StyleUtils.getHeightOfMagicCodeInput(),
                    hasError || errorText ? styles.borderColorDanger : {},
                    focusedIndex === index ? styles.borderColorFocus : {},
                    styles.pt0,
                    { position: 'relative' },
                ]}>
                                <react_native_1.View style={styles.magicCodeInputValueContainer}>
                                    <Text_1.default style={[styles.magicCodeInput, styles.textAlignCenter]}>{char}</Text_1.default>
                                    {isFocused && !isDisableKeyboard && (<react_native_1.View style={[styles.magicCodeInputCursorContainer]}>
                                            {!!char && <Text_1.default style={[styles.magicCodeInput, styles.textAlignCenter, styles.opacity0]}>{char}</Text_1.default>}
                                            <Text_1.default style={[styles.magicCodeInput, { width: 1 }]}> </Text_1.default>
                                            <react_native_reanimated_1.default.Text style={[styles.magicCodeInputCursor, animatedCursorStyle, cursorMargin]}>│</react_native_reanimated_1.default.Text>
                                        </react_native_1.View>)}
                                </react_native_1.View>
                            </react_native_1.View>
                        </react_native_1.View>);
        })}
            </react_native_1.View>
            {!!errorText && (<FormHelpMessage_1.default isError message={errorText}/>)}
        </>);
}
MagicCodeInput.displayName = 'MagicCodeInput';
exports.default = (0, react_1.forwardRef)(MagicCodeInput);
