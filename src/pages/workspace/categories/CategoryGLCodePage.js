"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
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
const WorkspaceCategoryForm_1 = require("@src/types/form/WorkspaceCategoryForm");
function CategoryGLCodePage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = route.params.policyID;
    const backTo = route.params.backTo;
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`, { canBeMissing: true });
    const categoryName = route.params.categoryName;
    const glCode = policyCategories?.[categoryName]?.['GL Code'];
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const isQuickSettingsFlow = route.name === SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORY_GL_CODE;
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        const value = values[WorkspaceCategoryForm_1.default.GL_CODE];
        if (value.length > CONST_1.default.MAX_LENGTH_256) {
            errors[WorkspaceCategoryForm_1.default.GL_CODE] = translate('common.error.characterLimitExceedCounter', {
                length: value.length,
                limit: CONST_1.default.MAX_LENGTH_256,
            });
        }
        return errors;
    }, [translate]);
    const editGLCode = (0, react_1.useCallback)((values) => {
        const newGLCode = values.glCode.trim();
        if (newGLCode !== glCode) {
            (0, Category_1.setPolicyCategoryGLCode)(policyID, categoryName, newGLCode);
        }
        Navigation_1.default.goBack(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_CATEGORY_SETTINGS.getRoute(policyID, categoryName, backTo) : ROUTES_1.default.WORKSPACE_CATEGORY_SETTINGS.getRoute(policyID, categoryName));
    }, [categoryName, glCode, policyID, isQuickSettingsFlow, backTo]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={route.params.policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={CategoryGLCodePage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.categories.glCode')} onBackButtonPress={() => Navigation_1.default.goBack(isQuickSettingsFlow
            ? ROUTES_1.default.SETTINGS_CATEGORY_SETTINGS.getRoute(route.params.policyID, route.params.categoryName, backTo)
            : ROUTES_1.default.WORKSPACE_CATEGORY_SETTINGS.getRoute(route.params.policyID, route.params.categoryName))}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_CATEGORY_FORM} validate={validate} onSubmit={editGLCode} submitButtonText={translate('common.save')} style={[styles.mh5, styles.flex1]} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <InputWrapper_1.default ref={inputCallbackRef} InputComponent={TextInput_1.default} defaultValue={glCode} label={translate('workspace.categories.glCode')} accessibilityLabel={translate('workspace.categories.glCode')} inputID={WorkspaceCategoryForm_1.default.GL_CODE} role={CONST_1.default.ROLE.PRESENTATION}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
CategoryGLCodePage.displayName = 'CategoryGLCodePage';
exports.default = CategoryGLCodePage;
