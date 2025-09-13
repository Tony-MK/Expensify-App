"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const Pressable_1 = require("@components/Pressable");
const RadioButton_1 = require("@components/RadioButton");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function MergeFieldReview({ mergeField, onValueSelected, errorText }) {
    const { label, field, options } = mergeField;
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={[styles.mb3, styles.pv5, styles.borderRadiusComponentLarge, styles.highlightBG]}>
            <Text_1.default style={[styles.textSupporting, styles.pb3, styles.ph5]}>{label}</Text_1.default>
            {options.map((option) => {
            const { transaction, displayValue, isSelected } = option;
            return (<Pressable_1.PressableWithoutFeedback key={`${field}-${transaction.transactionID}`} onPress={() => onValueSelected(transaction, field)} accessibilityLabel={displayValue} accessible={false} hoverStyle={styles.hoveredComponentBG} style={[styles.flexRow, styles.alignItemsCenter, styles.justifyContentBetween, styles.pv5, styles.ph5]}>
                        <Text_1.default style={[styles.flex1, styles.mr1, styles.textBold, styles.breakWord]}>{displayValue}</Text_1.default>
                        <RadioButton_1.default isChecked={isSelected} onPress={() => onValueSelected(transaction, field)} accessibilityLabel={displayValue} shouldUseNewStyle/>
                    </Pressable_1.PressableWithoutFeedback>);
        })}
            {!!errorText && (<FormHelpMessage_1.default message={errorText} style={[styles.ph5]}/>)}
        </react_native_1.View>);
}
MergeFieldReview.displayName = 'MergeFieldReview';
exports.default = MergeFieldReview;
