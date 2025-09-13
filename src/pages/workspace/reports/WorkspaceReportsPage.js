"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flash_list_1 = require("@shopify/flash-list");
var expensify_common_1 = require("expensify-common");
var react_1 = require("react");
var react_native_1 = require("react-native");
var ConfirmModal_1 = require("@components/ConfirmModal");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var Expensicons_1 = require("@components/Icon/Expensicons");
var Illustrations_1 = require("@components/Icon/Illustrations");
var ImportedFromAccountingSoftware_1 = require("@components/ImportedFromAccountingSoftware");
var MenuItem_1 = require("@components/MenuItem");
var MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
var OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
var RenderHTML_1 = require("@components/RenderHTML");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var ScrollView_1 = require("@components/ScrollView");
var Section_1 = require("@components/Section");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var useOnyx_1 = require("@hooks/useOnyx");
var usePolicy_1 = require("@hooks/usePolicy");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var connections_1 = require("@libs/actions/connections");
var Policy_1 = require("@libs/actions/Policy/Policy");
var ErrorUtils_1 = require("@libs/ErrorUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var WorkspaceReportFieldUtils_1 = require("@libs/WorkspaceReportFieldUtils");
var AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
var ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
var variables_1 = require("@styles/variables");
var ReportField_1 = require("@userActions/Policy/ReportField");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
function keyExtractor(item) {
    var _a;
    return (_a = item.keyForList) !== null && _a !== void 0 ? _a : '';
}
function WorkspaceReportFieldsPage(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var policyID = _a.route.params.policyID;
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout for the small screen selection mode
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var styles = (0, useThemeStyles_1.default)();
    var theme = (0, useTheme_1.default)();
    var _m = (0, useLocalize_1.default)(), translate = _m.translate, localeCompare = _m.localeCompare;
    var _o = (0, react_1.useState)(false), isReportFieldsWarningModalOpen = _o[0], setIsReportFieldsWarningModalOpen = _o[1];
    var policy = (0, usePolicy_1.default)(policyID);
    var connectionSyncProgress = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS).concat(policyID), { canBeMissing: true })[0];
    var isSyncInProgress = (0, connections_1.isConnectionInProgress)(connectionSyncProgress, policy);
    var hasSyncError = (0, PolicyUtils_1.shouldShowSyncError)(policy, isSyncInProgress);
    var connectedIntegration = (_b = (0, PolicyUtils_1.getConnectedIntegration)(policy)) !== null && _b !== void 0 ? _b : connectionSyncProgress === null || connectionSyncProgress === void 0 ? void 0 : connectionSyncProgress.connectionName;
    var isConnectionVerified = connectedIntegration && !(0, connections_1.isConnectionUnverified)(policy, connectedIntegration);
    var currentConnectionName = (0, PolicyUtils_1.getCurrentConnectionName)(policy);
    var hasAccountingConnections = (0, PolicyUtils_1.hasAccountingConnections)(policy);
    var filteredPolicyFieldList = (0, react_1.useMemo)(function () {
        if (!(policy === null || policy === void 0 ? void 0 : policy.fieldList)) {
            return {};
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return Object.fromEntries(Object.entries(policy.fieldList).filter(function (_a) {
            var _ = _a[0], value = _a[1];
            return value.fieldID !== 'text_title';
        }));
    }, [policy]);
    var _p = (0, react_1.useState)(false), isOrganizeWarningModalOpen = _p[0], setIsOrganizeWarningModalOpen = _p[1];
    var onDisabledOrganizeSwitchPress = (0, react_1.useCallback)(function () {
        if (!hasAccountingConnections) {
            return;
        }
        setIsOrganizeWarningModalOpen(true);
    }, [hasAccountingConnections]);
    var fetchReportFields = (0, react_1.useCallback)(function () {
        (0, ReportField_1.openPolicyReportFieldsPage)(policyID);
    }, [policyID]);
    var isOffline = (0, useNetwork_1.default)({ onReconnect: fetchReportFields }).isOffline;
    (0, react_1.useEffect)(function () {
        fetchReportFields();
    }, [fetchReportFields]);
    var reportFieldsSections = (0, react_1.useMemo)(function () {
        if (!policy) {
            return [];
        }
        return Object.values(filteredPolicyFieldList)
            .sort(function (a, b) { return localeCompare(a.name, b.name); })
            .map(function (reportField) { return ({
            text: reportField.name,
            keyForList: String(reportField.fieldID),
            fieldID: reportField.fieldID,
            pendingAction: reportField.pendingAction,
            isDisabled: reportField.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
            rightLabel: expensify_common_1.Str.recapitalize(translate((0, WorkspaceReportFieldUtils_1.getReportFieldTypeTranslationKey)(reportField.type))),
        }); });
    }, [filteredPolicyFieldList, policy, translate, localeCompare]);
    var navigateToReportFieldsSettings = (0, react_1.useCallback)(function (reportField) {
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_REPORT_FIELDS_SETTINGS.getRoute(policyID, reportField.fieldID));
    }, [policyID]);
    var getHeaderText = function () {
        return !hasSyncError && isConnectionVerified && currentConnectionName ? (<Text_1.default style={[styles.mr5, styles.mt1]}>
                <ImportedFromAccountingSoftware_1.default policyID={policyID} currentConnectionName={currentConnectionName} connectedIntegration={connectedIntegration} translatedText={translate('workspace.reportFields.importedFromAccountingSoftware')}/>
            </Text_1.default>) : (<Text_1.default style={[styles.textNormal, styles.colorMuted, styles.mr5, styles.mt1]}>{translate('workspace.reportFields.subtitle')}</Text_1.default>);
    };
    var isLoading = !isOffline && policy === undefined;
    var renderItem = (0, react_1.useCallback)(function (_a) {
        var item = _a.item;
        return (<OfflineWithFeedback_1.default pendingAction={item.pendingAction}>
                <MenuItem_1.default style={shouldUseNarrowLayout ? styles.ph5 : styles.ph8} onPress={function () { return navigateToReportFieldsSettings(item); }} description={item.text} disabled={item.isDisabled} shouldShowRightIcon={!item.isDisabled} interactive={!item.isDisabled} rightLabel={item.rightLabel} descriptionTextStyle={[styles.popoverMenuText, styles.textStrong]}/>
            </OfflineWithFeedback_1.default>);
    }, [shouldUseNarrowLayout, styles.ph5, styles.ph8, styles.popoverMenuText, styles.textStrong, navigateToReportFieldsSettings]);
    var titleFieldError = (_d = (_c = policy === null || policy === void 0 ? void 0 : policy.errorFields) === null || _c === void 0 ? void 0 : _c.fieldList) === null || _d === void 0 ? void 0 : _d[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE];
    var reportTitleErrors = (0, ErrorUtils_1.getLatestErrorField)({ errorFields: titleFieldError !== null && titleFieldError !== void 0 ? titleFieldError : {} }, 'defaultValue');
    var reportTitlePendingFields = (_g = (_f = (_e = policy === null || policy === void 0 ? void 0 : policy.fieldList) === null || _e === void 0 ? void 0 : _e[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE]) === null || _f === void 0 ? void 0 : _f.pendingFields) !== null && _g !== void 0 ? _g : {};
    var clearTitleFieldError = function () {
        (0, Policy_1.clearPolicyTitleFieldError)(policyID);
    };
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={WorkspaceReportFieldsPage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto}>
                <HeaderWithBackButton_1.default icon={Illustrations_1.ReportReceipt} title={translate('common.reports')} shouldUseHeadlineHeader shouldShowBackButton={shouldUseNarrowLayout} onBackButtonPress={Navigation_1.default.popToSidebar}/>
                {isLoading && (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} style={styles.flex1} color={theme.spinner}/>)}
                {!isLoading && (<ScrollView_1.default contentContainerStyle={[styles.flexGrow1, styles.mt3, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                        <Section_1.default isCentralPane title={translate('workspace.common.reportTitle')} renderSubtitle={function () { return (<react_native_1.View style={[[styles.renderHTML, styles.mt1]]}>
                                    <RenderHTML_1.default html={translate('workspace.reports.customReportNamesSubtitle')}/>
                                </react_native_1.View>); }} containerStyles={shouldUseNarrowLayout ? styles.p5 : styles.p8} titleStyles={[styles.textHeadline, styles.cardSectionTitle, styles.accountSettingsSectionTitle, styles.mb1]}>
                            <OfflineWithFeedback_1.default pendingAction={reportTitlePendingFields.defaultValue} shouldForceOpacity={!!reportTitlePendingFields.defaultValue} errors={reportTitleErrors} errorRowStyles={styles.mh0} onClose={clearTitleFieldError}>
                                <MenuItemWithTopDescription_1.default description={translate('workspace.reports.customNameTitle')} title={expensify_common_1.Str.htmlDecode((_j = (_h = policy === null || policy === void 0 ? void 0 : policy.fieldList) === null || _h === void 0 ? void 0 : _h[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE].defaultValue) !== null && _j !== void 0 ? _j : '')} shouldShowRightIcon style={[styles.sectionMenuItemTopDescription, styles.mt6, styles.mbn3]} onPress={function () { return Navigation_1.default.navigate(ROUTES_1.default.REPORTS_DEFAULT_TITLE.getRoute(policyID)); }}/>
                            </OfflineWithFeedback_1.default>
                            <ToggleSettingsOptionRow_1.default pendingAction={reportTitlePendingFields.deletable} title={translate('workspace.reports.preventMembersFromChangingCustomNamesTitle')} switchAccessibilityLabel={translate('workspace.reports.preventMembersFromChangingCustomNamesTitle')} wrapperStyle={[styles.sectionMenuItemTopDescription, styles.mt6]} titleStyle={styles.pv2} isActive={!((_k = policy === null || policy === void 0 ? void 0 : policy.fieldList) === null || _k === void 0 ? void 0 : _k[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE].deletable)} onToggle={function (isEnabled) {
                if (isEnabled && !(0, PolicyUtils_1.isControlPolicy)(policy)) {
                    Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policyID, CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.policyPreventMemberChangingTitle.alias, ROUTES_1.default.WORKSPACE_REPORTS.getRoute(policyID)));
                    return;
                }
                (0, Policy_1.setPolicyPreventMemberCreatedTitle)(policyID, isEnabled);
            }}/>
                        </Section_1.default>
                        <Section_1.default isCentralPane containerStyles={shouldUseNarrowLayout ? styles.p5 : styles.p8}>
                            <ToggleSettingsOptionRow_1.default pendingAction={(_l = policy === null || policy === void 0 ? void 0 : policy.pendingFields) === null || _l === void 0 ? void 0 : _l.areReportFieldsEnabled} title={translate('workspace.common.reportFields')} switchAccessibilityLabel={translate('workspace.common.reportFields')} subtitle={getHeaderText()} titleStyle={[styles.textHeadline, styles.cardSectionTitle, styles.accountSettingsSectionTitle, styles.mb1]} isActive={!!(policy === null || policy === void 0 ? void 0 : policy.areReportFieldsEnabled)} onToggle={function (isEnabled) {
                if (!isEnabled) {
                    setIsReportFieldsWarningModalOpen(true);
                    return;
                }
                if (!(0, PolicyUtils_1.isControlPolicy)(policy)) {
                    Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policyID, CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.reportFields.alias, ROUTES_1.default.WORKSPACE_REPORTS.getRoute(policyID)));
                    return;
                }
                (0, Policy_1.enablePolicyReportFields)(policyID, isEnabled);
            }} disabled={hasAccountingConnections} disabledAction={onDisabledOrganizeSwitchPress} subMenuItems={!!(policy === null || policy === void 0 ? void 0 : policy.areReportFieldsEnabled) && (<>
                                            <react_native_1.View style={[shouldUseNarrowLayout ? styles.mhn5 : styles.mhn8, styles.mt6]}>
                                                <flash_list_1.FlashList data={reportFieldsSections} renderItem={renderItem} estimatedItemSize={variables_1.default.optionRowHeight} keyExtractor={keyExtractor}/>
                                            </react_native_1.View>
                                            {!hasAccountingConnections && (<MenuItem_1.default onPress={function () { return Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_CREATE_REPORT_FIELD.getRoute(policyID)); }} title={translate('workspace.reportFields.addField')} icon={Expensicons_1.Plus} style={[styles.sectionMenuItemTopDescription]}/>)}
                                        </>)}/>
                        </Section_1.default>
                    </ScrollView_1.default>)}
                <ConfirmModal_1.default title={translate('workspace.reportFields.disableReportFields')} isVisible={isReportFieldsWarningModalOpen} onConfirm={function () {
            if (!policyID) {
                return;
            }
            setIsReportFieldsWarningModalOpen(false);
            (0, Policy_1.enablePolicyReportFields)(policyID, false);
        }} onCancel={function () { return setIsReportFieldsWarningModalOpen(false); }} prompt={translate('workspace.reportFields.disableReportFieldsConfirmation')} confirmText={translate('common.disable')} cancelText={translate('common.cancel')} danger/>
                <ConfirmModal_1.default title={translate('workspace.moreFeatures.connectionsWarningModal.featureEnabledTitle')} onConfirm={function () {
            if (!policyID) {
                return;
            }
            setIsOrganizeWarningModalOpen(false);
            Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyID));
        }} onCancel={function () { return setIsOrganizeWarningModalOpen(false); }} isVisible={isOrganizeWarningModalOpen} prompt={translate('workspace.moreFeatures.connectionsWarningModal.featureEnabledText')} confirmText={translate('workspace.moreFeatures.connectionsWarningModal.manageSettings')} cancelText={translate('common.cancel')}/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceReportFieldsPage.displayName = 'WorkspaceReportFieldsPage';
exports.default = WorkspaceReportFieldsPage;
