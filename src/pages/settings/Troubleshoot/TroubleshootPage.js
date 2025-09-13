"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var ConfirmModal_1 = require("@components/ConfirmModal");
var FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var Expensicons = require("@components/Icon/Expensicons");
var Illustrations = require("@components/Icon/Illustrations");
var ImportOnyxState_1 = require("@components/ImportOnyxState");
var LottieAnimations_1 = require("@components/LottieAnimations");
var MenuItemList_1 = require("@components/MenuItemList");
var OptionListContextProvider_1 = require("@components/OptionListContextProvider");
var RecordTroubleshootDataToolMenu_1 = require("@components/RecordTroubleshootDataToolMenu");
var RenderHTML_1 = require("@components/RenderHTML");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var ScrollView_1 = require("@components/ScrollView");
var SearchContext_1 = require("@components/Search/SearchContext");
var Section_1 = require("@components/Section");
var Switch_1 = require("@components/Switch");
var TestToolMenu_1 = require("@components/TestToolMenu");
var TestToolRow_1 = require("@components/TestToolRow");
var useEnvironment_1 = require("@hooks/useEnvironment");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var useWaitForNavigation_1 = require("@hooks/useWaitForNavigation");
var ExitSurvey_1 = require("@libs/actions/ExitSurvey");
var HybridApp_1 = require("@libs/actions/HybridApp");
var MaskOnyx_1 = require("@libs/actions/MaskOnyx");
var ExportOnyxState_1 = require("@libs/ExportOnyxState");
var Navigation_1 = require("@libs/Navigation/Navigation");
var App_1 = require("@userActions/App");
var CONFIG_1 = require("@src/CONFIG");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
function TroubleshootPage() {
    var _a;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var isProduction = (0, useEnvironment_1.default)().isProduction;
    var _b = (0, react_1.useState)(false), isConfirmationModalVisible = _b[0], setIsConfirmationModalVisible = _b[1];
    var waitForNavigate = (0, useWaitForNavigation_1.default)();
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var _c = (0, react_1.useState)(false), isLoading = _c[0], setIsLoading = _c[1];
    var shouldStoreLogs = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHOULD_STORE_LOGS, { canBeMissing: true })[0];
    var _d = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHOULD_MASK_ONYX_STATE, { canBeMissing: true })[0], shouldMaskOnyxState = _d === void 0 ? true : _d;
    var resetOptions = (0, OptionListContextProvider_1.useOptionsList)({ shouldInitialize: false }).resetOptions;
    var tryNewDot = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { canBeMissing: true })[0];
    var shouldOpenSurveyReasonPage = ((_a = tryNewDot === null || tryNewDot === void 0 ? void 0 : tryNewDot.classicRedirect) === null || _a === void 0 ? void 0 : _a.dismissed) === false;
    var setShouldResetSearchQuery = (0, SearchContext_1.useSearchContext)().setShouldResetSearchQuery;
    var exportOnyxState = (0, react_1.useCallback)(function () {
        ExportOnyxState_1.default.readFromOnyxDatabase().then(function (value) {
            var dataToShare = ExportOnyxState_1.default.maskOnyxState(value, shouldMaskOnyxState);
            ExportOnyxState_1.default.shareAsFile(JSON.stringify(dataToShare));
        });
    }, [shouldMaskOnyxState]);
    var menuItems = (0, react_1.useMemo)(function () {
        var debugConsoleItem = {
            translationKey: 'initialSettingsPage.troubleshoot.viewConsole',
            icon: Expensicons.Bug,
            action: waitForNavigate(function () { return Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_CONSOLE.getRoute(ROUTES_1.default.SETTINGS_TROUBLESHOOT)); }),
        };
        var baseMenuItems = [
            __assign({ translationKey: 'exitSurvey.goToExpensifyClassic', icon: Expensicons.ExpensifyLogoNew }, (CONFIG_1.default.IS_HYBRID_APP
                ? {
                    action: function () { return (0, HybridApp_1.closeReactNativeApp)({ shouldSetNVP: true }); },
                }
                : {
                    action: function () {
                        (0, ExitSurvey_1.resetExitSurveyForm)(function () {
                            if (shouldOpenSurveyReasonPage) {
                                Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_EXIT_SURVEY_REASON.route);
                                return;
                            }
                            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_EXIT_SURVEY_CONFIRM.route);
                        });
                    },
                })),
            {
                translationKey: 'initialSettingsPage.troubleshoot.clearCacheAndRestart',
                icon: Expensicons.RotateLeft,
                action: function () { return setIsConfirmationModalVisible(true); },
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
            .map(function (item) { return ({
            key: item.translationKey,
            title: translate(item.translationKey),
            icon: item.icon,
            onPress: item.action,
            wrapperStyle: [styles.sectionMenuItemTopDescription],
        }); })
            .reverse();
    }, [waitForNavigate, exportOnyxState, shouldStoreLogs, translate, styles.sectionMenuItemTopDescription, shouldOpenSurveyReasonPage]);
    return (<ScreenWrapper_1.default shouldEnablePickerAvoiding={false} shouldShowOfflineIndicatorInWideScreen testID={TroubleshootPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('initialSettingsPage.aboutPage.troubleshoot')} shouldShowBackButton={shouldUseNarrowLayout} shouldDisplaySearchRouter onBackButtonPress={Navigation_1.default.popToSidebar} icon={Illustrations.Lightbulb} shouldUseHeadlineHeader/>
            {isLoading && <FullscreenLoadingIndicator_1.default />}
            <ScrollView_1.default contentContainerStyle={styles.pt3}>
                <react_native_1.View style={[styles.flex1, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                    <Section_1.default title={translate('initialSettingsPage.aboutPage.troubleshoot')} subtitle={translate('initialSettingsPage.troubleshoot.description')} isCentralPane subtitleMuted illustration={LottieAnimations_1.default.Desk} titleStyles={styles.accountSettingsSectionTitle} renderSubtitle={function () { return (<react_native_1.View style={[styles.renderHTML, styles.flexRow, styles.alignItemsCenter, styles.w100, styles.mt2]}>
                                <RenderHTML_1.default html={translate('initialSettingsPage.troubleshoot.description')}/>
                            </react_native_1.View>); }}>
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
                            <ConfirmModal_1.default title={translate('common.areYouSure')} isVisible={isConfirmationModalVisible} onConfirm={function () {
            setIsConfirmationModalVisible(false);
            resetOptions();
            setShouldResetSearchQuery(true);
            (0, App_1.clearOnyxAndResetApp)();
        }} onCancel={function () { return setIsConfirmationModalVisible(false); }} prompt={translate('initialSettingsPage.troubleshoot.confirmResetDescription')} confirmText={translate('initialSettingsPage.troubleshoot.resetAndRefresh')} cancelText={translate('common.cancel')}/>
                        </react_native_1.View>
                    </Section_1.default>
                </react_native_1.View>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
TroubleshootPage.displayName = 'TroubleshootPage';
exports.default = TroubleshootPage;
