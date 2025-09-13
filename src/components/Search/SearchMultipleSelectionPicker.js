"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SelectionList_1 = require("@components/SelectionList");
const MultiSelectListItem_1 = require("@components/SelectionList/MultiSelectListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const ROUTES_1 = require("@src/ROUTES");
const SearchFilterPageFooterButtons_1 = require("./SearchFilterPageFooterButtons");
function SearchMultipleSelectionPicker({ items, initiallySelectedItems, pickerTitle, onSaveSelection, shouldShowTextInput = true }) {
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const [selectedItems, setSelectedItems] = (0, react_1.useState)(initiallySelectedItems ?? []);
    (0, react_1.useEffect)(() => {
        setSelectedItems(initiallySelectedItems ?? []);
    }, [initiallySelectedItems]);
    const { sections, noResultsFound } = (0, react_1.useMemo)(() => {
        const selectedItemsSection = selectedItems
            .filter((item) => item?.name.toLowerCase().includes(debouncedSearchTerm?.toLowerCase()))
            .sort((a, b) => (0, SearchQueryUtils_1.sortOptionsWithEmptyValue)(a.value.toString(), b.value.toString(), localeCompare))
            .map((item) => ({
            text: item.name,
            keyForList: item.name,
            isSelected: true,
            value: item.value,
        }));
        const remainingItemsSection = items
            .filter((item) => !selectedItems.some((selectedItem) => selectedItem.value.toString() === item.value.toString()) && item?.name?.toLowerCase().includes(debouncedSearchTerm?.toLowerCase()))
            .sort((a, b) => (0, SearchQueryUtils_1.sortOptionsWithEmptyValue)(a.value.toString(), b.value.toString(), localeCompare))
            .map((item) => ({
            text: item.name,
            keyForList: item.name,
            isSelected: false,
            value: item.value,
        }));
        const isEmpty = !selectedItemsSection.length && !remainingItemsSection.length;
        return {
            sections: isEmpty
                ? []
                : [
                    {
                        title: undefined,
                        data: selectedItemsSection,
                        shouldShow: selectedItemsSection.length > 0,
                    },
                    {
                        title: pickerTitle,
                        data: remainingItemsSection,
                        shouldShow: remainingItemsSection.length > 0,
                    },
                ],
            noResultsFound: isEmpty,
        };
    }, [selectedItems, items, pickerTitle, debouncedSearchTerm, localeCompare]);
    const onSelectItem = (0, react_1.useCallback)((item) => {
        if (!item.text || !item.keyForList || !item.value) {
            return;
        }
        if (item.isSelected) {
            setSelectedItems(selectedItems?.filter((selectedItem) => selectedItem.name !== item.keyForList));
        }
        else {
            setSelectedItems([...(selectedItems ?? []), { name: item.text, value: item.value }]);
        }
    }, [selectedItems]);
    const resetChanges = (0, react_1.useCallback)(() => {
        setSelectedItems([]);
    }, []);
    const applyChanges = (0, react_1.useCallback)(() => {
        onSaveSelection(selectedItems.map((item) => item.value).flat());
        Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
    }, [onSaveSelection, selectedItems]);
    const footerContent = (0, react_1.useMemo)(() => (<SearchFilterPageFooterButtons_1.default applyChanges={applyChanges} resetChanges={resetChanges}/>), [resetChanges, applyChanges]);
    return (<SelectionList_1.default sections={sections} textInputValue={searchTerm} onChangeText={setSearchTerm} textInputLabel={shouldShowTextInput ? translate('common.search') : undefined} onSelectRow={onSelectItem} headerMessage={noResultsFound ? translate('common.noResultsFound') : undefined} footerContent={footerContent} shouldStopPropagation showLoadingPlaceholder={!noResultsFound} shouldShowTooltips canSelectMultiple ListItem={MultiSelectListItem_1.default}/>);
}
SearchMultipleSelectionPicker.displayName = 'SearchMultipleSelectionPicker';
exports.default = SearchMultipleSelectionPicker;
