"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expensify_common_1 = require("expensify-common");
var react_1 = require("react");
var react_native_1 = require("react-native");
var PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
var ProductTrainingContext_1 = require("@components/ProductTrainingContext");
var ReportActionAvatars_1 = require("@components/ReportActionAvatars");
var SelectCircle_1 = require("@components/SelectCircle");
var Text_1 = require("@components/Text");
var TextWithTooltip_1 = require("@components/TextWithTooltip");
var EducationalTooltip_1 = require("@components/Tooltip/EducationalTooltip");
var useLocalize_1 = require("@hooks/useLocalize");
var usePermissions_1 = require("@hooks/usePermissions");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var OptionsListUtils_1 = require("@libs/OptionsListUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var CONST_1 = require("@src/CONST");
var BaseListItem_1 = require("./BaseListItem");
function InviteMemberListItem(_a) {
    var _b, _c;
    var item = _a.item, isFocused = _a.isFocused, showTooltip = _a.showTooltip, isDisabled = _a.isDisabled, canSelectMultiple = _a.canSelectMultiple, onSelectRow = _a.onSelectRow, onCheckboxPress = _a.onCheckboxPress, onDismissError = _a.onDismissError, rightHandSideComponent = _a.rightHandSideComponent, onFocus = _a.onFocus, shouldSyncFocus = _a.shouldSyncFocus, wrapperStyle = _a.wrapperStyle, _d = _a.canShowProductTrainingTooltip, canShowProductTrainingTooltip = _d === void 0 ? true : _d;
    var styles = (0, useThemeStyles_1.default)();
    var theme = (0, useTheme_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var isBetaEnabled = (0, usePermissions_1.default)().isBetaEnabled;
    var _e = (0, ProductTrainingContext_1.useProductTrainingContext)(CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP_MANAGER, canShowProductTrainingTooltip &&
        !(0, OptionsListUtils_1.getIsUserSubmittedExpenseOrScannedReceipt)() &&
        isBetaEnabled(CONST_1.default.BETAS.NEWDOT_MANAGER_MCTEST) &&
        (0, ReportUtils_1.isSelectedManagerMcTest)(item.login) &&
        !item.isSelected), renderProductTrainingTooltip = _e.renderProductTrainingTooltip, shouldShowProductTrainingTooltip = _e.shouldShowProductTrainingTooltip;
    var focusedBackgroundColor = styles.sidebarLinkActive.backgroundColor;
    var subscriptAvatarBorderColor = isFocused ? focusedBackgroundColor : theme.sidebar;
    var hoveredBackgroundColor = !!styles.sidebarLinkHover && 'backgroundColor' in styles.sidebarLinkHover ? styles.sidebarLinkHover.backgroundColor : theme.sidebar;
    var shouldShowCheckBox = canSelectMultiple && !item.isDisabled;
    var handleCheckboxPress = (0, react_1.useCallback)(function () {
        if (onCheckboxPress) {
            onCheckboxPress(item);
        }
        else {
            onSelectRow(item);
        }
    }, [item, onCheckboxPress, onSelectRow]);
    var firstItemIconID = Number((_c = (_b = item === null || item === void 0 ? void 0 : item.icons) === null || _b === void 0 ? void 0 : _b.at(0)) === null || _c === void 0 ? void 0 : _c.id);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var accountID = !item.reportID ? item.accountID || firstItemIconID : undefined;
    return (<BaseListItem_1.default item={item} wrapperStyle={[styles.flex1, styles.justifyContentBetween, styles.sidebarLinkInner, styles.userSelectNone, styles.peopleRow, wrapperStyle]} isFocused={isFocused} isDisabled={isDisabled} showTooltip={showTooltip} canSelectMultiple={canSelectMultiple} onSelectRow={onSelectRow} onDismissError={onDismissError} rightHandSideComponent={rightHandSideComponent} errors={item.errors} pendingAction={item.pendingAction} FooterComponent={item.invitedSecondaryLogin ? (<Text_1.default style={[styles.ml9, styles.ph5, styles.pb3, styles.textLabelSupporting]}>
                        {translate('workspace.people.invitedBySecondaryLogin', { secondaryLogin: item.invitedSecondaryLogin })}
                    </Text_1.default>) : undefined} keyForList={item.keyForList} onFocus={onFocus} shouldSyncFocus={shouldSyncFocus} shouldDisplayRBR={!shouldShowCheckBox} testID={item.text}>
            {function (hovered) {
            var _a, _b, _c, _d, _e, _f;
            return (<EducationalTooltip_1.default shouldRender={shouldShowProductTrainingTooltip} renderTooltipContent={renderProductTrainingTooltip} anchorAlignment={{
                    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
                    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
                }} shouldHideOnNavigate wrapperStyle={styles.productTrainingTooltipWrapper}>
                    <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.flex1]}>
                        {(!!item.reportID || !!accountID) && (<ReportActionAvatars_1.default subscriptAvatarBorderColor={hovered && !isFocused ? hoveredBackgroundColor : subscriptAvatarBorderColor} shouldShowTooltip={showTooltip} secondaryAvatarContainerStyle={[
                        StyleUtils.getBackgroundAndBorderStyle(theme.sidebar),
                        isFocused ? StyleUtils.getBackgroundAndBorderStyle(focusedBackgroundColor) : undefined,
                        hovered && !isFocused ? StyleUtils.getBackgroundAndBorderStyle(hoveredBackgroundColor) : undefined,
                    ]} fallbackDisplayName={(_b = (_a = item.text) !== null && _a !== void 0 ? _a : item.alternateText) !== null && _b !== void 0 ? _b : undefined} singleAvatarContainerStyle={[styles.actionAvatar, styles.mr3]} reportID={item.reportID} accountIDs={accountID ? [accountID] : undefined}/>)}
                        <react_native_1.View style={[styles.flex1, styles.flexColumn, styles.justifyContentCenter, styles.alignItemsStretch, styles.optionRow]}>
                            <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter]}>
                                <TextWithTooltip_1.default shouldShowTooltip={showTooltip} text={expensify_common_1.Str.removeSMSDomain((_c = item.text) !== null && _c !== void 0 ? _c : '')} style={[
                    styles.optionDisplayName,
                    isFocused ? styles.sidebarLinkActiveText : styles.sidebarLinkText,
                    item.isBold !== false && styles.sidebarLinkTextBold,
                    styles.pre,
                    item.alternateText ? styles.mb1 : null,
                ]}/>
                            </react_native_1.View>
                            {!!item.alternateText && (<TextWithTooltip_1.default shouldShowTooltip={showTooltip} text={expensify_common_1.Str.removeSMSDomain((_d = item.alternateText) !== null && _d !== void 0 ? _d : '')} style={[styles.textLabelSupporting, styles.lh16, styles.pre]}/>)}
                        </react_native_1.View>
                        {!!item.rightElement && item.rightElement}
                        {!!shouldShowCheckBox && (<PressableWithFeedback_1.default onPress={handleCheckboxPress} disabled={isDisabled} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={(_e = item.text) !== null && _e !== void 0 ? _e : ''} style={[styles.ml2, styles.optionSelectCircle]}>
                                <SelectCircle_1.default isChecked={(_f = item.isSelected) !== null && _f !== void 0 ? _f : false} selectCircleStyles={styles.ml0}/>
                            </PressableWithFeedback_1.default>)}
                    </react_native_1.View>
                </EducationalTooltip_1.default>);
        }}
        </BaseListItem_1.default>);
}
InviteMemberListItem.displayName = 'InviteMemberListItem';
exports.default = InviteMemberListItem;
