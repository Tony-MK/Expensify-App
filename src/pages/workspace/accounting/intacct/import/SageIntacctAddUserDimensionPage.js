"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const SageIntacct_1 = require("@libs/actions/connections/SageIntacct");
const ErrorUtils = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const withPolicy_1 = require("@pages/workspace/withPolicy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SageIntacctDimensionsForm_1 = require("@src/types/form/SageIntacctDimensionsForm");
const DimensionTypeSelector_1 = require("./DimensionTypeSelector");
function SageIntacctAddUserDimensionPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id ?? '-1';
    const userDimensions = policy?.connections?.intacct?.config?.mappings?.dimensions;
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        if (!values[SageIntacctDimensionsForm_1.default.INTEGRATION_NAME]) {
            ErrorUtils.addErrorMessage(errors, SageIntacctDimensionsForm_1.default.INTEGRATION_NAME, translate('common.error.fieldRequired'));
        }
        if (userDimensions?.some((userDimension) => userDimension.dimension === values[SageIntacctDimensionsForm_1.default.INTEGRATION_NAME])) {
            ErrorUtils.addErrorMessage(errors, SageIntacctDimensionsForm_1.default.INTEGRATION_NAME, translate('workspace.intacct.dimensionExists'));
        }
        if (!values[SageIntacctDimensionsForm_1.default.DIMENSION_TYPE]) {
            ErrorUtils.addErrorMessage(errors, SageIntacctDimensionsForm_1.default.DIMENSION_TYPE, translate('common.error.fieldRequired'));
        }
        return errors;
    }, [translate, userDimensions]);
    return (<ConnectionLayout_1.default displayName={SageIntacctAddUserDimensionPage.displayName} headerTitle="workspace.intacct.addUserDefinedDimension" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.flex1} shouldUseScrollView={false} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_USER_DIMENSIONS.getRoute(policyID))}>
            <FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.SAGE_INTACCT_DIMENSION_TYPE_FORM} validate={validate} onSubmit={(value) => {
            (0, SageIntacct_1.addSageIntacctUserDimensions)(policyID, value[SageIntacctDimensionsForm_1.default.INTEGRATION_NAME], value[SageIntacctDimensionsForm_1.default.DIMENSION_TYPE], userDimensions ?? []);
            Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_USER_DIMENSIONS.getRoute(policyID));
        }} submitButtonText={translate('common.confirm')} enabledWhenOffline shouldValidateOnBlur shouldValidateOnChange>
                <react_native_1.View style={styles.mb4}>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={SageIntacctDimensionsForm_1.default.INTEGRATION_NAME} label={translate('workspace.intacct.integrationName')} aria-label={translate('workspace.intacct.integrationName')} role={CONST_1.default.ROLE.PRESENTATION} spellCheck={false} ref={inputCallbackRef}/>
                </react_native_1.View>
                <react_native_1.View>
                    <InputWrapper_1.default InputComponent={DimensionTypeSelector_1.default} inputID={SageIntacctDimensionsForm_1.default.DIMENSION_TYPE} aria-label="dimensionTypeSelector"/>
                </react_native_1.View>
            </FormProvider_1.default>
        </ConnectionLayout_1.default>);
}
SageIntacctAddUserDimensionPage.displayName = 'SageIntacctAddUserDimensionPage';
exports.default = (0, withPolicy_1.default)(SageIntacctAddUserDimensionPage);
