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
const useNetSuiteImportAddCustomSegmentForm_1 = require("@hooks/useNetSuiteImportAddCustomSegmentForm");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Parser_1 = require("@libs/Parser");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const NetSuiteCustomFieldForm_1 = require("@src/types/form/NetSuiteCustomFieldForm");
const STEP_FIELDS = [NetSuiteCustomFieldForm_1.default.INTERNAL_ID];
function CustomSegmentInternalIdStep({ customSegmentType, onNext, isEditing, netSuiteCustomFieldFormValues, customSegments }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const customSegmentRecordType = customSegmentType ?? CONST_1.default.NETSUITE_CUSTOM_RECORD_TYPES.CUSTOM_SEGMENT;
    const fieldLabel = translate(`workspace.netsuite.import.importCustomFields.customSegments.fields.internalID`);
    const handleSubmit = (0, useNetSuiteImportAddCustomSegmentForm_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: true,
    });
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(values[NetSuiteCustomFieldForm_1.default.INTERNAL_ID])) {
            errors[NetSuiteCustomFieldForm_1.default.INTERNAL_ID] = translate('workspace.netsuite.import.importCustomFields.requiredFieldError', { fieldName: fieldLabel });
        }
        else if (customSegments?.find((customSegment) => customSegment.internalID.toLowerCase() === values[NetSuiteCustomFieldForm_1.default.INTERNAL_ID].toLowerCase())) {
            errors[NetSuiteCustomFieldForm_1.default.INTERNAL_ID] = translate('workspace.netsuite.import.importCustomFields.customSegments.errors.uniqueFieldError', { fieldName: fieldLabel });
        }
        return errors;
    }, [customSegments, translate, fieldLabel]);
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.NETSUITE_CUSTOM_SEGMENT_ADD_FORM} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} onSubmit={handleSubmit} validate={validate} style={[styles.flexGrow1]} submitButtonStyles={[styles.ph5, styles.mb0]} enabledWhenOffline submitFlexEnabled shouldUseScrollView shouldHideFixErrorsAlert addBottomSafeAreaPadding>
            <react_native_1.View style={styles.ph5}>
                <Text_1.default style={[styles.mb3, styles.textHeadlineLineHeightXXL]}>
                    {translate(`workspace.netsuite.import.importCustomFields.customSegments.addForm.customSegmentInternalIDTitle`)}
                </Text_1.default>

                <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={NetSuiteCustomFieldForm_1.default.INTERNAL_ID} label={fieldLabel} aria-label={fieldLabel} role={CONST_1.default.ROLE.PRESENTATION} spellCheck={false} ref={inputCallbackRef} defaultValue={netSuiteCustomFieldFormValues[NetSuiteCustomFieldForm_1.default.INTERNAL_ID]}/>
                <react_native_1.View style={[styles.flex1, styles.mv3, styles.renderHTML, styles.textDecorationSkipInkNone]}>
                    <RenderHTML_1.default html={`<comment>${Parser_1.default.replace(translate(`workspace.netsuite.import.importCustomFields.customSegments.addForm.${customSegmentRecordType}InternalIDFooter`))}</comment>`}/>
                </react_native_1.View>
            </react_native_1.View>
        </FormProvider_1.default>);
}
CustomSegmentInternalIdStep.displayName = 'CustomSegmentInternalIdStep';
exports.default = CustomSegmentInternalIdStep;
