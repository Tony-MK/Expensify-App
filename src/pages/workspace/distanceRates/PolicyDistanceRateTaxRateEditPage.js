"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TaxPicker_1 = require("@components/TaxPicker");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DistanceRate_1 = require("@libs/actions/Policy/DistanceRate");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicy_1 = require("@pages/workspace/withPolicy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function PolicyDistanceRateTaxRateEditPage({ route, policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = route.params.policyID;
    const rateID = route.params.rateID;
    const customUnit = (0, PolicyUtils_1.getDistanceRateCustomUnit)(policy);
    const rate = customUnit?.rates[rateID];
    const taxRateExternalID = rate?.attributes?.taxRateExternalID;
    const selectedTaxRate = taxRateExternalID ? (0, TransactionUtils_1.getWorkspaceTaxesSettingsName)(policy, taxRateExternalID) : undefined;
    const onTaxRateChange = (newTaxRate) => {
        if (taxRateExternalID === newTaxRate.code) {
            Navigation_1.default.goBack();
            return;
        }
        if (!customUnit || !rate) {
            return;
        }
        (0, DistanceRate_1.updateDistanceTaxRate)(policyID, customUnit, [
            {
                ...rate,
                attributes: {
                    ...rate?.attributes,
                    taxRateExternalID: newTaxRate.code,
                },
            },
        ]);
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_DISTANCE_RATE_DETAILS.getRoute(policyID, rateID));
    };
    const dismiss = () => {
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_DISTANCE_RATE_DETAILS.getRoute(policyID, rateID));
    };
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_DISTANCE_RATES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} shouldEnableMaxHeight testID={PolicyDistanceRateTaxRateEditPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.taxes.taxRate')} shouldShowBackButton/>
                <TaxPicker_1.default selectedTaxRate={selectedTaxRate} policyID={policyID} onSubmit={onTaxRateChange} onDismiss={dismiss} addBottomSafeAreaPadding/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
PolicyDistanceRateTaxRateEditPage.displayName = 'PolicyDistanceRateTaxRateEditPage';
exports.default = (0, withPolicy_1.default)(PolicyDistanceRateTaxRateEditPage);
