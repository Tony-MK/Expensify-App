"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Policy_1 = require("@libs/actions/Policy/Policy");
const Tag_1 = require("@libs/actions/Policy/Tag");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
/**
 * The pending state might be set by either setPolicyBillableMode or disableWorkspaceBillableExpenses.
 * setPolicyBillableMode changes disabledFields and defaultBillable and is called when disabledFields.defaultBillable is set.
 * Otherwise, disableWorkspaceBillableExpenses is used and it changes only disabledFields
 * */
function billableExpensesPending(policy) {
    if (policy?.disabledFields?.defaultBillable) {
        return policy?.pendingFields?.disabledFields ?? policy?.pendingFields?.defaultBillable;
    }
    return policy?.pendingFields?.disabledFields;
}
function toggleBillableExpenses(policy) {
    if (policy?.disabledFields?.defaultBillable) {
        (0, Policy_1.setPolicyBillableMode)(policy.id, false);
    }
    else if (policy) {
        (0, Policy_1.disableWorkspaceBillableExpenses)(policy.id);
    }
}
function WorkspaceTagsSettingsPage({ route }) {
    const policyID = route.params.policyID;
    const backTo = route.params.backTo;
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`, { canBeMissing: true });
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [policyTagLists, isMultiLevelTags] = (0, react_1.useMemo)(() => [(0, PolicyUtils_1.getTagLists)(policyTags), (0, PolicyUtils_1.isMultiLevelTags)(policyTags)], [policyTags]);
    const isLoading = !(0, PolicyUtils_1.getTagLists)(policyTags)?.at(0) || Object.keys(policyTags ?? {}).at(0) === 'undefined';
    const { isOffline } = (0, useNetwork_1.default)();
    const hasEnabledOptions = (0, OptionsListUtils_1.hasEnabledOptions)(Object.values(policyTags ?? {}).flatMap(({ tags }) => Object.values(tags)));
    const updateWorkspaceRequiresTag = (0, react_1.useCallback)((value) => {
        (0, Tag_1.setPolicyRequiresTag)(policyID, value);
    }, [policyID]);
    const isQuickSettingsFlow = route.name === SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_SETTINGS;
    const getTagsSettings = (policy) => (<react_native_1.View style={styles.flexGrow1}>
            {!isMultiLevelTags && (<OfflineWithFeedback_1.default errors={policyTags?.[policyTagLists.at(0)?.name ?? '']?.errors} onClose={() => (0, Tag_1.clearPolicyTagListErrors)(policyID, policyTagLists.at(0)?.orderWeight ?? 0)} pendingAction={policyTags?.[policyTagLists.at(0)?.name ?? '']?.pendingAction} errorRowStyles={styles.mh5}>
                    <MenuItemWithTopDescription_1.default title={policyTagLists.at(0)?.name ?? ''} description={translate(`workspace.tags.customTagName`)} onPress={() => {
                Navigation_1.default.navigate(isQuickSettingsFlow
                    ? ROUTES_1.default.SETTINGS_TAGS_EDIT.getRoute(policyID, policyTagLists.at(0)?.orderWeight ?? 0, backTo)
                    : ROUTES_1.default.WORKSPACE_EDIT_TAGS.getRoute(policyID, policyTagLists.at(0)?.orderWeight ?? 0));
            }} shouldShowRightIcon/>
                </OfflineWithFeedback_1.default>)}
            <OfflineWithFeedback_1.default errors={policy?.errorFields?.requiresTag} pendingAction={policy?.pendingFields?.requiresTag} errorRowStyles={styles.mh5}>
                <react_native_1.View style={[styles.flexRow, styles.mh5, styles.mv4, styles.alignItemsCenter, styles.justifyContentBetween]}>
                    <Text_1.default style={[styles.textNormal, styles.flex1, styles.mr2]}>{translate('workspace.tags.requiresTag')}</Text_1.default>
                    <Switch_1.default isOn={policy?.requiresTag ?? false} accessibilityLabel={translate('workspace.tags.requiresTag')} onToggle={updateWorkspaceRequiresTag} disabled={!policy?.areTagsEnabled || !hasEnabledOptions}/>
                </react_native_1.View>
            </OfflineWithFeedback_1.default>
            <OfflineWithFeedback_1.default pendingAction={billableExpensesPending(policy)}>
                <react_native_1.View style={[styles.flexRow, styles.mh5, styles.mv4, styles.alignItemsCenter, styles.justifyContentBetween]}>
                    <Text_1.default style={[styles.textNormal, styles.flex1, styles.mr2]}>{translate('workspace.tags.trackBillable')}</Text_1.default>
                    <Switch_1.default isOn={!(policy?.disabledFields?.defaultBillable ?? false)} accessibilityLabel={translate('workspace.tags.trackBillable')} onToggle={() => toggleBillableExpenses(policy)} disabled={!policy?.areTagsEnabled}/>
                </react_native_1.View>
            </OfflineWithFeedback_1.default>
        </react_native_1.View>);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_TAGS_ENABLED}>
            {({ policy }) => (<ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={WorkspaceTagsSettingsPage.displayName}>
                    <HeaderWithBackButton_1.default title={translate('common.settings')} onBackButtonPress={() => Navigation_1.default.goBack(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_TAGS_ROOT.getRoute(policyID, backTo) : undefined)}/>
                    {isOffline && isLoading ? <FullPageOfflineBlockingView_1.default addBottomSafeAreaPadding>{getTagsSettings(policy)}</FullPageOfflineBlockingView_1.default> : getTagsSettings(policy)}
                </ScreenWrapper_1.default>)}
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceTagsSettingsPage.displayName = 'WorkspaceTagsSettingsPage';
exports.default = WorkspaceTagsSettingsPage;
