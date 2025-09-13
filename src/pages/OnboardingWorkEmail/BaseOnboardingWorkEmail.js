"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const AutoEmailLink_1 = require("@components/AutoEmailLink");
const Button_1 = require("@components/Button");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const Illustrations = require("@components/Icon/Illustrations");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const OnboardingMergingAccountBlockedView_1 = require("@components/OnboardingMergingAccountBlockedView");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Browser_1 = require("@libs/Browser");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const getOperatingSystem_1 = require("@libs/getOperatingSystem");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Session_1 = require("@userActions/Session");
const Welcome_1 = require("@userActions/Welcome");
const CONST_1 = require("@src/CONST");
const Log_1 = require("@src/libs/Log");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const OnboardingWorkEmailForm_1 = require("@src/types/form/OnboardingWorkEmailForm");
function BaseOnboardingWorkEmail({ shouldUseNativeStyles }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [onboardingValues] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, { canBeMissing: true });
    const [formValue] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ONBOARDING_WORK_EMAIL_FORM, { canBeMissing: true });
    const workEmail = formValue?.[OnboardingWorkEmailForm_1.default.ONBOARDING_WORK_EMAIL];
    const [onboardingErrorMessage] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_ERROR_MESSAGE, { canBeMissing: true });
    const isVsb = onboardingValues && 'signupQualifier' in onboardingValues && onboardingValues.signupQualifier === CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.VSB;
    const isSmb = onboardingValues?.signupQualifier === CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.SMB;
    const { onboardingIsMediumOrLargerScreenWidth } = (0, useResponsiveLayout_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const [shouldValidateOnChange, setShouldValidateOnChange] = (0, react_1.useState)(false);
    const { isOffline } = (0, useNetwork_1.default)();
    const ICON_SIZE = 48;
    const operatingSystem = (0, getOperatingSystem_1.default)();
    const isFocused = (0, native_1.useIsFocused)();
    (0, react_1.useEffect)(() => {
        (0, Welcome_1.setOnboardingErrorMessage)('');
    }, []);
    (0, react_1.useEffect)(() => {
        if (onboardingValues?.shouldValidate === undefined && onboardingValues?.isMergeAccountStepCompleted === undefined) {
            return;
        }
        (0, Welcome_1.setOnboardingErrorMessage)('');
        if (onboardingValues?.shouldValidate) {
            Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_WORK_EMAIL_VALIDATION.getRoute());
            return;
        }
        // Once we verify that shouldValidate is false, we need to force replace the screen
        // so that we don't navigate back on back button press
        if (isVsb) {
            Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_ACCOUNTING.getRoute(), { forceReplace: true });
            return;
        }
        if (isSmb) {
            Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_EMPLOYEES.getRoute(), { forceReplace: true });
            return;
        }
        if (!onboardingValues?.isMergeAccountStepSkipped) {
            Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_PRIVATE_DOMAIN.getRoute(), { forceReplace: true });
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_PURPOSE.getRoute(), { forceReplace: true });
    }, [onboardingValues?.shouldValidate, isVsb, isSmb, isFocused, onboardingValues?.isMergeAccountStepCompleted, onboardingValues?.isMergeAccountStepSkipped]);
    const submitWorkEmail = (0, react_1.useCallback)((values) => {
        (0, Session_1.AddWorkEmail)(values[OnboardingWorkEmailForm_1.default.ONBOARDING_WORK_EMAIL]);
    }, []);
    const validate = (values) => {
        if (!shouldValidateOnChange) {
            setShouldValidateOnChange(true);
        }
        const userEmail = values[OnboardingWorkEmailForm_1.default.ONBOARDING_WORK_EMAIL];
        const errors = {};
        const emailParts = userEmail.split('@');
        const domain = emailParts.at(1) ?? '';
        if ((expensify_common_1.PUBLIC_DOMAINS_SET.has(domain.toLowerCase()) || !expensify_common_1.Str.isValidEmail(userEmail)) && !isOffline) {
            Log_1.default.hmmm('User is trying to add an invalid work email', { userEmail, domain });
            (0, ErrorUtils_1.addErrorMessage)(errors, OnboardingWorkEmailForm_1.default.ONBOARDING_WORK_EMAIL, translate('onboarding.workEmailValidationError.publicEmail'));
        }
        if (isOffline ?? false) {
            (0, ErrorUtils_1.addErrorMessage)(errors, OnboardingWorkEmailForm_1.default.ONBOARDING_WORK_EMAIL, translate('onboarding.workEmailValidationError.offline'));
        }
        return errors;
    };
    const section = [
        {
            icon: Illustrations.EnvelopeReceipt,
            titleTranslationKey: 'onboarding.workEmail.explanationModal.descriptionOne',
            shouldRenderEmail: true,
        },
        {
            icon: Illustrations.Profile,
            titleTranslationKey: 'onboarding.workEmail.explanationModal.descriptionTwo',
        },
        {
            icon: Illustrations.Gears,
            titleTranslationKey: 'onboarding.workEmail.explanationModal.descriptionThree',
        },
    ];
    return (<ScreenWrapper_1.default shouldEnableMaxHeight={!(0, Browser_1.isMobileSafari)()} shouldAvoidScrollOnVirtualViewport={!(0, Browser_1.isMobileSafari)()} includeSafeAreaPaddingBottom testID="BaseOnboardingWorkEmail" style={[styles.defaultModalContainer, shouldUseNativeStyles && styles.pt8]}>
            <HeaderWithBackButton_1.default progressBarPercentage={10} shouldShowBackButton={false}/>
            {onboardingValues?.isMergingAccountBlocked ? (<react_native_1.View style={[styles.flex1, onboardingIsMediumOrLargerScreenWidth && styles.mt5, onboardingIsMediumOrLargerScreenWidth ? styles.mh8 : styles.mh5]}>
                    <OnboardingMergingAccountBlockedView_1.default workEmail={workEmail} isVsb={isVsb}/>
                </react_native_1.View>) : (<FormProvider_1.default style={[styles.flexGrow1, onboardingIsMediumOrLargerScreenWidth && styles.mt5, onboardingIsMediumOrLargerScreenWidth ? styles.mh8 : styles.mh5]} formID={ONYXKEYS_1.default.FORMS.ONBOARDING_WORK_EMAIL_FORM} validate={validate} onSubmit={submitWorkEmail} submitButtonText={translate('onboarding.workEmail.addWorkEmail')} enabledWhenOffline submitFlexEnabled shouldValidateOnBlur={false} shouldValidateOnChange={shouldValidateOnChange} shouldTrimValues={false} footerContent={<OfflineWithFeedback_1.default shouldDisplayErrorAbove style={styles.mb3} errors={onboardingErrorMessage ? { addWorkEmailError: onboardingErrorMessage } : undefined} errorRowStyles={[styles.mt2, styles.textWrap]} onClose={() => (0, Welcome_1.setOnboardingErrorMessage)('')}>
                            <Button_1.default large text={translate('common.skip')} testID="onboardingPrivateEmailSkipButton" onPress={() => {
                    (0, Welcome_1.setOnboardingErrorMessage)('');
                    (0, Welcome_1.setOnboardingMergeAccountStepValue)(true, true);
                }}/>
                        </OfflineWithFeedback_1.default>} shouldRenderFooterAboveSubmit shouldHideFixErrorsAlert>
                    <react_native_1.View>
                        <react_native_1.View style={[onboardingIsMediumOrLargerScreenWidth ? styles.flexRow : styles.flexColumn, styles.mb3]}>
                            <Text_1.default style={styles.textHeadlineH1}>{translate('onboarding.workEmail.title')}</Text_1.default>
                        </react_native_1.View>
                        <react_native_1.View style={styles.mb2}>
                            <Text_1.default style={[styles.textNormal, styles.colorMuted]}>{translate('onboarding.workEmail.subtitle')}</Text_1.default>
                        </react_native_1.View>
                        <react_native_1.View>
                            {section.map((item) => {
                return (<react_native_1.View key={item.titleTranslationKey} style={[styles.mt2, styles.mb3]}>
                                        <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.flex1]}>
                                            <Icon_1.default src={item.icon} height={ICON_SIZE} width={ICON_SIZE} additionalStyles={[styles.mr3]}/>
                                            <react_native_1.View style={[styles.flexColumn, styles.flex1]}>
                                                {item.shouldRenderEmail ? (<AutoEmailLink_1.default style={[styles.textStrong, styles.lh20]} text={translate(item.titleTranslationKey)}/>) : (<Text_1.default style={[styles.textStrong, styles.lh20]}>{translate(item.titleTranslationKey)}</Text_1.default>)}
                                            </react_native_1.View>
                                        </react_native_1.View>
                                    </react_native_1.View>);
            })}
                        </react_native_1.View>
                    </react_native_1.View>

                    <react_native_1.View style={[styles.mb4, styles.pt3]}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} 
        // We do not want to auto-focus for mobile platforms
        ref={operatingSystem !== CONST_1.default.OS.ANDROID && operatingSystem !== CONST_1.default.OS.IOS ? inputCallbackRef : undefined} name="fname" inputID={OnboardingWorkEmailForm_1.default.ONBOARDING_WORK_EMAIL} label={translate('common.workEmail')} aria-label={translate('common.workEmail')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={workEmail ?? ''} shouldSaveDraft maxLength={CONST_1.default.LOGIN_CHARACTER_LIMIT} spellCheck={false}/>
                    </react_native_1.View>
                </FormProvider_1.default>)}
        </ScreenWrapper_1.default>);
}
BaseOnboardingWorkEmail.displayName = 'BaseOnboardingWorkEmail';
exports.default = BaseOnboardingWorkEmail;
