"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const FormActions_1 = require("@libs/actions/FormActions");
const CONST_1 = require("@src/CONST");
const FeedbackSurveyForm_1 = require("@src/types/form/FeedbackSurveyForm");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const FixedFooter_1 = require("./FixedFooter");
const FormProvider_1 = require("./Form/FormProvider");
const InputWrapper_1 = require("./Form/InputWrapper");
const FormAlertWithSubmitButton_1 = require("./FormAlertWithSubmitButton");
const RadioButtons_1 = require("./RadioButtons");
const Text_1 = require("./Text");
const TextInput_1 = require("./TextInput");
function FeedbackSurvey({ title, description, onSubmit, optionRowStyles, footerText, isNoteRequired, isLoading, formID, enabledWhenOffline = true }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [draft, draftResults] = (0, useOnyx_1.default)(`${formID}Draft`, { canBeMissing: true });
    const [reason, setReason] = (0, react_1.useState)(draft?.reason);
    const [shouldShowReasonError, setShouldShowReasonError] = (0, react_1.useState)(false);
    const isLoadingDraft = (0, isLoadingOnyxValue_1.default)(draftResults);
    const options = (0, react_1.useMemo)(() => [
        { value: CONST_1.default.FEEDBACK_SURVEY_OPTIONS.TOO_LIMITED.ID, label: translate(CONST_1.default.FEEDBACK_SURVEY_OPTIONS.TOO_LIMITED.TRANSLATION_KEY) },
        { value: CONST_1.default.FEEDBACK_SURVEY_OPTIONS.TOO_EXPENSIVE.ID, label: translate(CONST_1.default.FEEDBACK_SURVEY_OPTIONS.TOO_EXPENSIVE.TRANSLATION_KEY) },
        { value: CONST_1.default.FEEDBACK_SURVEY_OPTIONS.INADEQUATE_SUPPORT.ID, label: translate(CONST_1.default.FEEDBACK_SURVEY_OPTIONS.INADEQUATE_SUPPORT.TRANSLATION_KEY) },
        { value: CONST_1.default.FEEDBACK_SURVEY_OPTIONS.BUSINESS_CLOSING.ID, label: translate(CONST_1.default.FEEDBACK_SURVEY_OPTIONS.BUSINESS_CLOSING.TRANSLATION_KEY) },
    ], [translate]);
    (0, react_1.useEffect)(() => {
        if (!draft?.reason || isLoadingDraft) {
            return;
        }
        setReason(draft.reason);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- only sync with draft data when it is loaded
    }, [isLoadingDraft]);
    const handleOptionSelect = (value) => {
        setReason(value);
        setShouldShowReasonError(false);
    };
    const handleSubmit = () => {
        if (!draft?.reason || (isNoteRequired && !draft.note?.trim())) {
            setShouldShowReasonError(true);
            return;
        }
        onSubmit(draft.reason, draft.note?.trim());
        (0, FormActions_1.clearDraftValues)(formID);
    };
    const handleSetNote = () => {
        if (!isNoteRequired || !shouldShowReasonError) {
            return;
        }
        setShouldShowReasonError(false);
    };
    return (<FormProvider_1.default formID={formID} style={[styles.flexGrow1, styles.justifyContentBetween]} onSubmit={handleSubmit} submitButtonText={translate('common.submit')} isSubmitButtonVisible={false} enabledWhenOffline={enabledWhenOffline}>
            <react_native_1.View style={styles.mh5}>
                <Text_1.default style={styles.textHeadline}>{title}</Text_1.default>
                <Text_1.default style={[styles.mt1, styles.mb3, styles.textNormalThemeText]}>{description}</Text_1.default>
                <InputWrapper_1.default InputComponent={RadioButtons_1.default} inputID={FeedbackSurveyForm_1.default.REASON} items={options} radioButtonStyle={[styles.mb7, optionRowStyles]} onPress={handleOptionSelect} shouldSaveDraft/>
                {!!reason && (<>
                        <Text_1.default style={[styles.textNormalThemeText, styles.mb3]}>{translate('feedbackSurvey.additionalInfoTitle')}</Text_1.default>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={FeedbackSurveyForm_1.default.NOTE} label={translate('feedbackSurvey.additionalInfoInputLabel')} accessibilityLabel={translate('feedbackSurvey.additionalInfoInputLabel')} role={CONST_1.default.ROLE.PRESENTATION} onChangeText={handleSetNote} shouldSaveDraft/>
                    </>)}
            </react_native_1.View>
            <FixedFooter_1.default style={styles.pb0}>
                {!!footerText && footerText}
                <FormAlertWithSubmitButton_1.default isAlertVisible={shouldShowReasonError} onSubmit={handleSubmit} message={translate('common.error.pleaseCompleteForm')} buttonText={translate('common.submit')} enabledWhenOffline={enabledWhenOffline} containerStyles={styles.mt3} isLoading={isLoading}/>
            </FixedFooter_1.default>
        </FormProvider_1.default>);
}
FeedbackSurvey.displayName = 'FeedbackSurvey';
exports.default = FeedbackSurvey;
