"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var SelectionList_1 = require("@components/SelectionList");
var SingleSelectListItem_1 = require("@components/SelectionList/SingleSelectListItem");
var useDebouncedState_1 = require("@hooks/useDebouncedState");
var useLocalize_1 = require("@hooks/useLocalize");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ROUTES_1 = require("@src/ROUTES");
var SearchFilterPageFooterButtons_1 = require("./SearchFilterPageFooterButtons");
function SearchSingleSelectionPicker(_a) {
    var items = _a.items, initiallySelectedItem = _a.initiallySelectedItem, pickerTitle = _a.pickerTitle, onSaveSelection = _a.onSaveSelection, _b = _a.shouldShowTextInput, shouldShowTextInput = _b === void 0 ? true : _b;
    var translate = (0, useLocalize_1.default)().translate;
    var _c = (0, useDebouncedState_1.default)(''), searchTerm = _c[0], debouncedSearchTerm = _c[1], setSearchTerm = _c[2];
    var _d = (0, react_1.useState)(initiallySelectedItem), selectedItem = _d[0], setSelectedItem = _d[1];
    (0, react_1.useEffect)(function () {
        setSelectedItem(initiallySelectedItem);
    }, [initiallySelectedItem]);
    var _e = (0, react_1.useMemo)(function () {
        var initiallySelectedItemSection = (initiallySelectedItem === null || initiallySelectedItem === void 0 ? void 0 : initiallySelectedItem.name.toLowerCase().includes(debouncedSearchTerm === null || debouncedSearchTerm === void 0 ? void 0 : debouncedSearchTerm.toLowerCase()))
            ? [
                {
                    text: initiallySelectedItem.name,
                    keyForList: initiallySelectedItem.value,
                    isSelected: (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.value) === initiallySelectedItem.value,
                    value: initiallySelectedItem.value,
                },
            ]
            : [];
        var remainingItemsSection = items
            .filter(function (item) { var _a; return (item === null || item === void 0 ? void 0 : item.value) !== (initiallySelectedItem === null || initiallySelectedItem === void 0 ? void 0 : initiallySelectedItem.value) && ((_a = item === null || item === void 0 ? void 0 : item.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(debouncedSearchTerm === null || debouncedSearchTerm === void 0 ? void 0 : debouncedSearchTerm.toLowerCase())); })
            .map(function (item) { return ({
            text: item.name,
            keyForList: item.value,
            isSelected: (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.value) === item.value,
            value: item.value,
        }); });
        var isEmpty = !initiallySelectedItemSection.length && !remainingItemsSection.length;
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
    }, [initiallySelectedItem, selectedItem, items, pickerTitle, debouncedSearchTerm]), sections = _e.sections, noResultsFound = _e.noResultsFound;
    var onSelectItem = (0, react_1.useCallback)(function (item) {
        if (!item.text || !item.keyForList || !item.value) {
            return;
        }
        if (!item.isSelected) {
            setSelectedItem({ name: item.text, value: item.value });
        }
    }, []);
    var resetChanges = (0, react_1.useCallback)(function () {
        setSelectedItem(undefined);
    }, []);
    var applyChanges = (0, react_1.useCallback)(function () {
        onSaveSelection(selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.value);
        Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
    }, [onSaveSelection, selectedItem]);
    var footerContent = (0, react_1.useMemo)(function () { return (<SearchFilterPageFooterButtons_1.default applyChanges={applyChanges} resetChanges={resetChanges}/>); }, [resetChanges, applyChanges]);
    return (<SelectionList_1.default sections={sections} initiallyFocusedOptionKey={initiallySelectedItem === null || initiallySelectedItem === void 0 ? void 0 : initiallySelectedItem.value} textInputValue={searchTerm} onChangeText={setSearchTerm} textInputLabel={shouldShowTextInput ? translate('common.search') : undefined} onSelectRow={onSelectItem} headerMessage={noResultsFound ? translate('common.noResultsFound') : undefined} footerContent={footerContent} shouldStopPropagation showLoadingPlaceholder={!noResultsFound} shouldShowTooltips ListItem={SingleSelectListItem_1.default} shouldUpdateFocusedIndex/>);
}
SearchSingleSelectionPicker.displayName = 'SearchSingleSelectionPicker';
exports.default = SearchSingleSelectionPicker;
