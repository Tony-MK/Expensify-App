"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SelectionList_1 = require("@components/SelectionList");
const SingleSelectListItem_1 = require("@components/SelectionList/SingleSelectListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ROUTES_1 = require("@src/ROUTES");
const SearchFilterPageFooterButtons_1 = require("./SearchFilterPageFooterButtons");
function SearchSingleSelectionPicker({ items, initiallySelectedItem, pickerTitle, onSaveSelection, shouldShowTextInput = true }) {
    const { translate } = (0, useLocalize_1.default)();
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const [selectedItem, setSelectedItem] = (0, react_1.useState)(initiallySelectedItem);
    (0, react_1.useEffect)(() => {
        setSelectedItem(initiallySelectedItem);
    }, [initiallySelectedItem]);
    const { sections, noResultsFound } = (0, react_1.useMemo)(() => {
        const initiallySelectedItemSection = initiallySelectedItem?.name.toLowerCase().includes(debouncedSearchTerm?.toLowerCase())
            ? [
                {
                    text: initiallySelectedItem.name,
                    keyForList: initiallySelectedItem.value,
                    isSelected: selectedItem?.value === initiallySelectedItem.value,
                    value: initiallySelectedItem.value,
                },
            ]
            : [];
        const remainingItemsSection = items
            .filter((item) => item?.value !== initiallySelectedItem?.value && item?.name?.toLowerCase().includes(debouncedSearchTerm?.toLowerCase()))
            .map((item) => ({
            text: item.name,
            keyForList: item.value,
            isSelected: selectedItem?.value === item.value,
            value: item.value,
        }));
        const isEmpty = !initiallySelectedItemSection.length && !remainingItemsSection.length;
        return {
            sections: isEmpty
                ? []
                : [
                    {
                        title: undefined,
                        data: initiallySelectedItemSection,
                        shouldShow: initiallySelectedItemSection.length > 0,
                        indexOffset: 0,
                    },
                    {
                        title: pickerTitle,
                        data: remainingItemsSection,
                        shouldShow: remainingItemsSection.length > 0,
                        indexOffset: initiallySelectedItemSection.length,
                    },
                ],
            noResultsFound: isEmpty,
        };
    }, [initiallySelectedItem, selectedItem, items, pickerTitle, debouncedSearchTerm]);
    const onSelectItem = (0, react_1.useCallback)((item) => {
        if (!item.text || !item.keyForList || !item.value) {
            return;
        }
        if (!item.isSelected) {
            setSelectedItem({ name: item.text, value: item.value });
        }
    }, []);
    const resetChanges = (0, react_1.useCallback)(() => {
        setSelectedItem(undefined);
    }, []);
    const applyChanges = (0, react_1.useCallback)(() => {
        onSaveSelection(selectedItem?.value);
        Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
    }, [onSaveSelection, selectedItem]);
    const footerContent = (0, react_1.useMemo)(() => (<SearchFilterPageFooterButtons_1.default applyChanges={applyChanges} resetChanges={resetChanges}/>), [resetChanges, applyChanges]);
    return (<SelectionList_1.default sections={sections} initiallyFocusedOptionKey={initiallySelectedItem?.value} textInputValue={searchTerm} onChangeText={setSearchTerm} textInputLabel={shouldShowTextInput ? translate('common.search') : undefined} onSelectRow={onSelectItem} headerMessage={noResultsFound ? translate('common.noResultsFound') : undefined} footerContent={footerContent} shouldStopPropagation showLoadingPlaceholder={!noResultsFound} shouldShowTooltips ListItem={SingleSelectListItem_1.default} shouldUpdateFocusedIndex/>);
}
SearchSingleSelectionPicker.displayName = 'SearchSingleSelectionPicker';
exports.default = SearchSingleSelectionPicker;
