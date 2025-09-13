"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var FormHelpMessage_1 = require("@components/FormHelpMessage");
var Pressable_1 = require("@components/Pressable");
var RadioButton_1 = require("@components/RadioButton");
var Text_1 = require("@components/Text");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
function MergeFieldReview(_a) {
    var mergeField = _a.mergeField, onValueSelected = _a.onValueSelected, errorText = _a.errorText;
    var label = mergeField.label, field = mergeField.field, options = mergeField.options;
    var styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={[styles.mb3, styles.pv5, styles.borderRadiusComponentLarge, styles.highlightBG]}>
            <Text_1.default style={[styles.textSupporting, styles.pb3, styles.ph5]}>{label}</Text_1.default>
            {options.map(function (option) {
            var transaction = option.transaction, displayValue = option.displayValue, isSelected = option.isSelected;
            return (<Pressable_1.PressableWithoutFeedback key={"".concat(field, "-").concat(transaction.transactionID)} onPress={function () { return onValueSelected(transaction, field); }} accessibilityLabel={displayValue} accessible={false} hoverStyle={styles.hoveredComponentBG} style={[styles.flexRow, styles.alignItemsCenter, styles.justifyContentBetween, styles.pv5, styles.ph5]}>
                        <Text_1.default style={[styles.flex1, styles.mr1, styles.textBold, styles.breakWord]}>{displayValue}</Text_1.default>
                        <RadioButton_1.default isChecked={isSelected} onPress={function () { return onValueSelected(transaction, field); }} accessibilityLabel={displayValue} shouldUseNewStyle/>
                    </Pressable_1.PressableWithoutFeedback>);
        })}
            {!!errorText && (<FormHelpMessage_1.default message={errorText} style={[styles.ph5]}/>)}
        </react_native_1.View>);
}
MergeFieldReview.displayName = 'MergeFieldReview';
exports.default = MergeFieldReview;
