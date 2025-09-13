"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Illustrations = require("@components/Icon/Illustrations");
const LottieAnimations_1 = require("@components/LottieAnimations");
const MenuItemList_1 = require("@components/MenuItemList");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Section_1 = require("@components/Section");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWaitForNavigation_1 = require("@hooks/useWaitForNavigation");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
function SaveTheWorldPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const waitForNavigate = (0, useWaitForNavigation_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const theme = (0, useTheme_1.default)();
    const menuItems = (0, react_1.useMemo)(() => {
        const baseMenuItems = [
            {
                translationKey: 'teachersUnitePage.iKnowATeacher',
                action: waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.I_KNOW_A_TEACHER)),
            },
            {
                translationKey: 'teachersUnitePage.iAmATeacher',
                action: waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.I_AM_A_TEACHER)),
            },
        ];
        return baseMenuItems.map((item) => ({
            key: item.translationKey,
            title: translate(item.translationKey),
            onPress: item.action,
            shouldShowRightIcon: true,
            link: '',
            wrapperStyle: [styles.sectionMenuItemTopDescription],
        }));
    }, [translate, waitForNavigate, styles]);
    return (<ScreenWrapper_1.default testID={SaveTheWorldPage.displayName} includeSafeAreaPaddingBottom={false} shouldEnablePickerAvoiding={false} shouldShowOfflineIndicatorInWideScreen>
            <HeaderWithBackButton_1.default title={translate('sidebarScreen.saveTheWorld')} shouldShowBackButton={shouldUseNarrowLayout} shouldDisplaySearchRouter onBackButtonPress={Navigation_1.default.popToSidebar} icon={Illustrations.TeachersUnite} shouldUseHeadlineHeader/>
            <ScrollView_1.default contentContainerStyle={styles.pt3}>
                <react_native_1.View style={[styles.flex1, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                    <Section_1.default title={translate('teachersUnitePage.teachersUnite')} subtitle={translate('teachersUnitePage.joinExpensifyOrg')} isCentralPane subtitleMuted illustration={LottieAnimations_1.default.SaveTheWorld} illustrationBackgroundColor={theme.PAGE_THEMES[SCREENS_1.default.SAVE_THE_WORLD.ROOT].backgroundColor} titleStyles={styles.accountSettingsSectionTitle} childrenStyles={styles.pt5}>
                        <MenuItemList_1.default menuItems={menuItems} shouldUseSingleExecution/>
                    </Section_1.default>
                </react_native_1.View>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
SaveTheWorldPage.displayName = 'SettingSecurityPage';
exports.default = SaveTheWorldPage;
