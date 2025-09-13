"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AmountTextInput_1 = require("@components/AmountTextInput");
const BigNumberPad_1 = require("@components/BigNumberPad");
const Button_1 = require("@components/Button");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const Text_1 = require("@components/Text");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useKeyboardShortcut_1 = require("@hooks/useKeyboardShortcut");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DateUtils_1 = require("@libs/DateUtils");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const CONST_1 = require("@src/CONST");
const setCursorPosition_1 = require("./setCursorPosition");
const AMOUNT_VIEW_ID = 'amountView';
const NUM_PAD_CONTAINER_VIEW_ID = 'numPadContainerView';
const NUM_PAD_VIEW_ID = 'numPadView';
/**
 * Replace the sub-string of the given string with the provided value
 * @param originalString - the string that will be modified
 * @param newSubstring - the replacement string
 * @param from - the start index of the sub-string to replace
 * @param to - the end index of the sub-string to replace
 *
 * @returns - the modified string with the range (from, to) replaced with the provided value
 */
function insertAtPosition(originalString, newSubstring, from, to) {
    // Check for invalid positions
    if (from < 0 || to < 0 || from > originalString.length || to > originalString.length) {
        return originalString;
    }
    /*
     If the positions are the same, it means we're inserting at a point.
     If the insertion point is at the end, simply return the original string.
    */
    if (from === to && from === originalString.length) {
        return originalString;
    }
    // Replace the selected range
    return originalString.slice(0, from) + newSubstring + originalString.slice(to);
}
/**
 * Replace the sub-string of the given string with zeros
 * @param originalString - the string that will be modified
 * @param from - the start index of the sub-string to replace
 * @param to - the end index of the sub-string to replace
 *
 * @returns - the modified string with the range (from, to) replaced with zeros
 */
function replaceRangeWithZeros(originalString, from, to, numOfDigits = 2) {
    const normalizedFrom = Math.max(from, 0);
    const normalizedTo = Math.min(to, numOfDigits);
    const replacement = '0'.repeat(normalizedTo - normalizedFrom);
    return `${originalString.slice(0, normalizedFrom)}${replacement}${originalString.slice(normalizedTo)}`;
}
/**
 * Clear the value under selection of an input (either hours, minutes, seconds or milliseconds) by replacing it with zeros
 *
 * @param value - current value of the input
 * @param selection - current selection of the input
 * @param setValue - the function that modifies the value of the input
 * @param setSelection - the function that modifies the selection of the input
 */
function clearSelectedValue(value, selection, setValue, setSelection, numOfDigits) {
    let newValue;
    let newCursorPosition;
    if (selection.start !== selection.end) {
        newValue = replaceRangeWithZeros(value, selection.start, selection.end, numOfDigits);
        newCursorPosition = selection.start;
    }
    else {
        const positionBeforeSelection = Math.max(selection.start - 1, 0);
        newValue = replaceRangeWithZeros(value, positionBeforeSelection, selection.start, numOfDigits);
        newCursorPosition = positionBeforeSelection;
    }
    setValue(newValue);
    setSelection({ start: newCursorPosition, end: newCursorPosition });
}
function TimePicker({ defaultValue = '', onSubmit, onInputChange = () => { }, shouldValidate = true, shouldValidateFutureTime = true, showFullFormat = false }, ref) {
    const { numberFormat, translate } = (0, useLocalize_1.default)();
    const { isExtraSmallScreenHeight } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const value = DateUtils_1.default.extractTime12Hour(defaultValue, showFullFormat);
    const canUseTouchScreen = (0, DeviceCapabilities_1.canUseTouchScreen)();
    const [isError, setError] = (0, react_1.useState)(false);
    const [errorMessage, setErrorMessage] = (0, react_1.useState)('');
    const [selectionHour, setSelectionHour] = (0, react_1.useState)({ start: 0, end: 0 });
    const [selectionMinute, setSelectionMinute] = (0, react_1.useState)(showFullFormat ? { start: 0, end: 0 } : { start: 2, end: 2 }); // we focus it by default so need  to have selection on the end
    const [selectionSecond, setSelectionSecond] = (0, react_1.useState)({ start: 0, end: 0 });
    const [selectionMillisecond, setSelectionMillisecond] = (0, react_1.useState)(showFullFormat ? { start: 6, end: 6 } : { start: 0, end: 0 });
    const [hours, setHours] = (0, react_1.useState)(() => DateUtils_1.default.get12HourTimeObjectFromDate(value, showFullFormat).hour);
    const [minutes, setMinutes] = (0, react_1.useState)(() => DateUtils_1.default.get12HourTimeObjectFromDate(value, showFullFormat).minute);
    const [seconds, setSeconds] = (0, react_1.useState)(() => DateUtils_1.default.get12HourTimeObjectFromDate(value, showFullFormat).seconds);
    const [milliseconds, setMilliseconds] = (0, react_1.useState)(() => DateUtils_1.default.get12HourTimeObjectFromDate(value, showFullFormat).milliseconds);
    const [amPmValue, setAmPmValue] = (0, react_1.useState)(() => DateUtils_1.default.get12HourTimeObjectFromDate(value, showFullFormat).period);
    const lastPressedKey = (0, react_1.useRef)('');
    const hourInputRef = (0, react_1.useRef)(null);
    const minuteInputRef = (0, react_1.useRef)(null);
    const secondInputRef = (0, react_1.useRef)(null);
    const millisecondInputRef = (0, react_1.useRef)(null);
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const focusMillisecondInputOnFirstCharacter = (0, react_1.useCallback)(() => (0, setCursorPosition_1.default)(0, millisecondInputRef, setSelectionMillisecond), []);
    const focusSecondInputOnLastCharacter = (0, react_1.useCallback)(() => (0, setCursorPosition_1.default)(2, secondInputRef, setSelectionSecond), []);
    const focusSecondInputOnFirstCharacter = (0, react_1.useCallback)(() => (0, setCursorPosition_1.default)(0, secondInputRef, setSelectionSecond), []);
    const focusMinuteInputOnLastCharacter = (0, react_1.useCallback)(() => (0, setCursorPosition_1.default)(2, minuteInputRef, setSelectionMinute), []);
    const focusMinuteInputOnFirstCharacter = (0, react_1.useCallback)(() => (0, setCursorPosition_1.default)(0, minuteInputRef, setSelectionMinute), []);
    const focusHourInputOnLastCharacter = (0, react_1.useCallback)(() => (0, setCursorPosition_1.default)(2, hourInputRef, setSelectionHour), []);
    const validate = (0, react_1.useCallback)((time) => {
        if (!shouldValidate) {
            return true;
        }
        const timeString = time || `${hours}:${minutes} ${amPmValue}`;
        const [hourStr] = timeString.split(/[:\s]+/);
        const hour = parseInt(hourStr, 10);
        if (hour === 0) {
            setError(true);
            setErrorMessage(translate('common.error.invalidTimeRange'));
            return false;
        }
        if (!shouldValidateFutureTime) {
            return true;
        }
        const isValid = DateUtils_1.default.isTimeAtLeastOneMinuteInFuture({ timeString, dateTimeString: defaultValue });
        setError(!isValid);
        setErrorMessage(translate('common.error.invalidTimeShouldBeFuture'));
        return isValid;
    }, [shouldValidate, hours, minutes, amPmValue, shouldValidateFutureTime, defaultValue, translate]);
    const resetHours = () => {
        setHours('00');
        setSelectionHour({ start: 0, end: 0 });
    };
    const resetMinutes = () => {
        setMinutes('00');
        setSelectionMinute({ start: 0, end: 0 });
    };
    const resetSeconds = () => {
        setSeconds('00');
        setSelectionSecond({ start: 0, end: 0 });
    };
    const resetMilliseconds = () => {
        setMinutes('000');
        setSelectionMillisecond({ start: 0, end: 0 });
    };
    // This function receive value from hour input and validate it
    // The valid format is HH(from 00 to 12). If the user input 9, it will be 09. If user try to change 09 to 19 it would skip the first character
    const handleHourChange = (text) => {
        // Replace spaces with 0 to implement the following digit removal by pressing space
        const trimmedText = text.replace(/ /g, '0');
        if (!trimmedText) {
            resetHours();
            return;
        }
        const isOnlyNumericValue = /^\d+$/.test(trimmedText);
        if (!isOnlyNumericValue) {
            return;
        }
        let newHour;
        let newSelection;
        if (selectionHour.start === 0 && selectionHour.end === 0) {
            // The cursor is at the start of hours
            const firstDigit = trimmedText[0];
            const secondDigit = trimmedText[2] || '0';
            if (trimmedText.length === 1) {
                // To support the forward-removal using Delete key
                newHour = `0${firstDigit}`;
                newSelection = 1;
            }
            else if (Number(firstDigit) <= 1) {
                /*
                 The first entered digit is 0 or 1.
                 If the first digit is 0, we can safely append the second digit.
                 If the first digit is 1, we must check the second digit to ensure it is not greater than 2, amd replace it with 0 otherwise.
                */
                newHour = `${firstDigit}${firstDigit === '1' && Number(secondDigit) > 2 ? 0 : secondDigit}`;
                newSelection = 1;
            }
            else {
                // The first entered digit is 2-9. We should replace the whole value by prepending 0 to the entered digit.
                newHour = `0${firstDigit}`;
                newSelection = 2;
            }
        }
        else if (selectionHour.start === 1 && selectionHour.end === 1) {
            // The cursor is in-between the digits
            if (trimmedText.length === 1 && lastPressedKey.current === 'Backspace') {
                // We have removed the first digit. Replace it with 0 and move the cursor to the start.
                newHour = `0${trimmedText}`;
                newSelection = 0;
            }
            else {
                newHour = `${trimmedText[0]}${trimmedText[1] || 0}`;
                newSelection = 2;
            }
        }
        else if (selectionHour.start === 0 && selectionHour.end === 1) {
            // There is an active selection of the first digit
            newHour = trimmedText.substring(0, 2).padStart(2, '0');
            newSelection = trimmedText.length === 1 ? 0 : 1;
        }
        else if (selectionHour.start === 1 && selectionHour.end === 2) {
            // There is an active selection of the second digit
            newHour = trimmedText.substring(0, 2).padEnd(2, '0');
            newSelection = trimmedText.length === 1 ? 1 : 2;
        }
        else if (trimmedText.length === 1 && /^\d$/.test(trimmedText)) {
            // Handles any single digit '0'-'9'
            const digit = trimmedText[0];
            if (digit === '0') {
                newHour = '00';
                newSelection = 1;
            }
            else if (digit === '1') {
                newHour = '01';
                // Check if it was a full replacement of a 2-digit hour field
                if (selectionHour.start === 0 && typeof selectionHour.end === 'number' && selectionHour.end >= 2 && hours.length >= 2) {
                    newSelection = 2;
                }
                else {
                    newSelection = 1;
                }
            }
            else {
                // Digit is '2' through '9'
                newHour = `0${digit}`;
                newSelection = 2;
            }
        }
        else {
            // Handle empty input or multiple digits
            if (trimmedText.length === 0) {
                newHour = '00';
                newSelection = 0;
                return;
            }
            const candidate = trimmedText.substring(0, 2);
            if (/^\d\d$/.test(candidate)) {
                // e.g. "05", "12"
                newHour = candidate;
            }
            else if (/^\d$/.test(candidate)) {
                // e.g. "5" became candidate (should be rare here)
                newHour = `0${candidate}`;
            }
            else {
                // Invalid input like "aa"
                newHour = hours; // Revert to previous valid hours
            }
            newSelection = 2;
        }
        const newHourNumber = Number(newHour);
        if (newHourNumber > 24) {
            newHour = hours;
        }
        else if (newHourNumber > 12) {
            newHour = String(newHourNumber - 12).padStart(2, '0');
            setAmPmValue(CONST_1.default.TIME_PERIOD.PM);
        }
        setHours(newHour);
        setSelectionHour({ start: newSelection, end: newSelection });
        if (newSelection === 2) {
            focusMinuteInputOnFirstCharacter();
        }
    };
    /*
     This function receives value from the minutes input and validates it.
     The valid format is MM(from 00 to 59). If the user enters 9, it will be prepended to 09. If the user tries to change 09 to 99, it would skip the character
    */
    const handleMinutesChange = (text) => {
        // Replace spaces with 0 to implement the following digit removal by pressing space
        const trimmedText = text.replace(/ /g, '0');
        if (!trimmedText) {
            resetMinutes();
            return;
        }
        const isOnlyNumericValue = /^\d+$/.test(trimmedText);
        if (!isOnlyNumericValue) {
            return;
        }
        let newMinute;
        let newSelection;
        if (selectionMinute.start === 0 && selectionMinute.end === 0) {
            // The cursor is at the start of minutes
            const firstDigit = trimmedText[0];
            if (trimmedText.length === 1) {
                // To support the forward-removal using Delete key
                newMinute = `0${firstDigit}`;
                newSelection = 1;
            }
            else if (Number(firstDigit) <= 5) {
                // The first entered digit is 0-5, we can safely append the second digit.
                newMinute = `${firstDigit}${trimmedText[2] || 0}`;
                newSelection = 1;
            }
            else {
                // The first entered digit is 6-9. We should replace the whole value by prepending 0 to the entered digit.
                newMinute = `0${firstDigit}`;
                newSelection = 2;
            }
        }
        else if (selectionMinute.start === 1 && selectionMinute.end === 1) {
            // The cursor is in-between the digits
            if (trimmedText.length === 1 && lastPressedKey.current === 'Backspace') {
                // We have removed the first digit. Replace it with 0 and move the cursor to the start.
                newMinute = `0${trimmedText}`;
                newSelection = 0;
            }
            else {
                newMinute = `${trimmedText[0]}${trimmedText[1] || 0}`;
                newSelection = 2;
            }
        }
        else if (selectionMinute.start === 0 && selectionMinute.end === 1) {
            // There is an active selection of the first digit
            newMinute = trimmedText.substring(0, 2).padStart(2, '0');
            newSelection = trimmedText.length === 1 ? 0 : 1;
        }
        else if (selectionMinute.start === 1 && selectionMinute.end === 2) {
            // There is an active selection of the second digit
            newMinute = trimmedText.substring(0, 2).padEnd(2, '0');
            newSelection = trimmedText.length === 1 ? 1 : 2;
        }
        else if (trimmedText.length === 1 && Number(trimmedText) <= 5) {
            /*
             The trimmed text is from 0 to 5.
             We are either replacing minutes with a single digit, or removing the last digit.
             In both cases, we should append 0 to the remaining value.
             Note: we must check the length of the filtered text to avoid incorrectly handling e.g. "01" as "1"
            */
            newMinute = `${trimmedText}0`;
            newSelection = 1;
        }
        else {
            newMinute = trimmedText.substring(0, 2).padStart(2, '0');
            newSelection = 2;
        }
        if (Number(newMinute) > 59) {
            newMinute = minutes;
        }
        setMinutes(newMinute);
        setSelectionMinute({ start: newSelection, end: newSelection });
        if (showFullFormat && newSelection === 2) {
            focusSecondInputOnFirstCharacter();
        }
    };
    /*
     This function receives value from the seconds input and validates it.
     The valid format is SS(from 00 to 59). If the user enters 9, it will be prepended to 09. If the user tries to change 09 to 99, it would skip the character
    */
    const handleSecondsChange = (text) => {
        // Replace spaces with 0 to implement the following digit removal by pressing space
        const trimmedText = text.replace(/ /g, '0');
        if (!trimmedText) {
            resetSeconds();
            return;
        }
        const isOnlyNumericValue = /^\d+$/.test(trimmedText);
        if (!isOnlyNumericValue) {
            return;
        }
        let newSecond;
        let newSelection;
        if (selectionSecond.start === 0 && selectionSecond.end === 0) {
            // The cursor is at the start of seconds
            const firstDigit = trimmedText[0];
            if (trimmedText.length === 1) {
                // To support the forward-removal using Delete key
                newSecond = `0${firstDigit}`;
                newSelection = 1;
            }
            else if (Number(firstDigit) <= 5) {
                // The first entered digit is 0-5, we can safely append the second digit.
                newSecond = `${firstDigit}${trimmedText[2] || 0}`;
                newSelection = 1;
            }
            else {
                // The first entered digit is 6-9. We should replace the whole value by prepending 0 to the entered digit.
                newSecond = `0${firstDigit}`;
                newSelection = 2;
            }
        }
        else if (selectionSecond.start === 1 && selectionSecond.end === 1) {
            // The cursor is in-between the digits
            if (trimmedText.length === 1 && lastPressedKey.current === 'Backspace') {
                // We have removed the first digit. Replace it with 0 and move the cursor to the start.
                newSecond = `0${trimmedText}`;
                newSelection = 0;
            }
            else {
                newSecond = `${trimmedText[0]}${trimmedText[1] || 0}`;
                newSelection = 2;
            }
        }
        else if (selectionSecond.start === 0 && selectionSecond.end === 1) {
            // There is an active selection of the first digit
            newSecond = trimmedText.substring(0, 2).padStart(2, '0');
            newSelection = trimmedText.length === 1 ? 0 : 1;
        }
        else if (selectionSecond.start === 1 && selectionSecond.end === 2) {
            // There is an active selection of the second digit
            newSecond = trimmedText.substring(0, 2).padEnd(2, '0');
            newSelection = trimmedText.length === 1 ? 1 : 2;
        }
        else if (trimmedText.length === 1 && Number(trimmedText) <= 5) {
            /*
             The trimmed text is from 0 to 5.
             We are either replacing seconds with a single digit, or removing the last digit.
             In both cases, we should append 0 to the remaining value.
             Note: we must check the length of the filtered text to avoid incorrectly handling e.g. "01" as "1"
            */
            newSecond = `${trimmedText}0`;
            newSelection = 1;
        }
        else {
            newSecond = trimmedText.substring(0, 2).padStart(2, '0');
            newSelection = 2;
        }
        if (Number(newSecond) > 59) {
            newSecond = seconds;
        }
        setSeconds(newSecond);
        setSelectionSecond({ start: newSelection, end: newSelection });
        if (newSelection === 2) {
            focusMillisecondInputOnFirstCharacter();
        }
    };
    /*
     This function receives value from the milliseconds input and validates it.
     The valid format is SSS(from 000 to 999). If the user enters 9, it will be prepended to 009. If the user tries to change 999 to 9999, it would skip the character
    */
    const handleMillisecondsChange = (text) => {
        // Replace spaces with 0 to implement the following digit removal by pressing space
        const trimmedText = text.replace(/ /g, '0');
        if (!trimmedText) {
            resetMilliseconds();
            return;
        }
        const isOnlyNumericValue = /^\d+$/.test(trimmedText);
        if (!isOnlyNumericValue) {
            return;
        }
        let newMillisecond;
        let newSelection;
        if (selectionMillisecond.start === 0 && selectionMillisecond.end === 0) {
            // The cursor is at the start of milliseconds
            const firstDigit = trimmedText[0];
            const secondDigit = trimmedText[2] || '0';
            const thirdDigit = trimmedText[3] || '0';
            newMillisecond = `${firstDigit}${secondDigit}${thirdDigit}`;
            newSelection = 1;
        }
        else if (selectionMillisecond.start === 1 && selectionMillisecond.end === 1) {
            // The cursor is in-between the digits
            if (lastPressedKey.current === 'Backspace') {
                // We have removed the first digit. Replace it with 0 and move the cursor to the start.
                const secondDigit = trimmedText[0];
                const thirdDigit = trimmedText[1] || '0';
                newMillisecond = `0${secondDigit}${thirdDigit}`;
                newSelection = 0;
            }
            else {
                const firstDigit = trimmedText[0];
                const secondDigit = trimmedText[1] || '0';
                const thirdDigit = trimmedText[3] || '0';
                newMillisecond = `${firstDigit}${secondDigit}${thirdDigit}`;
                newSelection = 2;
            }
        }
        else if (selectionMillisecond.start === 2 && selectionMillisecond.end === 2) {
            // The cursor is in-between the digits
            if (lastPressedKey.current === 'Backspace') {
                // We have removed the second digit. Replace it with 0 and move the cursor back.
                const firstDigit = trimmedText[0];
                const thirdDigit = trimmedText[1] || '0';
                newMillisecond = `${firstDigit}0${thirdDigit}`;
                newSelection = 1;
            }
            else {
                const firstDigit = trimmedText[0];
                const secondDigit = trimmedText[1] || '0';
                const thirdDigit = trimmedText[2] || '0';
                newMillisecond = `${firstDigit}${secondDigit}${thirdDigit}`;
                newSelection = 3;
            }
        }
        else if (selectionMillisecond.start === 0 && selectionMillisecond.end === 1) {
            // There is an active selection of the first digit
            newMillisecond = trimmedText.substring(0, 3).padStart(3, '0');
            newSelection = trimmedText.length === 1 ? 0 : 1;
        }
        else if (selectionMillisecond.start === 1 && selectionMillisecond.end === 2) {
            // There is an active selection of the second digit
            newMillisecond = trimmedText.substring(0, 3).padStart(3, '0');
            newSelection = trimmedText.length === 1 ? 1 : 2;
        }
        else if (selectionMillisecond.start === 2 && selectionMillisecond.end === 3) {
            // There is an active selection of the third digit
            newMillisecond = trimmedText.substring(0, 3).padEnd(3, '0');
            newSelection = trimmedText.length === 2 ? 2 : 3;
        }
        else {
            newMillisecond = trimmedText.substring(0, 3).padEnd(3, '0');
            newSelection = trimmedText.length;
        }
        if (Number(newMillisecond) > 999) {
            newMillisecond = milliseconds;
        }
        setMilliseconds(newMillisecond);
        setSelectionMillisecond({ start: newSelection, end: newSelection });
    };
    /**
     * Update amount with number or Backspace pressed for BigNumberPad.
     * Validate new amount with decimal number regex up to 6 digits and 2 decimal digit to enable Next button
     */
    const updateAmountNumberPad = (0, react_1.useCallback)((key) => {
        const isHourFocused = hourInputRef.current?.isFocused();
        const isMinuteFocused = minuteInputRef.current?.isFocused();
        const isSecondFocused = secondInputRef.current?.isFocused();
        const isMillisecondFocused = millisecondInputRef.current?.isFocused();
        if (showFullFormat && !isHourFocused && !isMinuteFocused && !isSecondFocused && !isMillisecondFocused) {
            millisecondInputRef.current?.focus();
        }
        else if (!showFullFormat && !isHourFocused && !isMinuteFocused) {
            minuteInputRef.current?.focus();
        }
        if (key === '.') {
            return;
        }
        if (key === '<' || key === 'Backspace') {
            if (isHourFocused) {
                clearSelectedValue(hours, selectionHour, setHours, setSelectionHour);
            }
            else if (isMinuteFocused) {
                if (selectionMinute.start === 0 && selectionMinute.end === 0) {
                    focusHourInputOnLastCharacter();
                    return;
                }
                clearSelectedValue(minutes, selectionMinute, setMinutes, setSelectionMinute);
            }
            else if (isSecondFocused) {
                if (selectionSecond.start === 0 && selectionSecond.end === 0) {
                    focusMinuteInputOnLastCharacter();
                    return;
                }
                clearSelectedValue(seconds, selectionSecond, setSeconds, setSelectionSecond);
            }
            else if (isMillisecondFocused) {
                if (selectionMillisecond.start === 0 && selectionMillisecond.end === 0) {
                    focusSecondInputOnLastCharacter();
                    return;
                }
                clearSelectedValue(milliseconds, selectionMillisecond, setMilliseconds, setSelectionMillisecond, 3);
            }
            return;
        }
        const trimmedKey = key.replace(/[^0-9]/g, '');
        if (isHourFocused) {
            handleHourChange(insertAtPosition(hours, trimmedKey, selectionHour.start, selectionHour.end));
        }
        else if (isMinuteFocused) {
            handleMinutesChange(insertAtPosition(minutes, trimmedKey, selectionMinute.start, selectionMinute.end));
        }
        else if (isSecondFocused) {
            handleSecondsChange(insertAtPosition(seconds, trimmedKey, selectionSecond.start, selectionSecond.end));
        }
        else if (isMillisecondFocused) {
            handleMillisecondsChange(insertAtPosition(milliseconds, trimmedKey, selectionMillisecond.start, selectionMillisecond.end));
        }
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [minutes, hours, seconds, milliseconds, selectionMinute, selectionHour, selectionSecond, selectionMillisecond]);
    (0, react_1.useEffect)(() => {
        // we implement this to ensure the hour input focuses on the first character upon initial focus
        // https://github.com/facebook/react-native/issues/20214
        setSelectionHour({ start: 0, end: 0 });
    }, []);
    const arrowConfig = (0, react_1.useMemo)(() => ({
        shouldPreventDefault: false,
    }), []);
    const arrowLeftCallback = (0, react_1.useCallback)((e) => {
        if (minuteInputRef.current?.isFocused() && selectionMinute.start === 0) {
            // Check e to be truthy to avoid crashing on Android (e is undefined there)
            e?.preventDefault();
            focusHourInputOnLastCharacter();
        }
        if (secondInputRef.current?.isFocused() && selectionSecond.start === 0) {
            // Check e to be truthy to avoid crashing on Android (e is undefined there)
            e?.preventDefault();
            focusMinuteInputOnLastCharacter();
        }
        if (millisecondInputRef.current?.isFocused() && selectionMillisecond.start === 0) {
            // Check e to be truthy to avoid crashing on Android (e is undefined there)
            e?.preventDefault();
            focusSecondInputOnLastCharacter();
        }
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [selectionHour, selectionMinute]);
    const arrowRightCallback = (0, react_1.useCallback)((e) => {
        if (hourInputRef.current?.isFocused() && selectionHour.start === 2) {
            // Check e to be truthy to avoid crashing on Android (e is undefined there)
            e?.preventDefault();
            focusMinuteInputOnFirstCharacter();
        }
        if (minuteInputRef.current?.isFocused() && selectionMinute.start === 2) {
            // Check e to be truthy to avoid crashing on Android (e is undefined there)
            e?.preventDefault();
            focusSecondInputOnFirstCharacter();
        }
        if (secondInputRef.current?.isFocused() && selectionSecond.start === 2) {
            // Check e to be truthy to avoid crashing on Android (e is undefined there)
            e?.preventDefault();
            focusMillisecondInputOnFirstCharacter();
        }
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [selectionHour, selectionMinute, selectionSecond, selectionMillisecond]);
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.ARROW_LEFT, arrowLeftCallback, arrowConfig);
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.ARROW_RIGHT, arrowRightCallback, arrowConfig);
    const handleFocusOnBackspace = (0, react_1.useCallback)((e) => {
        if (e.nativeEvent.key !== 'Backspace') {
            return;
        }
        if (minuteInputRef.current?.isFocused() && selectionMinute.start === 0 && selectionMinute.end === 0) {
            e.preventDefault();
            focusHourInputOnLastCharacter();
        }
        if (secondInputRef.current?.isFocused() && selectionSecond.start === 0 && selectionSecond.end === 0) {
            e.preventDefault();
            focusMinuteInputOnLastCharacter();
        }
        if (millisecondInputRef.current?.isFocused() && selectionMillisecond.start === 0 && selectionMillisecond.end === 0) {
            e.preventDefault();
            focusSecondInputOnLastCharacter();
        }
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [
        selectionMinute.start,
        selectionMinute.end,
        selectionSecond.start,
        selectionSecond.end,
        selectionMillisecond.start,
        selectionMillisecond.end,
        focusHourInputOnLastCharacter,
        focusMinuteInputOnLastCharacter,
        focusSecondInputOnLastCharacter,
    ]);
    const { styleForAM, styleForPM } = StyleUtils.getStatusAMandPMButtonStyle(amPmValue);
    const numberPad = (0, react_1.useCallback)(() => {
        if (!canUseTouchScreen) {
            return null;
        }
        return (<BigNumberPad_1.default id={NUM_PAD_VIEW_ID} numberPressed={updateAmountNumberPad} isLongPressDisabled/>);
    }, [canUseTouchScreen, updateAmountNumberPad]);
    (0, react_1.useEffect)(() => {
        onInputChange(showFullFormat ? `${hours}:${minutes}:${seconds}.${milliseconds} ${amPmValue}` : `${hours}:${minutes} ${amPmValue}`);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [hours, minutes, amPmValue]);
    const handleSubmit = () => {
        const time = showFullFormat ? `${hours}:${minutes}:${seconds}.${milliseconds}` : `${hours}:${minutes} ${amPmValue}`;
        const isValid = validate(time);
        if (isValid) {
            onSubmit(time);
        }
    };
    const updateRefs = (refName, updatedRef) => {
        const updatedRefs = {
            hourRef: hourInputRef.current,
            minuteRef: minuteInputRef.current,
            secondRef: secondInputRef.current,
            millisecondRef: millisecondInputRef.current,
            [refName]: updatedRef,
        };
        if (typeof ref === 'function') {
            ref(updatedRefs);
        }
        else if (ref && 'current' in ref) {
            // eslint-disable-next-line no-param-reassign
            ref.current = updatedRefs;
        }
    };
    const renderedAmPmButtons = (0, react_1.useMemo)(() => (<react_native_1.View style={styles.timePickerSwitcherContainer}>
                <Button_1.default shouldEnableHapticFeedback innerStyles={styleForAM} small text={translate('common.am')} onLongPress={() => { }} onPress={() => {
            setAmPmValue(CONST_1.default.TIME_PERIOD.AM);
        }} onPressOut={() => { }} onMouseDown={(e) => e.preventDefault()}/>
                <Button_1.default shouldEnableHapticFeedback innerStyles={[styleForPM, styles.ml1]} small text={translate('common.pm')} onLongPress={() => { }} onPress={() => {
            setAmPmValue(CONST_1.default.TIME_PERIOD.PM);
        }} onPressOut={() => { }} onMouseDown={(e) => e.preventDefault()}/>
            </react_native_1.View>), [styles, styleForAM, styleForPM, translate, setAmPmValue]);
    return (<react_native_1.View style={styles.flex1}>
            <react_native_1.View style={[styles.flex1, styles.w100, styles.alignItemsCenter, styles.justifyContentCenter]}>
                <react_native_1.View nativeID={AMOUNT_VIEW_ID} style={[styles.flexRow, styles.w100, styles.justifyContentCenter, styles.timePickerInputsContainer, styles.mb2]}>
                    <AmountTextInput_1.default placeholder={numberFormat(0)} formattedAmount={hours} onKeyPress={(e) => {
            lastPressedKey.current = e.nativeEvent.key;
        }} onChangeAmount={handleHourChange} ref={(textInputRef) => {
            updateRefs('hourRef', textInputRef);
            // eslint-disable-next-line react-compiler/react-compiler
            hourInputRef.current = textInputRef;
        }} onSelectionChange={(e) => {
            setSelectionHour(e.nativeEvent.selection);
        }} style={[styles.iouAmountTextInput, styles.timePickerInput, showFullFormat && [styles.textXXLarge, styles.mnw0]]} containerStyle={[styles.iouAmountTextInputContainer]} touchableInputWrapperStyle={!showFullFormat && styles.timePickerHeight100} selection={selectionHour}/>
                    <Text_1.default style={[styles.timePickerSemiDot, showFullFormat && [styles.textXXLarge, { height: undefined }]]}>{CONST_1.default.COLON}</Text_1.default>
                    <AmountTextInput_1.default placeholder={numberFormat(0)} formattedAmount={minutes} onKeyPress={(e) => {
            lastPressedKey.current = e.nativeEvent.key;
            handleFocusOnBackspace(e);
        }} onChangeAmount={handleMinutesChange} ref={(textInputRef) => {
            updateRefs('minuteRef', textInputRef);
            minuteInputRef.current = textInputRef;
            if (!showFullFormat) {
                inputCallbackRef(textInputRef);
            }
        }} onSelectionChange={(e) => {
            setSelectionMinute(e.nativeEvent.selection);
        }} style={[styles.iouAmountTextInput, styles.timePickerInput, showFullFormat && [styles.textXXLarge, styles.mnw0]]} containerStyle={[styles.iouAmountTextInputContainer]} touchableInputWrapperStyle={!showFullFormat && styles.timePickerHeight100} selection={selectionMinute}/>
                    {showFullFormat && (<>
                            <Text_1.default style={[styles.timePickerSemiDot, showFullFormat && [styles.textXXLarge, { height: undefined }]]}>{CONST_1.default.COLON}</Text_1.default>
                            <AmountTextInput_1.default placeholder={numberFormat(0)} formattedAmount={seconds} onKeyPress={(e) => {
                lastPressedKey.current = e.nativeEvent.key;
                handleFocusOnBackspace(e);
            }} onChangeAmount={handleSecondsChange} ref={(textInputRef) => {
                updateRefs('secondRef', textInputRef);
                secondInputRef.current = textInputRef;
            }} onSelectionChange={(e) => {
                setSelectionSecond(e.nativeEvent.selection);
            }} style={[styles.iouAmountTextInput, styles.timePickerInput, showFullFormat && [styles.textXXLarge, styles.mnw0]]} containerStyle={[styles.iouAmountTextInputContainer]} touchableInputWrapperStyle={!showFullFormat && styles.timePickerHeight100} selection={selectionSecond}/>
                            <Text_1.default style={[styles.timePickerSemiDot, showFullFormat && [styles.textXXLarge, { height: undefined }]]}>{CONST_1.default.COLON}</Text_1.default>
                            <AmountTextInput_1.default placeholder={numberFormat(0)} formattedAmount={milliseconds} onKeyPress={(e) => {
                lastPressedKey.current = e.nativeEvent.key;
                handleFocusOnBackspace(e);
            }} onChangeAmount={handleMillisecondsChange} ref={(textInputRef) => {
                updateRefs('millisecondRef', textInputRef);
                millisecondInputRef.current = textInputRef;
                if (showFullFormat) {
                    inputCallbackRef(textInputRef);
                }
            }} onSelectionChange={(e) => {
                setSelectionMillisecond(e.nativeEvent.selection);
            }} style={[styles.iouAmountTextInput, styles.timePickerInput, showFullFormat && [styles.textXXLarge, styles.mnw0]]} containerStyle={[styles.iouAmountTextInputContainer]} touchableInputWrapperStyle={!showFullFormat && styles.timePickerHeight100} selection={selectionMillisecond}/>
                        </>)}
                </react_native_1.View>
                {!canUseTouchScreen && renderedAmPmButtons}
            </react_native_1.View>
            {isError ? (<FormHelpMessage_1.default isError={isError} message={errorMessage} style={[styles.ph5, styles.formHelperMessage, canUseTouchScreen && styles.mb5]}/>) : (<react_native_1.View style={[styles.formHelperMessage, canUseTouchScreen && styles.mb5]}/>)}
            {canUseTouchScreen && renderedAmPmButtons}
            <react_native_1.View style={[styles.numberPadWrapper, styles.pb4]} nativeID={NUM_PAD_CONTAINER_VIEW_ID}>
                {numberPad()}
            </react_native_1.View>
            <Button_1.default success medium={isExtraSmallScreenHeight} large={!isExtraSmallScreenHeight} style={[styles.mb5, styles.mh5]} onPress={handleSubmit} pressOnEnter text={translate('common.save')}/>
        </react_native_1.View>);
}
TimePicker.displayName = 'TimePicker';
exports.default = react_1.default.forwardRef(TimePicker);
