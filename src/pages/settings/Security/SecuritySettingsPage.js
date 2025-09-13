"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debounce_1 = require("lodash/debounce");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const DelegateNoAccessModalProvider_1 = require("@components/DelegateNoAccessModalProvider");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const Expensicons_1 = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const LockedAccountModalProvider_1 = require("@components/LockedAccountModalProvider");
const LottieAnimations_1 = require("@components/LottieAnimations");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemList_1 = require("@components/MenuItemList");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const PopoverMenu_1 = require("@components/PopoverMenu");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Section_1 = require("@components/Section");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrivateSubscription_1 = require("@hooks/usePrivateSubscription");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWaitForNavigation_1 = require("@hooks/useWaitForNavigation");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const Delegate_1 = require("@libs/actions/Delegate");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const getClickedTargetLocation_1 = require("@libs/getClickedTargetLocation");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const Modal_1 = require("@userActions/Modal");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function SecuritySettingsPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const waitForNavigate = (0, useWaitForNavigation_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { windowWidth } = (0, useWindowDimensions_1.default)();
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const privateSubscription = (0, usePrivateSubscription_1.default)();
    const isUserValidated = account?.validated;
    const delegateButtonRef = (0, react_1.useRef)(null);
    const [shouldShowDelegatePopoverMenu, setShouldShowDelegatePopoverMenu] = (0, react_1.useState)(false);
    const [shouldShowRemoveDelegateModal, setShouldShowRemoveDelegateModal] = (0, react_1.useState)(false);
    const [selectedDelegate, setSelectedDelegate] = (0, react_1.useState)();
    const [selectedEmail, setSelectedEmail] = (0, react_1.useState)();
    const errorFields = account?.delegatedAccess?.errorFields ?? {};
    const [anchorPosition, setAnchorPosition] = (0, react_1.useState)({
        horizontal: 0,
        vertical: 0,
    });
    const { isAccountLocked, showLockedAccountModal } = (0, react_1.useContext)(LockedAccountModalProvider_1.LockedAccountContext);
    const { isDelegateAccessRestricted, showDelegateNoAccessModal } = (0, react_1.useContext)(DelegateNoAccessModalProvider_1.DelegateNoAccessContext);
    const delegates = account?.delegatedAccess?.delegates ?? [];
    const delegators = account?.delegatedAccess?.delegators ?? [];
    const hasDelegates = delegates.length > 0;
    const hasDelegators = delegators.length > 0;
    const setMenuPosition = (0, react_1.useCallback)(() => {
        if (!delegateButtonRef.current) {
            return;
        }
        const position = (0, getClickedTargetLocation_1.default)(delegateButtonRef.current);
        setAnchorPosition({
            horizontal: position.right - position.left,
            vertical: position.y + position.height,
        });
    }, [delegateButtonRef]);
    const showPopoverMenu = (nativeEvent, delegate) => {
        delegateButtonRef.current = nativeEvent?.currentTarget;
        setMenuPosition();
        setShouldShowDelegatePopoverMenu(true);
        setSelectedDelegate(delegate);
        setSelectedEmail(delegate.email);
    };
    (0, react_1.useLayoutEffect)(() => {
        const popoverPositionListener = react_native_1.Dimensions.addEventListener('change', () => {
            (0, debounce_1.default)(setMenuPosition, CONST_1.default.TIMING.RESIZE_DEBOUNCE_TIME)();
        });
        return () => {
            if (!popoverPositionListener) {
                return;
            }
            popoverPositionListener.remove();
        };
    }, [setMenuPosition]);
    const securityMenuItems = (0, react_1.useMemo)(() => {
        const baseMenuItems = [
            {
                translationKey: 'twoFactorAuth.headerTitle',
                icon: Expensicons.Shield,
                action: () => {
                    if (isDelegateAccessRestricted) {
                        showDelegateNoAccessModal();
                        return;
                    }
                    if (isAccountLocked) {
                        showLockedAccountModal();
                        return;
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_2FA_ROOT.getRoute());
                },
            },
            {
                translationKey: 'mergeAccountsPage.mergeAccount',
                icon: Expensicons.ArrowCollapse,
                action: () => {
                    if (isDelegateAccessRestricted) {
                        showDelegateNoAccessModal();
                        return;
                    }
                    if (isAccountLocked) {
                        showLockedAccountModal();
                        return;
                    }
                    if (privateSubscription?.type === CONST_1.default.SUBSCRIPTION.TYPE.INVOICING) {
                        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_MERGE_ACCOUNTS_RESULT.getRoute(currentUserPersonalDetails.login ?? '', CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_INVOICING, ROUTES_1.default.SETTINGS_SECURITY));
                        return;
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_MERGE_ACCOUNTS.route);
                },
            },
        ];
        if (isAccountLocked) {
            baseMenuItems.push({
                translationKey: 'lockAccountPage.unlockAccount',
                icon: Expensicons.UserLock,
                action: waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_UNLOCK_ACCOUNT)),
            });
        }
        else {
            baseMenuItems.push({
                translationKey: 'lockAccountPage.reportSuspiciousActivity',
                icon: Expensicons.UserLock,
                action: waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_LOCK_ACCOUNT)),
            });
        }
        baseMenuItems.push({
            translationKey: 'closeAccountPage.closeAccount',
            icon: Expensicons.ClosedSign,
            action: () => {
                if (isDelegateAccessRestricted) {
                    showDelegateNoAccessModal();
                    return;
                }
                if (isAccountLocked) {
                    showLockedAccountModal();
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_CLOSE);
            },
        });
        return baseMenuItems.map((item) => ({
            key: item.translationKey,
            title: translate(item.translationKey),
            icon: item.icon,
            onPress: item.action,
            shouldShowRightIcon: true,
            link: '',
            wrapperStyle: [styles.sectionMenuItemTopDescription],
        }));
    }, [
        isAccountLocked,
        isDelegateAccessRestricted,
        showDelegateNoAccessModal,
        showLockedAccountModal,
        privateSubscription?.type,
        currentUserPersonalDetails.login,
        waitForNavigate,
        translate,
        styles.sectionMenuItemTopDescription,
    ]);
    const delegateMenuItems = (0, react_1.useMemo)(() => delegates
        .filter((d) => !d.optimisticAccountID)
        .map(({ email, role, pendingAction, pendingFields }) => {
        const personalDetail = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(email);
        const addDelegateErrors = errorFields?.addDelegate?.[email];
        const error = (0, ErrorUtils_1.getLatestError)(addDelegateErrors);
        const onPress = (e) => {
            if ((0, EmptyObject_1.isEmptyObject)(pendingAction)) {
                showPopoverMenu(e, { email, role });
                return;
            }
            if (!role) {
                Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_DELEGATE_ROLE.getRoute(email));
                return;
            }
            if (pendingFields?.role && !pendingFields?.email) {
                Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_UPDATE_DELEGATE_ROLE.getRoute(email, role));
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_DELEGATE_CONFIRM.getRoute(email, role, true));
        };
        const formattedEmail = formatPhoneNumber(email);
        return {
            title: personalDetail?.displayName ?? formattedEmail,
            description: personalDetail?.displayName ? formattedEmail : '',
            badgeText: translate('delegate.role', { role }),
            avatarID: personalDetail?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID,
            icon: personalDetail?.avatar ?? Expensicons_1.FallbackAvatar,
            iconType: CONST_1.default.ICON_TYPE_AVATAR,
            numberOfLinesDescription: 1,
            wrapperStyle: [styles.sectionMenuItemTopDescription],
            iconRight: Expensicons.ThreeDots,
            shouldShowRightIcon: true,
            pendingAction,
            shouldForceOpacity: !!pendingAction,
            onPendingActionDismiss: () => (0, Delegate_1.clearDelegateErrorsByField)(email, 'addDelegate'),
            error,
            onPress,
            success: selectedEmail === email,
        };
    }), 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [delegates, translate, styles, personalDetails, errorFields, windowWidth, selectedEmail]);
    const delegatorMenuItems = (0, react_1.useMemo)(() => delegators.map(({ email, role }) => {
        const personalDetail = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(email);
        const formattedEmail = formatPhoneNumber(email);
        return {
            title: personalDetail?.displayName ?? formattedEmail,
            description: personalDetail?.displayName ? formattedEmail : '',
            badgeText: translate('delegate.role', { role }),
            avatarID: personalDetail?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID,
            icon: personalDetail?.avatar ?? Expensicons_1.FallbackAvatar,
            iconType: CONST_1.default.ICON_TYPE_AVATAR,
            numberOfLinesDescription: 1,
            wrapperStyle: [styles.sectionMenuItemTopDescription],
            interactive: false,
        };
    }), 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [delegators, styles, translate, personalDetails]);
    const delegatePopoverMenuItems = [
        {
            text: translate('delegate.changeAccessLevel'),
            icon: Expensicons.Pencil,
            onPress: () => {
                if (isDelegateAccessRestricted) {
                    (0, Modal_1.close)(() => showDelegateNoAccessModal());
                    return;
                }
                if (isAccountLocked) {
                    (0, Modal_1.close)(() => showLockedAccountModal());
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_UPDATE_DELEGATE_ROLE.getRoute(selectedDelegate?.email ?? '', selectedDelegate?.role ?? ''));
                setShouldShowDelegatePopoverMenu(false);
                setSelectedDelegate(undefined);
                setSelectedEmail(undefined);
            },
        },
        {
            text: translate('delegate.removeCopilot'),
            icon: Expensicons.Trashcan,
            onPress: () => {
                if (isDelegateAccessRestricted) {
                    (0, Modal_1.close)(() => showDelegateNoAccessModal());
                    return;
                }
                if (isAccountLocked) {
                    (0, Modal_1.close)(() => showLockedAccountModal());
                    return;
                }
                (0, Modal_1.close)(() => {
                    setShouldShowDelegatePopoverMenu(false);
                    setShouldShowRemoveDelegateModal(true);
                    setSelectedEmail(undefined);
                });
            },
        },
    ];
    (0, react_1.useEffect)(() => {
        (0, Delegate_1.openSecuritySettingsPage)();
    }, []);
    return (<ScreenWrapper_1.default testID={SecuritySettingsPage.displayName} includeSafeAreaPaddingBottom={false} shouldEnablePickerAvoiding={false} shouldShowOfflineIndicatorInWideScreen>
            {({ safeAreaPaddingBottomStyle }) => (<>
                    <HeaderWithBackButton_1.default title={translate('initialSettingsPage.security')} shouldShowBackButton={shouldUseNarrowLayout} onBackButtonPress={Navigation_1.default.popToSidebar} icon={Illustrations.LockClosed} shouldUseHeadlineHeader shouldDisplaySearchRouter/>
                    <ScrollView_1.default contentContainerStyle={styles.pt3}>
                        <react_native_1.View style={[styles.flex1, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                            <Section_1.default title={translate('securityPage.title')} subtitle={translate('securityPage.subtitle')} isCentralPane subtitleMuted illustration={LottieAnimations_1.default.Safe} titleStyles={styles.accountSettingsSectionTitle} childrenStyles={styles.pt5}>
                                <MenuItemList_1.default menuItems={securityMenuItems} shouldUseSingleExecution/>
                            </Section_1.default>
                            <react_native_1.View style={safeAreaPaddingBottomStyle}>
                                <Section_1.default title={translate('delegate.copilotDelegatedAccess')} renderSubtitle={() => (<Text_1.default style={[styles.flexRow, styles.alignItemsCenter, styles.w100, styles.mt2]}>
                                            <Text_1.default style={[styles.textNormal, styles.colorMuted]}>{translate('delegate.copilotDelegatedAccessDescription')} </Text_1.default>
                                            <TextLink_1.default style={[styles.link]} href={CONST_1.default.COPILOT_HELP_URL}>
                                                {translate('common.learnMore')}
                                            </TextLink_1.default>
                                            .
                                        </Text_1.default>)} isCentralPane subtitleMuted titleStyles={styles.accountSettingsSectionTitle} childrenStyles={styles.pt5}>
                                    {hasDelegates && (<>
                                            <Text_1.default style={[styles.textLabelSupporting, styles.pv1]}>{translate('delegate.membersCanAccessYourAccount')}</Text_1.default>
                                            <MenuItemList_1.default menuItems={delegateMenuItems}/>
                                        </>)}
                                    {!isDelegateAccessRestricted && (<MenuItem_1.default title={translate('delegate.addCopilot')} icon={Expensicons.UserPlus} onPress={() => {
                    if (!isUserValidated) {
                        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_DELEGATE_VERIFY_ACCOUNT);
                        return;
                    }
                    if (isAccountLocked) {
                        showLockedAccountModal();
                        return;
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_ADD_DELEGATE);
                }} shouldShowRightIcon wrapperStyle={[styles.sectionMenuItemTopDescription, hasDelegators && styles.mb6]}/>)}
                                    {hasDelegators && (<>
                                            <Text_1.default style={[styles.textLabelSupporting, styles.pv1]}>{translate('delegate.youCanAccessTheseAccounts')}</Text_1.default>
                                            <MenuItemList_1.default menuItems={delegatorMenuItems}/>
                                        </>)}
                                </Section_1.default>
                            </react_native_1.View>
                            <PopoverMenu_1.default isVisible={shouldShowDelegatePopoverMenu} anchorRef={delegateButtonRef} anchorPosition={{
                horizontal: anchorPosition.horizontal,
                vertical: anchorPosition.vertical,
            }} anchorAlignment={{
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
            }} menuItems={delegatePopoverMenuItems} onClose={() => {
                setShouldShowDelegatePopoverMenu(false);
                setSelectedEmail(undefined);
            }}/>
                            <ConfirmModal_1.default isVisible={shouldShowRemoveDelegateModal} title={translate('delegate.removeCopilot')} prompt={translate('delegate.removeCopilotConfirmation')} danger onConfirm={() => {
                (0, Delegate_1.removeDelegate)(selectedDelegate?.email ?? '');
                setShouldShowRemoveDelegateModal(false);
                setSelectedDelegate(undefined);
            }} onCancel={() => {
                setShouldShowRemoveDelegateModal(false);
                setSelectedDelegate(undefined);
            }} confirmText={translate('delegate.removeCopilot')} cancelText={translate('common.cancel')} shouldShowCancelButton/>
                        </react_native_1.View>
                    </ScrollView_1.default>
                </>)}
        </ScreenWrapper_1.default>);
}
SecuritySettingsPage.displayName = 'SettingSecurityPage';
exports.default = SecuritySettingsPage;
