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
const ValidationUtils_1 = require("@libs/ValidationUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Tag_1 = require("@userActions/Policy/Tag");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const WorkspaceTagForm_1 = require("@src/types/form/WorkspaceTagForm");
function EditTagPage({ route }) {
    const policyID = route.params.policyID;
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`, { canBeMissing: true });
    const backTo = route.params.backTo;
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const currentTagName = (0, PolicyUtils_1.getCleanedTagName)(route.params.tagName);
    const isQuickSettingsFlow = route.name === SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_EDIT;
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        const tagName = values.tagName.trim();
        const escapedTagName = (0, PolicyUtils_1.escapeTagName)(values.tagName.trim());
        const { tags } = (0, PolicyUtils_1.getTagListByOrderWeight)(policyTags, route.params.orderWeight);
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(tagName)) {
            errors.tagName = translate('workspace.tags.tagRequiredError');
        }
        else if (escapedTagName === '0') {
            errors.tagName = translate('workspace.tags.invalidTagNameError');
        }
        else if (tags?.[escapedTagName] && currentTagName !== tagName) {
            errors.tagName = translate('workspace.tags.existingTagError');
        }
        else if ([...tagName].length > CONST_1.default.API_TRANSACTION_TAG_MAX_LENGTH) {
            // Uses the spread syntax to count the number of Unicode code points instead of the number of UTF-16 code units.
            errors.tagName = translate('common.error.characterLimitExceedCounter', { length: [...tagName].length, limit: CONST_1.default.API_TRANSACTION_TAG_MAX_LENGTH });
        }
        return errors;
    }, [policyTags, route.params.orderWeight, currentTagName, translate]);
    const editTag = (0, react_1.useCallback)((values) => {
        const tagName = values.tagName.trim();
        // Do not call the API if the edited tag name is the same as the current tag name
        if (currentTagName !== tagName) {
            (0, Tag_1.renamePolicyTag)(policyID, { oldName: route.params.tagName, newName: values.tagName.trim() }, route.params.orderWeight);
        }
        react_native_1.Keyboard.dismiss();
        Navigation_1.default.goBack(isQuickSettingsFlow
            ? ROUTES_1.default.SETTINGS_TAG_SETTINGS.getRoute(policyID, route.params.orderWeight, route.params.tagName, backTo)
            : ROUTES_1.default.WORKSPACE_TAG_SETTINGS.getRoute(policyID, route.params.orderWeight, route.params.tagName));
    }, [currentTagName, policyID, route.params.tagName, route.params.orderWeight, isQuickSettingsFlow, backTo]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_TAGS_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={EditTagPage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.tags.editTag')} onBackButtonPress={() => Navigation_1.default.goBack(isQuickSettingsFlow
            ? ROUTES_1.default.SETTINGS_TAG_SETTINGS.getRoute(route?.params?.policyID, route.params.orderWeight, route.params.tagName, backTo)
            : ROUTES_1.default.WORKSPACE_TAG_SETTINGS.getRoute(route?.params?.policyID, route.params.orderWeight, route.params.tagName))}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_TAG_FORM} onSubmit={editTag} submitButtonText={translate('common.save')} validate={validate} style={[styles.mh5, styles.flex1]} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} defaultValue={currentTagName} label={translate('common.name')} accessibilityLabel={translate('common.name')} inputID={WorkspaceTagForm_1.default.TAG_NAME} role={CONST_1.default.ROLE.PRESENTATION} ref={inputCallbackRef}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
EditTagPage.displayName = 'EditTagPage';
exports.default = EditTagPage;
