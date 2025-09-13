"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const ProductTrainingContext_1 = require("@components/ProductTrainingContext");
const ReportActionAvatars_1 = require("@components/ReportActionAvatars");
const SelectCircle_1 = require("@components/SelectCircle");
const Text_1 = require("@components/Text");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const EducationalTooltip_1 = require("@components/Tooltip/EducationalTooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const usePermissions_1 = require("@hooks/usePermissions");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const BaseListItem_1 = require("./BaseListItem");
function InviteMemberListItem({ item, isFocused, showTooltip, isDisabled, canSelectMultiple, onSelectRow, onCheckboxPress, onDismissError, rightHandSideComponent, onFocus, shouldSyncFocus, wrapperStyle, canShowProductTrainingTooltip = true, }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const { renderProductTrainingTooltip, shouldShowProductTrainingTooltip } = (0, ProductTrainingContext_1.useProductTrainingContext)(CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP_MANAGER, canShowProductTrainingTooltip &&
        !(0, OptionsListUtils_1.getIsUserSubmittedExpenseOrScannedReceipt)() &&
        isBetaEnabled(CONST_1.default.BETAS.NEWDOT_MANAGER_MCTEST) &&
        (0, ReportUtils_1.isSelectedManagerMcTest)(item.login) &&
        !item.isSelected);
    const focusedBackgroundColor = styles.sidebarLinkActive.backgroundColor;
    const subscriptAvatarBorderColor = isFocused ? focusedBackgroundColor : theme.sidebar;
    const hoveredBackgroundColor = !!styles.sidebarLinkHover && 'backgroundColor' in styles.sidebarLinkHover ? styles.sidebarLinkHover.backgroundColor : theme.sidebar;
    const shouldShowCheckBox = canSelectMultiple && !item.isDisabled;
    const handleCheckboxPress = (0, react_1.useCallback)(() => {
        if (onCheckboxPress) {
            onCheckboxPress(item);
        }
        else {
            onSelectRow(item);
        }
    }, [item, onCheckboxPress, onSelectRow]);
    const firstItemIconID = Number(item?.icons?.at(0)?.id);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const accountID = !item.reportID ? item.accountID || firstItemIconID : undefined;
    return (<BaseListItem_1.default item={item} wrapperStyle={[styles.flex1, styles.justifyContentBetween, styles.sidebarLinkInner, styles.userSelectNone, styles.peopleRow, wrapperStyle]} isFocused={isFocused} isDisabled={isDisabled} showTooltip={showTooltip} canSelectMultiple={canSelectMultiple} onSelectRow={onSelectRow} onDismissError={onDismissError} rightHandSideComponent={rightHandSideComponent} errors={item.errors} pendingAction={item.pendingAction} FooterComponent={item.invitedSecondaryLogin ? (<Text_1.default style={[styles.ml9, styles.ph5, styles.pb3, styles.textLabelSupporting]}>
                        {translate('workspace.people.invitedBySecondaryLogin', { secondaryLogin: item.invitedSecondaryLogin })}
                    </Text_1.default>) : undefined} keyForList={item.keyForList} onFocus={onFocus} shouldSyncFocus={shouldSyncFocus} shouldDisplayRBR={!shouldShowCheckBox} testID={item.text}>
            {(hovered) => (<EducationalTooltip_1.default shouldRender={shouldShowProductTrainingTooltip} renderTooltipContent={renderProductTrainingTooltip} anchorAlignment={{
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
            }} shouldHideOnNavigate wrapperStyle={styles.productTrainingTooltipWrapper}>
                    <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.flex1]}>
                        {(!!item.reportID || !!accountID) && (<ReportActionAvatars_1.default subscriptAvatarBorderColor={hovered && !isFocused ? hoveredBackgroundColor : subscriptAvatarBorderColor} shouldShowTooltip={showTooltip} secondaryAvatarContainerStyle={[
                    StyleUtils.getBackgroundAndBorderStyle(theme.sidebar),
                    isFocused ? StyleUtils.getBackgroundAndBorderStyle(focusedBackgroundColor) : undefined,
                    hovered && !isFocused ? StyleUtils.getBackgroundAndBorderStyle(hoveredBackgroundColor) : undefined,
                ]} fallbackDisplayName={item.text ?? item.alternateText ?? undefined} singleAvatarContainerStyle={[styles.actionAvatar, styles.mr3]} reportID={item.reportID} accountIDs={accountID ? [accountID] : undefined}/>)}
                        <react_native_1.View style={[styles.flex1, styles.flexColumn, styles.justifyContentCenter, styles.alignItemsStretch, styles.optionRow]}>
                            <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter]}>
                                <TextWithTooltip_1.default shouldShowTooltip={showTooltip} text={expensify_common_1.Str.removeSMSDomain(item.text ?? '')} style={[
                styles.optionDisplayName,
                isFocused ? styles.sidebarLinkActiveText : styles.sidebarLinkText,
                item.isBold !== false && styles.sidebarLinkTextBold,
                styles.pre,
                item.alternateText ? styles.mb1 : null,
            ]}/>
                            </react_native_1.View>
                            {!!item.alternateText && (<TextWithTooltip_1.default shouldShowTooltip={showTooltip} text={expensify_common_1.Str.removeSMSDomain(item.alternateText ?? '')} style={[styles.textLabelSupporting, styles.lh16, styles.pre]}/>)}
                        </react_native_1.View>
                        {!!item.rightElement && item.rightElement}
                        {!!shouldShowCheckBox && (<PressableWithFeedback_1.default onPress={handleCheckboxPress} disabled={isDisabled} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={item.text ?? ''} style={[styles.ml2, styles.optionSelectCircle]}>
                                <SelectCircle_1.default isChecked={item.isSelected ?? false} selectCircleStyles={styles.ml0}/>
                            </PressableWithFeedback_1.default>)}
                    </react_native_1.View>
                </EducationalTooltip_1.default>)}
        </BaseListItem_1.default>);
}
InviteMemberListItem.displayName = 'InviteMemberListItem';
exports.default = InviteMemberListItem;
