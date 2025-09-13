"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Policy_1 = require("@libs/actions/Policy/Policy");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WorkspaceSettingsForm_1 = require("@src/types/form/WorkspaceSettingsForm");
const AccessOrNotFoundWrapper_1 = require("./AccessOrNotFoundWrapper");
const withPolicy_1 = require("./withPolicy");
function WorkspaceNamePage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const submit = (0, react_1.useCallback)((values) => {
        if (!policy || policy.isPolicyUpdating) {
            return;
        }
        (0, Policy_1.updateGeneralSettings)(policy.id, values.name.trim(), policy.outputCurrency);
        react_native_1.Keyboard.dismiss();
        Navigation_1.default.setNavigationActionToMicrotaskQueue(() => Navigation_1.default.goBack());
    }, [policy]);
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        const name = values.name.trim();
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(name)) {
            errors.name = translate('workspace.editor.nameIsRequiredError');
        }
        else if ([...name].length > CONST_1.default.TITLE_CHARACTER_LIMIT) {
            // Uses the spread syntax to count the number of Unicode code points instead of the number of UTF-16
            // code units.
            (0, ErrorUtils_1.addErrorMessage)(errors, 'name', translate('common.error.characterLimitExceedCounter', { length: [...name].length, limit: CONST_1.default.TITLE_CHARACTER_LIMIT }));
        }
        return errors;
    }, [translate]);
    return (<AccessOrNotFoundWrapper_1.default policyID={policy?.id} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={WorkspaceNamePage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.common.workspaceName')} onBackButtonPress={() => Navigation_1.default.goBack()}/>

                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_SETTINGS_FORM} submitButtonText={translate('workspace.editor.save')} style={[styles.flexGrow1, styles.ph5]} scrollContextEnabled validate={validate} onSubmit={submit} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <react_native_1.View style={styles.mb4}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} role={CONST_1.default.ROLE.PRESENTATION} inputID={WorkspaceSettingsForm_1.default.NAME} label={translate('workspace.common.workspaceName')} accessibilityLabel={translate('workspace.common.workspaceName')} defaultValue={policy?.name} spellCheck={false} autoFocus/>
                    </react_native_1.View>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceNamePage.displayName = 'WorkspaceNamePage';
exports.default = (0, withPolicy_1.default)(WorkspaceNamePage);
