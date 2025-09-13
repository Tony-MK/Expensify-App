"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
function ValueSelectionList({ items = [], selectedItem, onItemSelected, shouldShowTooltips = true }) {
    const sections = (0, react_1.useMemo)(() => [{ data: items.map((item) => ({ value: item.value, alternateText: item.description, text: item.label ?? '', isSelected: item === selectedItem, keyForList: item.value ?? '' })) }], [items, selectedItem]);
    return (<SelectionList_1.default sections={sections} onSelectRow={(item) => onItemSelected?.(item)} initiallyFocusedOptionKey={selectedItem?.value} shouldStopPropagation shouldShowTooltips={shouldShowTooltips} shouldUpdateFocusedIndex ListItem={RadioListItem_1.default} addBottomSafeAreaPadding/>);
}
ValueSelectionList.displayName = 'ValueSelectionList';
exports.default = ValueSelectionList;
