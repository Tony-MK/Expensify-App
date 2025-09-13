"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const InteractiveStepSubHeader_1 = require("@components/InteractiveStepSubHeader");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
function ReviewFields({ stepNames, label, options, index, onSelectRow }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    let falsyCount = 0;
    const filteredOptions = options?.filter((name) => {
        if (name.text !== translate('violations.none')) {
            return true;
        }
        falsyCount++;
        return falsyCount <= 1;
    });
    const sections = (0, react_1.useMemo)(() => filteredOptions?.map((option) => ({
        text: option.text,
        keyForList: option.text,
        value: option.value,
    })), [filteredOptions]);
    return (<react_native_1.View key={index} style={styles.flex1}>
            {stepNames.length > 1 && (<react_native_1.View style={[styles.w100, styles.ph5, styles.mb5, styles.mt3, { height: CONST_1.default.BANK_ACCOUNT.STEPS_HEADER_HEIGHT }]}>
                    <InteractiveStepSubHeader_1.default stepNames={stepNames} startStepIndex={index}/>
                </react_native_1.View>)}

            <Text_1.default family="EXP_NEW_KANSAS_MEDIUM" fontSize={variables_1.default.fontSizeLarge} style={[styles.pb5, styles.ph5, stepNames.length < 1 && styles.mt3]}>
                {label}
            </Text_1.default>
            <SelectionList_1.default sections={[{ data: sections ?? [] }]} ListItem={RadioListItem_1.default} onSelectRow={onSelectRow}/>
        </react_native_1.View>);
}
ReviewFields.displayName = 'ReviewFields';
exports.default = ReviewFields;
