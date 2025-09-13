"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const CategorySelector_1 = require("@components/CategorySelector");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const PerDiem_1 = require("@libs/actions/Policy/PerDiem");
const ErrorUtils = require("@libs/ErrorUtils");
const OptionsListUtils = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Category = require("@userActions/Policy/Category");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function WorkspacePerDiemSettingsPage({ route }) {
    const policyID = route.params.policyID;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`);
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`);
    const styles = (0, useThemeStyles_1.default)();
    const [isCategoryPickerVisible, setIsCategoryPickerVisible] = (0, react_1.useState)(false);
    const { translate } = (0, useLocalize_1.default)();
    const customUnit = (0, PolicyUtils_1.getPerDiemCustomUnit)(policy);
    const customUnitID = customUnit?.customUnitID ?? '';
    const defaultCategory = customUnit?.defaultCategory;
    const errorFields = customUnit?.errorFields;
    const FullPageBlockingView = !customUnit ? FullPageOfflineBlockingView_1.default : react_native_1.View;
    const setNewCategory = (category) => {
        if (!category.searchText || !customUnit || defaultCategory === category.searchText) {
            return;
        }
        Category.setPolicyCustomUnitDefaultCategory(policyID, customUnitID, customUnit.defaultCategory, category.searchText);
    };
    const clearErrorFields = (fieldName) => {
        (0, PerDiem_1.clearPolicyPerDiemRatesErrorFields)(policyID, customUnitID, { ...errorFields, [fieldName]: null });
    };
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_PER_DIEM_RATES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={WorkspacePerDiemSettingsPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.common.settings')}/>
                <FullPageBlockingView style={customUnit ? styles.flexGrow1 : []} addBottomSafeAreaPadding>
                    <ScrollView_1.default addBottomSafeAreaPadding contentContainerStyle={styles.flexGrow1} keyboardShouldPersistTaps="always">
                        {!!policy?.areCategoriesEnabled && OptionsListUtils.hasEnabledOptions(policyCategories ?? {}) && (<OfflineWithFeedback_1.default errors={ErrorUtils.getLatestErrorField(customUnit ?? {}, 'defaultCategory')} pendingAction={customUnit?.pendingFields?.defaultCategory} errorRowStyles={styles.mh5} onClose={() => clearErrorFields('defaultCategory')}>
                                <CategorySelector_1.default policyID={policyID} label={translate('workspace.common.defaultCategory')} defaultValue={defaultCategory} wrapperStyle={[styles.ph5, styles.mt3]} setNewCategory={setNewCategory} isPickerVisible={isCategoryPickerVisible} showPickerModal={() => setIsCategoryPickerVisible(true)} hidePickerModal={() => setIsCategoryPickerVisible(false)}/>
                            </OfflineWithFeedback_1.default>)}
                    </ScrollView_1.default>
                </FullPageBlockingView>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspacePerDiemSettingsPage.displayName = 'WorkspacePerDiemSettingsPage';
exports.default = WorkspacePerDiemSettingsPage;
