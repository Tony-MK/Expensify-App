"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const usePrivateSubscription_1 = require("@hooks/usePrivateSubscription");
const useStepFormSubmit_1 = require("@hooks/useStepFormSubmit");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SubscriptionSizeForm_1 = require("@src/types/form/SubscriptionSizeForm");
function Size({ onNext }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const privateSubscription = (0, usePrivateSubscription_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const updateValuesAndNavigateToNextStep = (0, useStepFormSubmit_1.default)({
        formId: ONYXKEYS_1.default.FORMS.SUBSCRIPTION_SIZE_FORM,
        fieldIds: [SubscriptionSizeForm_1.default.SUBSCRIPTION_SIZE],
        onNext,
        shouldSaveDraft: true,
    });
    const defaultValues = {
        [SubscriptionSizeForm_1.default.SUBSCRIPTION_SIZE]: `${privateSubscription?.userCount ?? ''}`,
    };
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [SubscriptionSizeForm_1.default.SUBSCRIPTION_SIZE]);
        if (values[SubscriptionSizeForm_1.default.SUBSCRIPTION_SIZE] && !(0, ValidationUtils_1.isValidSubscriptionSize)(values[SubscriptionSizeForm_1.default.SUBSCRIPTION_SIZE])) {
            errors.subscriptionSize = translate('subscription.subscriptionSize.error.size');
        }
        if (Number(values[SubscriptionSizeForm_1.default.SUBSCRIPTION_SIZE]) === privateSubscription?.userCount) {
            errors.subscriptionSize = translate('subscription.subscriptionSize.error.sameSize');
        }
        return errors;
    }, [privateSubscription?.userCount, translate]);
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.SUBSCRIPTION_SIZE_FORM} submitButtonText={translate('common.next')} onSubmit={updateValuesAndNavigateToNextStep} validate={validate} style={[styles.mh5, styles.flexGrow1]} enabledWhenOffline shouldHideFixErrorsAlert>
            <react_native_1.View>
                <Text_1.default style={[styles.textNormalThemeText, styles.mb5]}>{translate('subscription.subscriptionSize.yourSize')}</Text_1.default>
                <InputWrapper_1.default InputComponent={TextInput_1.default} ref={inputCallbackRef} inputID={SubscriptionSizeForm_1.default.SUBSCRIPTION_SIZE} label={translate('subscription.subscriptionSize.subscriptionSize')} aria-label={translate('subscription.subscriptionSize.subscriptionSize')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={defaultValues[SubscriptionSizeForm_1.default.SUBSCRIPTION_SIZE]} shouldSaveDraft inputMode={CONST_1.default.INPUT_MODE.NUMERIC}/>
                <Text_1.default style={[styles.formHelp, styles.mt2]}>{translate('subscription.subscriptionSize.eachMonth')}</Text_1.default>
                <Text_1.default style={[styles.formHelp, styles.mt2]}>{translate('subscription.subscriptionSize.note')}</Text_1.default>
            </react_native_1.View>
        </FormProvider_1.default>);
}
Size.displayName = 'SizeStep';
exports.default = Size;
