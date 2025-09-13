"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const SelectCircle_1 = require("@components/SelectCircle");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const BaseListItem_1 = require("./BaseListItem");
function SelectableListItem({ item, isFocused, showTooltip, isDisabled, canSelectMultiple, onSelectRow, onCheckboxPress, onDismissError, onFocus, shouldSyncFocus, }) {
    const styles = (0, useThemeStyles_1.default)();
    const handleCheckboxPress = (0, react_1.useCallback)(() => {
        if (onCheckboxPress) {
            onCheckboxPress(item);
        }
        else {
            onSelectRow(item);
        }
    }, [item, onCheckboxPress, onSelectRow]);
    return (<BaseListItem_1.default item={item} wrapperStyle={[styles.flex1, styles.justifyContentBetween, styles.sidebarLinkInner]} isFocused={isFocused} isDisabled={isDisabled} showTooltip={showTooltip} canSelectMultiple={canSelectMultiple} onSelectRow={onSelectRow} onDismissError={onDismissError} errors={item.errors} pendingAction={item.pendingAction} keyForList={item.keyForList} onFocus={onFocus} shouldSyncFocus={shouldSyncFocus}>
            <>
                <react_native_1.View style={[styles.flex1, styles.flexColumn, styles.justifyContentCenter, styles.alignItemsStretch, styles.optionRow]}>
                    <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter]}>
                        <TextWithTooltip_1.default shouldShowTooltip={showTooltip} text={item.text ?? ''} style={[
            styles.optionDisplayName,
            isFocused ? styles.sidebarLinkActiveText : styles.sidebarLinkText,
            item.isBold !== false && styles.sidebarLinkTextBold,
            styles.pre,
            item.alternateText ? styles.mb1 : null,
        ]}/>
                    </react_native_1.View>
                </react_native_1.View>
                {!!canSelectMultiple && !item.isDisabled && (<PressableWithFeedback_1.default onPress={handleCheckboxPress} disabled={isDisabled} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={item.text ?? ''} style={[styles.ml2, styles.optionSelectCircle]}>
                        <SelectCircle_1.default isChecked={item.isSelected ?? false} selectCircleStyles={styles.ml0}/>
                    </PressableWithFeedback_1.default>)}
            </>
        </BaseListItem_1.default>);
}
SelectableListItem.displayName = 'SelectableListItem';
exports.default = SelectableListItem;
