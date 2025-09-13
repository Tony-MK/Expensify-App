"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const SelectionList_1 = require("@components/SelectionList");
const MultiSelectListItem_1 = require("@components/SelectionList/MultiSelectListItem");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
function MultiSelectPopup({ label, value, items, closeOverlay, onChange }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const [selectedItems, setSelectedItems] = (0, react_1.useState)(value);
    const listData = (0, react_1.useMemo)(() => {
        return items.map((item) => ({
            text: item.text,
            keyForList: item.value,
            isSelected: !!selectedItems.find((i) => i.value === item.value),
        }));
    }, [items, selectedItems]);
    const updateSelectedItems = (0, react_1.useCallback)((item) => {
        if (item.isSelected) {
            setSelectedItems(selectedItems.filter((i) => i.value !== item.keyForList));
            return;
        }
        const newItem = items.find((i) => i.value === item.keyForList);
        if (newItem) {
            setSelectedItems([...selectedItems, newItem]);
        }
    }, [items, selectedItems]);
    const applyChanges = (0, react_1.useCallback)(() => {
        onChange(selectedItems);
        closeOverlay();
    }, [closeOverlay, onChange, selectedItems]);
    const resetChanges = (0, react_1.useCallback)(() => {
        onChange([]);
        closeOverlay();
    }, [closeOverlay, onChange]);
    return (<react_native_1.View style={[!isSmallScreenWidth && styles.pv4, styles.gap2]}>
            {isSmallScreenWidth && <Text_1.default style={[styles.textLabel, styles.textSupporting, styles.ph5, styles.pv1]}>{label}</Text_1.default>}

            <react_native_1.View style={[styles.getSelectionListPopoverHeight(items.length, windowHeight, false)]}>
                <SelectionList_1.default shouldSingleExecuteRowSelect sections={[{ data: listData }]} ListItem={MultiSelectListItem_1.default} onSelectRow={updateSelectedItems}/>
            </react_native_1.View>

            <react_native_1.View style={[styles.flexRow, styles.gap2, styles.ph5]}>
                <Button_1.default medium style={[styles.flex1]} text={translate('common.reset')} onPress={resetChanges}/>
                <Button_1.default success medium style={[styles.flex1]} text={translate('common.apply')} onPress={applyChanges}/>
            </react_native_1.View>
        </react_native_1.View>);
}
MultiSelectPopup.displayName = 'MultiSelectPopup';
exports.default = MultiSelectPopup;
