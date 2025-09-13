"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const RadioButtons_1 = require("@components/RadioButtons");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@navigation/Navigation");
const ExitSurvey_1 = require("@userActions/ExitSurvey");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const ExitSurveyReasonForm_1 = require("@src/types/form/ExitSurveyReasonForm");
const ExitSurveyOffline_1 = require("./ExitSurveyOffline");
function ExitSurveyReasonPage() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [draftReason] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.EXIT_SURVEY_REASON_FORM_DRAFT, {
        selector: (value) => value?.[ExitSurveyReasonForm_1.default.REASON] ?? null,
        canBeMissing: true,
    });
    const [reason, setReason] = (0, react_1.useState)(draftReason ?? null);
    (0, react_1.useEffect)(() => {
        // disabling lint because || is fine to use as a logical operator (as opposed to being used to define a default value)
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (reason || !draftReason) {
            return;
        }
        setReason(draftReason);
    }, [reason, draftReason]);
    const reasons = (0, react_1.useMemo)(() => Object.values(CONST_1.default.EXIT_SURVEY.REASONS).map((value) => ({
        value,
        label: translate(`exitSurvey.reasons.${value}`),
        style: styles.mt6,
    })), [styles, translate]);
    return (<ScreenWrapper_1.default testID={ExitSurveyReasonPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('exitSurvey.header')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
            <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.EXIT_SURVEY_REASON_FORM} style={[styles.flex1, styles.mt3, styles.mh5]} validate={() => {
            const errors = {};
            if (!reason) {
                errors[ExitSurveyReasonForm_1.default.REASON] = translate('common.error.fieldRequired');
            }
            return errors;
        }} onSubmit={() => {
            if (!reason) {
                return;
            }
            (0, ExitSurvey_1.saveExitReason)(reason);
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_EXIT_SURVEY_RESPONSE.getRoute(reason, ROUTES_1.default.SETTINGS_EXIT_SURVEY_REASON.route));
        }} submitButtonText={translate('common.next')} shouldValidateOnBlur shouldValidateOnChange shouldHideFixErrorsAlert>
                {isOffline && <ExitSurveyOffline_1.default />}
                {!isOffline && (<>
                        <Text_1.default style={styles.headerAnonymousFooter}>{translate('exitSurvey.reasonPage.title')}</Text_1.default>
                        <Text_1.default style={styles.mt2}>{translate('exitSurvey.reasonPage.subtitle')}</Text_1.default>
                        <InputWrapper_1.default InputComponent={RadioButtons_1.default} inputID={ExitSurveyReasonForm_1.default.REASON} value={reason} items={reasons} onPress={setReason} shouldSaveDraft/>
                    </>)}
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
ExitSurveyReasonPage.displayName = 'ExitSurveyReasonPage';
exports.default = ExitSurveyReasonPage;
