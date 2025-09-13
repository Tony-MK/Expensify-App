"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Category_1 = require("@libs/actions/Policy/Category");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const CategoryForm_1 = require("./CategoryForm");
function CreateCategoryPage({ route }) {
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${route.params.policyID}`, { canBeMissing: true });
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const backTo = route.params?.backTo;
    const isQuickSettingsFlow = route.name === SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORY_CREATE;
    const createCategory = (0, react_1.useCallback)((values) => {
        (0, Category_1.createPolicyCategory)(route.params.policyID, values.categoryName.trim());
        Navigation_1.default.goBack(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_CATEGORIES_ROOT.getRoute(route.params.policyID, backTo) : undefined);
    }, [isQuickSettingsFlow, route.params.policyID, backTo]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={route.params.policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={CreateCategoryPage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.categories.addCategory')} onBackButtonPress={() => Navigation_1.default.goBack(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_CATEGORIES_ROOT.getRoute(route.params.policyID, backTo) : undefined)}/>
                <CategoryForm_1.default onSubmit={createCategory} policyCategories={policyCategories}/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
CreateCategoryPage.displayName = 'CreateCategoryPage';
exports.default = CreateCategoryPage;
