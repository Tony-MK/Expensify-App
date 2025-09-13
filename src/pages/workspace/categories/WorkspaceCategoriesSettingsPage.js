"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const CategorySelectorModal_1 = require("@components/CategorySelector/CategorySelectorModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const SelectionList_1 = require("@components/SelectionList");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Category_1 = require("@userActions/Policy/Category");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const SpendCategorySelectorListItem_1 = require("./SpendCategorySelectorListItem");
function WorkspaceCategoriesSettingsPage({ policy, route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const isConnectedToAccounting = Object.keys(policy?.connections ?? {}).length > 0;
    const policyID = route.params.policyID;
    const backTo = route.params.backTo;
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`, { canBeMissing: true });
    const [currentPolicy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true });
    const currentConnectionName = (0, PolicyUtils_1.getCurrentConnectionName)(policy);
    const [isSelectorModalVisible, setIsSelectorModalVisible] = (0, react_1.useState)(false);
    const [categoryID, setCategoryID] = (0, react_1.useState)();
    const [groupID, setGroupID] = (0, react_1.useState)();
    const [allTransactionViolations] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, { canBeMissing: true });
    const [policyTagLists] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`, { canBeMissing: true });
    const isQuickSettingsFlow = route.name === SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORIES_SETTINGS;
    const toggleSubtitle = isConnectedToAccounting && currentConnectionName ? translate('workspace.categories.needCategoryForExportToIntegration', { connectionName: currentConnectionName }) : undefined;
    const updateWorkspaceRequiresCategory = (value) => {
        (0, Category_1.setWorkspaceRequiresCategory)(policyID, value, policyTagLists, allTransactionViolations);
    };
    const { sections } = (0, react_1.useMemo)(() => {
        if (!(currentPolicy && currentPolicy.mccGroup)) {
            return { sections: [{ data: [] }] };
        }
        return {
            sections: [
                {
                    data: Object.entries(currentPolicy.mccGroup).map(([mccKey, mccGroup]) => ({
                        categoryID: mccGroup.category,
                        keyForList: mccKey,
                        groupID: mccKey,
                        tabIndex: -1,
                        pendingAction: mccGroup?.pendingAction,
                    })),
                },
            ],
        };
    }, [currentPolicy]);
    const hasEnabledCategories = (0, OptionsListUtils_1.hasEnabledOptions)(policyCategories ?? {});
    const isToggleDisabled = !policy?.areCategoriesEnabled || !hasEnabledCategories || isConnectedToAccounting;
    const setNewCategory = (selectedCategory) => {
        if (!selectedCategory.keyForList || !groupID) {
            return;
        }
        if (categoryID !== selectedCategory.keyForList) {
            (0, Policy_1.setWorkspaceDefaultSpendCategory)(policyID, groupID, selectedCategory.keyForList);
        }
        react_native_1.Keyboard.dismiss();
        react_native_1.InteractionManager.runAfterInteractions(() => {
            setIsSelectorModalVisible(false);
        });
    };
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={WorkspaceCategoriesSettingsPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('common.settings')} onBackButtonPress={() => Navigation_1.default.goBack(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_CATEGORIES_ROOT.getRoute(policyID, backTo) : undefined)}/>
                <ScrollView_1.default contentContainerStyle={[styles.flexGrow1]}>
                    <ToggleSettingsOptionRow_1.default title={translate('workspace.categories.requiresCategory')} subtitle={toggleSubtitle} switchAccessibilityLabel={translate('workspace.categories.requiresCategory')} isActive={policy?.requiresCategory ?? false} onToggle={updateWorkspaceRequiresCategory} pendingAction={policy?.pendingFields?.requiresCategory} disabled={isToggleDisabled} wrapperStyle={[styles.pv2, styles.mh5]} errors={policy?.errorFields?.requiresCategory ?? undefined} onCloseError={() => (0, Policy_1.clearPolicyErrorField)(policy?.id, 'requiresCategory')} shouldPlaceSubtitleBelowSwitch/>
                    <react_native_1.View style={[styles.sectionDividerLine, styles.mh5, styles.mv6]}/>
                    <react_native_1.View style={[styles.containerWithSpaceBetween]}>
                        {!!currentPolicy && (sections.at(0)?.data?.length ?? 0) > 0 && (<SelectionList_1.default addBottomSafeAreaPadding headerContent={<react_native_1.View style={[styles.mh5, styles.mt2, styles.mb1]}>
                                        <Text_1.default style={[styles.headerText]}>{translate('workspace.categories.defaultSpendCategories')}</Text_1.default>
                                        <Text_1.default style={[styles.mt1, styles.lh20]}>{translate('workspace.categories.spendCategoriesDescription')}</Text_1.default>
                                    </react_native_1.View>} sections={sections} ListItem={SpendCategorySelectorListItem_1.default} onSelectRow={(item) => {
                if (!item.groupID || !item.categoryID) {
                    return;
                }
                setIsSelectorModalVisible(true);
                setCategoryID(item.categoryID);
                setGroupID(item.groupID);
            }}/>)}
                    </react_native_1.View>
                </ScrollView_1.default>
                {!!categoryID && !!groupID && (<CategorySelectorModal_1.default policyID={policyID} isVisible={isSelectorModalVisible} currentCategory={categoryID} onClose={() => setIsSelectorModalVisible(false)} onCategorySelected={setNewCategory} label={groupID[0].toUpperCase() + groupID.slice(1)}/>)}
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceCategoriesSettingsPage.displayName = 'WorkspaceCategoriesSettingsPage';
exports.default = (0, withPolicyConnections_1.default)(WorkspaceCategoriesSettingsPage);
