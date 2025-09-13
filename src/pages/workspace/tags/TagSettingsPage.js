"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Tag_1 = require("@userActions/Policy/Tag");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
function TagSettingsPage({ route, navigation }) {
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${route.params.policyID}`, { canBeMissing: true });
    const { orderWeight, policyID, tagName, backTo, parentTagsFilter } = route.params;
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyTag = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getTagListByOrderWeight)(policyTags, orderWeight), [policyTags, orderWeight]);
    const policy = (0, usePolicy_1.default)(policyID);
    const { environmentURL } = (0, useEnvironment_1.default)();
    const hasAccountingConnections = (0, PolicyUtils_1.hasAccountingConnections)(policy);
    const [isDeleteTagModalOpen, setIsDeleteTagModalOpen] = react_1.default.useState(false);
    const [isCannotDeleteOrDisableLastTagModalVisible, setIsCannotDeleteOrDisableLastTagModalVisible] = (0, react_1.useState)(false);
    const isQuickSettingsFlow = route.name === SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_SETTINGS;
    const tagApprover = (0, PolicyUtils_1.getTagApproverRule)(policyID, route.params?.tagName)?.approver ?? '';
    const approver = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(tagApprover);
    const approverText = approver?.displayName ?? tagApprover;
    const hasDependentTags = (0, react_1.useMemo)(() => (0, PolicyUtils_1.hasDependentTags)(policy, policyTags), [policy, policyTags]);
    const currentPolicyTag = (0, react_1.useMemo)(() => {
        if (hasDependentTags) {
            return Object.values(policyTag.tags ?? {}).find((tag) => tag?.name === tagName && tag.rules?.parentTagsFilter === parentTagsFilter);
        }
        return policyTag.tags[tagName] ?? Object.values(policyTag.tags ?? {}).find((tag) => tag.previousTagName === tagName);
    }, [policyTag, tagName, parentTagsFilter, hasDependentTags]);
    const shouldPreventDisableOrDelete = (0, OptionsListUtils_1.isDisablingOrDeletingLastEnabledTag)(policyTag, [currentPolicyTag]);
    (0, react_1.useEffect)(() => {
        if (currentPolicyTag?.name === tagName || !currentPolicyTag) {
            return;
        }
        navigation.setParams({ tagName: currentPolicyTag?.name });
    }, [tagName, currentPolicyTag, navigation]);
    if (!currentPolicyTag) {
        return <NotFoundPage_1.default />;
    }
    const deleteTagAndHideModal = () => {
        (0, Tag_1.deletePolicyTags)(policyID, [currentPolicyTag.name]);
        setIsDeleteTagModalOpen(false);
        Navigation_1.default.goBack(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_TAGS_ROOT.getRoute(policyID, backTo) : undefined);
    };
    const updateWorkspaceTagEnabled = (value) => {
        if (shouldPreventDisableOrDelete) {
            setIsCannotDeleteOrDisableLastTagModalVisible(true);
            return;
        }
        (0, Tag_1.setWorkspaceTagEnabled)(policyID, { [currentPolicyTag.name]: { name: currentPolicyTag.name, enabled: value } }, policyTag.orderWeight);
    };
    const navigateToEditTag = () => {
        Navigation_1.default.navigate(isQuickSettingsFlow
            ? ROUTES_1.default.SETTINGS_TAG_EDIT.getRoute(policyID, orderWeight, currentPolicyTag.name, backTo)
            : ROUTES_1.default.WORKSPACE_TAG_EDIT.getRoute(policyID, orderWeight, currentPolicyTag.name));
    };
    const navigateToEditGlCode = () => {
        if (!(0, PolicyUtils_1.isControlPolicy)(policy)) {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policyID, CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.glCodes.alias, isQuickSettingsFlow
                ? ROUTES_1.default.SETTINGS_TAG_GL_CODE.getRoute(policyID, orderWeight, tagName, backTo)
                : ROUTES_1.default.WORKSPACE_TAG_GL_CODE.getRoute(policyID, orderWeight, tagName)));
            return;
        }
        Navigation_1.default.navigate(isQuickSettingsFlow
            ? ROUTES_1.default.SETTINGS_TAG_GL_CODE.getRoute(policyID, orderWeight, currentPolicyTag.name, backTo)
            : ROUTES_1.default.WORKSPACE_TAG_GL_CODE.getRoute(policyID, orderWeight, currentPolicyTag.name));
    };
    const navigateToEditTagApprover = () => {
        Navigation_1.default.navigate(isQuickSettingsFlow
            ? ROUTES_1.default.SETTINGS_TAG_APPROVER.getRoute(policyID, orderWeight, currentPolicyTag.name, backTo)
            : ROUTES_1.default.WORKSPACE_TAG_APPROVER.getRoute(policyID, orderWeight, currentPolicyTag.name));
    };
    const isThereAnyAccountingConnection = Object.keys(policy?.connections ?? {}).length !== 0;
    const isMultiLevelTags = (0, PolicyUtils_1.isMultiLevelTags)(policyTags);
    const shouldShowDeleteMenuItem = !isThereAnyAccountingConnection && !isMultiLevelTags;
    const workflowApprovalsUnavailable = (0, PolicyUtils_1.getWorkflowApprovalsUnavailable)(policy);
    const approverDisabled = !policy?.areWorkflowsEnabled || workflowApprovalsUnavailable;
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_TAGS_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={TagSettingsPage.displayName}>
                <HeaderWithBackButton_1.default title={(0, PolicyUtils_1.getCleanedTagName)(tagName)} shouldSetModalVisibility={false} onBackButtonPress={() => Navigation_1.default.goBack(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_TAGS_ROOT.getRoute(policyID, backTo) : undefined)}/>
                <ConfirmModal_1.default title={translate('workspace.tags.deleteTag')} isVisible={isDeleteTagModalOpen} onConfirm={deleteTagAndHideModal} onCancel={() => setIsDeleteTagModalOpen(false)} shouldSetModalVisibility={false} prompt={translate('workspace.tags.deleteTagConfirmation')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
                <ConfirmModal_1.default isVisible={isCannotDeleteOrDisableLastTagModalVisible} onConfirm={() => setIsCannotDeleteOrDisableLastTagModalVisible(false)} onCancel={() => setIsCannotDeleteOrDisableLastTagModalVisible(false)} title={translate('workspace.tags.cannotDeleteOrDisableAllTags.title')} prompt={translate('workspace.tags.cannotDeleteOrDisableAllTags.description')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>

                <react_native_1.View style={styles.flexGrow1}>
                    {!hasDependentTags && (<OfflineWithFeedback_1.default errors={(0, ErrorUtils_1.getLatestErrorMessageField)(currentPolicyTag)} pendingAction={currentPolicyTag.pendingFields?.enabled} errorRowStyles={styles.mh5} onClose={() => (0, Tag_1.clearPolicyTagErrors)(policyID, tagName, orderWeight)}>
                            <react_native_1.View style={[styles.mt2, styles.mh5]}>
                                <react_native_1.View style={[styles.flexRow, styles.mb5, styles.mr2, styles.alignItemsCenter, styles.justifyContentBetween]}>
                                    <Text_1.default>{translate('workspace.tags.enableTag')}</Text_1.default>
                                    <Switch_1.default isOn={currentPolicyTag.enabled} accessibilityLabel={translate('workspace.tags.enableTag')} onToggle={updateWorkspaceTagEnabled} showLockIcon={shouldPreventDisableOrDelete}/>
                                </react_native_1.View>
                            </react_native_1.View>
                        </OfflineWithFeedback_1.default>)}
                    <OfflineWithFeedback_1.default pendingAction={currentPolicyTag.pendingFields?.name}>
                        <MenuItemWithTopDescription_1.default title={(0, PolicyUtils_1.getCleanedTagName)(currentPolicyTag.name)} description={translate(`common.name`)} onPress={navigateToEditTag} interactive={!hasDependentTags} shouldShowRightIcon={!hasDependentTags}/>
                    </OfflineWithFeedback_1.default>
                    {(!hasDependentTags || !!currentPolicyTag?.['GL Code']) && (<OfflineWithFeedback_1.default pendingAction={currentPolicyTag.pendingFields?.['GL Code']}>
                            <MenuItemWithTopDescription_1.default description={translate(`workspace.tags.glCode`)} title={currentPolicyTag?.['GL Code']} onPress={navigateToEditGlCode} iconRight={hasAccountingConnections ? Expensicons.Lock : undefined} interactive={!hasAccountingConnections && !hasDependentTags} shouldShowRightIcon={!hasDependentTags}/>
                        </OfflineWithFeedback_1.default>)}

                    {!!policy?.areRulesEnabled && !isMultiLevelTags && (<>
                            <react_native_1.View style={[styles.mh5, styles.mv3, styles.pt3, styles.borderTop]}>
                                <Text_1.default style={[styles.textNormal, styles.textStrong, styles.mv3]}>{translate('workspace.tags.tagRules')}</Text_1.default>
                            </react_native_1.View>
                            <MenuItemWithTopDescription_1.default title={approverText} description={translate(`workspace.tags.approverDescription`)} onPress={navigateToEditTagApprover} shouldShowRightIcon disabled={approverDisabled} helperText={approverDisabled
                ? translate('workspace.rules.categoryRules.enableWorkflows', {
                    moreFeaturesLink: `${environmentURL}/${ROUTES_1.default.WORKSPACE_MORE_FEATURES.getRoute(policyID)}`,
                })
                : undefined} shouldParseHelperText/>
                        </>)}

                    {shouldShowDeleteMenuItem && (<MenuItem_1.default icon={Expensicons.Trashcan} title={translate('common.delete')} onPress={() => {
                if (shouldPreventDisableOrDelete) {
                    setIsCannotDeleteOrDisableLastTagModalVisible(true);
                    return;
                }
                setIsDeleteTagModalOpen(true);
            }}/>)}
                </react_native_1.View>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
TagSettingsPage.displayName = 'TagSettingsPage';
exports.default = TagSettingsPage;
