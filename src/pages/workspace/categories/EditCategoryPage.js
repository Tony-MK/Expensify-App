"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Category_1 = require("@userActions/Policy/Category");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const CategoryForm_1 = require("./CategoryForm");
function EditCategoryPage({ route }) {
    const policyID = route.params.policyID;
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`, { canBeMissing: true });
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const currentCategoryName = route.params.categoryName;
    const backTo = route.params?.backTo;
    const isQuickSettingsFlow = route.name === SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORY_EDIT;
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        const newCategoryName = values.categoryName.trim();
        if (!newCategoryName) {
            errors.categoryName = translate('workspace.categories.categoryRequiredError');
        }
        else if (policyCategories?.[newCategoryName] && currentCategoryName !== newCategoryName) {
            errors.categoryName = translate('workspace.categories.existingCategoryError');
        }
        else if ([...newCategoryName].length > CONST_1.default.API_TRANSACTION_CATEGORY_MAX_LENGTH) {
            // Uses the spread syntax to count the number of Unicode code points instead of the number of UTF-16 code units.
            errors.categoryName = translate('common.error.characterLimitExceedCounter', { length: [...newCategoryName].length, limit: CONST_1.default.API_TRANSACTION_CATEGORY_MAX_LENGTH });
        }
        return errors;
    }, [policyCategories, currentCategoryName, translate]);
    const editCategory = (0, react_1.useCallback)((values) => {
        const newCategoryName = values.categoryName.trim();
        // Do not call the API if the edited category name is the same as the current category name
        if (currentCategoryName !== newCategoryName) {
            (0, Category_1.renamePolicyCategory)(policyID, { oldName: currentCategoryName, newName: values.categoryName });
        }
        // Ensure Onyx.update is executed before navigation to prevent UI blinking issues, affecting the category name and rate.
        Navigation_1.default.setNavigationActionToMicrotaskQueue(() => {
            Navigation_1.default.goBack(isQuickSettingsFlow
                ? ROUTES_1.default.SETTINGS_CATEGORY_SETTINGS.getRoute(policyID, currentCategoryName, backTo)
                : ROUTES_1.default.WORKSPACE_CATEGORY_SETTINGS.getRoute(policyID, currentCategoryName), { compareParams: false });
        });
    }, [isQuickSettingsFlow, currentCategoryName, policyID, backTo]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={route.params.policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={EditCategoryPage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.categories.editCategory')} onBackButtonPress={() => Navigation_1.default.goBack(isQuickSettingsFlow
            ? ROUTES_1.default.SETTINGS_CATEGORY_SETTINGS.getRoute(route.params.policyID, route.params.categoryName, backTo)
            : ROUTES_1.default.WORKSPACE_CATEGORY_SETTINGS.getRoute(route.params.policyID, route.params.categoryName))}/>
                <CategoryForm_1.default onSubmit={editCategory} validateEdit={validate} categoryName={currentCategoryName} policyCategories={policyCategories}/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
EditCategoryPage.displayName = 'EditCategoryPage';
exports.default = EditCategoryPage;
