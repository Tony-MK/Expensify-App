"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Avatar_1 = require("@components/Avatar");
const Checkbox_1 = require("@components/Checkbox");
const Icon_1 = require("@components/Icon");
const Expensicons_1 = require("@components/Icon/Expensicons");
const PlaidCardFeedIcon_1 = require("@components/PlaidCardFeedIcon");
const BaseListItem_1 = require("@components/SelectionList/BaseListItem");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const UserDetailsTooltip_1 = require("@components/UserDetailsTooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
function CardListItem({ item, isFocused, showTooltip, isDisabled, canSelectMultiple, onSelectRow, onCheckboxPress, onDismissError, rightHandSideComponent, onFocus, shouldSyncFocus, }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const handleCheckboxPress = (0, react_1.useCallback)(() => {
        if (onCheckboxPress) {
            onCheckboxPress(item);
        }
        else {
            onSelectRow(item);
        }
    }, [item, onCheckboxPress, onSelectRow]);
    const ownersAvatar = {
        source: item.cardOwnerPersonalDetails?.avatar ?? Expensicons_1.FallbackAvatar,
        id: item.cardOwnerPersonalDetails?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID,
        type: CONST_1.default.ICON_TYPE_AVATAR,
        name: item.cardOwnerPersonalDetails?.displayName ?? '',
        fallbackIcon: item.cardOwnerPersonalDetails?.fallbackIcon,
    };
    const subtitleText = `${item.lastFourPAN ? `${item.lastFourPAN}` : ''}` +
        `${item.cardName ? ` ${CONST_1.default.DOT_SEPARATOR} ${item.cardName}` : ''}` +
        `${item.isVirtual ? ` ${CONST_1.default.DOT_SEPARATOR} ${translate('workspace.expensifyCard.virtual')}` : ''}`;
    return (<BaseListItem_1.default item={item} wrapperStyle={[styles.flex1, styles.justifyContentBetween, styles.sidebarLinkInner, styles.userSelectNone, styles.peopleRow]} isFocused={isFocused} isDisabled={isDisabled} showTooltip={showTooltip} canSelectMultiple={canSelectMultiple} onSelectRow={onSelectRow} onDismissError={onDismissError} rightHandSideComponent={rightHandSideComponent} errors={item.errors} pendingAction={item.pendingAction} keyForList={item.keyForList} onFocus={onFocus} shouldSyncFocus={shouldSyncFocus}>
            <>
                {!!item.bankIcon && (<react_native_1.View style={[styles.mr3]}>
                        {item.shouldShowOwnersAvatar ? (<react_native_1.View>
                                <UserDetailsTooltip_1.default shouldRender={showTooltip} accountID={Number(item.cardOwnerPersonalDetails?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID)} icon={ownersAvatar} fallbackUserDetails={{
                    displayName: item.cardOwnerPersonalDetails?.displayName,
                }}>
                                    <react_native_1.View>
                                        <Avatar_1.default containerStyles={StyleUtils.getWidthAndHeightStyle(StyleUtils.getAvatarSize(CONST_1.default.AVATAR_SIZE.DEFAULT))} source={ownersAvatar.source} name={ownersAvatar.name} avatarID={ownersAvatar.id} type={CONST_1.default.ICON_TYPE_AVATAR} fallbackIcon={ownersAvatar.fallbackIcon}/>
                                    </react_native_1.View>
                                </UserDetailsTooltip_1.default>
                                <react_native_1.View style={[styles.cardItemSecondaryIconStyle, StyleUtils.getBorderColorStyle(theme.componentBG)]}>
                                    {!!item?.plaidUrl && (<PlaidCardFeedIcon_1.default plaidUrl={item.plaidUrl} isSmall/>)}
                                    {!item?.plaidUrl && (<Icon_1.default src={item.bankIcon.icon} width={variables_1.default.cardMiniatureWidth} height={variables_1.default.cardMiniatureHeight} additionalStyles={styles.cardMiniature}/>)}
                                </react_native_1.View>
                            </react_native_1.View>) : (<>
                                {!!item?.plaidUrl && <PlaidCardFeedIcon_1.default plaidUrl={item.plaidUrl}/>}
                                {!item?.plaidUrl && (<Icon_1.default src={item.bankIcon.icon} width={variables_1.default.cardIconWidth} height={variables_1.default.cardIconHeight} additionalStyles={styles.cardIcon}/>)}
                            </>)}
                    </react_native_1.View>)}
                <react_native_1.View style={[styles.flex1, styles.flexColumn, styles.justifyContentCenter, styles.alignItemsStretch, styles.optionRow]}>
                    <react_native_1.View style={[styles.flex1, styles.flexColumn, styles.justifyContentCenter, styles.alignItemsStretch]}>
                        <TextWithTooltip_1.default shouldShowTooltip={showTooltip} text={expensify_common_1.Str.removeSMSDomain(item.text ?? '')} style={[
            styles.optionDisplayName,
            isFocused ? styles.sidebarLinkActiveText : styles.sidebarLinkText,
            item.isBold !== false && styles.sidebarLinkTextBold,
            styles.pre,
            item.alternateText ? styles.mb1 : null,
        ]}/>
                        {!!subtitleText && (<TextWithTooltip_1.default shouldShowTooltip={showTooltip} text={subtitleText} style={[styles.textLabelSupporting, styles.lh16, styles.pre]}/>)}
                    </react_native_1.View>
                </react_native_1.View>
                {!!canSelectMultiple && !item.isDisabled && (<Checkbox_1.default shouldSelectOnPressEnter isChecked={item.isSelected ?? false} accessibilityLabel={item.text ?? ''} onPress={handleCheckboxPress} disabled={!!isDisabled} style={styles.ml3}/>)}
            </>
        </BaseListItem_1.default>);
}
CardListItem.displayName = 'CardListItem';
exports.default = CardListItem;
