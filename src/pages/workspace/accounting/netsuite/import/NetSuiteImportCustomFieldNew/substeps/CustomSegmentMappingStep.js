"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetSuiteImportAddCustomSegmentForm_1 = require("@hooks/useNetSuiteImportAddCustomSegmentForm");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils = require("@libs/ValidationUtils");
const NetSuiteCustomFieldMappingPicker_1 = require("@pages/workspace/accounting/netsuite/import/NetSuiteImportCustomFieldNew/NetSuiteCustomFieldMappingPicker");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const NetSuiteCustomFieldForm_1 = require("@src/types/form/NetSuiteCustomFieldForm");
const STEP_FIELDS = [NetSuiteCustomFieldForm_1.default.MAPPING];
function CustomSegmentMappingStep({ importCustomField, customSegmentType, onNext, isEditing, netSuiteCustomFieldFormValues }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    // reminder to change the validation logic at the last phase of PR
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        if (!ValidationUtils.isRequiredFulfilled(values[NetSuiteCustomFieldForm_1.default.MAPPING])) {
            errors[NetSuiteCustomFieldForm_1.default.MAPPING] = translate('common.error.pleaseSelectOne');
        }
        return errors;
    }, [translate]);
    const handleSubmit = (0, useNetSuiteImportAddCustomSegmentForm_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: true,
    });
    let titleKey;
    if (importCustomField === CONST_1.default.NETSUITE_CONFIG.IMPORT_CUSTOM_FIELDS.CUSTOM_LISTS) {
        titleKey = 'workspace.netsuite.import.importCustomFields.customLists.addForm.mappingTitle';
    }
    else {
        const customSegmentRecordType = customSegmentType ?? CONST_1.default.NETSUITE_CUSTOM_RECORD_TYPES.CUSTOM_SEGMENT;
        titleKey = `workspace.netsuite.import.importCustomFields.customSegments.addForm.${customSegmentRecordType}MappingTitle`;
    }
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.NETSUITE_CUSTOM_SEGMENT_ADD_FORM} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} onSubmit={handleSubmit} validate={validate} style={[styles.flexGrow1]} submitButtonStyles={[styles.ph5, styles.mb0]} enabledWhenOffline shouldUseScrollView={false} shouldHideFixErrorsAlert submitFlexEnabled={false} addBottomSafeAreaPadding>
            <Text_1.default style={[styles.ph5, styles.textHeadlineLineHeightXXL, styles.mb3]}>{translate(titleKey)}</Text_1.default>
            <Text_1.default style={[styles.ph5, styles.mb3]}>{translate(`workspace.netsuite.import.importCustomFields.chooseOptionBelow`)}</Text_1.default>
            <InputWrapper_1.default InputComponent={NetSuiteCustomFieldMappingPicker_1.default} inputID={NetSuiteCustomFieldForm_1.default.MAPPING} defaultValue={netSuiteCustomFieldFormValues[NetSuiteCustomFieldForm_1.default.MAPPING]}/>
        </FormProvider_1.default>);
}
CustomSegmentMappingStep.displayName = 'CustomSegmentMappingStep';
exports.default = CustomSegmentMappingStep;
