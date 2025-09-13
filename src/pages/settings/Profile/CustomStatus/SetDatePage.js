"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DatePicker_1 = require("@components/DatePicker");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DateUtils_1 = require("@libs/DateUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const User_1 = require("@userActions/User");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SettingsStatusClearDateForm_1 = require("@src/types/form/SettingsStatusClearDateForm");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function SetDatePage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [customStatus, customStatusMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CUSTOM_STATUS_DRAFT);
    const customClearAfter = customStatus?.clearAfter ?? '';
    const onSubmit = (value) => {
        (0, User_1.updateDraftCustomStatus)({ clearAfter: DateUtils_1.default.combineDateAndTime(customClearAfter, value.dateTime) });
        Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_STATUS_CLEAR_AFTER);
    };
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [SettingsStatusClearDateForm_1.default.DATE_TIME]);
        const dateError = (0, ValidationUtils_1.getDatePassedError)(values.dateTime);
        if (values.dateTime && dateError) {
            errors.dateTime = dateError;
        }
        return errors;
    }, []);
    if ((0, isLoadingOnyxValue_1.default)(customStatusMetadata)) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom testID={SetDatePage.displayName}>
            <HeaderWithBackButton_1.default title={translate('statusPage.date')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_STATUS_CLEAR_AFTER)}/>
            <FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.SETTINGS_STATUS_CLEAR_DATE_FORM} onSubmit={onSubmit} submitButtonText={translate('common.save')} validate={validate} enabledWhenOffline shouldHideFixErrorsAlert>
                <InputWrapper_1.default InputComponent={DatePicker_1.default} inputID={SettingsStatusClearDateForm_1.default.DATE_TIME} label={translate('statusPage.date')} defaultValue={DateUtils_1.default.extractDate(customClearAfter)} minDate={new Date()} shouldUseDefaultValue autoFocus/>
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
SetDatePage.displayName = 'SetDatePage';
exports.default = SetDatePage;
