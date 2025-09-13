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
const MoneyRequestHoldReasonForm_1 = require("@src/types/form/MoneyRequestHoldReasonForm");
function HoldReasonFormView({ backTo, validate, onSubmit }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom shouldEnableMaxHeight testID={HoldReasonFormView.displayName}>
            <HeaderWithBackButton_1.default title={translate('iou.holdExpense')} onBackButtonPress={() => Navigation_1.default.goBack(backTo)}/>
            <FormProvider_1.default formID="moneyHoldReasonForm" submitButtonText={translate('iou.holdExpense')} style={[styles.flexGrow1, styles.ph5]} onSubmit={onSubmit} validate={validate} enabledWhenOffline shouldHideFixErrorsAlert>
                <Text_1.default style={styles.mb6}>{translate('iou.explainHold')}</Text_1.default>
                <react_native_1.View>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={MoneyRequestHoldReasonForm_1.default.COMMENT} valueType="string" name="comment" defaultValue={undefined} label={translate('iou.reason')} accessibilityLabel={translate('iou.reason')} ref={inputCallbackRef}/>
                </react_native_1.View>
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
HoldReasonFormView.displayName = 'HoldReasonFormViewProps';
exports.default = HoldReasonFormView;
