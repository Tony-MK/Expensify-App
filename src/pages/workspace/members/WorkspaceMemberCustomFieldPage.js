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
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Policy_1 = require("@libs/actions/Policy/Policy");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceMemberCustomFieldPage({ policy, route, personalDetails }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const params = route.params;
    const customFieldType = params.customFieldType;
    const accountID = Number(params.accountID);
    const memberLogin = personalDetails?.[accountID]?.login ?? '';
    const member = policy?.employeeList?.[memberLogin];
    const customFieldKey = CONST_1.default.CUSTOM_FIELD_KEYS[customFieldType];
    const [customField, setCustomField] = (0, react_1.useState)(member?.[customFieldKey ?? ''] ?? '');
    const customFieldText = translate(`workspace.common.${customFieldType}`);
    const policyID = params.policyID;
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_MEMBER_DETAILS.getRoute(policyID, accountID));
    }, [accountID, policyID]);
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]}>
            <ScreenWrapper_1.default testID="WorkspaceMemberCustomFieldPage" shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={customFieldText} onBackButtonPress={goBack}/>
                <react_native_1.View style={[styles.ph5, styles.pb5]}>
                    <Text_1.default>{translate('workspace.common.customFieldHint')}</Text_1.default>
                </react_native_1.View>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_MEMBER_CUSTOM_FIELD_FORM} style={[styles.flexGrow1, styles.ph5]} enabledWhenOffline submitButtonText={translate('common.save')} onSubmit={() => {
            (0, Policy_1.updateMemberCustomField)(params.policyID, memberLogin, customFieldType, customField.trim());
            goBack();
        }}>
                    <InputWrapper_1.default ref={inputCallbackRef} InputComponent={TextInput_1.default} label={customFieldText} accessibilityLabel={customFieldText} role={CONST_1.default.ROLE.PRESENTATION} inputID="customField" value={customField} onChangeText={setCustomField}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceMemberCustomFieldPage.displayName = 'WorkspaceMemberCustomFieldPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceMemberCustomFieldPage);
