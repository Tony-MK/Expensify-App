"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const RenderHTML_1 = require("@components/RenderHTML");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetSuiteImportAddCustomListForm_1 = require("@hooks/useNetSuiteImportAddCustomListForm");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Parser_1 = require("@libs/Parser");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const NetSuiteCustomFieldForm_1 = require("@src/types/form/NetSuiteCustomFieldForm");
const STEP_FIELDS = [NetSuiteCustomFieldForm_1.default.TRANSACTION_FIELD_ID];
function TransactionFieldIDStep({ onNext, isEditing, netSuiteCustomFieldFormValues, customLists }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const fieldLabel = translate(`workspace.netsuite.import.importCustomFields.customLists.fields.transactionFieldID`);
    const handleSubmit = (0, useNetSuiteImportAddCustomListForm_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: true,
    });
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(values[NetSuiteCustomFieldForm_1.default.TRANSACTION_FIELD_ID])) {
            errors[NetSuiteCustomFieldForm_1.default.TRANSACTION_FIELD_ID] = translate('workspace.netsuite.import.importCustomFields.requiredFieldError', { fieldName: fieldLabel });
        }
        else if (customLists?.find((customList) => customList.transactionFieldID.toLowerCase() === values[NetSuiteCustomFieldForm_1.default.TRANSACTION_FIELD_ID].toLowerCase())) {
            errors[NetSuiteCustomFieldForm_1.default.TRANSACTION_FIELD_ID] = translate('workspace.netsuite.import.importCustomFields.customLists.errors.uniqueTransactionFieldIDError');
        }
        return errors;
    }, [customLists, translate, fieldLabel]);
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.NETSUITE_CUSTOM_LIST_ADD_FORM} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} onSubmit={handleSubmit} validate={validate} style={[styles.flexGrow1, styles.mt3]} submitButtonStyles={[styles.ph5, styles.mb0]} enabledWhenOffline submitFlexEnabled shouldUseScrollView shouldHideFixErrorsAlert addBottomSafeAreaPadding>
            <react_native_1.View style={styles.ph5}>
                <Text_1.default style={[styles.mb3, styles.textHeadlineLineHeightXXL]}>{translate(`workspace.netsuite.import.importCustomFields.customLists.addForm.transactionFieldIDTitle`)}</Text_1.default>
                <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={NetSuiteCustomFieldForm_1.default.TRANSACTION_FIELD_ID} label={fieldLabel} aria-label={fieldLabel} role={CONST_1.default.ROLE.PRESENTATION} spellCheck={false} ref={inputCallbackRef} defaultValue={netSuiteCustomFieldFormValues[NetSuiteCustomFieldForm_1.default.TRANSACTION_FIELD_ID]}/>
                <react_native_1.View style={[styles.flex1, styles.mv3, styles.renderHTML, styles.textDecorationSkipInkNone]}>
                    <RenderHTML_1.default html={`<comment>${Parser_1.default.replace(translate(`workspace.netsuite.import.importCustomFields.customLists.addForm.transactionFieldIDFooter`))}</comment>`}/>
                </react_native_1.View>
            </react_native_1.View>
        </FormProvider_1.default>);
}
TransactionFieldIDStep.displayName = 'TransactionFieldIDStep';
exports.default = TransactionFieldIDStep;
