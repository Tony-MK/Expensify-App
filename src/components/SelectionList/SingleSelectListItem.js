"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Checkbox_1 = require("@components/Checkbox");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const RadioListItem_1 = require("./RadioListItem");
/**
 * SingleSelectListItem mirrors the behavior of a default RadioListItem, but adds support
 * for the new style of single selection lists.
 */
function SingleSelectListItem({ item, isFocused, showTooltip, isDisabled, onSelectRow, onDismissError, shouldPreventEnterKeySubmit, isMultilineSupported = false, isAlternateTextMultilineSupported = false, alternateTextNumberOfLines = 2, onFocus, shouldSyncFocus, wrapperStyle, titleStyles, }) {
    const styles = (0, useThemeStyles_1.default)();
    const isSelected = item.isSelected;
    const radioCheckboxComponent = (0, react_1.useCallback)(() => {
        return (<Checkbox_1.default shouldSelectOnPressEnter containerBorderRadius={999} accessibilityLabel="SingleSelectListItem" isChecked={isSelected} onPress={() => onSelectRow(item)}/>);
    }, [isSelected, item, onSelectRow]);
    return (<RadioListItem_1.default item={item} isFocused={isFocused} showTooltip={showTooltip} isDisabled={isDisabled} rightHandSideComponent={radioCheckboxComponent} onSelectRow={onSelectRow} onDismissError={onDismissError} shouldPreventEnterKeySubmit={shouldPreventEnterKeySubmit} isMultilineSupported={isMultilineSupported} isAlternateTextMultilineSupported={isAlternateTextMultilineSupported} alternateTextNumberOfLines={alternateTextNumberOfLines} onFocus={onFocus} shouldSyncFocus={shouldSyncFocus} wrapperStyle={[wrapperStyle, styles.optionRowCompact]} titleStyles={titleStyles}/>);
}
SingleSelectListItem.displayName = 'SingleSelectListItem';
exports.default = SingleSelectListItem;
