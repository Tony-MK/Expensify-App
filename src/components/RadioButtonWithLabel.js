"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const FormHelpMessage_1 = require("./FormHelpMessage");
const Pressables = require("./Pressable");
const RadioButton_1 = require("./RadioButton");
const Text_1 = require("./Text");
const PressableWithFeedback = Pressables.PressableWithFeedback;
function RadioButtonWithLabel({ labelElement, style, label = '', hasError = false, errorText = '', isChecked, onPress, wrapperStyle, shouldBlendOpacity }) {
    const styles = (0, useThemeStyles_1.default)();
    const defaultStyles = [styles.flexRow, styles.alignItemsCenter];
    if (!label && !labelElement) {
        throw new Error('Must provide at least label or labelComponent prop');
    }
    return (<>
            <react_native_1.View style={[defaultStyles, style]}>
                <RadioButton_1.default isChecked={isChecked} onPress={onPress} accessibilityLabel={label} hasError={hasError}/>
                <PressableWithFeedback tabIndex={-1} accessible={false} onPress={onPress} style={[styles.flexRow, styles.flexWrap, styles.flexShrink1, styles.alignItemsCenter]} wrapperStyle={[styles.flex1, styles.ml3, styles.pr2, wrapperStyle]} 
    // disable hover style when disabled
    hoverDimmingValue={0.8} pressDimmingValue={0.5} shouldBlendOpacity={shouldBlendOpacity}>
                    {!!label && <Text_1.default style={[styles.ml1]}>{label}</Text_1.default>}
                    {!!labelElement && labelElement}
                </PressableWithFeedback>
            </react_native_1.View>
            <FormHelpMessage_1.default message={errorText}/>
        </>);
}
RadioButtonWithLabel.displayName = 'RadioButtonWithLabel';
exports.default = RadioButtonWithLabel;
