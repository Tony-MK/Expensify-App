"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useTheme_1 = require("@hooks/useTheme");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const ReportFieldOptionsListUtils_1 = require("@libs/ReportFieldOptionsListUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function EditReportFieldDropdownPage({ onSubmit, fieldKey, fieldValue, fieldOptions }) {
    const [recentlyUsedReportFields] = (0, useOnyx_1.default)(ONYXKEYS_1.default.RECENTLY_USED_REPORT_FIELDS, { canBeMissing: true });
    const [searchValue, debouncedSearchValue, setSearchValue] = (0, useDebouncedState_1.default)('');
    const theme = (0, useTheme_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const recentlyUsedOptions = (0, react_1.useMemo)(() => recentlyUsedReportFields?.[fieldKey]?.sort(localeCompare) ?? [], [recentlyUsedReportFields, fieldKey, localeCompare]);
    const itemRightSideComponent = (0, react_1.useCallback)((item) => {
        if (item.text === fieldValue) {
            return (<Icon_1.default src={Expensicons.Checkmark} fill={theme.iconSuccessFill}/>);
        }
        return null;
    }, [theme.iconSuccessFill, fieldValue]);
    const [sections, headerMessage] = (0, react_1.useMemo)(() => {
        const validFieldOptions = fieldOptions?.filter((option) => !!option)?.sort(localeCompare);
        const policyReportFieldOptions = (0, ReportFieldOptionsListUtils_1.getReportFieldOptionsSection)({
            searchValue: debouncedSearchValue,
            selectedOptions: [
                {
                    keyForList: fieldValue,
                    searchText: fieldValue,
                    text: fieldValue,
                },
            ],
            options: validFieldOptions,
            recentlyUsedOptions,
        });
        const policyReportFieldData = policyReportFieldOptions.at(0)?.data ?? [];
        const header = (0, OptionsListUtils_1.getHeaderMessageForNonUserList)(policyReportFieldData.length > 0, debouncedSearchValue);
        return [policyReportFieldOptions, header];
    }, [fieldOptions, localeCompare, debouncedSearchValue, fieldValue, recentlyUsedOptions]);
    const selectedOptionKey = (0, react_1.useMemo)(() => (sections.at(0)?.data ?? []).filter((option) => option.searchText === fieldValue)?.at(0)?.keyForList, [sections, fieldValue]);
    return (<SelectionList_1.default textInputValue={searchValue} textInputLabel={translate('common.search')} sections={sections ?? []} onSelectRow={(option) => onSubmit({ [fieldKey]: !option?.text || fieldValue === option.text ? '' : option.text })} initiallyFocusedOptionKey={selectedOptionKey ?? undefined} onChangeText={setSearchValue} headerMessage={headerMessage} ListItem={RadioListItem_1.default} isRowMultilineSupported rightHandSideComponent={itemRightSideComponent}/>);
}
EditReportFieldDropdownPage.displayName = 'EditReportFieldDropdownPage';
exports.default = EditReportFieldDropdownPage;
