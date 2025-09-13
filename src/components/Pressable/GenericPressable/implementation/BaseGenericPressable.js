"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// eslint-disable-next-line no-restricted-imports
const react_native_1 = require("react-native");
const useSingleExecution_1 = require("@hooks/useSingleExecution");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Accessibility_1 = require("@libs/Accessibility");
const HapticFeedback_1 = require("@libs/HapticFeedback");
const KeyboardShortcut_1 = require("@libs/KeyboardShortcut");
const CONST_1 = require("@src/CONST");
function GenericPressable({ children, onPress = () => { }, onLongPress, onKeyDown, disabled, style, disabledStyle = {}, hoverStyle = {}, focusStyle = {}, pressStyle = {}, screenReaderActiveStyle = {}, shouldUseHapticsOnLongPress = true, shouldUseHapticsOnPress = false, nextFocusRef, keyboardShortcut, shouldUseAutoHitSlop = false, enableInScreenReaderStates = CONST_1.default.SCREEN_READER_STATES.ALL, onPressIn, onPressOut, accessible = true, fullDisabled = false, interactive = true, isNested = false, ref, dataSet, forwardedFSClass, ...rest }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { isExecuting, singleExecution } = (0, useSingleExecution_1.default)();
    const isScreenReaderActive = Accessibility_1.default.useScreenReaderStatus();
    const [hitSlop, onLayout] = Accessibility_1.default.useAutoHitSlop();
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const isRoleButton = [rest.accessibilityRole, rest.role].includes(CONST_1.default.ROLE.BUTTON);
    const isDisabled = (0, react_1.useMemo)(() => {
        let shouldBeDisabledByScreenReader = false;
        if (enableInScreenReaderStates === CONST_1.default.SCREEN_READER_STATES.ACTIVE) {
            shouldBeDisabledByScreenReader = !isScreenReaderActive;
        }
        if (enableInScreenReaderStates === CONST_1.default.SCREEN_READER_STATES.DISABLED) {
            shouldBeDisabledByScreenReader = isScreenReaderActive;
        }
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return disabled || shouldBeDisabledByScreenReader || isExecuting;
    }, [isScreenReaderActive, enableInScreenReaderStates, disabled, isExecuting]);
    const shouldUseDisabledCursor = (0, react_1.useMemo)(() => isDisabled && !isExecuting, [isDisabled, isExecuting]);
    /**
     * Returns the cursor style based on the state of Pressable
     */
    const cursorStyle = (0, react_1.useMemo)(() => {
        if (!interactive) {
            return styles.cursorDefault;
        }
        if (shouldUseDisabledCursor) {
            return styles.cursorDisabled;
        }
        if ([rest.accessibilityRole, rest.role].includes(CONST_1.default.ROLE.PRESENTATION) && !isNested) {
            return styles.cursorText;
        }
        return styles.cursorPointer;
    }, [interactive, shouldUseDisabledCursor, rest.accessibilityRole, rest.role, isNested, styles.cursorPointer, styles.cursorDefault, styles.cursorDisabled, styles.cursorText]);
    const onLongPressHandler = (0, react_1.useCallback)((event) => {
        if (isDisabled) {
            return;
        }
        if (!onLongPress) {
            return;
        }
        if (shouldUseHapticsOnLongPress) {
            HapticFeedback_1.default.longPress();
        }
        if (ref && 'current' in ref && nextFocusRef) {
            ref.current?.blur();
            Accessibility_1.default.moveAccessibilityFocus(nextFocusRef);
        }
        onLongPress(event);
    }, [shouldUseHapticsOnLongPress, onLongPress, nextFocusRef, ref, isDisabled]);
    const onPressHandler = (0, react_1.useCallback)((event) => {
        if (isDisabled || !interactive) {
            return;
        }
        if (!onPress) {
            return;
        }
        if (shouldUseHapticsOnPress) {
            HapticFeedback_1.default.press();
        }
        if (ref && 'current' in ref && nextFocusRef) {
            ref.current?.blur();
            Accessibility_1.default.moveAccessibilityFocus(nextFocusRef);
        }
        return onPress(event);
    }, [shouldUseHapticsOnPress, onPress, nextFocusRef, ref, isDisabled, interactive]);
    const voidOnPressHandler = (0, react_1.useCallback)((...args) => {
        onPressHandler(...args);
    }, [onPressHandler]);
    const onKeyboardShortcutPressHandler = (0, react_1.useCallback)((event) => {
        onPressHandler(event);
    }, [onPressHandler]);
    (0, react_1.useEffect)(() => {
        if (!keyboardShortcut) {
            return () => { };
        }
        const { shortcutKey, descriptionKey, modifiers } = keyboardShortcut;
        return KeyboardShortcut_1.default.subscribe(shortcutKey, onKeyboardShortcutPressHandler, descriptionKey, modifiers, true, false, 0, false);
    }, [keyboardShortcut, onKeyboardShortcutPressHandler]);
    return (<react_native_1.Pressable hitSlop={shouldUseAutoHitSlop ? hitSlop : undefined} onLayout={shouldUseAutoHitSlop ? onLayout : undefined} ref={ref} disabled={fullDisabled} 
    // eslint-disable-next-line react-compiler/react-compiler
    onPress={!isDisabled ? singleExecution(onPressHandler) : undefined} onLongPress={!isDisabled && onLongPress ? onLongPressHandler : undefined} onKeyDown={!isDisabled ? onKeyDown : undefined} onPressIn={!isDisabled ? onPressIn : undefined} onPressOut={!isDisabled ? onPressOut : undefined} dataSet={{ ...(isRoleButton ? { [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true } : {}), ...(dataSet ?? {}) }} style={(state) => [
            cursorStyle,
            StyleUtils.parseStyleFromFunction(style, state),
            isScreenReaderActive && StyleUtils.parseStyleFromFunction(screenReaderActiveStyle, state),
            state.focused && StyleUtils.parseStyleFromFunction(focusStyle, state),
            (state.hovered || isHovered) && StyleUtils.parseStyleFromFunction(hoverStyle, state),
            state.pressed && StyleUtils.parseStyleFromFunction(pressStyle, state),
            isDisabled && [StyleUtils.parseStyleFromFunction(disabledStyle, state), styles.noSelect],
            isRoleButton && styles.userSelectNone,
        ]} 
    // accessibility props
    accessibilityState={{
            disabled: isDisabled,
            ...rest.accessibilityState,
        }} aria-disabled={isDisabled} aria-keyshortcuts={keyboardShortcut && `${keyboardShortcut.modifiers.join('')}+${keyboardShortcut.shortcutKey}`} 
    // ios-only form of inputs
    onMagicTap={!isDisabled ? voidOnPressHandler : undefined} onAccessibilityTap={!isDisabled ? voidOnPressHandler : undefined} accessible={accessible} fsClass={forwardedFSClass} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} onHoverOut={(event) => {
            if (event?.type === 'pointerenter' || event?.type === 'mouseenter') {
                return;
            }
            setIsHovered(false);
            if (rest.onHoverOut) {
                rest.onHoverOut(event);
            }
        }} onHoverIn={(event) => {
            setIsHovered(true);
            if (rest.onHoverIn) {
                rest.onHoverIn(event);
            }
        }}>
            {(state) => (typeof children === 'function' ? children({ ...state, isScreenReaderActive, hovered: state.hovered || isHovered, isDisabled }) : children)}
        </react_native_1.Pressable>);
}
GenericPressable.displayName = 'GenericPressable';
exports.default = GenericPressable;
