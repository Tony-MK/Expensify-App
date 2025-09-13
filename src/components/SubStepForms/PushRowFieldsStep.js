"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var FormProvider_1 = require("@components/Form/FormProvider");
var InputWrapper_1 = require("@components/Form/InputWrapper");
var PushRowWithModal_1 = require("@components/PushRowWithModal");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var ValidationUtils_1 = require("@libs/ValidationUtils");
function PushRowFieldsStep(_a) {
    var formID = _a.formID, formTitle = _a.formTitle, pushRowFields = _a.pushRowFields, onSubmit = _a.onSubmit, isEditing = _a.isEditing;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var pushRowFieldsIDs = pushRowFields.map(function (field) { return field.inputID; });
    var validate = (0, react_1.useCallback)(function (values) {
        return (0, ValidationUtils_1.getFieldRequiredErrors)(values, pushRowFieldsIDs);
    }, [pushRowFieldsIDs]);
    return (<FormProvider_1.default formID={formID} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} onSubmit={onSubmit} style={[styles.flexGrow1]} submitButtonStyles={[styles.mh5]} validate={validate}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mh5, styles.mb3]}>{formTitle}</Text_1.default>
            {pushRowFields.map(function (pushRowField) { return (<InputWrapper_1.default key={pushRowField.inputID} InputComponent={PushRowWithModal_1.default} optionsList={pushRowField.options} description={pushRowField.description} modalHeaderTitle={pushRowField.modalHeaderTitle} searchInputTitle={pushRowField.searchInputTitle} inputID={pushRowField.inputID} shouldSaveDraft={!isEditing} defaultValue={pushRowField.defaultValue}/>); })}
        </FormProvider_1.default>);
}
PushRowFieldsStep.displayName = 'PushRowFieldsStep';
exports.default = PushRowFieldsStep;
