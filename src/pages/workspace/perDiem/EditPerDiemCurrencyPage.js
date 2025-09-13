"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const CurrencySelectionList_1 = require("@components/CurrencySelectionList");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const PerDiem_1 = require("@libs/actions/Policy/PerDiem");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function EditPerDiemCurrencyPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = route.params.policyID;
    const rateID = route.params.rateID;
    const subRateID = route.params.subRateID;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true });
    const customUnit = (0, PolicyUtils_1.getPerDiemCustomUnit)(policy);
    const selectedRate = customUnit?.rates?.[rateID];
    const editCurrency = (0, react_1.useCallback)((item) => {
        const newCurrency = item.currencyCode;
        if (newCurrency !== selectedRate?.currency) {
            (0, PerDiem_1.editPerDiemRateCurrency)(policyID, rateID, customUnit, newCurrency);
        }
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_PER_DIEM_DETAILS.getRoute(policyID, rateID, subRateID));
    }, [selectedRate?.currency, policyID, rateID, subRateID, customUnit]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_PER_DIEM_RATES_ENABLED} shouldBeBlocked={!policyID || !rateID || (0, EmptyObject_1.isEmptyObject)(selectedRate)}>
            <ScreenWrapper_1.default shouldEnableKeyboardAvoidingView={false} enableEdgeToEdgeBottomSafeAreaPadding testID={EditPerDiemCurrencyPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('common.currency')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_PER_DIEM_DETAILS.getRoute(policyID, rateID, subRateID))}/>
                <react_native_1.View style={[styles.pb4, styles.mh5]}>
                    <Text_1.default style={[styles.sidebarLinkText, styles.optionAlternateText]}>{translate('workspace.perDiem.editCurrencySubtitle', { destination: selectedRate?.name ?? '' })}</Text_1.default>
                </react_native_1.View>
                <CurrencySelectionList_1.default initiallySelectedCurrencyCode={selectedRate?.currency} onSelect={editCurrency} searchInputLabel={translate('common.search')} addBottomSafeAreaPadding/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
EditPerDiemCurrencyPage.displayName = 'EditPerDiemCurrencyPage';
exports.default = EditPerDiemCurrencyPage;
