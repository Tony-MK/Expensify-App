"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const ConfirmModal_1 = require("@components/ConfirmModal");
const DecisionModal_1 = require("@components/DecisionModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons_1 = require("@components/Icon/Expensicons");
const ImportSpreadsheet_1 = require("@components/ImportSpreadsheet");
const MenuItem_1 = require("@components/MenuItem");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Tag_1 = require("@libs/actions/Policy/Tag");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function ImportTagsOptionsPage({ route }) {
    const policyID = route.params.policyID;
    const policy = (0, usePolicy_1.default)(policyID);
    const backTo = route.params.backTo;
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to use the correct modal type for the decision modal
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const hasAccountingConnections = (0, PolicyUtils_1.hasAccountingConnections)(policy);
    const isQuickSettingsFlow = !!backTo;
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [isSwitchSingleToMultipleLevelTagWarningModalVisible, setIsSwitchSingleToMultipleLevelTagWarningModalVisible] = (0, react_1.useState)(false);
    const [isDownloadFailureModalVisible, setIsDownloadFailureModalVisible] = (0, react_1.useState)(false);
    const [shouldRunPostUpgradeFlow, setShouldRunPostUpgradeFlow] = (0, react_1.useState)(false);
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`, { canBeMissing: true });
    const [policyTagLists, isMultiLevelTags, hasDependentTags, hasIndependentTags] = (0, react_1.useMemo)(() => [(0, PolicyUtils_1.getTagLists)(policyTags), (0, PolicyUtils_1.isMultiLevelTags)(policyTags), (0, PolicyUtils_1.hasDependentTags)(policy, policyTags), (0, PolicyUtils_1.hasIndependentTags)(policy, policyTags)], [policy, policyTags]);
    const hasVisibleTags = (0, react_1.useMemo)(() => {
        if (isMultiLevelTags) {
            return policyTagLists.some((policyTagList) => Object.values(policyTagList.tags ?? {}).some((tag) => tag.enabled));
        }
        const singleLevelTags = policyTagLists.at(0)?.tags ?? {};
        return Object.values(singleLevelTags).some((tag) => tag.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
    }, [isMultiLevelTags, policyTagLists]);
    const startMultiLevelTagImportFlow = (0, react_1.useCallback)(() => {
        (0, Tag_1.setImportedSpreadsheetIsImportingMultiLevelTags)(true);
        if (hasVisibleTags) {
            setIsSwitchSingleToMultipleLevelTagWarningModalVisible(true);
        }
        else {
            Navigation_1.default.navigate(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_TAGS_IMPORT.getRoute(policyID, ROUTES_1.default.SETTINGS_TAGS_ROOT.getRoute(policyID, backTo)) : ROUTES_1.default.WORKSPACE_TAGS_IMPORT.getRoute(policyID));
        }
    }, [hasVisibleTags, policyID, isQuickSettingsFlow, backTo]);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        if (!shouldRunPostUpgradeFlow || !(0, PolicyUtils_1.isControlPolicy)(policy)) {
            return;
        }
        startMultiLevelTagImportFlow();
        setShouldRunPostUpgradeFlow(false);
    }, [shouldRunPostUpgradeFlow, policy, startMultiLevelTagImportFlow]));
    if (hasAccountingConnections) {
        return <NotFoundPage_1.default />;
    }
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} fullPageNotFoundViewProps={{ subtitleKey: (0, EmptyObject_1.isEmptyObject)(policy) ? undefined : 'workspace.common.notAuthorized', onLinkPress: PolicyUtils_1.goBackFromInvalidPolicy }}>
            <ScreenWrapper_1.default shouldEnableKeyboardAvoidingView={false} testID={ImportSpreadsheet_1.default.displayName} shouldEnableMaxHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} enableEdgeToEdgeBottomSafeAreaPadding>
                <HeaderWithBackButton_1.default title={translate('workspace.tags.importTags')} onBackButtonPress={() => Navigation_1.default.goBack(backTo)}/>
                <FullPageOfflineBlockingView_1.default>
                    <Text_1.default style={[styles.ph5, styles.pv3, styles.textSupporting, styles.textNormal]}>{translate('workspace.tags.importTagsSupportingText')}</Text_1.default>

                    <MenuItem_1.default title={translate('workspace.tags.tagLevel.singleLevel')} icon={Expensicons_1.Tag} shouldShowRightIcon onPress={() => {
            (0, Tag_1.setImportedSpreadsheetIsImportingMultiLevelTags)(false);
            if (hasVisibleTags) {
                setIsSwitchSingleToMultipleLevelTagWarningModalVisible(true);
            }
            else {
                Navigation_1.default.navigate(isQuickSettingsFlow
                    ? ROUTES_1.default.SETTINGS_TAGS_IMPORT.getRoute(policyID, ROUTES_1.default.SETTINGS_TAGS_ROOT.getRoute(policyID, backTo))
                    : ROUTES_1.default.WORKSPACE_TAGS_IMPORT.getRoute(policyID));
            }
        }}/>
                    <MenuItem_1.default title={translate('workspace.tags.tagLevel.multiLevel')} 
    // TODO: Update icon to multi-level tag icon once it's provided by design team
    icon={Expensicons_1.MultiTag} shouldShowRightIcon onPress={() => {
            if (!(0, PolicyUtils_1.isControlPolicy)(policy)) {
                setShouldRunPostUpgradeFlow(true);
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policyID, CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.multiLevelTags.alias, Navigation_1.default.getActiveRoute()));
                return;
            }
            startMultiLevelTagImportFlow();
        }}/>
                </FullPageOfflineBlockingView_1.default>
            </ScreenWrapper_1.default>
            <DecisionModal_1.default title={translate('common.downloadFailedTitle')} prompt={translate('common.downloadFailedDescription')} isSmallScreenWidth={isSmallScreenWidth} onSecondOptionSubmit={() => setIsDownloadFailureModalVisible(false)} secondOptionText={translate('common.buttonConfirm')} isVisible={isDownloadFailureModalVisible} onClose={() => setIsDownloadFailureModalVisible(false)}/>
            <ConfirmModal_1.default isVisible={isSwitchSingleToMultipleLevelTagWarningModalVisible} onConfirm={() => {
            (0, Tag_1.cleanPolicyTags)(policyID);
            setIsSwitchSingleToMultipleLevelTagWarningModalVisible(false);
            Navigation_1.default.navigate(isQuickSettingsFlow
                ? ROUTES_1.default.SETTINGS_TAGS_IMPORT.getRoute(policyID, ROUTES_1.default.SETTINGS_TAGS_ROOT.getRoute(policyID, backTo))
                : ROUTES_1.default.WORKSPACE_TAGS_IMPORT.getRoute(policyID));
        }} title={translate('workspace.tags.switchSingleToMultiLevelTagWarning.title')} prompt={<Text_1.default>
                        {translate('workspace.tags.switchSingleToMultiLevelTagWarning.prompt1')}
                        {!hasDependentTags && (<>
                                {translate('workspace.tags.switchSingleToMultiLevelTagWarning.prompt2')}
                                <TextLink_1.default onPress={() => {
                    if (hasIndependentTags && isMultiLevelTags) {
                        (0, Tag_1.downloadMultiLevelIndependentTagsCSV)(policyID, () => {
                            setIsDownloadFailureModalVisible(true);
                        });
                    }
                    else {
                        (0, Tag_1.downloadTagsCSV)(policyID, () => {
                            setIsDownloadFailureModalVisible(true);
                        });
                    }
                }}>
                                    {translate('workspace.tags.switchSingleToMultiLevelTagWarning.prompt3')}
                                </TextLink_1.default>
                                {translate('workspace.tags.switchSingleToMultiLevelTagWarning.prompt4')}
                                <TextLink_1.default href={CONST_1.default.IMPORT_SPREADSHEET.TAGS_ARTICLE_LINK}>{translate('workspace.tags.switchSingleToMultiLevelTagWarning.prompt5')}</TextLink_1.default>
                                {translate('workspace.tags.switchSingleToMultiLevelTagWarning.prompt6')}
                            </>)}
                    </Text_1.default>} confirmText={translate('workspace.tags.switchSingleToMultiLevelTagWarning.title')} danger cancelText={translate('common.cancel')} onCancel={() => {
            (0, Tag_1.setImportedSpreadsheetIsImportingMultiLevelTags)(false);
            setIsSwitchSingleToMultipleLevelTagWarningModalVisible(false);
        }}/>
        </AccessOrNotFoundWrapper_1.default>);
}
ImportTagsOptionsPage.displayName = 'ImportTagsOptionsPage';
exports.default = ImportTagsOptionsPage;
