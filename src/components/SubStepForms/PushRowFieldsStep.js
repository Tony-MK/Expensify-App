"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const PushRowWithModal_1 = require("@components/PushRowWithModal");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
function PushRowFieldsStep({ formID, formTitle, pushRowFields, onSubmit, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const pushRowFieldsIDs = pushRowFields.map((field) => field.inputID);
    const validate = (0, react_1.useCallback)((values) => {
        return (0, ValidationUtils_1.getFieldRequiredErrors)(values, pushRowFieldsIDs);
    }, [pushRowFieldsIDs]);
    return (<FormProvider_1.default formID={formID} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} onSubmit={onSubmit} style={[styles.flexGrow1]} submitButtonStyles={[styles.mh5]} validate={validate}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mh5, styles.mb3]}>{formTitle}</Text_1.default>
            {pushRowFields.map((pushRowField) => (<InputWrapper_1.default key={pushRowField.inputID} InputComponent={PushRowWithModal_1.default} optionsList={pushRowField.options} description={pushRowField.description} modalHeaderTitle={pushRowField.modalHeaderTitle} searchInputTitle={pushRowField.searchInputTitle} inputID={pushRowField.inputID} shouldSaveDraft={!isEditing} defaultValue={pushRowField.defaultValue}/>))}
        </FormProvider_1.default>);
}
PushRowFieldsStep.displayName = 'PushRowFieldsStep';
exports.default = PushRowFieldsStep;
