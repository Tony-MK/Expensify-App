"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const ImportOnyxState_1 = require("@components/ImportOnyxState");
const LottieAnimations_1 = require("@components/LottieAnimations");
const MenuItemList_1 = require("@components/MenuItemList");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const RecordTroubleshootDataToolMenu_1 = require("@components/RecordTroubleshootDataToolMenu");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const SearchContext_1 = require("@components/Search/SearchContext");
const Section_1 = require("@components/Section");
const Switch_1 = require("@components/Switch");
const TestToolMenu_1 = require("@components/TestToolMenu");
const TestToolRow_1 = require("@components/TestToolRow");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWaitForNavigation_1 = require("@hooks/useWaitForNavigation");
const ExitSurvey_1 = require("@libs/actions/ExitSurvey");
const HybridApp_1 = require("@libs/actions/HybridApp");
const MaskOnyx_1 = require("@libs/actions/MaskOnyx");
const ExportOnyxState_1 = require("@libs/ExportOnyxState");
const Navigation_1 = require("@libs/Navigation/Navigation");
const App_1 = require("@userActions/App");
const CONFIG_1 = require("@src/CONFIG");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function TroubleshootPage() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isProduction } = (0, useEnvironment_1.default)();
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = (0, react_1.useState)(false);
    const waitForNavigate = (0, useWaitForNavigation_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [shouldStoreLogs] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHOULD_STORE_LOGS, { canBeMissing: true });
    const [shouldMaskOnyxState = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHOULD_MASK_ONYX_STATE, { canBeMissing: true });
    const { resetOptions } = (0, OptionListContextProvider_1.useOptionsList)({ shouldInitialize: false });
    const [tryNewDot] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { canBeMissing: true });
    const shouldOpenSurveyReasonPage = tryNewDot?.classicRedirect?.dismissed === false;
    const { setShouldResetSearchQuery } = (0, SearchContext_1.useSearchContext)();
    const exportOnyxState = (0, react_1.useCallback)(() => {
        ExportOnyxState_1.default.readFromOnyxDatabase().then((value) => {
            const dataToShare = ExportOnyxState_1.default.maskOnyxState(value, shouldMaskOnyxState);
            ExportOnyxState_1.default.shareAsFile(JSON.stringify(dataToShare));
        });
    }, [shouldMaskOnyxState]);
    const menuItems = (0, react_1.useMemo)(() => {
        const debugConsoleItem = {
            translationKey: 'initialSettingsPage.troubleshoot.viewConsole',
            icon: Expensicons.Bug,
            action: waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_CONSOLE.getRoute(ROUTES_1.default.SETTINGS_TROUBLESHOOT))),
        };
        const baseMenuItems = [
            {
                translationKey: 'exitSurvey.goToExpensifyClassic',
                icon: Expensicons.ExpensifyLogoNew,
                ...(CONFIG_1.default.IS_HYBRID_APP
                    ? {
                        action: () => (0, HybridApp_1.closeReactNativeApp)({ shouldSetNVP: true }),
                    }
                    : {
                        action() {
                            (0, ExitSurvey_1.resetExitSurveyForm)(() => {
                                if (shouldOpenSurveyReasonPage) {
                                    Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_EXIT_SURVEY_REASON.route);
                                    return;
                                }
                                Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_EXIT_SURVEY_CONFIRM.route);
                            });
                        },
                    }),
            },
            {
                translationKey: 'initialSettingsPage.troubleshoot.clearCacheAndRestart',
                icon: Expensicons.RotateLeft,
                action: () => setIsConfirmationModalVisible(true),
            },
            {
                translationKey: 'initialSettingsPage.troubleshoot.exportOnyxState',
                icon: Expensicons.Download,
                action: exportOnyxState,
            },
        ];
        if (shouldStoreLogs) {
            baseMenuItems.push(debugConsoleItem);
        }
        return baseMenuItems
            .map((item) => ({
            key: item.translationKey,
            title: translate(item.translationKey),
            icon: item.icon,
            onPress: item.action,
            wrapperStyle: [styles.sectionMenuItemTopDescription],
        }))
            .reverse();
    }, [waitForNavigate, exportOnyxState, shouldStoreLogs, translate, styles.sectionMenuItemTopDescription, shouldOpenSurveyReasonPage]);
    return (<ScreenWrapper_1.default shouldEnablePickerAvoiding={false} shouldShowOfflineIndicatorInWideScreen testID={TroubleshootPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('initialSettingsPage.aboutPage.troubleshoot')} shouldShowBackButton={shouldUseNarrowLayout} shouldDisplaySearchRouter onBackButtonPress={Navigation_1.default.popToSidebar} icon={Illustrations.Lightbulb} shouldUseHeadlineHeader/>
            {isLoading && <FullscreenLoadingIndicator_1.default />}
            <ScrollView_1.default contentContainerStyle={styles.pt3}>
                <react_native_1.View style={[styles.flex1, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                    <Section_1.default title={translate('initialSettingsPage.aboutPage.troubleshoot')} subtitle={translate('initialSettingsPage.troubleshoot.description')} isCentralPane subtitleMuted illustration={LottieAnimations_1.default.Desk} titleStyles={styles.accountSettingsSectionTitle} renderSubtitle={() => (<react_native_1.View style={[styles.renderHTML, styles.flexRow, styles.alignItemsCenter, styles.w100, styles.mt2]}>
                                <RenderHTML_1.default html={translate('initialSettingsPage.troubleshoot.description')}/>
                            </react_native_1.View>)}>
                        <react_native_1.View style={[styles.flex1, styles.mt5]}>
                            <react_native_1.View>
                                <RecordTroubleshootDataToolMenu_1.default />
                                <TestToolRow_1.default title={translate('initialSettingsPage.troubleshoot.maskExportOnyxStateData')}>
                                    <Switch_1.default accessibilityLabel={translate('initialSettingsPage.troubleshoot.maskExportOnyxStateData')} isOn={shouldMaskOnyxState} onToggle={MaskOnyx_1.setShouldMaskOnyxState}/>
                                </TestToolRow_1.default>
                            </react_native_1.View>
                            <ImportOnyxState_1.default setIsLoading={setIsLoading}/>
                            <MenuItemList_1.default menuItems={menuItems} shouldUseSingleExecution/>
                            {!isProduction && (<react_native_1.View style={[styles.mt6]}>
                                    <TestToolMenu_1.default />
                                </react_native_1.View>)}
                            <ConfirmModal_1.default title={translate('common.areYouSure')} isVisible={isConfirmationModalVisible} onConfirm={() => {
            setIsConfirmationModalVisible(false);
            resetOptions();
            setShouldResetSearchQuery(true);
            (0, App_1.clearOnyxAndResetApp)();
        }} onCancel={() => setIsConfirmationModalVisible(false)} prompt={translate('initialSettingsPage.troubleshoot.confirmResetDescription')} confirmText={translate('initialSettingsPage.troubleshoot.resetAndRefresh')} cancelText={translate('common.cancel')}/>
                        </react_native_1.View>
                    </Section_1.default>
                </react_native_1.View>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
TroubleshootPage.displayName = 'TroubleshootPage';
exports.default = TroubleshootPage;
