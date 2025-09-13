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
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Policy_1 = require("@libs/actions/Policy/Policy");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Parser_1 = require("@libs/Parser");
const updateMultilineInputRange_1 = require("@libs/updateMultilineInputRange");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const AccessOrNotFoundWrapper_1 = require("./AccessOrNotFoundWrapper");
const withPolicy_1 = require("./withPolicy");
function WorkspaceOverviewDescriptionPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const isInputInitializedRef = (0, react_1.useRef)(false);
    const [description, setDescription] = (0, react_1.useState)(() => Parser_1.default.htmlToMarkdown(policy?.description ?? translate('workspace.common.defaultDescription')));
    /**
     * @param {Object} values - form input values passed by the Form component
     * @returns {Boolean}
     */
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        if (values.description.length > CONST_1.default.DESCRIPTION_LIMIT) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'description', translate('common.error.characterLimitExceedCounter', { length: values.description.length, limit: CONST_1.default.DESCRIPTION_LIMIT }));
        }
        return errors;
    }, [translate]);
    const submit = (0, react_1.useCallback)((values) => {
        if (!policy || policy.isPolicyUpdating) {
            return;
        }
        (0, Policy_1.updateWorkspaceDescription)(policy.id, values.description.trim(), policy.description);
        react_native_1.Keyboard.dismiss();
        Navigation_1.default.setNavigationActionToMicrotaskQueue(() => Navigation_1.default.goBack());
    }, [policy]);
    return (<AccessOrNotFoundWrapper_1.default policyID={policy?.id} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]}>
            <ScreenWrapper_1.default shouldEnableMaxHeight enableEdgeToEdgeBottomSafeAreaPadding testID={WorkspaceOverviewDescriptionPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.editor.descriptionInputLabel')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
                <react_native_1.View style={[styles.ph5, styles.pb5]}>
                    <Text_1.default>{translate('workspace.common.descriptionHint')}</Text_1.default>
                </react_native_1.View>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_DESCRIPTION_FORM} submitButtonText={translate('workspace.editor.save')} style={[styles.flexGrow1, styles.ph5]} scrollContextEnabled onSubmit={submit} validate={validate} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <react_native_1.View style={styles.mb4}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} role={CONST_1.default.ROLE.PRESENTATION} inputID="description" label={translate('workspace.editor.descriptionInputLabel')} accessibilityLabel={translate('workspace.editor.descriptionInputLabel')} maxAutoGrowHeight={variables_1.default.textInputAutoGrowMaxHeight} value={description} spellCheck={false} autoFocus onChangeText={setDescription} autoGrowHeight type="markdown" ref={(el) => {
            if (!isInputInitializedRef.current) {
                (0, updateMultilineInputRange_1.default)(el);
            }
            isInputInitializedRef.current = true;
        }}/>
                    </react_native_1.View>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceOverviewDescriptionPage.displayName = 'WorkspaceOverviewDescriptionPage';
exports.default = (0, withPolicy_1.default)(WorkspaceOverviewDescriptionPage);
