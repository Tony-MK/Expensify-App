"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
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
const WorkspaceCategoryDescriptionHintForm_1 = require("@src/types/form/WorkspaceCategoryDescriptionHintForm");
function CategoryDescriptionHintPage({ route: { params: { policyID, categoryName }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`);
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const commentHintDefaultValue = policyCategories?.[categoryName]?.commentHint;
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={CategoryDescriptionHintPage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.rules.categoryRules.descriptionHint')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_CATEGORY_SETTINGS.getRoute(policyID, categoryName))}/>
                <FormProvider_1.default style={[styles.flexGrow1, styles.mh5]} formID={ONYXKEYS_1.default.FORMS.WORKSPACE_CATEGORY_DESCRIPTION_HINT_FORM} onSubmit={({ commentHint }) => {
            (0, Category_1.setWorkspaceCategoryDescriptionHint)(policyID, categoryName, commentHint);
            Navigation_1.default.setNavigationActionToMicrotaskQueue(() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_CATEGORY_SETTINGS.getRoute(policyID, categoryName)));
        }} submitButtonText={translate('common.save')} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <react_native_1.View style={styles.mb4}>
                        <Text_1.default style={styles.pb5}>{translate('workspace.rules.categoryRules.descriptionHintDescription', { categoryName })}</Text_1.default>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={WorkspaceCategoryDescriptionHintForm_1.default.COMMENT_HINT} defaultValue={commentHintDefaultValue} label={translate('workspace.rules.categoryRules.descriptionHintLabel')} aria-label={translate('workspace.rules.categoryRules.descriptionHintLabel')} ref={inputCallbackRef}/>
                        <Text_1.default style={[styles.mutedTextLabel, styles.mt2]}>{translate('workspace.rules.categoryRules.descriptionHintSubtitle')}</Text_1.default>
                    </react_native_1.View>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
CategoryDescriptionHintPage.displayName = 'CategoryDescriptionHintPage';
exports.default = CategoryDescriptionHintPage;
