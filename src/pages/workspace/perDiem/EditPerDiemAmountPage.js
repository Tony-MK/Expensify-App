"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AmountWithoutCurrencyInput_1 = require("@components/AmountWithoutCurrencyInput");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const PerDiem_1 = require("@userActions/Policy/PerDiem");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const WorkspacePerDiemForm_1 = require("@src/types/form/WorkspacePerDiemForm");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function EditPerDiemAmountPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = route.params.policyID;
    const rateID = route.params.rateID;
    const subRateID = route.params.subRateID;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true });
    const customUnit = (0, PolicyUtils_1.getPerDiemCustomUnit)(policy);
    const selectedRate = customUnit?.rates?.[rateID];
    const selectedSubrate = selectedRate?.subRates?.find((subRate) => subRate.id === subRateID);
    const defaultAmount = selectedSubrate?.rate ? (0, CurrencyUtils_1.convertToFrontendAmountAsString)(Number(selectedSubrate.rate)) : undefined;
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        const newAmount = values.amount.trim();
        const backendAmount = newAmount ? (0, CurrencyUtils_1.convertToBackendAmount)(Number(newAmount)) : 0;
        if (backendAmount === 0 || newAmount === '-') {
            errors.amount = translate('common.error.fieldRequired');
        }
        return errors;
    }, [translate]);
    const editAmount = (0, react_1.useCallback)((values) => {
        const newAmount = values.amount.trim();
        const backendAmount = newAmount ? (0, CurrencyUtils_1.convertToBackendAmount)(Number(newAmount)) : 0;
        if (backendAmount !== Number(selectedSubrate?.rate)) {
            (0, PerDiem_1.editPerDiemRateAmount)(policyID, rateID, subRateID, customUnit, backendAmount);
        }
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_PER_DIEM_DETAILS.getRoute(policyID, rateID, subRateID));
    }, [selectedSubrate?.rate, policyID, rateID, subRateID, customUnit]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_PER_DIEM_RATES_ENABLED} shouldBeBlocked={!policyID || !rateID || (0, EmptyObject_1.isEmptyObject)(selectedRate) || (0, EmptyObject_1.isEmptyObject)(selectedSubrate)}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={EditPerDiemAmountPage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.perDiem.amount')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_PER_DIEM_DETAILS.getRoute(policyID, rateID, subRateID))}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_PER_DIEM_FORM} validate={validate} onSubmit={editAmount} submitButtonText={translate('common.save')} style={[styles.mh5, styles.flex1]} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <InputWrapper_1.default ref={inputCallbackRef} InputComponent={AmountWithoutCurrencyInput_1.default} defaultValue={defaultAmount} label={translate('workspace.perDiem.amount')} accessibilityLabel={translate('workspace.perDiem.amount')} inputID={WorkspacePerDiemForm_1.default.AMOUNT} role={CONST_1.default.ROLE.PRESENTATION} shouldAllowNegative uncontrolled/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
EditPerDiemAmountPage.displayName = 'EditPerDiemAmountPage';
exports.default = EditPerDiemAmountPage;
