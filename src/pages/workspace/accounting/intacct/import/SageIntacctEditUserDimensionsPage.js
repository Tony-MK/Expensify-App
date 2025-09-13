"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const SageIntacct_1 = require("@libs/actions/connections/SageIntacct");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SageIntacctDimensionsForm_1 = require("@src/types/form/SageIntacctDimensionsForm");
const DimensionTypeSelector_1 = require("./DimensionTypeSelector");
function SageIntacctEditUserDimensionsPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const editedUserDimensionName = route.params.dimensionName;
    const policy = (0, usePolicy_1.default)(route.params.policyID);
    const policyID = policy?.id ?? `${CONST_1.default.DEFAULT_NUMBER_ID}`;
    const config = policy?.connections?.intacct?.config;
    const userDimensions = policy?.connections?.intacct?.config?.mappings?.dimensions;
    const editedUserDimension = userDimensions?.find((userDimension) => userDimension.dimension === editedUserDimensionName);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = (0, react_1.useState)(false);
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        if (!values[SageIntacctDimensionsForm_1.default.INTEGRATION_NAME]) {
            (0, ErrorUtils_1.addErrorMessage)(errors, SageIntacctDimensionsForm_1.default.INTEGRATION_NAME, translate('common.error.fieldRequired'));
        }
        if (userDimensions?.some((userDimension) => userDimension.dimension === values[SageIntacctDimensionsForm_1.default.INTEGRATION_NAME] && editedUserDimensionName !== values[SageIntacctDimensionsForm_1.default.INTEGRATION_NAME])) {
            (0, ErrorUtils_1.addErrorMessage)(errors, SageIntacctDimensionsForm_1.default.INTEGRATION_NAME, translate('workspace.intacct.dimensionExists'));
        }
        if (!values[SageIntacctDimensionsForm_1.default.DIMENSION_TYPE]) {
            (0, ErrorUtils_1.addErrorMessage)(errors, SageIntacctDimensionsForm_1.default.DIMENSION_TYPE, translate('common.error.fieldRequired'));
        }
        return errors;
    }, [editedUserDimensionName, translate, userDimensions]);
    return (<ConnectionLayout_1.default displayName={SageIntacctEditUserDimensionsPage.displayName} headerTitleAlreadyTranslated={editedUserDimensionName} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.flex1} shouldUseScrollView={false} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_USER_DIMENSIONS.getRoute(policyID))}>
            <FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.SAGE_INTACCT_DIMENSION_TYPE_FORM} validate={validate} onSubmit={(value) => {
            (0, SageIntacct_1.editSageIntacctUserDimensions)(policyID, editedUserDimensionName, value[SageIntacctDimensionsForm_1.default.INTEGRATION_NAME], value[SageIntacctDimensionsForm_1.default.DIMENSION_TYPE], userDimensions ?? []);
            Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_USER_DIMENSIONS.getRoute(policyID));
        }} submitButtonText={translate('common.save')} enabledWhenOffline shouldValidateOnBlur shouldValidateOnChange>
                <OfflineWithFeedback_1.default pendingAction={(0, PolicyUtils_1.settingsPendingAction)([`${CONST_1.default.SAGE_INTACCT_CONFIG.DIMENSION_PREFIX}${editedUserDimensionName}`], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config ?? {}, `${CONST_1.default.SAGE_INTACCT_CONFIG.DIMENSION_PREFIX}${editedUserDimensionName}`)} errorRowStyles={[styles.pb3]} onClose={() => {
            (0, SageIntacct_1.clearSageIntacctErrorField)(policyID, `${CONST_1.default.SAGE_INTACCT_CONFIG.DIMENSION_PREFIX}${editedUserDimensionName}`);
            const pendingAction = (0, PolicyUtils_1.settingsPendingAction)([`${CONST_1.default.SAGE_INTACCT_CONFIG.DIMENSION_PREFIX}${editedUserDimensionName}`], config?.pendingFields);
            if (pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD) {
                (0, SageIntacct_1.removeSageIntacctUserDimensionsByName)(userDimensions ?? [], policyID, editedUserDimensionName);
                Navigation_1.default.goBack();
            }
            (0, SageIntacct_1.clearSageIntacctPendingField)(policyID, `${CONST_1.default.SAGE_INTACCT_CONFIG.DIMENSION_PREFIX}${editedUserDimensionName}`);
        }}>
                    <react_native_1.View style={[styles.mb4]}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={SageIntacctDimensionsForm_1.default.INTEGRATION_NAME} label={translate('workspace.intacct.integrationName')} aria-label={translate('workspace.intacct.integrationName')} role={CONST_1.default.ROLE.PRESENTATION} spellCheck={false} defaultValue={editedUserDimensionName}/>
                    </react_native_1.View>
                    <react_native_1.View style={[]}>
                        <InputWrapper_1.default InputComponent={DimensionTypeSelector_1.default} inputID={SageIntacctDimensionsForm_1.default.DIMENSION_TYPE} aria-label="dimensionTypeSelector" defaultValue={editedUserDimension?.mapping}/>
                    </react_native_1.View>
                    <react_native_1.View style={[styles.mhn5]}>
                        <MenuItem_1.default title={translate('common.remove')} icon={Expensicons.Trashcan} onPress={() => setIsDeleteModalOpen(true)}/>
                    </react_native_1.View>
                </OfflineWithFeedback_1.default>
                <ConfirmModal_1.default title={translate('workspace.intacct.removeDimension')} isVisible={isDeleteModalOpen} onConfirm={() => {
            setIsDeleteModalOpen(false);
            (0, SageIntacct_1.removeSageIntacctUserDimensions)(policyID, editedUserDimensionName, userDimensions ?? []);
            Navigation_1.default.goBack();
        }} onCancel={() => setIsDeleteModalOpen(false)} prompt={translate('workspace.intacct.removeDimensionPrompt')} confirmText={translate('common.remove')} cancelText={translate('common.cancel')} danger shouldEnableNewFocusManagement/>
            </FormProvider_1.default>
        </ConnectionLayout_1.default>);
}
SageIntacctEditUserDimensionsPage.displayName = 'SageIntacctEditUserDimensionsPage';
exports.default = SageIntacctEditUserDimensionsPage;
