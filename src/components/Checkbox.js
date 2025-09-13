"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const PressableWithFeedback_1 = require("./Pressable/PressableWithFeedback");
function Checkbox({ isChecked = false, isIndeterminate = false, hasError = false, disabled = false, style, containerStyle, children = null, onMouseDown, containerSize = 20, containerBorderRadius = 4, caretSize = 14, onPress, accessibilityLabel, shouldStopMouseDownPropagation, shouldSelectOnPressEnter, wrapperStyle, ref, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const handleSpaceOrEnterKey = (event) => {
        if (event?.code !== 'Space' && event?.code !== 'Enter') {
            return;
        }
        if (event?.code === 'Enter' && !shouldSelectOnPressEnter) {
            // If the checkbox should not be selected on Enter key press, we do not want to
            // toggle it, so we return early.
            return;
        }
        onPress();
    };
    const firePressHandlerOnClick = (event) => {
        // Pressable can be triggered with Enter key and by a click. As this is a checkbox,
        // We do not want to toggle it, when Enter key is pressed.
        if (event?.type && event.type !== 'click') {
            return;
        }
        onPress();
    };
    return (<PressableWithFeedback_1.default disabled={disabled} onPress={firePressHandlerOnClick} onMouseDown={(e) => {
            if (shouldStopMouseDownPropagation) {
                e.stopPropagation();
            }
            onMouseDown?.(e);
        }} ref={ref} style={[StyleUtils.getCheckboxPressableStyle(containerBorderRadius + 2), style]} // to align outline on focus, border-radius of pressable should be 2px more than Checkbox
     onKeyDown={handleSpaceOrEnterKey} role={CONST_1.default.ROLE.CHECKBOX} 
    /*  true  → checked
        false → unchecked
        mixed → indeterminate  */
    aria-checked={isIndeterminate ? 'mixed' : isChecked} accessibilityLabel={accessibilityLabel} pressDimmingValue={1} wrapperStyle={wrapperStyle}>
            {children ?? (<react_native_1.View style={[
                StyleUtils.getCheckboxContainerStyle(containerSize, containerBorderRadius),
                containerStyle,
                (isChecked || isIndeterminate) && styles.checkedContainer,
                hasError && styles.borderColorDanger,
                disabled && styles.cursorDisabled,
                disabled && styles.buttonOpacityDisabled,
                (isChecked || isIndeterminate) && styles.borderColorFocus,
            ]}>
                    {(isChecked || isIndeterminate) && (<Icon_1.default src={isChecked ? Expensicons.Checkmark : Expensicons.Minus} fill={theme.textLight} height={caretSize} width={caretSize}/>)}
                </react_native_1.View>)}
        </PressableWithFeedback_1.default>);
}
Checkbox.displayName = 'Checkbox';
exports.default = Checkbox;
