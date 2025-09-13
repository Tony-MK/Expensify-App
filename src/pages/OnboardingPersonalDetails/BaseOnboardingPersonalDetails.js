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
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnboardingMessages_1 = require("@hooks/useOnboardingMessages");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const navigateAfterOnboarding_1 = require("@libs/navigateAfterOnboarding");
const Navigation_1 = require("@libs/Navigation/Navigation");
const UserUtils_1 = require("@libs/UserUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const Onboarding_1 = require("@userActions/Onboarding");
const PersonalDetails_1 = require("@userActions/PersonalDetails");
const Report_1 = require("@userActions/Report");
const Welcome_1 = require("@userActions/Welcome");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const DisplayNameForm_1 = require("@src/types/form/DisplayNameForm");
function BaseOnboardingPersonalDetails({ currentUserPersonalDetails, shouldUseNativeStyles, route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const [onboardingPurposeSelected] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_PURPOSE_SELECTED, { canBeMissing: true });
    const [onboardingPolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_POLICY_ID, { canBeMissing: true });
    const [onboardingAdminsChatReportID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_ADMINS_CHAT_REPORT_ID, { canBeMissing: true });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [loginList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LOGIN_LIST, { canBeMissing: true });
    const [onboardingValues] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, { canBeMissing: true });
    const [conciergeChatReportID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CONCIERGE_REPORT_ID, { canBeMissing: true });
    const { onboardingMessages } = (0, useOnboardingMessages_1.default)();
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    // When we merge public email with work email, we now want to navigate to the
    // concierge chat report of the new work email and not the last accessed report.
    const mergedAccountConciergeReportID = !onboardingValues?.shouldRedirectToClassicAfterMerge && onboardingValues?.shouldValidate ? conciergeChatReportID : undefined;
    // We need to use isSmallScreenWidth, see navigateAfterOnboarding function comment
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { onboardingIsMediumOrLargerScreenWidth, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const [shouldValidateOnChange, setShouldValidateOnChange] = (0, react_1.useState)(false);
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const isPrivateDomainAndHasAccessiblePolicies = !account?.isFromPublicDomain && !!account?.hasAccessibleDomainPolicies;
    const isValidated = (0, UserUtils_1.isCurrentUserValidated)(loginList, session?.email);
    const isVsb = onboardingValues?.signupQualifier === CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.VSB;
    const isSmb = onboardingValues?.signupQualifier === CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.SMB;
    (0, react_1.useEffect)(() => {
        (0, Welcome_1.setOnboardingErrorMessage)('');
    }, []);
    const completeOnboarding = (0, react_1.useCallback)((firstName, lastName) => {
        if (!onboardingPurposeSelected) {
            return;
        }
        (0, Report_1.completeOnboarding)({
            engagementChoice: onboardingPurposeSelected,
            onboardingMessage: onboardingMessages[onboardingPurposeSelected],
            firstName,
            lastName,
            adminsChatReportID: onboardingAdminsChatReportID,
            onboardingPolicyID,
        });
        (0, Welcome_1.setOnboardingAdminsChatReportID)();
        (0, Welcome_1.setOnboardingPolicyID)();
        (0, navigateAfterOnboarding_1.navigateAfterOnboardingWithMicrotaskQueue)(isSmallScreenWidth, isBetaEnabled(CONST_1.default.BETAS.DEFAULT_ROOMS), onboardingPolicyID, mergedAccountConciergeReportID);
    }, [onboardingPurposeSelected, onboardingAdminsChatReportID, onboardingMessages, onboardingPolicyID, isBetaEnabled, isSmallScreenWidth, mergedAccountConciergeReportID]);
    const handleSubmit = (0, react_1.useCallback)((values) => {
        const firstName = values.firstName.trim();
        const lastName = values.lastName.trim();
        (0, PersonalDetails_1.setDisplayName)(firstName, lastName, formatPhoneNumber);
        (0, Onboarding_1.clearPersonalDetailsDraft)();
        (0, Onboarding_1.setPersonalDetails)(firstName, lastName);
        if (isPrivateDomainAndHasAccessiblePolicies && (!onboardingPurposeSelected || isVsb || isSmb)) {
            const nextRoute = isValidated ? ROUTES_1.default.ONBOARDING_WORKSPACES : ROUTES_1.default.ONBOARDING_PRIVATE_DOMAIN;
            Navigation_1.default.navigate(nextRoute.getRoute(route.params?.backTo));
            return;
        }
        if (onboardingPurposeSelected === CONST_1.default.ONBOARDING_CHOICES.PERSONAL_SPEND || onboardingPurposeSelected === CONST_1.default.ONBOARDING_CHOICES.TRACK_WORKSPACE) {
            (0, PersonalDetails_1.updateDisplayName)(firstName, lastName, formatPhoneNumber);
            Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_WORKSPACE.getRoute(route.params?.backTo));
            return;
        }
        completeOnboarding(firstName, lastName);
    }, [isPrivateDomainAndHasAccessiblePolicies, onboardingPurposeSelected, isValidated, route.params?.backTo, completeOnboarding, isVsb, isSmb, formatPhoneNumber]);
    const validate = (values) => {
        if (!shouldValidateOnChange) {
            setShouldValidateOnChange(true);
        }
        const errors = {};
        // First we validate the first name field
        if (values.firstName.replace(CONST_1.default.REGEX.ANY_SPACE, '').length === 0) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'firstName', translate('onboarding.error.requiredFirstName'));
        }
        if (!(0, ValidationUtils_1.isValidDisplayName)(values.firstName)) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'firstName', translate('personalDetails.error.hasInvalidCharacter'));
        }
        else if (values.firstName.length > CONST_1.default.DISPLAY_NAME.MAX_LENGTH) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'firstName', translate('common.error.characterLimitExceedCounter', { length: values.firstName.length, limit: CONST_1.default.DISPLAY_NAME.MAX_LENGTH }));
        }
        if ((0, ValidationUtils_1.doesContainReservedWord)(values.firstName, CONST_1.default.DISPLAY_NAME.RESERVED_NAMES)) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'firstName', translate('personalDetails.error.containsReservedWord'));
        }
        // Then we validate the last name field
        if (!(0, ValidationUtils_1.isValidDisplayName)(values.lastName)) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'lastName', translate('personalDetails.error.hasInvalidCharacter'));
        }
        else if (values.lastName.length > CONST_1.default.DISPLAY_NAME.MAX_LENGTH) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'lastName', translate('common.error.characterLimitExceedCounter', { length: values.lastName.length, limit: CONST_1.default.DISPLAY_NAME.MAX_LENGTH }));
        }
        if ((0, ValidationUtils_1.doesContainReservedWord)(values.lastName, CONST_1.default.DISPLAY_NAME.RESERVED_NAMES)) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'lastName', translate('personalDetails.error.containsReservedWord'));
        }
        return errors;
    };
    return (<ScreenWrapper_1.default shouldEnableMaxHeight includeSafeAreaPaddingBottom testID="BaseOnboardingPersonalDetails" style={[styles.defaultModalContainer, shouldUseNativeStyles && styles.pt8]}>
            <HeaderWithBackButton_1.default shouldShowBackButton={!isPrivateDomainAndHasAccessiblePolicies} progressBarPercentage={isPrivateDomainAndHasAccessiblePolicies ? 20 : 80} onBackButtonPress={Navigation_1.default.goBack}/>
            <FormProvider_1.default style={[styles.flexGrow1, onboardingIsMediumOrLargerScreenWidth && styles.mt5, onboardingIsMediumOrLargerScreenWidth ? styles.mh8 : styles.mh5]} formID={ONYXKEYS_1.default.FORMS.ONBOARDING_PERSONAL_DETAILS_FORM} validate={validate} onSubmit={handleSubmit} submitButtonText={translate('common.continue')} enabledWhenOffline submitFlexEnabled shouldValidateOnBlur={false} shouldValidateOnChange={shouldValidateOnChange} shouldTrimValues={false}>
                <react_native_1.View style={[onboardingIsMediumOrLargerScreenWidth ? styles.flexRow : styles.flexColumn, styles.mb5]}>
                    <Text_1.default style={styles.textHeadlineH1}>{translate('onboarding.whatsYourName')}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={styles.mb4}>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} ref={inputCallbackRef} inputID={DisplayNameForm_1.default.FIRST_NAME} name="fname" label={translate('common.firstName')} aria-label={translate('common.firstName')} role={CONST_1.default.ROLE.PRESENTATION} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...(currentUserPersonalDetails?.firstName && { defaultValue: currentUserPersonalDetails.firstName })} shouldSaveDraft spellCheck={false}/>
                </react_native_1.View>
                <react_native_1.View>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={DisplayNameForm_1.default.LAST_NAME} name="lname" label={translate('common.lastName')} aria-label={translate('common.lastName')} role={CONST_1.default.ROLE.PRESENTATION} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...(currentUserPersonalDetails?.lastName && { defaultValue: currentUserPersonalDetails.lastName })} shouldSaveDraft spellCheck={false}/>
                </react_native_1.View>
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
BaseOnboardingPersonalDetails.displayName = 'BaseOnboardingPersonalDetails';
exports.default = (0, withCurrentUserPersonalDetails_1.default)(BaseOnboardingPersonalDetails);
