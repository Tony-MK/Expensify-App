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
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Tag_1 = require("@userActions/Policy/Tag");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const WorkspaceTagForm_1 = require("@src/types/form/WorkspaceTagForm");
function WorkspaceCreateTagPage({ route }) {
    const policyID = route.params.policyID;
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`, { canBeMissing: true });
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const backTo = route.params.backTo;
    const isQuickSettingsFlow = route.name === SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_CREATE;
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        const tagName = (0, PolicyUtils_1.escapeTagName)(values.tagName.trim());
        const { tags } = (0, PolicyUtils_1.getTagList)(policyTags, 0);
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(tagName)) {
            errors.tagName = translate('workspace.tags.tagRequiredError');
        }
        else if (tagName === '0') {
            errors.tagName = translate('workspace.tags.invalidTagNameError');
        }
        else if (tags?.[tagName]) {
            errors.tagName = translate('workspace.tags.existingTagError');
        }
        else if ([...tagName].length > CONST_1.default.API_TRANSACTION_TAG_MAX_LENGTH) {
            // Uses the spread syntax to count the number of Unicode code points instead of the number of UTF-16 code units.
            (0, ErrorUtils_1.addErrorMessage)(errors, 'tagName', translate('common.error.characterLimitExceedCounter', { length: [...tagName].length, limit: CONST_1.default.API_TRANSACTION_TAG_MAX_LENGTH }));
        }
        return errors;
    }, [policyTags, translate]);
    const createTag = (0, react_1.useCallback)((values) => {
        (0, Tag_1.createPolicyTag)(policyID, values.tagName.trim());
        react_native_1.Keyboard.dismiss();
        Navigation_1.default.goBack(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_TAGS_ROOT.getRoute(policyID, backTo) : undefined);
    }, [policyID, isQuickSettingsFlow, backTo]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_TAGS_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={WorkspaceCreateTagPage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.tags.addTag')} onBackButtonPress={() => Navigation_1.default.goBack(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_TAGS_ROOT.getRoute(policyID, backTo) : undefined)}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_TAG_FORM} onSubmit={createTag} submitButtonText={translate('common.save')} validate={validate} style={[styles.mh5, styles.flex1]} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} label={translate('common.name')} accessibilityLabel={translate('common.name')} inputID={WorkspaceTagForm_1.default.TAG_NAME} role={CONST_1.default.ROLE.PRESENTATION} ref={inputCallbackRef}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceCreateTagPage.displayName = 'WorkspaceCreateTagPage';
exports.default = WorkspaceCreateTagPage;
