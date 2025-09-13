"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function NetSuiteCustomFieldMappingPicker({ value, errorText, onInputChange }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const options = [CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.TAG, CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.REPORT_FIELD];
    const selectionData = options.map((option) => ({
        text: translate(`workspace.netsuite.import.importTypes.${option}.label`),
        keyForList: option,
        isSelected: value === option,
        value: option,
        alternateText: translate(`workspace.netsuite.import.importTypes.${option}.description`),
    })) ?? [];
    return (<>
            <SelectionList_1.default sections={[{ data: selectionData }]} onSelectRow={(selected) => {
            onInputChange?.(selected.value);
        }} ListItem={RadioListItem_1.default} initiallyFocusedOptionKey={value ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.TAG} shouldSingleExecuteRowSelect shouldUpdateFocusedIndex/>
            {!!errorText && (<react_native_1.View style={styles.ph5}>
                    <FormHelpMessage_1.default isError={!!errorText} message={errorText}/>
                </react_native_1.View>)}
        </>);
}
NetSuiteCustomFieldMappingPicker.displayName = 'NetSuiteCustomFieldMappingPicker';
exports.default = NetSuiteCustomFieldMappingPicker;
