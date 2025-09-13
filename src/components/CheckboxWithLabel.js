"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const Checkbox_1 = require("./Checkbox");
const FormHelpMessage_1 = require("./FormHelpMessage");
const PressableWithFeedback_1 = require("./Pressable/PressableWithFeedback");
const Text_1 = require("./Text");
function CheckboxWithLabel({ errorText = '', isChecked: isCheckedProp = false, defaultValue = false, onInputChange = () => { }, LabelComponent, label, accessibilityLabel, style, value }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    // We need to pick the first value that is strictly a boolean
    // https://github.com/Expensify/App/issues/16885#issuecomment-1520846065
    const [isChecked, setIsChecked] = (0, react_1.useState)(() => [value, defaultValue, isCheckedProp].find((item) => typeof item === 'boolean'));
    const toggleCheckbox = () => {
        onInputChange(!isChecked);
        setIsChecked(!isChecked);
    };
    return (<react_native_1.View style={style}>
            <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.breakWord]}>
                <Checkbox_1.default isChecked={isChecked} onPress={toggleCheckbox} style={[styles.checkboxWithLabelCheckboxStyle]} hasError={!!errorText} ref={ref} accessibilityLabel={accessibilityLabel ?? label ?? ''}/>
                <PressableWithFeedback_1.default tabIndex={-1} accessible={false} onPress={toggleCheckbox} pressDimmingValue={variables_1.default.checkboxLabelActiveOpacity} 
    // We want to disable hover dimming
    hoverDimmingValue={variables_1.default.checkboxLabelHoverOpacity} style={[styles.flexRow, styles.alignItemsCenter, styles.noSelect, styles.w100]} wrapperStyle={[styles.ml3, styles.pr2, styles.w100, styles.flexWrap, styles.flexShrink1]}>
                    {!!label && <Text_1.default style={[styles.ml1]}>{label}</Text_1.default>}
                    {!!LabelComponent && <LabelComponent />}
                </PressableWithFeedback_1.default>
            </react_native_1.View>
            <FormHelpMessage_1.default message={errorText}/>
        </react_native_1.View>);
}
CheckboxWithLabel.displayName = 'CheckboxWithLabel';
exports.default = react_1.default.forwardRef(CheckboxWithLabel);
