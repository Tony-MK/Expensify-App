"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const PerDiem_1 = require("@userActions/Policy/PerDiem");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function WorkspacePerDiemDetailsPage({ route }) {
    const policyID = route.params.policyID;
    const rateID = route.params.rateID;
    const subRateID = route.params.subRateID;
    const [deletePerDiemConfirmModalVisible, setDeletePerDiemConfirmModalVisible] = (0, react_1.useState)(false);
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: false });
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const customUnit = (0, PolicyUtils_1.getPerDiemCustomUnit)(policy);
    const selectedRate = customUnit?.rates?.[rateID];
    const fetchedSubRate = selectedRate?.subRates?.find((subRate) => subRate.id === subRateID);
    const previousFetchedSubRate = (0, usePrevious_1.default)(fetchedSubRate);
    const selectedSubRate = fetchedSubRate ?? previousFetchedSubRate;
    const amountValue = selectedSubRate?.rate ? (0, CurrencyUtils_1.convertToDisplayStringWithoutCurrency)(Number(selectedSubRate.rate)) : undefined;
    const currencyValue = selectedRate?.currency ? `${selectedRate.currency} - ${(0, CurrencyUtils_1.getCurrencySymbol)(selectedRate.currency)}` : undefined;
    const handleDeletePerDiemRate = () => {
        (0, PerDiem_1.deleteWorkspacePerDiemRates)(policyID, customUnit, [
            {
                destination: selectedRate?.name ?? '',
                subRateName: selectedSubRate?.name ?? '',
                rate: selectedSubRate?.rate ?? 0,
                currency: selectedRate?.currency ?? '',
                rateID,
                subRateID,
            },
        ]);
        setDeletePerDiemConfirmModalVisible(false);
        Navigation_1.default.goBack();
    };
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_PER_DIEM_RATES_ENABLED} shouldBeBlocked={(0, EmptyObject_1.isEmptyObject)(selectedSubRate)}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={WorkspacePerDiemDetailsPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.perDiem.editPerDiemRate')}/>
                <ConfirmModal_1.default isVisible={deletePerDiemConfirmModalVisible} onConfirm={handleDeletePerDiemRate} onCancel={() => setDeletePerDiemConfirmModalVisible(false)} title={translate('workspace.perDiem.deletePerDiemRate')} prompt={translate('workspace.perDiem.areYouSureDelete', { count: 1 })} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
                <ScrollView_1.default addBottomSafeAreaPadding contentContainerStyle={styles.flexGrow1} keyboardShouldPersistTaps="always">
                    <MenuItemWithTopDescription_1.default title={selectedRate?.name} description={translate('common.destination')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_PER_DIEM_EDIT_DESTINATION.getRoute(policyID, rateID, subRateID))} shouldShowRightIcon/>
                    <MenuItemWithTopDescription_1.default title={selectedSubRate?.name} description={translate('common.subrate')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_PER_DIEM_EDIT_SUBRATE.getRoute(policyID, rateID, subRateID))} shouldShowRightIcon/>
                    <MenuItemWithTopDescription_1.default title={amountValue} description={translate('workspace.perDiem.amount')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_PER_DIEM_EDIT_AMOUNT.getRoute(policyID, rateID, subRateID))} shouldShowRightIcon/>
                    <MenuItemWithTopDescription_1.default title={currencyValue} description={translate('common.currency')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_PER_DIEM_EDIT_CURRENCY.getRoute(policyID, rateID, subRateID))} shouldShowRightIcon/>
                    <MenuItem_1.default icon={Expensicons.Trashcan} title={translate('common.delete')} onPress={() => setDeletePerDiemConfirmModalVisible(true)}/>
                </ScrollView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspacePerDiemDetailsPage.displayName = 'WorkspacePerDiemDetailsPage';
exports.default = WorkspacePerDiemDetailsPage;
