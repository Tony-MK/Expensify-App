"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isObject_1 = require("lodash/isObject");
const react_1 = require("react");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const tokenizedSearch_1 = require("@libs/tokenizedSearch");
const const_1 = require("./const");
function ConstantPicker({ formType, fieldName, fieldValue, onSubmit }) {
    const { translate } = (0, useLocalize_1.default)();
    const [searchValue, setSearchValue] = (0, react_1.useState)('');
    const sections = (0, react_1.useMemo)(() => Object.entries(const_1.DETAILS_CONSTANT_FIELDS[formType].find((field) => field.fieldName === fieldName)?.options ?? {})
        .reduce((acc, [key, value]) => {
        // Option has multiple constants, so we need to flatten these into separate options
        if ((0, isObject_1.default)(value)) {
            acc.push(...Object.entries(value));
            return acc;
        }
        acc.push([key, String(value)]);
        return acc;
    }, [])
        .map(([key, value]) => ({
        text: value,
        keyForList: key,
        isSelected: value === fieldValue,
        searchText: value,
    }))
        .filter(({ searchText }) => {
        return (0, tokenizedSearch_1.default)([{ searchText }], searchValue, (item) => [item.searchText]).length > 0;
    }), [fieldName, fieldValue, formType, searchValue]);
    const selectedOptionKey = (0, react_1.useMemo)(() => sections.filter((option) => option.searchText === fieldValue).at(0)?.keyForList, [sections, fieldValue]);
    return (<SelectionList_1.default sections={[{ data: sections }]} textInputValue={searchValue} textInputLabel={translate('common.search')} onChangeText={setSearchValue} onSelectRow={onSubmit} ListItem={RadioListItem_1.default} initiallyFocusedOptionKey={selectedOptionKey ?? undefined} isRowMultilineSupported/>);
}
ConstantPicker.default = 'ConstantPicker';
exports.default = ConstantPicker;
