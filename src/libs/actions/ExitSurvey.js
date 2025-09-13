"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveExitReason = saveExitReason;
exports.saveResponse = saveResponse;
exports.switchToOldDot = switchToOldDot;
exports.resetExitSurveyForm = resetExitSurveyForm;
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ExitSurveyReasonForm_1 = require("@src/types/form/ExitSurveyReasonForm");
const ExitSurveyResponseForm_1 = require("@src/types/form/ExitSurveyResponseForm");
function saveExitReason(reason) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.FORMS.EXIT_SURVEY_REASON_FORM, { [ExitSurveyReasonForm_1.default.REASON]: reason });
}
function saveResponse(response) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.FORMS.EXIT_SURVEY_RESPONSE_FORM, { [ExitSurveyResponseForm_1.default.RESPONSE]: response });
}
/**
 * Save the user's response to the mandatory exit survey in the back-end.
 */
function switchToOldDot(exitReason, exitSurveyResponse) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.FORMS.EXIT_SURVEY_REASON_FORM,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.FORMS.EXIT_SURVEY_REASON_FORM_DRAFT,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.FORMS.EXIT_SURVEY_RESPONSE_FORM,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.FORMS.EXIT_SURVEY_RESPONSE_FORM_DRAFT,
            value: null,
        },
    ];
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    API.write(types_1.WRITE_COMMANDS.SWITCH_TO_OLD_DOT, {
        reason: exitReason,
        surveyResponse: exitSurveyResponse,
    }, { optimisticData });
}
/**
 * Clear the exit survey form data.
 */
function resetExitSurveyForm(callback) {
    react_native_onyx_1.default.multiSet({
        [ONYXKEYS_1.default.FORMS.EXIT_SURVEY_REASON_FORM]: null,
        [ONYXKEYS_1.default.FORMS.EXIT_SURVEY_REASON_FORM_DRAFT]: null,
        [ONYXKEYS_1.default.FORMS.EXIT_SURVEY_RESPONSE_FORM]: null,
        [ONYXKEYS_1.default.FORMS.EXIT_SURVEY_RESPONSE_FORM_DRAFT]: null,
    }).then(callback);
}
