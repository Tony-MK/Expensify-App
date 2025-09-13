"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Illustrations = require("@components/Icon/Illustrations");
const LottieAnimations_1 = require("@components/LottieAnimations");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Section_1 = require("@components/Section");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const User_1 = require("@libs/actions/User");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const getPlatform_1 = require("@libs/getPlatform");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const LOCALES_1 = require("@src/CONST/LOCALES");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function PreferencesPage() {
    const [priorityMode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIORITY_MODE, { canBeMissing: true });
    const platform = (0, getPlatform_1.default)(true);
    const [mutedPlatforms = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_MUTED_PLATFORMS, { canBeMissing: true });
    const isPlatformMuted = mutedPlatforms[platform];
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const [preferredTheme] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PREFERRED_THEME, { canBeMissing: true });
    const [preferredLocale] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE, { canBeMissing: true });
    const personalPolicy = (0, usePolicy_1.default)((0, PolicyUtils_1.getPersonalPolicy)()?.id);
    const paymentCurrency = personalPolicy?.outputCurrency ?? CONST_1.default.CURRENCY.USD;
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} shouldEnablePickerAvoiding={false} shouldShowOfflineIndicatorInWideScreen testID={PreferencesPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('common.preferences')} icon={Illustrations.Gears} shouldUseHeadlineHeader shouldShowBackButton={shouldUseNarrowLayout} shouldDisplaySearchRouter onBackButtonPress={Navigation_1.default.popToSidebar}/>
            <ScrollView_1.default contentContainerStyle={styles.pt3}>
                <react_native_1.View style={[styles.flex1, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                    <Section_1.default title={translate('preferencesPage.appSection.title')} isCentralPane illustration={LottieAnimations_1.default.PreferencesDJ} titleStyles={styles.accountSettingsSectionTitle}>
                        <react_native_1.View style={[styles.flex1, styles.mt5]}>
                            <react_native_1.View style={[styles.flexRow, styles.mb4, styles.justifyContentBetween, styles.sectionMenuItemTopDescription]}>
                                <react_native_1.View style={styles.flex4}>
                                    <Text_1.default>{translate('preferencesPage.receiveRelevantFeatureUpdatesAndExpensifyNews')}</Text_1.default>
                                </react_native_1.View>
                                <react_native_1.View style={[styles.flex1, styles.alignItemsEnd]}>
                                    <Switch_1.default accessibilityLabel={translate('preferencesPage.receiveRelevantFeatureUpdatesAndExpensifyNews')} isOn={account?.isSubscribedToNewsletter ?? true} onToggle={User_1.updateNewsletterSubscription}/>
                                </react_native_1.View>
                            </react_native_1.View>
                            <react_native_1.View style={[styles.flexRow, styles.mb4, styles.justifyContentBetween]}>
                                <react_native_1.View style={styles.flex4}>
                                    <Text_1.default>{translate('preferencesPage.muteAllSounds')}</Text_1.default>
                                </react_native_1.View>
                                <react_native_1.View style={[styles.flex1, styles.alignItemsEnd]}>
                                    <Switch_1.default accessibilityLabel={translate('preferencesPage.muteAllSounds')} isOn={isPlatformMuted ?? false} onToggle={() => (0, User_1.togglePlatformMute)(platform, mutedPlatforms)}/>
                                </react_native_1.View>
                            </react_native_1.View>
                            <MenuItemWithTopDescription_1.default shouldShowRightIcon title={translate(`priorityModePage.priorityModes.${priorityMode ?? CONST_1.default.PRIORITY_MODE.DEFAULT}.label`)} description={translate('priorityModePage.priorityMode')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_PRIORITY_MODE)} wrapperStyle={styles.sectionMenuItemTopDescription}/>
                            <MenuItemWithTopDescription_1.default shouldShowRightIcon title={preferredLocale ? LOCALES_1.LOCALE_TO_LANGUAGE_STRING[preferredLocale] : undefined} description={translate('languagePage.language')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_LANGUAGE)} wrapperStyle={styles.sectionMenuItemTopDescription} hintText={!preferredLocale || !(0, LOCALES_1.isFullySupportedLocale)(preferredLocale) ? translate('languagePage.aiGenerated') : ''}/>
                            <MenuItemWithTopDescription_1.default shouldShowRightIcon title={`${paymentCurrency} - ${(0, CurrencyUtils_1.getCurrencySymbol)(paymentCurrency)}`} description={translate('billingCurrency.paymentCurrency')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_PAYMENT_CURRENCY)} wrapperStyle={styles.sectionMenuItemTopDescription}/>
                            <MenuItemWithTopDescription_1.default shouldShowRightIcon title={translate(`themePage.themes.${preferredTheme ?? CONST_1.default.THEME.DEFAULT}.label`)} description={translate('themePage.theme')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_THEME)} wrapperStyle={styles.sectionMenuItemTopDescription}/>
                        </react_native_1.View>
                    </Section_1.default>
                </react_native_1.View>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
PreferencesPage.displayName = 'PreferencesPage';
exports.default = PreferencesPage;
