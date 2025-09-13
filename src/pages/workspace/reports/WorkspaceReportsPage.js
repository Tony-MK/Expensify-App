"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flash_list_1 = require("@shopify/flash-list");
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons_1 = require("@components/Icon/Expensicons");
const Illustrations_1 = require("@components/Icon/Illustrations");
const ImportedFromAccountingSoftware_1 = require("@components/ImportedFromAccountingSoftware");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Section_1 = require("@components/Section");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const connections_1 = require("@libs/actions/connections");
const Policy_1 = require("@libs/actions/Policy/Policy");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const WorkspaceReportFieldUtils_1 = require("@libs/WorkspaceReportFieldUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const variables_1 = require("@styles/variables");
const ReportField_1 = require("@userActions/Policy/ReportField");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function keyExtractor(item) {
    return item.keyForList ?? '';
}
function WorkspaceReportFieldsPage({ route: { params: { policyID }, }, }) {
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout for the small screen selection mode
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const [isReportFieldsWarningModalOpen, setIsReportFieldsWarningModalOpen] = (0, react_1.useState)(false);
    const policy = (0, usePolicy_1.default)(policyID);
    const [connectionSyncProgress] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS}${policyID}`, { canBeMissing: true });
    const isSyncInProgress = (0, connections_1.isConnectionInProgress)(connectionSyncProgress, policy);
    const hasSyncError = (0, PolicyUtils_1.shouldShowSyncError)(policy, isSyncInProgress);
    const connectedIntegration = (0, PolicyUtils_1.getConnectedIntegration)(policy) ?? connectionSyncProgress?.connectionName;
    const isConnectionVerified = connectedIntegration && !(0, connections_1.isConnectionUnverified)(policy, connectedIntegration);
    const currentConnectionName = (0, PolicyUtils_1.getCurrentConnectionName)(policy);
    const hasAccountingConnections = (0, PolicyUtils_1.hasAccountingConnections)(policy);
    const filteredPolicyFieldList = (0, react_1.useMemo)(() => {
        if (!policy?.fieldList) {
            return {};
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return Object.fromEntries(Object.entries(policy.fieldList).filter(([_, value]) => value.fieldID !== 'text_title'));
    }, [policy]);
    const [isOrganizeWarningModalOpen, setIsOrganizeWarningModalOpen] = (0, react_1.useState)(false);
    const onDisabledOrganizeSwitchPress = (0, react_1.useCallback)(() => {
        if (!hasAccountingConnections) {
            return;
        }
        setIsOrganizeWarningModalOpen(true);
    }, [hasAccountingConnections]);
    const fetchReportFields = (0, react_1.useCallback)(() => {
        (0, ReportField_1.openPolicyReportFieldsPage)(policyID);
    }, [policyID]);
    const { isOffline } = (0, useNetwork_1.default)({ onReconnect: fetchReportFields });
    (0, react_1.useEffect)(() => {
        fetchReportFields();
    }, [fetchReportFields]);
    const reportFieldsSections = (0, react_1.useMemo)(() => {
        if (!policy) {
            return [];
        }
        return Object.values(filteredPolicyFieldList)
            .sort((a, b) => localeCompare(a.name, b.name))
            .map((reportField) => ({
            text: reportField.name,
            keyForList: String(reportField.fieldID),
            fieldID: reportField.fieldID,
            pendingAction: reportField.pendingAction,
            isDisabled: reportField.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
            rightLabel: expensify_common_1.Str.recapitalize(translate((0, WorkspaceReportFieldUtils_1.getReportFieldTypeTranslationKey)(reportField.type))),
        }));
    }, [filteredPolicyFieldList, policy, translate, localeCompare]);
    const navigateToReportFieldsSettings = (0, react_1.useCallback)((reportField) => {
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_REPORT_FIELDS_SETTINGS.getRoute(policyID, reportField.fieldID));
    }, [policyID]);
    const getHeaderText = () => !hasSyncError && isConnectionVerified && currentConnectionName ? (<Text_1.default style={[styles.mr5, styles.mt1]}>
                <ImportedFromAccountingSoftware_1.default policyID={policyID} currentConnectionName={currentConnectionName} connectedIntegration={connectedIntegration} translatedText={translate('workspace.reportFields.importedFromAccountingSoftware')}/>
            </Text_1.default>) : (<Text_1.default style={[styles.textNormal, styles.colorMuted, styles.mr5, styles.mt1]}>{translate('workspace.reportFields.subtitle')}</Text_1.default>);
    const isLoading = !isOffline && policy === undefined;
    const renderItem = (0, react_1.useCallback)(({ item }) => (<OfflineWithFeedback_1.default pendingAction={item.pendingAction}>
                <MenuItem_1.default style={shouldUseNarrowLayout ? styles.ph5 : styles.ph8} onPress={() => navigateToReportFieldsSettings(item)} description={item.text} disabled={item.isDisabled} shouldShowRightIcon={!item.isDisabled} interactive={!item.isDisabled} rightLabel={item.rightLabel} descriptionTextStyle={[styles.popoverMenuText, styles.textStrong]}/>
            </OfflineWithFeedback_1.default>), [shouldUseNarrowLayout, styles.ph5, styles.ph8, styles.popoverMenuText, styles.textStrong, navigateToReportFieldsSettings]);
    const titleFieldError = policy?.errorFields?.fieldList?.[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE];
    const reportTitleErrors = (0, ErrorUtils_1.getLatestErrorField)({ errorFields: titleFieldError ?? {} }, 'defaultValue');
    const reportTitlePendingFields = policy?.fieldList?.[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE]?.pendingFields ?? {};
    const clearTitleFieldError = () => {
        (0, Policy_1.clearPolicyTitleFieldError)(policyID);
    };
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={WorkspaceReportFieldsPage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto}>
                <HeaderWithBackButton_1.default icon={Illustrations_1.ReportReceipt} title={translate('common.reports')} shouldUseHeadlineHeader shouldShowBackButton={shouldUseNarrowLayout} onBackButtonPress={Navigation_1.default.popToSidebar}/>
                {isLoading && (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} style={styles.flex1} color={theme.spinner}/>)}
                {!isLoading && (<ScrollView_1.default contentContainerStyle={[styles.flexGrow1, styles.mt3, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                        <Section_1.default isCentralPane title={translate('workspace.common.reportTitle')} renderSubtitle={() => (<react_native_1.View style={[[styles.renderHTML, styles.mt1]]}>
                                    <RenderHTML_1.default html={translate('workspace.reports.customReportNamesSubtitle')}/>
                                </react_native_1.View>)} containerStyles={shouldUseNarrowLayout ? styles.p5 : styles.p8} titleStyles={[styles.textHeadline, styles.cardSectionTitle, styles.accountSettingsSectionTitle, styles.mb1]}>
                            <OfflineWithFeedback_1.default pendingAction={reportTitlePendingFields.defaultValue} shouldForceOpacity={!!reportTitlePendingFields.defaultValue} errors={reportTitleErrors} errorRowStyles={styles.mh0} onClose={clearTitleFieldError}>
                                <MenuItemWithTopDescription_1.default description={translate('workspace.reports.customNameTitle')} title={expensify_common_1.Str.htmlDecode(policy?.fieldList?.[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE].defaultValue ?? '')} shouldShowRightIcon style={[styles.sectionMenuItemTopDescription, styles.mt6, styles.mbn3]} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.REPORTS_DEFAULT_TITLE.getRoute(policyID))}/>
                            </OfflineWithFeedback_1.default>
                            <ToggleSettingsOptionRow_1.default pendingAction={reportTitlePendingFields.deletable} title={translate('workspace.reports.preventMembersFromChangingCustomNamesTitle')} switchAccessibilityLabel={translate('workspace.reports.preventMembersFromChangingCustomNamesTitle')} wrapperStyle={[styles.sectionMenuItemTopDescription, styles.mt6]} titleStyle={styles.pv2} isActive={!policy?.fieldList?.[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE].deletable} onToggle={(isEnabled) => {
                if (isEnabled && !(0, PolicyUtils_1.isControlPolicy)(policy)) {
                    Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policyID, CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.policyPreventMemberChangingTitle.alias, ROUTES_1.default.WORKSPACE_REPORTS.getRoute(policyID)));
                    return;
                }
                (0, Policy_1.setPolicyPreventMemberCreatedTitle)(policyID, isEnabled);
            }}/>
                        </Section_1.default>
                        <Section_1.default isCentralPane containerStyles={shouldUseNarrowLayout ? styles.p5 : styles.p8}>
                            <ToggleSettingsOptionRow_1.default pendingAction={policy?.pendingFields?.areReportFieldsEnabled} title={translate('workspace.common.reportFields')} switchAccessibilityLabel={translate('workspace.common.reportFields')} subtitle={getHeaderText()} titleStyle={[styles.textHeadline, styles.cardSectionTitle, styles.accountSettingsSectionTitle, styles.mb1]} isActive={!!policy?.areReportFieldsEnabled} onToggle={(isEnabled) => {
                if (!isEnabled) {
                    setIsReportFieldsWarningModalOpen(true);
                    return;
                }
                if (!(0, PolicyUtils_1.isControlPolicy)(policy)) {
                    Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policyID, CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.reportFields.alias, ROUTES_1.default.WORKSPACE_REPORTS.getRoute(policyID)));
                    return;
                }
                (0, Policy_1.enablePolicyReportFields)(policyID, isEnabled);
            }} disabled={hasAccountingConnections} disabledAction={onDisabledOrganizeSwitchPress} subMenuItems={!!policy?.areReportFieldsEnabled && (<>
                                            <react_native_1.View style={[shouldUseNarrowLayout ? styles.mhn5 : styles.mhn8, styles.mt6]}>
                                                <flash_list_1.FlashList data={reportFieldsSections} renderItem={renderItem} estimatedItemSize={variables_1.default.optionRowHeight} keyExtractor={keyExtractor}/>
                                            </react_native_1.View>
                                            {!hasAccountingConnections && (<MenuItem_1.default onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_CREATE_REPORT_FIELD.getRoute(policyID))} title={translate('workspace.reportFields.addField')} icon={Expensicons_1.Plus} style={[styles.sectionMenuItemTopDescription]}/>)}
                                        </>)}/>
                        </Section_1.default>
                    </ScrollView_1.default>)}
                <ConfirmModal_1.default title={translate('workspace.reportFields.disableReportFields')} isVisible={isReportFieldsWarningModalOpen} onConfirm={() => {
            if (!policyID) {
                return;
            }
            setIsReportFieldsWarningModalOpen(false);
            (0, Policy_1.enablePolicyReportFields)(policyID, false);
        }} onCancel={() => setIsReportFieldsWarningModalOpen(false)} prompt={translate('workspace.reportFields.disableReportFieldsConfirmation')} confirmText={translate('common.disable')} cancelText={translate('common.cancel')} danger/>
                <ConfirmModal_1.default title={translate('workspace.moreFeatures.connectionsWarningModal.featureEnabledTitle')} onConfirm={() => {
            if (!policyID) {
                return;
            }
            setIsOrganizeWarningModalOpen(false);
            Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyID));
        }} onCancel={() => setIsOrganizeWarningModalOpen(false)} isVisible={isOrganizeWarningModalOpen} prompt={translate('workspace.moreFeatures.connectionsWarningModal.featureEnabledText')} confirmText={translate('workspace.moreFeatures.connectionsWarningModal.manageSettings')} cancelText={translate('common.cancel')}/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceReportFieldsPage.displayName = 'WorkspaceReportFieldsPage';
exports.default = WorkspaceReportFieldsPage;
