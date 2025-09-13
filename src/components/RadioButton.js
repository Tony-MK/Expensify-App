"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const PressableWithFeedback_1 = require("./Pressable/PressableWithFeedback");
function RadioButton({ isChecked, onPress, accessibilityLabel, hasError = false, disabled = false, shouldUseNewStyle = false }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    if (shouldUseNewStyle) {
        return (<PressableWithFeedback_1.default disabled={disabled} onPress={onPress} hoverDimmingValue={1} pressDimmingValue={1} accessibilityLabel={accessibilityLabel} role={CONST_1.default.ROLE.RADIO} style={[
                styles.newRadioButtonContainer,
                hasError && styles.borderColorDanger,
                disabled && styles.cursorDisabled,
                isChecked && styles.checkedContainer,
                isChecked && styles.borderColorFocus,
            ]}>
                {isChecked && (<Icon_1.default src={Expensicons.Checkmark} fill={theme.textLight} height={14} width={14}/>)}
            </PressableWithFeedback_1.default>);
    }
    return (<PressableWithFeedback_1.default disabled={disabled} onPress={onPress} hoverDimmingValue={1} pressDimmingValue={1} accessibilityLabel={accessibilityLabel} role={CONST_1.default.ROLE.RADIO} style={[styles.radioButtonContainer, hasError && styles.borderColorDanger, disabled && styles.cursorDisabled]}>
            {isChecked && (<Icon_1.default src={Expensicons.Checkmark} fill={theme.checkBox} height={20} width={20}/>)}
        </PressableWithFeedback_1.default>);
}
RadioButton.displayName = 'RadioButton';
exports.default = RadioButton;
