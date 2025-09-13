"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Button_1 = require("@components/Button");
var SelectionList_1 = require("@components/SelectionList");
var SingleSelectListItem_1 = require("@components/SelectionList/SingleSelectListItem");
var Text_1 = require("@components/Text");
var useDebouncedState_1 = require("@hooks/useDebouncedState");
var useLocalize_1 = require("@hooks/useLocalize");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var useWindowDimensions_1 = require("@hooks/useWindowDimensions");
function SingleSelectPopup(_a) {
    var label = _a.label, value = _a.value, items = _a.items, closeOverlay = _a.closeOverlay, onChange = _a.onChange, isSearchable = _a.isSearchable, searchPlaceholder = _a.searchPlaceholder;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    var isSmallScreenWidth = (0, useResponsiveLayout_1.default)().isSmallScreenWidth;
    var windowHeight = (0, useWindowDimensions_1.default)().windowHeight;
    var _b = (0, react_1.useState)(value), selectedItem = _b[0], setSelectedItem = _b[1];
    var _c = (0, useDebouncedState_1.default)(''), searchTerm = _c[0], debouncedSearchTerm = _c[1], setSearchTerm = _c[2];
    var _d = (0, react_1.useMemo)(function () {
        // If the selection is searchable, we push the initially selected item into its own section and display it at the top
        if (isSearchable) {
            var initiallySelectedItemSection = (value === null || value === void 0 ? void 0 : value.text.toLowerCase().includes(debouncedSearchTerm === null || debouncedSearchTerm === void 0 ? void 0 : debouncedSearchTerm.toLowerCase()))
                ? [{ text: value.text, keyForList: value.value, isSelected: (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.value) === value.value }]
                : [];
            var remainingItemsSection = items
                .filter(function (item) { var _a; return (item === null || item === void 0 ? void 0 : item.value) !== (value === null || value === void 0 ? void 0 : value.value) && ((_a = item === null || item === void 0 ? void 0 : item.text) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(debouncedSearchTerm === null || debouncedSearchTerm === void 0 ? void 0 : debouncedSearchTerm.toLowerCase())); })
                .map(function (item) { return ({
                text: item.text,
                keyForList: item.value,
                isSelected: (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.value) === item.value,
            }); });
            var isEmpty = !initiallySelectedItemSection.length && !remainingItemsSection.length;
            return {
                sections: isEmpty
                    ? []
                    : [
                        {
                            data: initiallySelectedItemSection,
                            shouldShow: initiallySelectedItemSection.length > 0,
                            indexOffset: 0,
                        },
                        {
                            data: remainingItemsSection,
                            shouldShow: remainingItemsSection.length > 0,
                            indexOffset: initiallySelectedItemSection.length,
                        },
                    ],
                noResultsFound: isEmpty,
            };
        }
        return {
            sections: [
                {
                    data: items.map(function (item) { return ({
                        text: item.text,
                        keyForList: item.value,
                        isSelected: item.value === (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.value),
                    }); }),
                },
            ],
            noResultsFound: false,
        };
    }, [isSearchable, items, value, selectedItem, debouncedSearchTerm]), sections = _d.sections, noResultsFound = _d.noResultsFound;
    var dataLength = (0, react_1.useMemo)(function () { return sections.flatMap(function (section) { return section.data; }).length; }, [sections]);
    var updateSelectedItem = (0, react_1.useCallback)(function (item) {
        var _a;
        var newItem = (_a = items.find(function (i) { return i.value === item.keyForList; })) !== null && _a !== void 0 ? _a : null;
        setSelectedItem(newItem);
    }, [items]);
    var applyChanges = (0, react_1.useCallback)(function () {
        onChange(selectedItem);
        closeOverlay();
    }, [closeOverlay, onChange, selectedItem]);
    var resetChanges = (0, react_1.useCallback)(function () {
        onChange(null);
        closeOverlay();
    }, [closeOverlay, onChange]);
    return (<react_native_1.View style={[!isSmallScreenWidth && styles.pv4, styles.gap2]}>
            {isSmallScreenWidth && <Text_1.default style={[styles.textLabel, styles.textSupporting, styles.ph5, styles.pv1]}>{label}</Text_1.default>}

            <react_native_1.View style={[styles.getSelectionListPopoverHeight(dataLength || 1, windowHeight, isSearchable !== null && isSearchable !== void 0 ? isSearchable : false)]}>
                <SelectionList_1.default shouldSingleExecuteRowSelect sections={sections} ListItem={SingleSelectListItem_1.default} onSelectRow={updateSelectedItem} textInputValue={searchTerm} onChangeText={setSearchTerm} textInputLabel={isSearchable ? (searchPlaceholder !== null && searchPlaceholder !== void 0 ? searchPlaceholder : translate('common.search')) : undefined} shouldUpdateFocusedIndex={isSearchable} initiallyFocusedOptionKey={isSearchable ? value === null || value === void 0 ? void 0 : value.value : undefined} headerMessage={noResultsFound ? translate('common.noResultsFound') : undefined} showLoadingPlaceholder={!noResultsFound}/>
            </react_native_1.View>
            <react_native_1.View style={[styles.flexRow, styles.gap2, styles.ph5]}>
                <Button_1.default medium style={[styles.flex1]} text={translate('common.reset')} onPress={resetChanges}/>
                <Button_1.default success medium style={[styles.flex1]} text={translate('common.apply')} onPress={applyChanges}/>
            </react_native_1.View>
        </react_native_1.View>);
}
SingleSelectPopup.displayName = 'SingleSelectPopup';
exports.default = SingleSelectPopup;
