"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const PressableWithoutFeedback_1 = require("./Pressable/PressableWithoutFeedback");
const SelectCircle_1 = require("./SelectCircle");
const Text_1 = require("./Text");
function SingleOptionSelector({ options = [], selectedOptionKey, onSelectOption = () => { }, optionRowStyles, selectCircleStyles }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<react_native_1.View style={styles.pt4}>
            {options.map((option) => (<react_native_1.View style={styles.flexRow} key={option.key}>
                    <PressableWithoutFeedback_1.default style={[styles.singleOptionSelectorRow, optionRowStyles]} onPress={() => onSelectOption(option)} role={CONST_1.default.ROLE.BUTTON} accessibilityState={{ checked: selectedOptionKey === option.key }} aria-checked={selectedOptionKey === option.key} accessibilityLabel={option.label}>
                        <SelectCircle_1.default isChecked={selectedOptionKey ? selectedOptionKey === option.key : false} selectCircleStyles={[styles.ml0, styles.singleOptionSelectorCircle, selectCircleStyles]}/>
                        <Text_1.default>{translate(option.label)}</Text_1.default>
                    </PressableWithoutFeedback_1.default>
                </react_native_1.View>))}
        </react_native_1.View>);
}
SingleOptionSelector.displayName = 'SingleOptionSelector';
exports.default = SingleOptionSelector;
