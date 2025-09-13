"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const Delegate_1 = require("@libs/actions/Delegate");
const Modal_1 = require("@libs/actions/Modal");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const TextWithEmojiFragment_1 = require("@pages/home/report/comment/TextWithEmojiFragment");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Avatar_1 = require("./Avatar");
const ConfirmModal_1 = require("./ConfirmModal");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const PopoverMenu_1 = require("./PopoverMenu");
const Pressable_1 = require("./Pressable");
const ProductTrainingContext_1 = require("./ProductTrainingContext");
const Text_1 = require("./Text");
const Tooltip_1 = require("./Tooltip");
const EducationalTooltip_1 = require("./Tooltip/EducationalTooltip");
function AccountSwitcher({ isScreenFocused }) {
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [accountID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false, selector: (onyxSession) => onyxSession?.accountID });
    const [isDebugModeEnabled] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_DEBUG_MODE_ENABLED, { canBeMissing: true });
    const buttonRef = (0, react_1.useRef)(null);
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const [shouldShowDelegatorMenu, setShouldShowDelegatorMenu] = (0, react_1.useState)(false);
    const [shouldShowOfflineModal, setShouldShowOfflineModal] = (0, react_1.useState)(false);
    const delegators = account?.delegatedAccess?.delegators ?? [];
    const isActingAsDelegate = !!account?.delegatedAccess?.delegate;
    const canSwitchAccounts = delegators.length > 0 || isActingAsDelegate;
    const displayName = currentUserPersonalDetails?.displayName ?? '';
    const doesDisplayNameContainEmojis = new RegExp(CONST_1.default.REGEX.EMOJIS, CONST_1.default.REGEX.EMOJIS.flags.concat('g')).test(displayName);
    const { shouldShowProductTrainingTooltip, renderProductTrainingTooltip, hideProductTrainingTooltip } = (0, ProductTrainingContext_1.useProductTrainingContext)(CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.ACCOUNT_SWITCHER, isScreenFocused && canSwitchAccounts);
    const onPressSwitcher = () => {
        hideProductTrainingTooltip();
        setShouldShowDelegatorMenu(!shouldShowDelegatorMenu);
    };
    const TooltipToRender = shouldShowProductTrainingTooltip ? EducationalTooltip_1.default : Tooltip_1.default;
    const tooltipProps = shouldShowProductTrainingTooltip
        ? {
            shouldRender: shouldShowProductTrainingTooltip,
            renderTooltipContent: renderProductTrainingTooltip,
            anchorAlignment: {
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
            },
            shiftVertical: variables_1.default.accountSwitcherTooltipShiftVertical,
            shiftHorizontal: variables_1.default.accountSwitcherTooltipShiftHorizontal,
            wrapperStyle: styles.productTrainingTooltipWrapper,
            onTooltipPress: onPressSwitcher,
        }
        : {
            text: translate('delegate.copilotAccess'),
            shiftVertical: 8,
            shiftHorizontal: 8,
            anchorAlignment: { horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT, vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM },
            shouldRender: canSwitchAccounts,
        };
    const createBaseMenuItem = (personalDetails, errors, additionalProps = {}) => {
        const error = Object.values(errors ?? {}).at(0) ?? '';
        return {
            text: personalDetails?.displayName ?? personalDetails?.login ?? '',
            description: expensify_common_1.Str.removeSMSDomain(personalDetails?.login ?? ''),
            avatarID: personalDetails?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID,
            icon: personalDetails?.avatar ?? '',
            iconType: CONST_1.default.ICON_TYPE_AVATAR,
            outerWrapperStyle: shouldUseNarrowLayout ? {} : styles.accountSwitcherPopover,
            numberOfLinesDescription: 1,
            errorText: error ?? '',
            shouldShowRedDotIndicator: !!error,
            errorTextStyle: styles.mt2,
            ...additionalProps,
        };
    };
    const menuItems = () => {
        const currentUserMenuItem = createBaseMenuItem(currentUserPersonalDetails, undefined, {
            shouldShowRightIcon: true,
            iconRight: Expensicons.Checkmark,
            success: true,
            isSelected: true,
        });
        if (isActingAsDelegate) {
            const delegateEmail = account?.delegatedAccess?.delegate ?? '';
            // Avoid duplicating the current user in the list when switching accounts
            if (delegateEmail === currentUserPersonalDetails.login) {
                return [currentUserMenuItem];
            }
            const delegatePersonalDetails = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(delegateEmail);
            const error = (0, ErrorUtils_1.getLatestError)(account?.delegatedAccess?.errorFields?.disconnect);
            return [
                createBaseMenuItem(delegatePersonalDetails, error, {
                    onSelected: () => {
                        if (isOffline) {
                            (0, Modal_1.close)(() => setShouldShowOfflineModal(true));
                            return;
                        }
                        (0, Delegate_1.disconnect)();
                    },
                }),
                currentUserMenuItem,
            ];
        }
        const delegatorMenuItems = delegators
            .filter(({ email }) => email !== currentUserPersonalDetails.login)
            .map(({ email, role }) => {
            const errorFields = account?.delegatedAccess?.errorFields ?? {};
            const error = (0, ErrorUtils_1.getLatestError)(errorFields?.connect?.[email]);
            const personalDetails = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(email);
            return createBaseMenuItem(personalDetails, error, {
                badgeText: translate('delegate.role', { role }),
                onSelected: () => {
                    if (isOffline) {
                        (0, Modal_1.close)(() => setShouldShowOfflineModal(true));
                        return;
                    }
                    (0, Delegate_1.connect)(email);
                },
            });
        });
        return [currentUserMenuItem, ...delegatorMenuItems];
    };
    const hideDelegatorMenu = () => {
        setShouldShowDelegatorMenu(false);
        (0, Delegate_1.clearDelegatorErrors)();
    };
    return (<>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <TooltipToRender {...tooltipProps}>
                <Pressable_1.PressableWithFeedback accessible accessibilityLabel={translate('common.profile')} onPress={onPressSwitcher} ref={buttonRef} interactive={canSwitchAccounts} pressDimmingValue={canSwitchAccounts ? undefined : 1} wrapperStyle={[styles.flexGrow1, styles.flex1, styles.mnw0, styles.justifyContentCenter]}>
                    <react_native_1.View style={[styles.flexRow, styles.gap3, styles.alignItemsCenter]}>
                        <Avatar_1.default type={CONST_1.default.ICON_TYPE_AVATAR} size={CONST_1.default.AVATAR_SIZE.DEFAULT} avatarID={currentUserPersonalDetails?.accountID} source={currentUserPersonalDetails?.avatar} fallbackIcon={currentUserPersonalDetails.fallbackIcon}/>
                        <react_native_1.View style={[styles.flex1, styles.flexShrink1, styles.flexBasis0, styles.justifyContentCenter, styles.gap1]}>
                            <react_native_1.View style={[styles.flexRow, styles.gap1]}>
                                {doesDisplayNameContainEmojis ? (<Text_1.default numberOfLines={1}>
                                        <TextWithEmojiFragment_1.default message={displayName} style={[styles.textBold, styles.textLarge, styles.flexShrink1, styles.lineHeightXLarge]}/>
                                    </Text_1.default>) : (<Text_1.default numberOfLines={1} style={[styles.textBold, styles.textLarge, styles.flexShrink1, styles.lineHeightXLarge]}>
                                        {formatPhoneNumber(displayName)}
                                    </Text_1.default>)}
                                {!!canSwitchAccounts && (<react_native_1.View style={styles.justifyContentCenter}>
                                        <Icon_1.default fill={theme.icon} src={Expensicons.CaretUpDown} height={variables_1.default.iconSizeSmall} width={variables_1.default.iconSizeSmall}/>
                                    </react_native_1.View>)}
                            </react_native_1.View>
                            <Text_1.default numberOfLines={1} style={[styles.colorMuted, styles.fontSizeLabel]}>
                                {expensify_common_1.Str.removeSMSDomain(currentUserPersonalDetails?.login ?? '')}
                            </Text_1.default>
                            {!!isDebugModeEnabled && (<Text_1.default style={[styles.textLabelSupporting, styles.mt1, styles.w100]} numberOfLines={1}>
                                    AccountID: {accountID}
                                </Text_1.default>)}
                        </react_native_1.View>
                    </react_native_1.View>
                </Pressable_1.PressableWithFeedback>
            </TooltipToRender>

            {!!canSwitchAccounts && (<PopoverMenu_1.default isVisible={shouldShowDelegatorMenu} onClose={hideDelegatorMenu} onItemSelected={hideDelegatorMenu} anchorRef={buttonRef} anchorPosition={CONST_1.default.POPOVER_ACCOUNT_SWITCHER_POSITION} anchorAlignment={{
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
            }} menuItems={menuItems()} headerText={translate('delegate.switchAccount')} containerStyles={[{ maxHeight: windowHeight / 2 }, styles.pb0, styles.mw100, shouldUseNarrowLayout ? {} : styles.wFitContent]} headerStyles={styles.pt0} innerContainerStyle={styles.pb0} scrollContainerStyle={styles.pb4} shouldUseScrollView shouldUpdateFocusedIndex={false}/>)}
            <ConfirmModal_1.default title={translate('common.youAppearToBeOffline')} isVisible={shouldShowOfflineModal} onConfirm={() => setShouldShowOfflineModal(false)} onCancel={() => setShouldShowOfflineModal(false)} confirmText={translate('common.buttonConfirm')} prompt={translate('common.offlinePrompt')} shouldShowCancelButton={false}/>
        </>);
}
AccountSwitcher.displayName = 'AccountSwitcher';
exports.default = AccountSwitcher;
