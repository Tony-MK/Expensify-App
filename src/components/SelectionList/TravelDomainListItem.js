"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Badge_1 = require("@components/Badge");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const SelectCircle_1 = require("@components/SelectCircle");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const BaseListItem_1 = require("./BaseListItem");
function TravelDomainListItem({ item, isFocused, showTooltip, isDisabled, onSelectRow, onCheckboxPress, onFocus, shouldSyncFocus }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const handleCheckboxPress = (0, react_1.useCallback)(() => {
        if (onCheckboxPress) {
            onCheckboxPress(item);
        }
        else {
            onSelectRow(item);
        }
    }, [item, onCheckboxPress, onSelectRow]);
    const showRecommendedTag = item.isRecommended ?? false;
    return (<BaseListItem_1.default item={item} wrapperStyle={[styles.flex1, styles.sidebarLinkInner, styles.userSelectNone, styles.optionRow, styles.justifyContentBetween]} isFocused={isFocused} isDisabled={isDisabled} showTooltip={showTooltip} canSelectMultiple onSelectRow={onSelectRow} keyForList={item.keyForList} onFocus={onFocus} shouldSyncFocus={shouldSyncFocus}>
            <>
                <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter]}>
                    <PressableWithFeedback_1.default onPress={handleCheckboxPress} disabled={isDisabled} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={item.text ?? ''} style={[styles.mr2, styles.optionSelectCircle]}>
                        <SelectCircle_1.default isChecked={item.isSelected ?? false} selectCircleStyles={styles.ml0}/>
                    </PressableWithFeedback_1.default>
                    <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter]}>
                        <TextWithTooltip_1.default shouldShowTooltip={showTooltip} text={item.text ?? ''} style={[
            styles.optionDisplayName,
            isFocused ? styles.sidebarLinkActiveText : styles.sidebarLinkText,
            item.isBold !== false && styles.sidebarLinkTextBold,
            styles.pre,
        ]}/>
                    </react_native_1.View>
                </react_native_1.View>
                {showRecommendedTag && <Badge_1.default text={translate('travel.domainSelector.recommended')}/>}
            </>
        </BaseListItem_1.default>);
}
TravelDomainListItem.displayName = 'TravelDomainListItem';
exports.default = TravelDomainListItem;
