"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_device_info_1 = require("react-native-device-info");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const LottieAnimations_1 = require("@components/LottieAnimations");
const MenuItemList_1 = require("@components/MenuItemList");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Section_1 = require("@components/Section");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWaitForNavigation_1 = require("@hooks/useWaitForNavigation");
const Environment_1 = require("@libs/Environment/Environment");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionContextMenu_1 = require("@pages/home/report/ContextMenu/ReportActionContextMenu");
const Link_1 = require("@userActions/Link");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const package_json_1 = require("../../../../package.json");
function getFlavor() {
    const bundleId = react_native_device_info_1.default.getBundleId();
    if (bundleId.includes('dev')) {
        return ' Develop';
    }
    if (bundleId.includes('adhoc')) {
        return ' Ad-Hoc';
    }
    return '';
}
function AboutPage() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const popoverAnchor = (0, react_1.useRef)(null);
    const waitForNavigate = (0, useWaitForNavigation_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const menuItems = (0, react_1.useMemo)(() => {
        const baseMenuItems = [
            {
                translationKey: 'initialSettingsPage.aboutPage.appDownloadLinks',
                icon: Expensicons.Link,
                action: waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_APP_DOWNLOAD_LINKS)),
            },
            {
                translationKey: 'initialSettingsPage.aboutPage.viewKeyboardShortcuts',
                icon: Expensicons.Keyboard,
                action: waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.KEYBOARD_SHORTCUTS.getRoute(Navigation_1.default.getActiveRoute()))),
            },
            {
                translationKey: 'initialSettingsPage.aboutPage.viewTheCode',
                icon: Expensicons.Eye,
                iconRight: Expensicons.NewWindow,
                action: () => {
                    (0, Link_1.openExternalLink)(CONST_1.default.GITHUB_URL);
                    return Promise.resolve();
                },
                link: CONST_1.default.GITHUB_URL,
            },
            {
                translationKey: 'initialSettingsPage.aboutPage.viewOpenJobs',
                icon: Expensicons.MoneyBag,
                iconRight: Expensicons.NewWindow,
                action: () => {
                    (0, Link_1.openExternalLink)(CONST_1.default.UPWORK_URL);
                    return Promise.resolve();
                },
                link: CONST_1.default.UPWORK_URL,
            },
            {
                translationKey: 'initialSettingsPage.aboutPage.reportABug',
                icon: Expensicons.Bug,
                action: waitForNavigate(Report_1.navigateToConciergeChat),
            },
        ];
        return baseMenuItems.map(({ translationKey, icon, iconRight, action, link }) => ({
            key: translationKey,
            title: translate(translationKey),
            icon,
            iconRight,
            onPress: action,
            shouldShowRightIcon: true,
            onSecondaryInteraction: link
                ? (event) => (0, ReportActionContextMenu_1.showContextMenu)({
                    type: CONST_1.default.CONTEXT_MENU_TYPES.LINK,
                    event,
                    selection: link,
                    contextMenuAnchor: popoverAnchor.current,
                })
                : undefined,
            ref: popoverAnchor,
            shouldBlockSelection: !!link,
            wrapperStyle: [styles.sectionMenuItemTopDescription],
        }));
    }, [styles, translate, waitForNavigate]);
    const overlayContent = (0, react_1.useCallback)(() => (<react_native_1.View style={[styles.pAbsolute, styles.w100, styles.h100, styles.justifyContentEnd, styles.pb3]}>
                <Text_1.default selectable style={[styles.textLabel, styles.textVersion, styles.alignSelfCenter]}>
                    v{(0, Environment_1.isInternalTestBuild)() ? `${package_json_1.default.version} PR:${CONST_1.default.PULL_REQUEST_NUMBER}${getFlavor()}` : `${package_json_1.default.version}${getFlavor()}`}
                </Text_1.default>
            </react_native_1.View>), 
    // disabling this rule, as we want this to run only on the first render
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    []);
    return (<ScreenWrapper_1.default shouldEnablePickerAvoiding={false} shouldShowOfflineIndicatorInWideScreen testID={AboutPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('initialSettingsPage.about')} shouldShowBackButton={shouldUseNarrowLayout} shouldDisplaySearchRouter onBackButtonPress={Navigation_1.default.popToSidebar} icon={Illustrations.PalmTree} shouldUseHeadlineHeader/>
            <ScrollView_1.default contentContainerStyle={styles.pt3}>
                <react_native_1.View style={[styles.flex1, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                    <Section_1.default title={translate('footer.aboutExpensify')} subtitle={translate('initialSettingsPage.aboutPage.description')} isCentralPane subtitleMuted illustration={LottieAnimations_1.default.Coin} titleStyles={styles.accountSettingsSectionTitle} overlayContent={overlayContent}>
                        <react_native_1.View style={[styles.flex1, styles.mt5]}>
                            <MenuItemList_1.default menuItems={menuItems} shouldUseSingleExecution/>
                        </react_native_1.View>
                    </Section_1.default>
                </react_native_1.View>
                <react_native_1.View style={[styles.renderHTML, styles.pl5, styles.mb5]}>
                    <RenderHTML_1.default html={translate('initialSettingsPage.readTheTermsAndPrivacy')}/>
                </react_native_1.View>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
AboutPage.displayName = 'AboutPage';
exports.default = AboutPage;
