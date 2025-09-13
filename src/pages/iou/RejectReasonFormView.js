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
const Navigation_1 = require("@libs/Navigation/Navigation");
const MoneyRequestRejectReasonForm_1 = require("@src/types/form/MoneyRequestRejectReasonForm");
function RejectReasonFormView({ backTo, validate, onSubmit }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom shouldEnableMaxHeight testID={RejectReasonFormView.displayName}>
            <HeaderWithBackButton_1.default title={translate('iou.reject.reasonPageTitle')} onBackButtonPress={() => Navigation_1.default.goBack(backTo)}/>
            <FormProvider_1.default formID="moneyRejectReasonForm" submitButtonText={translate('iou.reject.reasonPageTitle')} style={[styles.flexGrow1, styles.ph5]} onSubmit={onSubmit} validate={validate} enabledWhenOffline shouldHideFixErrorsAlert isSubmitActionDangerous>
                <react_native_1.View>
                    <Text_1.default style={styles.mb6}>{translate('iou.reject.reasonPageDescription1')}</Text_1.default>
                    <Text_1.default style={styles.mb6}>{translate('iou.reject.reasonPageDescription2')}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={MoneyRequestRejectReasonForm_1.default.COMMENT} valueType="string" name="comment" defaultValue={undefined} label={translate('iou.reject.rejectReason')} accessibilityLabel={translate('iou.reject.rejectReason')} ref={inputCallbackRef}/>
                </react_native_1.View>
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
RejectReasonFormView.displayName = 'RejectReasonFormView';
exports.default = RejectReasonFormView;
