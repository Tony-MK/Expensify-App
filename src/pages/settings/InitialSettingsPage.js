"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const AccountSwitcher_1 = require("@components/AccountSwitcher");
const AccountSwitcherSkeletonView_1 = require("@components/AccountSwitcherSkeletonView");
const ConfirmModal_1 = require("@components/ConfirmModal");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const NavigationTabBar_1 = require("@components/Navigation/NavigationTabBar");
const NAVIGATION_TABS_1 = require("@components/Navigation/NavigationTabBar/NAVIGATION_TABS");
const Pressable_1 = require("@components/Pressable");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollOffsetContextProvider_1 = require("@components/ScrollOffsetContextProvider");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const Tooltip_1 = require("@components/Tooltip");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const usePrivateSubscription_1 = require("@hooks/usePrivateSubscription");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSingleExecution_1 = require("@hooks/useSingleExecution");
const useSubscriptionPlan_1 = require("@hooks/useSubscriptionPlan");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const useIsSidebarRouteActive_1 = require("@libs/Navigation/helpers/useIsSidebarRouteActive");
const Navigation_1 = require("@libs/Navigation/Navigation");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const UserUtils_1 = require("@libs/UserUtils");
const ReportActionContextMenu_1 = require("@pages/home/report/ContextMenu/ReportActionContextMenu");
const variables_1 = require("@styles/variables");
const App_1 = require("@userActions/App");
const Link_1 = require("@userActions/Link");
const PaymentMethods_1 = require("@userActions/PaymentMethods");
const Session_1 = require("@userActions/Session");
const Wallet_1 = require("@userActions/Wallet");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function InitialSettingsPage({ currentUserPersonalDetails }) {
    const [userWallet] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { canBeMissing: true });
    const [bankAccountList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true });
    const [fundList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FUND_LIST, { canBeMissing: true });
    const [walletTerms] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_TERMS, { canBeMissing: true });
    const [loginList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LOGIN_LIST, { canBeMissing: true });
    const [privatePersonalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS, { canBeMissing: true });
    const [vacationDelegate] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_VACATION_DELEGATE, { canBeMissing: true });
    const [allCards] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: true });
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const [stripeCustomerId] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_STRIPE_CUSTOMER_ID, { canBeMissing: true });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const network = (0, useNetwork_1.default)();
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isExecuting, singleExecution } = (0, useSingleExecution_1.default)();
    const popoverAnchor = (0, react_1.useRef)(null);
    const { translate } = (0, useLocalize_1.default)();
    const focusedRouteName = (0, native_1.useNavigationState)((state) => (0, native_1.findFocusedRoute)(state)?.name);
    const emojiCode = currentUserPersonalDetails?.status?.emojiCode ?? '';
    const isScreenFocused = (0, useIsSidebarRouteActive_1.default)(NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR, shouldUseNarrowLayout);
    const hasActivatedWallet = [CONST_1.default.WALLET.TIER_NAME.GOLD, CONST_1.default.WALLET.TIER_NAME.PLATINUM].includes(userWallet?.tierName ?? '');
    const privateSubscription = (0, usePrivateSubscription_1.default)();
    const subscriptionPlan = (0, useSubscriptionPlan_1.default)();
    const previousUserPersonalDetails = (0, usePrevious_1.default)(currentUserPersonalDetails);
    const shouldLogout = (0, react_1.useRef)(false);
    const freeTrialText = (0, SubscriptionUtils_1.getFreeTrialText)(policies);
    const shouldDisplayLHB = !shouldUseNarrowLayout;
    const hasBrokenFeedConnection = (0, CardUtils_1.checkIfFeedConnectionIsBroken)(allCards, CONST_1.default.EXPENSIFY_CARD.BANK);
    const walletBrickRoadIndicator = (0, PaymentMethods_1.hasPaymentMethodError)(bankAccountList, fundList) || !(0, EmptyObject_1.isEmptyObject)(userWallet?.errors) || !(0, EmptyObject_1.isEmptyObject)(walletTerms?.errors) || hasBrokenFeedConnection ? 'error' : undefined;
    const [shouldShowSignoutConfirmModal, setShouldShowSignoutConfirmModal] = (0, react_1.useState)(false);
    const hasAccountBeenSwitched = (0, react_1.useMemo)(() => currentUserPersonalDetails.accountID !== previousUserPersonalDetails.accountID, [currentUserPersonalDetails.accountID, previousUserPersonalDetails.accountID]);
    (0, react_1.useEffect)(() => {
        if (!hasAccountBeenSwitched) {
            return;
        }
        Navigation_1.default.clearPreloadedRoutes();
    }, [hasAccountBeenSwitched]);
    (0, react_1.useEffect)(() => {
        (0, Wallet_1.openInitialSettingsPage)();
        (0, App_1.confirmReadyToOpenApp)();
    }, []);
    const toggleSignoutConfirmModal = (value) => {
        setShouldShowSignoutConfirmModal(value);
    };
    const signOut = (0, react_1.useCallback)((shouldForceSignout = false) => {
        if (!network.isOffline || shouldForceSignout) {
            return (0, Session_1.signOutAndRedirectToSignIn)();
        }
        // When offline, warn the user that any actions they took while offline will be lost if they sign out
        toggleSignoutConfirmModal(true);
    }, [network.isOffline]);
    /**
     * Return a list of menu items data for account section
     * @returns object with translationKey, style and items for the account section
     */
    const accountMenuItemsData = (0, react_1.useMemo)(() => {
        const profileBrickRoadIndicator = (0, UserUtils_1.getProfilePageBrickRoadIndicator)(loginList, privatePersonalDetails, vacationDelegate, session?.email);
        const items = [
            {
                translationKey: 'common.profile',
                icon: Expensicons.Profile,
                screenName: SCREENS_1.default.SETTINGS.PROFILE.ROOT,
                brickRoadIndicator: profileBrickRoadIndicator,
                action: () => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_PROFILE.getRoute()),
            },
            {
                translationKey: 'common.wallet',
                icon: Expensicons.Wallet,
                screenName: SCREENS_1.default.SETTINGS.WALLET.ROOT,
                brickRoadIndicator: walletBrickRoadIndicator,
                action: () => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_WALLET),
                badgeText: hasActivatedWallet ? (0, CurrencyUtils_1.convertToDisplayString)(userWallet?.currentBalance) : undefined,
            },
            {
                translationKey: 'common.preferences',
                icon: Expensicons.Gear,
                screenName: SCREENS_1.default.SETTINGS.PREFERENCES.ROOT,
                action: () => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_PREFERENCES),
            },
            {
                translationKey: 'initialSettingsPage.security',
                icon: Expensicons.Lock,
                screenName: SCREENS_1.default.SETTINGS.SECURITY,
                action: () => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SECURITY),
            },
        ];
        if (subscriptionPlan) {
            items.splice(1, 0, {
                translationKey: 'allSettingsScreen.subscription',
                icon: Expensicons.CreditCard,
                screenName: SCREENS_1.default.SETTINGS.SUBSCRIPTION.ROOT,
                brickRoadIndicator: !!privateSubscription?.errors || (0, SubscriptionUtils_1.hasSubscriptionRedDotError)(stripeCustomerId) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
                badgeText: freeTrialText,
                badgeStyle: freeTrialText ? styles.badgeSuccess : undefined,
                action: () => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SUBSCRIPTION.route),
            });
        }
        return {
            sectionStyle: styles.accountSettingsSectionContainer,
            sectionTranslationKey: 'initialSettingsPage.account',
            items,
        };
    }, [
        loginList,
        privatePersonalDetails,
        vacationDelegate,
        session?.email,
        walletBrickRoadIndicator,
        hasActivatedWallet,
        userWallet?.currentBalance,
        subscriptionPlan,
        styles.accountSettingsSectionContainer,
        styles.badgeSuccess,
        privateSubscription?.errors,
        stripeCustomerId,
        freeTrialText,
    ]);
    /**
     * Return a list of menu items data for general section
     * @returns object with translationKey, style and items for the general section
     */
    const generalMenuItemsData = (0, react_1.useMemo)(() => {
        const signOutTranslationKey = (0, Session_1.isSupportAuthToken)() ? 'initialSettingsPage.restoreStashed' : 'initialSettingsPage.signOut';
        return {
            sectionStyle: {
                ...styles.pt4,
            },
            sectionTranslationKey: 'initialSettingsPage.general',
            items: [
                {
                    translationKey: 'initialSettingsPage.help',
                    icon: Expensicons.QuestionMark,
                    iconRight: Expensicons.NewWindow,
                    shouldShowRightIcon: true,
                    link: CONST_1.default.NEWHELP_URL,
                    action: () => {
                        (0, Link_1.openExternalLink)(CONST_1.default.NEWHELP_URL);
                    },
                },
                {
                    translationKey: 'initialSettingsPage.whatIsNew',
                    icon: Expensicons.TreasureChest,
                    iconRight: Expensicons.NewWindow,
                    shouldShowRightIcon: true,
                    link: CONST_1.default.WHATS_NEW_URL,
                    action: () => {
                        (0, Link_1.openExternalLink)(CONST_1.default.WHATS_NEW_URL);
                    },
                },
                {
                    translationKey: 'initialSettingsPage.about',
                    icon: Expensicons.Info,
                    screenName: SCREENS_1.default.SETTINGS.ABOUT,
                    action: () => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_ABOUT),
                },
                {
                    translationKey: 'initialSettingsPage.aboutPage.troubleshoot',
                    icon: Expensicons.Lightbulb,
                    screenName: SCREENS_1.default.SETTINGS.TROUBLESHOOT,
                    action: () => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_TROUBLESHOOT),
                },
                {
                    translationKey: 'sidebarScreen.saveTheWorld',
                    icon: Expensicons.Heart,
                    screenName: SCREENS_1.default.SETTINGS.SAVE_THE_WORLD,
                    action: () => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SAVE_THE_WORLD),
                },
                {
                    translationKey: signOutTranslationKey,
                    icon: Expensicons.Exit,
                    action: () => signOut(false),
                },
            ],
        };
    }, [styles.pt4, signOut]);
    /**
     * Return JSX.Element with menu items
     * @param menuItemsData list with menu items data
     * @returns the menu items for passed data
     */
    const getMenuItemsSection = (0, react_1.useCallback)((menuItemsData) => {
        const openPopover = (link, event) => {
            if (!isScreenFocused) {
                return;
            }
            if (typeof link === 'function') {
                link?.()?.then((url) => (0, ReportActionContextMenu_1.showContextMenu)({
                    type: CONST_1.default.CONTEXT_MENU_TYPES.LINK,
                    event,
                    selection: url,
                    contextMenuAnchor: popoverAnchor.current,
                }));
            }
            else if (link) {
                (0, ReportActionContextMenu_1.showContextMenu)({
                    type: CONST_1.default.CONTEXT_MENU_TYPES.LINK,
                    event,
                    selection: link,
                    contextMenuAnchor: popoverAnchor.current,
                });
            }
        };
        return (<react_native_1.View style={[menuItemsData.sectionStyle, styles.pb4, styles.mh3]}>
                    <Text_1.default style={styles.sectionTitle}>{translate(menuItemsData.sectionTranslationKey)}</Text_1.default>
                    {menuItemsData.items.map((item) => {
                const keyTitle = item.translationKey ? translate(item.translationKey) : item.title;
                const isFocused = focusedRouteName ? focusedRouteName === item.screenName : false;
                return (<MenuItem_1.default key={keyTitle} wrapperStyle={styles.sectionMenuItem} title={keyTitle} icon={item.icon} iconType={item.iconType} disabled={isExecuting} onPress={singleExecution(item.action)} iconStyles={item.iconStyles} badgeText={item.badgeText} badgeStyle={item.badgeStyle} fallbackIcon={item.fallbackIcon} brickRoadIndicator={item.brickRoadIndicator} shouldStackHorizontally={item.shouldStackHorizontally} ref={popoverAnchor} shouldBlockSelection={!!item.link} onSecondaryInteraction={item.link ? (event) => openPopover(item.link, event) : undefined} focused={isFocused} isPaneMenu iconRight={item.iconRight} shouldShowRightIcon={item.shouldShowRightIcon} shouldIconUseAutoWidthStyle/>);
            })}
                </react_native_1.View>);
    }, [styles.pb4, styles.mh3, styles.sectionTitle, styles.sectionMenuItem, translate, isScreenFocused, focusedRouteName, isExecuting, singleExecution]);
    const accountMenuItems = (0, react_1.useMemo)(() => getMenuItemsSection(accountMenuItemsData), [accountMenuItemsData, getMenuItemsSection]);
    const generalMenuItems = (0, react_1.useMemo)(() => getMenuItemsSection(generalMenuItemsData), [generalMenuItemsData, getMenuItemsSection]);
    const headerContent = (<react_native_1.View style={[styles.ph5, styles.pv4]}>
            {(0, EmptyObject_1.isEmptyObject)(currentUserPersonalDetails) || currentUserPersonalDetails.displayName === undefined ? (<AccountSwitcherSkeletonView_1.default avatarSize={CONST_1.default.AVATAR_SIZE.DEFAULT}/>) : (<react_native_1.View style={[styles.flexRow, styles.justifyContentBetween, styles.alignItemsCenter, styles.gap3]}>
                    <AccountSwitcher_1.default isScreenFocused={isScreenFocused}/>
                    <Tooltip_1.default text={translate('statusPage.status')}>
                        <Pressable_1.PressableWithFeedback accessibilityLabel={translate('statusPage.status')} accessibilityRole="button" accessible onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_STATUS)}>
                            <react_native_1.View style={styles.primaryMediumIcon}>
                                {emojiCode ? (<Text_1.default style={styles.primaryMediumText}>{emojiCode}</Text_1.default>) : (<Icon_1.default src={Expensicons.Emoji} width={variables_1.default.iconSizeNormal} height={variables_1.default.iconSizeNormal} fill={theme.icon}/>)}
                            </react_native_1.View>
                        </Pressable_1.PressableWithFeedback>
                    </Tooltip_1.default>
                </react_native_1.View>)}
        </react_native_1.View>);
    const { saveScrollOffset, getScrollOffset } = (0, react_1.useContext)(ScrollOffsetContextProvider_1.ScrollOffsetContext);
    const route = (0, native_1.useRoute)();
    const scrollViewRef = (0, react_1.useRef)(null);
    const onScroll = (0, react_1.useCallback)((e) => {
        // If the layout measurement is 0, it means the flash list is not displayed but the onScroll may be triggered with offset value 0.
        // We should ignore this case.
        if (e.nativeEvent.layoutMeasurement.height === 0) {
            return;
        }
        saveScrollOffset(route, e.nativeEvent.contentOffset.y);
    }, [route, saveScrollOffset]);
    (0, react_1.useLayoutEffect)(() => {
        const scrollOffset = getScrollOffset(route);
        if (!scrollOffset || !scrollViewRef.current) {
            return;
        }
        scrollViewRef.current.scrollTo({ y: scrollOffset, animated: false });
    }, [getScrollOffset, route]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom testID={InitialSettingsPage.displayName} bottomContent={!shouldDisplayLHB && <NavigationTabBar_1.default selectedTab={NAVIGATION_TABS_1.default.SETTINGS}/>} shouldEnableKeyboardAvoidingView={false}>
            {headerContent}
            <ScrollView_1.default ref={scrollViewRef} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={[styles.w100]} showsVerticalScrollIndicator={false}>
                {accountMenuItems}
                {generalMenuItems}
                <ConfirmModal_1.default danger title={translate('common.areYouSure')} prompt={translate('initialSettingsPage.signOutConfirmationText')} confirmText={translate('initialSettingsPage.signOut')} cancelText={translate('common.cancel')} isVisible={shouldShowSignoutConfirmModal} onConfirm={() => {
            toggleSignoutConfirmModal(false);
            shouldLogout.current = true;
        }} onCancel={() => toggleSignoutConfirmModal(false)} onModalHide={() => {
            if (!shouldLogout.current) {
                return;
            }
            signOut(true);
        }}/>
            </ScrollView_1.default>
            {shouldDisplayLHB && <NavigationTabBar_1.default selectedTab={NAVIGATION_TABS_1.default.SETTINGS}/>}
        </ScreenWrapper_1.default>);
}
InitialSettingsPage.displayName = 'InitialSettingsPage';
exports.default = (0, withCurrentUserPersonalDetails_1.default)(InitialSettingsPage);
