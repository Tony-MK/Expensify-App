"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const SelectionList_1 = require("@components/SelectionList");
const SingleSelectListItem_1 = require("@components/SelectionList/SingleSelectListItem");
const Text_1 = require("@components/Text");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
function SingleSelectPopup({ label, value, items, closeOverlay, onChange, isSearchable, searchPlaceholder }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const [selectedItem, setSelectedItem] = (0, react_1.useState)(value);
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const { sections, noResultsFound } = (0, react_1.useMemo)(() => {
        // If the selection is searchable, we push the initially selected item into its own section and display it at the top
        if (isSearchable) {
            const initiallySelectedItemSection = value?.text.toLowerCase().includes(debouncedSearchTerm?.toLowerCase())
                ? [{ text: value.text, keyForList: value.value, isSelected: selectedItem?.value === value.value }]
                : [];
            const remainingItemsSection = items
                .filter((item) => item?.value !== value?.value && item?.text?.toLowerCase().includes(debouncedSearchTerm?.toLowerCase()))
                .map((item) => ({
                text: item.text,
                keyForList: item.value,
                isSelected: selectedItem?.value === item.value,
            }));
            const isEmpty = !initiallySelectedItemSection.length && !remainingItemsSection.length;
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
                    data: items.map((item) => ({
                        text: item.text,
                        keyForList: item.value,
                        isSelected: item.value === selectedItem?.value,
                    })),
                },
            ],
            noResultsFound: false,
        };
    }, [isSearchable, items, value, selectedItem, debouncedSearchTerm]);
    const dataLength = (0, react_1.useMemo)(() => sections.flatMap((section) => section.data).length, [sections]);
    const updateSelectedItem = (0, react_1.useCallback)((item) => {
        const newItem = items.find((i) => i.value === item.keyForList) ?? null;
        setSelectedItem(newItem);
    }, [items]);
    const applyChanges = (0, react_1.useCallback)(() => {
        onChange(selectedItem);
        closeOverlay();
    }, [closeOverlay, onChange, selectedItem]);
    const resetChanges = (0, react_1.useCallback)(() => {
        onChange(null);
        closeOverlay();
    }, [closeOverlay, onChange]);
    return (<react_native_1.View style={[!isSmallScreenWidth && styles.pv4, styles.gap2]}>
            {isSmallScreenWidth && <Text_1.default style={[styles.textLabel, styles.textSupporting, styles.ph5, styles.pv1]}>{label}</Text_1.default>}

            <react_native_1.View style={[styles.getSelectionListPopoverHeight(dataLength || 1, windowHeight, isSearchable ?? false)]}>
                <SelectionList_1.default shouldSingleExecuteRowSelect sections={sections} ListItem={SingleSelectListItem_1.default} onSelectRow={updateSelectedItem} textInputValue={searchTerm} onChangeText={setSearchTerm} textInputLabel={isSearchable ? (searchPlaceholder ?? translate('common.search')) : undefined} shouldUpdateFocusedIndex={isSearchable} initiallyFocusedOptionKey={isSearchable ? value?.value : undefined} headerMessage={noResultsFound ? translate('common.noResultsFound') : undefined} showLoadingPlaceholder={!noResultsFound}/>
            </react_native_1.View>
            <react_native_1.View style={[styles.flexRow, styles.gap2, styles.ph5]}>
                <Button_1.default medium style={[styles.flex1]} text={translate('common.reset')} onPress={resetChanges}/>
                <Button_1.default success medium style={[styles.flex1]} text={translate('common.apply')} onPress={applyChanges}/>
            </react_native_1.View>
        </react_native_1.View>);
}
SingleSelectPopup.displayName = 'SingleSelectPopup';
exports.default = SingleSelectPopup;
