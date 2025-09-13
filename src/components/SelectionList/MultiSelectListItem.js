"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Checkbox_1 = require("@components/Checkbox");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const RadioListItem_1 = require("./RadioListItem");
/**
 * MultiSelectListItem mirrors the behavior of a default RadioListItem, but adds support
 * for the new style of multi selection lists.
 */
function MultiSelectListItem({ item, isFocused, showTooltip, isDisabled, onSelectRow, onDismissError, shouldPreventEnterKeySubmit, isMultilineSupported = false, isAlternateTextMultilineSupported = false, alternateTextNumberOfLines = 2, onFocus, shouldSyncFocus, wrapperStyle, titleStyles, }) {
    const styles = (0, useThemeStyles_1.default)();
    const isSelected = item.isSelected;
    const checkboxComponent = (0, react_1.useCallback)(() => {
        return (<Checkbox_1.default shouldSelectOnPressEnter isChecked={isSelected} accessibilityLabel={item.text ?? ''} onPress={() => onSelectRow(item)}/>);
    }, [isSelected, item, onSelectRow]);
    return (<RadioListItem_1.default item={item} isFocused={isFocused} showTooltip={showTooltip} isDisabled={isDisabled} rightHandSideComponent={checkboxComponent} onSelectRow={onSelectRow} onDismissError={onDismissError} shouldPreventEnterKeySubmit={shouldPreventEnterKeySubmit} isMultilineSupported={isMultilineSupported} isAlternateTextMultilineSupported={isAlternateTextMultilineSupported} alternateTextNumberOfLines={alternateTextNumberOfLines} onFocus={onFocus} shouldSyncFocus={shouldSyncFocus} wrapperStyle={[wrapperStyle, styles.optionRowCompact]} titleStyles={titleStyles}/>);
}
MultiSelectListItem.displayName = 'MultiSelectListItem';
exports.default = MultiSelectListItem;
