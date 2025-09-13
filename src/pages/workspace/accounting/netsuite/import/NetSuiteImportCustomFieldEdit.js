"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const NetSuiteCommands_1 = require("@libs/actions/connections/NetSuiteCommands");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const NetSuiteCustomFieldMappingPicker_1 = require("./NetSuiteImportCustomFieldNew/NetSuiteCustomFieldMappingPicker");
function NetSuiteImportCustomFieldEdit({ policy, route: { params: { importCustomField, valueIndex, fieldName, policyID }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const config = policy?.connections?.netsuite?.options?.config;
    const allRecords = (0, react_1.useMemo)(() => config?.syncOptions?.[importCustomField] ?? [], [config?.syncOptions, importCustomField]);
    const customField = allRecords[valueIndex];
    const fieldValue = customField?.[fieldName] ?? '';
    const updateRecord = (0, react_1.useCallback)((formValues) => {
        const newValue = formValues[fieldName];
        if (customField) {
            const updatedRecords = allRecords.map((record, index) => {
                if (index === Number(valueIndex)) {
                    return {
                        ...record,
                        [fieldName]: newValue,
                    };
                }
                return record;
            });
            if ((0, PolicyUtils_1.isNetSuiteCustomSegmentRecord)(customField)) {
                (0, NetSuiteCommands_1.updateNetSuiteCustomSegments)(policyID, updatedRecords, allRecords, `${importCustomField}_${valueIndex}`, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
            }
            else {
                (0, NetSuiteCommands_1.updateNetSuiteCustomLists)(policyID, updatedRecords, allRecords, `${importCustomField}_${valueIndex}`, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
            }
        }
        Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_FIELD_VIEW.getRoute(policyID, importCustomField, valueIndex));
    }, [allRecords, customField, fieldName, importCustomField, policyID, valueIndex]);
    const validate = (0, react_1.useCallback)((formValues) => {
        const errors = {};
        const key = fieldName;
        const fieldLabel = translate(`workspace.netsuite.import.importCustomFields.${importCustomField}.fields.${fieldName}`);
        if (!formValues[key]) {
            (0, ErrorUtils_1.addErrorMessage)(errors, fieldName, translate('workspace.netsuite.import.importCustomFields.requiredFieldError', { fieldName: fieldLabel }));
        }
        else if (policy?.connections?.netsuite?.options?.config?.syncOptions?.customSegments?.find((customSegment) => customSegment?.[fieldName]?.toLowerCase() === formValues[key].toLowerCase())) {
            (0, ErrorUtils_1.addErrorMessage)(errors, fieldName, translate('workspace.netsuite.import.importCustomFields.customSegments.errors.uniqueFieldError', { fieldName: fieldLabel }));
        }
        return errors;
    }, [fieldName, importCustomField, policy?.connections?.netsuite?.options?.config?.syncOptions?.customSegments, translate]);
    const renderForm = (0, react_1.useMemo)(() => !!customField && (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.NETSUITE_CUSTOM_FIELD_FORM} style={[styles.flexGrow1, styles.ph5]} validate={validate} onSubmit={updateRecord} submitButtonText={translate('common.save')} shouldValidateOnBlur shouldValidateOnChange isSubmitDisabled={!!(0, PolicyUtils_1.settingsPendingAction)([`${importCustomField}_${valueIndex}`], config?.pendingFields)} shouldHideFixErrorsAlert>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={fieldName} label={translate(`workspace.netsuite.import.importCustomFields.${importCustomField}.fields.${fieldName}`)} aria-label={translate(`workspace.netsuite.import.importCustomFields.${importCustomField}.fields.${fieldName}`)} role={CONST_1.default.ROLE.PRESENTATION} spellCheck={false} defaultValue={fieldValue ?? ''} ref={inputCallbackRef}/>
                </FormProvider_1.default>), [config?.pendingFields, customField, fieldName, fieldValue, importCustomField, inputCallbackRef, styles.flexGrow1, styles.ph5, translate, updateRecord, validate, valueIndex]);
    const renderSelection = (0, react_1.useMemo)(() => !!customField && (<NetSuiteCustomFieldMappingPicker_1.default onInputChange={(value) => {
            updateRecord({
                [fieldName]: value,
            });
        }} value={fieldValue}/>), [customField, fieldName, fieldValue, updateRecord]);
    const renderMap = {
        mapping: renderSelection,
    };
    return (<ConnectionLayout_1.default displayName={NetSuiteImportCustomFieldEdit.displayName} headerTitle={`workspace.netsuite.import.importCustomFields.${importCustomField}.fields.${fieldName}`} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.pb2, styles.flex1]} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} shouldBeBlocked={!customField || !(0, PolicyUtils_1.isNetSuiteCustomFieldPropertyEditable)(customField, fieldName)} shouldUseScrollView={false}>
            {renderMap[fieldName] || renderForm}
        </ConnectionLayout_1.default>);
}
NetSuiteImportCustomFieldEdit.displayName = 'NetSuiteImportCustomFieldEdit';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteImportCustomFieldEdit);
