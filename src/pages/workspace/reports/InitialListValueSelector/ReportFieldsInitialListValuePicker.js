"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
function ReportFieldsInitialListValuePicker({ listValues, disabledOptions, value, onValueChange }) {
    const { localeCompare } = (0, useLocalize_1.default)();
    const listValueSections = (0, react_1.useMemo)(() => [
        {
            data: Object.values(listValues ?? {})
                .filter((listValue, index) => !disabledOptions.at(index))
                .sort(localeCompare)
                .map((listValue) => ({
                keyForList: listValue,
                value: listValue,
                isSelected: value === listValue,
                text: listValue,
            })),
        },
    ], [value, listValues, disabledOptions, localeCompare]);
    return (<SelectionList_1.default sections={listValueSections} ListItem={RadioListItem_1.default} onSelectRow={(item) => onValueChange(item.value)} initiallyFocusedOptionKey={listValueSections.at(0)?.data?.find((listValue) => listValue.isSelected)?.keyForList} addBottomSafeAreaPadding/>);
}
ReportFieldsInitialListValuePicker.displayName = 'ReportFieldsInitialListValuePicker';
exports.default = ReportFieldsInitialListValuePicker;
