"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const TaxRate_1 = require("@libs/actions/TaxRate");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceEditTaxPage({ route: { params: { policyID, taxID }, }, policy, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const currentTaxID = (0, PolicyUtils_1.getCurrentTaxID)(policy, taxID);
    const currentTaxRate = currentTaxID && policy?.taxRates?.taxes?.[currentTaxID];
    const [isDeleteModalVisible, setIsDeleteModalVisible] = (0, react_1.useState)(false);
    const canEditTaxRate = policy && (0, PolicyUtils_1.canEditTaxRate)(policy, currentTaxID ?? taxID);
    const shouldShowDeleteMenuItem = canEditTaxRate && !(0, PolicyUtils_1.hasAccountingConnections)(policy);
    const toggleTaxRate = () => {
        if (!currentTaxRate) {
            return;
        }
        (0, TaxRate_1.setPolicyTaxesEnabled)(policy, [taxID], !!currentTaxRate.isDisabled);
    };
    (0, react_1.useEffect)(() => {
        if (currentTaxID === taxID || !currentTaxID) {
            return;
        }
        Navigation_1.default.setParams({ taxID: currentTaxID });
    }, [taxID, currentTaxID]);
    const deleteTaxRate = () => {
        if (!policyID) {
            return;
        }
        (0, TaxRate_1.deletePolicyTaxes)(policy, [taxID], localeCompare);
        setIsDeleteModalVisible(false);
        Navigation_1.default.goBack();
    };
    if (!currentTaxRate) {
        return <NotFoundPage_1.default />;
    }
    const taxCodeToShow = (0, PolicyUtils_1.isControlPolicy)(policy) ? taxID : '';
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_TAXES_ENABLED}>
            <ScreenWrapper_1.default testID={WorkspaceEditTaxPage.displayName} style={styles.mb5}>
                <react_native_1.View style={[styles.h100, styles.flex1]}>
                    <HeaderWithBackButton_1.default title={currentTaxRate?.name}/>
                    <OfflineWithFeedback_1.default errors={(0, ErrorUtils_1.getLatestErrorField)(currentTaxRate, 'isDisabled')} pendingAction={currentTaxRate?.pendingFields?.isDisabled} errorRowStyles={styles.mh5} onClose={() => (0, TaxRate_1.clearTaxRateFieldError)(policyID, taxID, 'isDisabled')}>
                        <react_native_1.View style={[styles.mt2, styles.mh5]}>
                            <react_native_1.View style={[styles.flexRow, styles.mb5, styles.mr2, styles.alignItemsCenter, styles.justifyContentBetween]}>
                                <Text_1.default>{translate('workspace.taxes.actions.enable')}</Text_1.default>
                                <Switch_1.default isOn={!currentTaxRate?.isDisabled} accessibilityLabel={translate('workspace.taxes.actions.enable')} onToggle={toggleTaxRate} disabled={!canEditTaxRate}/>
                            </react_native_1.View>
                        </react_native_1.View>
                    </OfflineWithFeedback_1.default>
                    <OfflineWithFeedback_1.default errors={(0, ErrorUtils_1.getLatestErrorField)(currentTaxRate, 'name')} pendingAction={currentTaxRate?.pendingFields?.name} errorRowStyles={styles.mh5} onClose={() => (0, TaxRate_1.clearTaxRateFieldError)(policyID, taxID, 'name')}>
                        <MenuItemWithTopDescription_1.default shouldShowRightIcon title={currentTaxRate?.name} description={translate('common.name')} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_TAX_NAME.getRoute(`${policyID}`, taxID))}/>
                    </OfflineWithFeedback_1.default>
                    <OfflineWithFeedback_1.default errors={(0, ErrorUtils_1.getLatestErrorField)(currentTaxRate, 'value')} pendingAction={currentTaxRate?.pendingFields?.value} errorRowStyles={styles.mh5} onClose={() => (0, TaxRate_1.clearTaxRateFieldError)(policyID, taxID, 'value')}>
                        <MenuItemWithTopDescription_1.default shouldShowRightIcon title={currentTaxRate?.value} description={translate('workspace.taxes.value')} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_TAX_VALUE.getRoute(`${policyID}`, taxID))}/>
                    </OfflineWithFeedback_1.default>
                    <OfflineWithFeedback_1.default errors={(0, ErrorUtils_1.getLatestErrorField)(currentTaxRate, 'code')} pendingAction={currentTaxRate?.pendingFields?.code} errorRowStyles={styles.mh5} onClose={() => (0, TaxRate_1.clearTaxRateFieldError)(policyID, taxID, 'code')}>
                        <MenuItemWithTopDescription_1.default shouldShowRightIcon title={taxCodeToShow} description={translate('workspace.taxes.taxCode')} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={() => {
            if (!(0, PolicyUtils_1.isControlPolicy)(policy)) {
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policyID, CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.taxCodes.alias, ROUTES_1.default.WORKSPACE_TAX_CODE.getRoute(`${policyID}`, taxID)));
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_TAX_CODE.getRoute(`${policyID}`, taxID));
        }}/>
                    </OfflineWithFeedback_1.default>
                    {!!shouldShowDeleteMenuItem && (<MenuItem_1.default icon={Expensicons.Trashcan} title={translate('common.delete')} onPress={() => setIsDeleteModalVisible(true)}/>)}
                </react_native_1.View>
                <ConfirmModal_1.default title={translate('workspace.taxes.actions.delete')} isVisible={isDeleteModalVisible} onConfirm={deleteTaxRate} onCancel={() => setIsDeleteModalVisible(false)} prompt={translate('workspace.taxes.deleteTaxConfirmation')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceEditTaxPage.displayName = 'WorkspaceEditTaxPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceEditTaxPage);
