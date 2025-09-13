"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const Onboarding_1 = require("@userActions/Onboarding");
const Policy_1 = require("@userActions/Policy/Policy");
const Welcome_1 = require("@userActions/Welcome");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const WorkspaceConfirmationForm_1 = require("@src/types/form/WorkspaceConfirmationForm");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const OnboardingCurrencyPicker_1 = require("./OnboardingCurrencyPicker");
function BaseOnboardingWorkspaceConfirmation({ shouldUseNativeStyles }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [onboardingPurposeSelected] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_PURPOSE_SELECTED, { canBeMissing: true });
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const [onboardingPolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_POLICY_ID, { canBeMissing: true });
    const [onboardingAdminsChatReportID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_ADMINS_CHAT_REPORT_ID, { canBeMissing: true });
    const { onboardingIsMediumOrLargerScreenWidth } = (0, useResponsiveLayout_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const [draftValues, draftValuesMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ONBOARDING_WORKSPACE_DETAILS_FORM_DRAFT, { canBeMissing: true });
    const [session, sessionMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const paidGroupPolicy = Object.values(allPolicies ?? {}).find((policy) => (0, PolicyUtils_1.isPaidGroupPolicy)(policy) && (0, PolicyUtils_1.isPolicyAdmin)(policy, session?.email));
    const defaultWorkspaceName = draftValues?.name ?? (0, Policy_1.generateDefaultWorkspaceName)(session?.email);
    const defaultCurrency = draftValues?.currency ?? currentUserPersonalDetails?.localCurrencyCode ?? CONST_1.default.CURRENCY.USD;
    (0, react_1.useEffect)(() => {
        (0, Welcome_1.setOnboardingErrorMessage)('');
    }, []);
    const handleSubmit = (0, react_1.useCallback)((values) => {
        if (!onboardingPurposeSelected) {
            return;
        }
        const shouldCreateWorkspace = !onboardingPolicyID && !paidGroupPolicy;
        const name = values.name.trim();
        const currency = values[WorkspaceConfirmationForm_1.default.CURRENCY];
        // We need `adminsChatReportID` for `completeOnboarding`, but at the same time, we don't want to call `createWorkspace` more than once.
        // If we have already created a workspace, we want to reuse the `onboardingAdminsChatReportID` and `onboardingPolicyID`.
        const { adminsChatReportID, policyID } = shouldCreateWorkspace
            ? (0, Policy_1.createWorkspace)({
                policyOwnerEmail: undefined,
                makeMeAdmin: true,
                policyName: name,
                policyID: (0, Policy_1.generatePolicyID)(),
                engagementChoice: CONST_1.default.ONBOARDING_CHOICES.TRACK_WORKSPACE,
                currency,
                file: undefined,
                shouldAddOnboardingTasks: false,
            })
            : { adminsChatReportID: onboardingAdminsChatReportID, policyID: onboardingPolicyID };
        if (shouldCreateWorkspace) {
            (0, Welcome_1.setOnboardingAdminsChatReportID)(adminsChatReportID);
            (0, Welcome_1.setOnboardingPolicyID)(policyID);
        }
        (0, Onboarding_1.clearWorkspaceDetailsDraft)();
        Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_WORKSPACE_INVITE.getRoute());
    }, [onboardingPurposeSelected, onboardingPolicyID, paidGroupPolicy, onboardingAdminsChatReportID]);
    const validate = (values) => {
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
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(values[WorkspaceConfirmationForm_1.default.CURRENCY])) {
            errors[WorkspaceConfirmationForm_1.default.CURRENCY] = translate('common.error.fieldRequired');
        }
        return errors;
    };
    if ((0, isLoadingOnyxValue_1.default)(draftValuesMetadata, sessionMetadata)) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<ScreenWrapper_1.default shouldEnableMaxHeight includeSafeAreaPaddingBottom testID={BaseOnboardingWorkspaceConfirmation.displayName} style={[styles.defaultModalContainer, shouldUseNativeStyles && styles.pt8]}>
            <HeaderWithBackButton_1.default progressBarPercentage={100}/>
            <FormProvider_1.default style={[styles.flexGrow1, onboardingIsMediumOrLargerScreenWidth && styles.mt5, onboardingIsMediumOrLargerScreenWidth ? styles.mh8 : styles.mh5]} formID={ONYXKEYS_1.default.FORMS.ONBOARDING_WORKSPACE_DETAILS_FORM} validate={validate} onSubmit={handleSubmit} submitButtonText={translate('common.continue')} enabledWhenOffline submitFlexEnabled shouldValidateOnBlur={false}>
                <react_native_1.View style={[onboardingIsMediumOrLargerScreenWidth ? styles.flexRow : styles.flexColumn, styles.mb3]}>
                    <Text_1.default style={styles.textHeadlineH1}>{translate('onboarding.confirmWorkspace.title')}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={styles.mb5}>
                    <Text_1.default style={[styles.textNormal, styles.colorMuted]}>{translate('onboarding.confirmWorkspace.subtitle')}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={styles.mb4}>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} ref={inputCallbackRef} inputID={WorkspaceConfirmationForm_1.default.NAME} label={translate('workspace.common.workspaceName')} accessibilityLabel={translate('workspace.common.workspaceName')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={defaultWorkspaceName} shouldSaveDraft spellCheck={false}/>
                </react_native_1.View>
                <react_native_1.View style={[onboardingIsMediumOrLargerScreenWidth ? styles.mhn8 : styles.mhn5]}>
                    <InputWrapper_1.default InputComponent={OnboardingCurrencyPicker_1.default} inputID={WorkspaceConfirmationForm_1.default.CURRENCY} label={translate('workspace.editor.currencyInputLabel')} defaultValue={defaultCurrency} style={onboardingIsMediumOrLargerScreenWidth ? styles.ph8 : styles.ph5}/>
                </react_native_1.View>
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
BaseOnboardingWorkspaceConfirmation.displayName = 'BaseOnboardingWorkspaceConfirmation';
exports.default = BaseOnboardingWorkspaceConfirmation;
