"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useKeyboardShortcut_1 = require("@hooks/useKeyboardShortcut");
const useKeyboardState_1 = require("@hooks/useKeyboardState");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useSafeAreaInsets_1 = require("@hooks/useSafeAreaInsets");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const StatusBar_1 = require("@libs/StatusBar");
const Navigation_1 = require("@navigation/Navigation");
const variables_1 = require("@styles/variables");
const ExitSurvey_1 = require("@userActions/ExitSurvey");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const ExitSurveyResponseForm_1 = require("@src/types/form/ExitSurveyResponseForm");
const ExitSurveyOffline_1 = require("./ExitSurveyOffline");
function ExitSurveyResponsePage({ route, navigation }) {
    const [draftResponse = ''] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.EXIT_SURVEY_RESPONSE_FORM_DRAFT, { selector: (value) => value?.[ExitSurveyResponseForm_1.default.RESPONSE], canBeMissing: true });
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { keyboardHeight } = (0, useKeyboardState_1.default)();
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)(true);
    // Device safe area top and bottom insets.
    // When the keyboard is shown, the bottom inset doesn't affect the height, so we take it out from the calculation.
    const { top: safeAreaInsetsTop } = (0, useSafeAreaInsets_1.default)();
    const { reason, backTo } = route.params;
    const { isOffline } = (0, useNetwork_1.default)({
        onReconnect: () => {
            navigation.setParams({
                backTo: ROUTES_1.default.SETTINGS_EXIT_SURVEY_REASON.route,
            });
        },
    });
    (0, react_1.useEffect)(() => {
        if (!isOffline || backTo === ROUTES_1.default.SETTINGS) {
            return;
        }
        navigation.setParams({ backTo: ROUTES_1.default.SETTINGS });
    }, [backTo, isOffline, navigation]);
    const submitForm = (0, react_1.useCallback)(() => {
        (0, ExitSurvey_1.saveResponse)(draftResponse);
        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_EXIT_SURVEY_CONFIRM.getRoute(ROUTES_1.default.SETTINGS_EXIT_SURVEY_RESPONSE.route));
    }, [draftResponse]);
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.CTRL_ENTER, submitForm);
    const formTopMarginsStyle = styles.mt3;
    const textStyle = styles.headerAnonymousFooter;
    const baseResponseInputContainerStyle = styles.mt7;
    const formMaxHeight = Math.floor(
    // windowHeight doesn't include status bar height in Android, so we need to add it here.
    // StatusBar.currentHeight is only available on Android.
    windowHeight +
        (StatusBar_1.default.currentHeight ?? 0) -
        keyboardHeight -
        safeAreaInsetsTop -
        // Minus the height of HeaderWithBackButton
        variables_1.default.contentHeaderHeight -
        // Minus the top margins on the form
        formTopMarginsStyle.marginTop);
    return (<ScreenWrapper_1.default testID={ExitSurveyResponsePage.displayName} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('exitSurvey.header')} onBackButtonPress={() => Navigation_1.default.goBack(backTo)}/>
            <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.EXIT_SURVEY_RESPONSE_FORM} style={[styles.flex1, styles.mh5, formTopMarginsStyle, StyleUtils.getMaximumHeight(formMaxHeight)]} onSubmit={submitForm} submitButtonText={translate('common.next')} validate={() => {
            const errors = {};
            if (!draftResponse?.trim()) {
                errors[ExitSurveyResponseForm_1.default.RESPONSE] = translate('common.error.fieldRequired');
            }
            else if (draftResponse.length > CONST_1.default.MAX_COMMENT_LENGTH) {
                errors[ExitSurveyResponseForm_1.default.RESPONSE] = translate('common.error.characterLimitExceedCounter', {
                    length: draftResponse.length,
                    limit: CONST_1.default.MAX_COMMENT_LENGTH,
                });
            }
            return errors;
        }} shouldValidateOnBlur shouldValidateOnChange shouldHideFixErrorsAlert>
                {isOffline && <ExitSurveyOffline_1.default />}
                {!isOffline && (<>
                        <Text_1.default style={textStyle}>{translate(`exitSurvey.prompts.${reason}`)}</Text_1.default>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={ExitSurveyResponseForm_1.default.RESPONSE} label={translate(`exitSurvey.responsePlaceholder`)} accessibilityLabel={translate(`exitSurvey.responsePlaceholder`)} role={CONST_1.default.ROLE.PRESENTATION} autoGrowHeight maxAutoGrowHeight={variables_1.default.textInputAutoGrowMaxHeight} ref={inputCallbackRef} containerStyles={[baseResponseInputContainerStyle]} shouldSaveDraft shouldSubmitForm/>
                    </>)}
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
ExitSurveyResponsePage.displayName = 'ExitSurveyResponsePage';
exports.default = ExitSurveyResponsePage;
