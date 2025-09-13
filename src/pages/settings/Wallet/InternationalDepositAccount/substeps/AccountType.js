"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const ValuePicker_1 = require("@components/ValuePicker");
const useInternationalBankAccountFormSubmit_1 = require("@hooks/useInternationalBankAccountFormSubmit");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const FormActions_1 = require("@libs/actions/FormActions");
const Text_1 = require("@src/components/Text");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function AccountType({ isEditing, onNext, fieldsMap }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const formRef = (0, react_1.useRef)(null);
    const fieldData = fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_TYPE]?.[CONST_1.default.CORPAY_FIELDS.ACCOUNT_TYPE_KEY] ?? {};
    const handleSubmit = (0, useInternationalBankAccountFormSubmit_1.default)({
        fieldIds: Object.keys(fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_TYPE]),
        onNext,
        shouldSaveDraft: isEditing,
    });
    const validate = (0, react_1.useCallback)((values) => {
        if (!fieldData.isRequired || values[CONST_1.default.CORPAY_FIELDS.ACCOUNT_TYPE_KEY]) {
            return {};
        }
        return { [CONST_1.default.CORPAY_FIELDS.ACCOUNT_TYPE_KEY]: translate('common.error.pleaseSelectOne') };
    }, [fieldData.isRequired, translate]);
    const options = (0, react_1.useMemo)(() => (fieldData.valueSet ?? []).map((item) => {
        return {
            value: item.id,
            label: item.text,
        };
    }), [fieldData.valueSet]);
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.INTERNATIONAL_BANK_ACCOUNT_FORM} submitButtonText={translate('common.confirm')} onSubmit={handleSubmit} validate={validate} style={[styles.flexGrow1, styles.mt3]} submitButtonStyles={[styles.ph5, styles.mb0]} enabledWhenOffline ref={formRef} isSubmitButtonVisible={!isEditing}>
            <react_native_1.View style={styles.ph5}>
                <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb6]}>{translate('addPersonalBankAccount.accountTypeStepHeader')}</Text_1.default>
            </react_native_1.View>
            <InputWrapper_1.default InputComponent={ValuePicker_1.default} inputID={fieldData.id} label={fieldData.label} items={options} shouldSaveDraft={!isEditing} shouldShowModal={false} onValueChange={(value) => {
            if (!isEditing) {
                return;
            }
            (0, FormActions_1.setDraftValues)(ONYXKEYS_1.default.FORMS.INTERNATIONAL_BANK_ACCOUNT_FORM, { [CONST_1.default.CORPAY_FIELDS.ACCOUNT_TYPE_KEY]: value }).then(() => {
                onNext();
            });
        }}/>
        </FormProvider_1.default>);
}
AccountType.displayName = 'AccountType';
exports.default = AccountType;
