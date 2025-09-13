"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var FormProvider_1 = require("@components/Form/FormProvider");
var InputWrapper_1 = require("@components/Form/InputWrapper");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var Text_1 = require("@components/Text");
var TextInput_1 = require("@components/TextInput");
var useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Navigation_1 = require("@libs/Navigation/Navigation");
var MoneyRequestRejectReasonForm_1 = require("@src/types/form/MoneyRequestRejectReasonForm");
function RejectReasonFormView(_a) {
    var backTo = _a.backTo, validate = _a.validate, onSubmit = _a.onSubmit;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var inputCallbackRef = (0, useAutoFocusInput_1.default)().inputCallbackRef;
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom shouldEnableMaxHeight testID={RejectReasonFormView.displayName}>
            <HeaderWithBackButton_1.default title={translate('iou.reject.reasonPageTitle')} onBackButtonPress={function () { return Navigation_1.default.goBack(backTo); }}/>
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
