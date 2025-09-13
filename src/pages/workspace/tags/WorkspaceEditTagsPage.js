"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
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
const PolicyUtils_1 = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Tag_1 = require("@userActions/Policy/Tag");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const PolicyTagNameForm_1 = require("@src/types/form/PolicyTagNameForm");
function WorkspaceEditTagsPage({ route }) {
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${route?.params?.policyID}`, { canBeMissing: true });
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const tagListName = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getTagListName)(policyTags, route.params.orderWeight), [policyTags, route.params.orderWeight]);
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const backTo = route.params.backTo;
    const isQuickSettingsFlow = route.name === SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_EDIT;
    const validateTagName = (0, react_1.useCallback)((values) => {
        const errors = {};
        if (!values[PolicyTagNameForm_1.default.POLICY_TAGS_NAME] && values[PolicyTagNameForm_1.default.POLICY_TAGS_NAME].trim() === '') {
            errors[PolicyTagNameForm_1.default.POLICY_TAGS_NAME] = translate('common.error.fieldRequired');
        }
        if (values[PolicyTagNameForm_1.default.POLICY_TAGS_NAME]?.trim() === '0') {
            errors[PolicyTagNameForm_1.default.POLICY_TAGS_NAME] = translate('workspace.tags.invalidTagNameError');
        }
        if (policyTags && Object.values(policyTags).find((tag) => tag.orderWeight !== route.params.orderWeight && tag.name === values[PolicyTagNameForm_1.default.POLICY_TAGS_NAME])) {
            errors[PolicyTagNameForm_1.default.POLICY_TAGS_NAME] = translate('workspace.tags.existingTagError');
        }
        return errors;
    }, [translate, policyTags, route.params.orderWeight]);
    const goBackToTagsSettings = (0, react_1.useCallback)(() => {
        if (isQuickSettingsFlow) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        Navigation_1.default.goBack(route.params.orderWeight
            ? ROUTES_1.default.WORKSPACE_TAG_LIST_VIEW.getRoute(route?.params?.policyID, route.params.orderWeight)
            : ROUTES_1.default.WORKSPACE_TAGS_SETTINGS.getRoute(route?.params?.policyID));
    }, [isQuickSettingsFlow, route.params.orderWeight, route.params?.policyID, backTo]);
    const updateTagListName = (0, react_1.useCallback)((values) => {
        if (values[PolicyTagNameForm_1.default.POLICY_TAGS_NAME] !== tagListName) {
            (0, Tag_1.renamePolicyTagList)(route.params.policyID, { oldName: tagListName, newName: values[PolicyTagNameForm_1.default.POLICY_TAGS_NAME] }, policyTags, route.params.orderWeight);
        }
        goBackToTagsSettings();
    }, [tagListName, goBackToTagsSettings, route.params.policyID, route.params.orderWeight, policyTags]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={route.params.policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_TAGS_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={WorkspaceEditTagsPage.displayName}>
                <HeaderWithBackButton_1.default title={translate(`workspace.tags.customTagName`)} onBackButtonPress={goBackToTagsSettings}/>
                <FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.POLICY_TAG_NAME_FORM} onSubmit={updateTagListName} validate={validateTagName} submitButtonText={translate('common.save')} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <react_native_1.View style={styles.mb4}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={PolicyTagNameForm_1.default.POLICY_TAGS_NAME} label={translate(`workspace.tags.customTagName`)} accessibilityLabel={translate(`workspace.tags.customTagName`)} defaultValue={(0, PolicyUtils_1.getCleanedTagName)(tagListName)} role={CONST_1.default.ROLE.PRESENTATION} ref={inputCallbackRef}/>
                    </react_native_1.View>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceEditTagsPage.displayName = 'WorkspaceEditTagsPage';
exports.default = WorkspaceEditTagsPage;
