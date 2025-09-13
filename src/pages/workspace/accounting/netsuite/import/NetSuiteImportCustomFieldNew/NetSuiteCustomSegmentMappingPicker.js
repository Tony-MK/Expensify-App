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
function NetSuiteCustomSegmentMappingPicker({ value, errorText, onInputChange }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const selectionData = [
        {
            text: translate(`workspace.netsuite.import.importCustomFields.customSegments.addForm.segmentTitle`),
            keyForList: CONST_1.default.NETSUITE_CUSTOM_RECORD_TYPES.CUSTOM_SEGMENT,
            isSelected: value === CONST_1.default.NETSUITE_CUSTOM_RECORD_TYPES.CUSTOM_SEGMENT,
            value: CONST_1.default.NETSUITE_CUSTOM_RECORD_TYPES.CUSTOM_SEGMENT,
        },
        {
            text: translate(`workspace.netsuite.import.importCustomFields.customSegments.addForm.recordTitle`),
            keyForList: CONST_1.default.NETSUITE_CUSTOM_RECORD_TYPES.CUSTOM_RECORD,
            isSelected: value === CONST_1.default.NETSUITE_CUSTOM_RECORD_TYPES.CUSTOM_RECORD,
            value: CONST_1.default.NETSUITE_CUSTOM_RECORD_TYPES.CUSTOM_RECORD,
        },
    ];
    return (<>
            <SelectionList_1.default sections={[{ data: selectionData }]} onSelectRow={(selected) => {
            onInputChange?.(selected.value);
        }} ListItem={RadioListItem_1.default} initiallyFocusedOptionKey={value ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.TAG} shouldSingleExecuteRowSelect shouldUpdateFocusedIndex/>
            {!!errorText && (<react_native_1.View style={styles.ph5}>
                    <FormHelpMessage_1.default isError={!!errorText} message={errorText}/>
                </react_native_1.View>)}
        </>);
}
NetSuiteCustomSegmentMappingPicker.displayName = 'NetSuiteCustomSegmentMappingPicker';
exports.default = NetSuiteCustomSegmentMappingPicker;
