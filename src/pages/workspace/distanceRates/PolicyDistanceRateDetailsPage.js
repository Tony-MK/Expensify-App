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
const ScrollView_1 = require("@components/ScrollView");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const DistanceRate_1 = require("@userActions/Policy/DistanceRate");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function PolicyDistanceRateDetailsPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [isWarningModalVisible, setIsWarningModalVisible] = (0, react_1.useState)(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = (0, react_1.useState)(false);
    const policyID = route.params.policyID;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${route.params.policyID}`, { canBeMissing: true });
    const rateID = route.params.rateID;
    const customUnit = (0, PolicyUtils_1.getDistanceRateCustomUnit)(policy);
    const rate = customUnit?.rates[rateID];
    const customUnitID = customUnit?.customUnitID;
    const [policyReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, {
        selector: (reports) => {
            return Object.values(reports ?? {}).reduce((reportIDs, report) => {
                if (report && report.policyID === policyID) {
                    reportIDs.add(report.reportID);
                }
                return reportIDs;
            }, new Set());
        },
        canBeMissing: true,
    });
    const [eligibleTransactionIDs] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
        selector: (transactions) => {
            return Object.values(transactions ?? {}).reduce((transactionIDs, transaction) => {
                if (transaction &&
                    transaction.reportID &&
                    policyReports?.has(transaction.reportID) &&
                    customUnitID &&
                    transaction?.comment?.customUnit?.customUnitID === customUnitID &&
                    transaction?.comment?.customUnit?.customUnitRateID &&
                    transaction?.comment?.customUnit?.customUnitRateID === rateID) {
                    transactionIDs.add(transaction?.transactionID);
                }
                return transactionIDs;
            }, new Set());
        },
        canBeMissing: true,
    });
    const [transactionViolations] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, {
        selector: (violations) => {
            if (!eligibleTransactionIDs || eligibleTransactionIDs.size === 0) {
                return undefined;
            }
            return Object.fromEntries(Object.entries(violations ?? {}).filter(([key]) => {
                const id = key.replace(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, '');
                return eligibleTransactionIDs?.has(id);
            }));
        },
        canBeMissing: true,
    });
    const currency = rate?.currency ?? CONST_1.default.CURRENCY.USD;
    const taxClaimablePercentage = rate?.attributes?.taxClaimablePercentage;
    const taxRateExternalID = rate?.attributes?.taxRateExternalID;
    const isDistanceTrackTaxEnabled = !!customUnit?.attributes?.taxEnabled;
    const isPolicyTrackTaxEnabled = !!policy?.tax?.trackingEnabled;
    const taxRate = taxRateExternalID && policy?.taxRates?.taxes[taxRateExternalID] ? `${policy?.taxRates?.taxes[taxRateExternalID]?.name} (${policy?.taxRates?.taxes[taxRateExternalID]?.value})` : '';
    // Rates can be disabled or deleted as long as in the remaining rates there is always at least one enabled rate and there are no pending delete action
    const canDisableOrDeleteRate = Object.values(customUnit?.rates ?? {}).some((distanceRate) => distanceRate?.enabled && rateID !== distanceRate?.customUnitRateID && distanceRate?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
    const errorFields = rate?.errorFields;
    if (!rate) {
        return <NotFoundPage_1.default />;
    }
    const editRateName = () => {
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_DISTANCE_RATE_NAME_EDIT.getRoute(policyID, rateID));
    };
    const editRateValue = () => {
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_DISTANCE_RATE_EDIT.getRoute(policyID, rateID));
    };
    const editTaxReclaimableValue = () => {
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_DISTANCE_RATE_TAX_RECLAIMABLE_ON_EDIT.getRoute(policyID, rateID));
    };
    const editTaxRateValue = () => {
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_DISTANCE_RATE_TAX_RATE_EDIT.getRoute(policyID, rateID));
    };
    const toggleRate = () => {
        if (!rate?.enabled || canDisableOrDeleteRate) {
            (0, DistanceRate_1.setPolicyDistanceRatesEnabled)(policyID, customUnit, [{ ...rate, enabled: !rate?.enabled }]);
        }
        else {
            setIsWarningModalVisible(true);
        }
    };
    const deleteRate = () => {
        Navigation_1.default.goBack();
        (0, DistanceRate_1.deletePolicyDistanceRates)(policyID, customUnit, [rateID], Array.from(eligibleTransactionIDs ?? []), transactionViolations);
        setIsDeleteModalVisible(false);
    };
    const rateValueToDisplay = (0, CurrencyUtils_1.convertAmountToDisplayString)(rate?.rate, currency);
    const taxClaimableValueToDisplay = taxClaimablePercentage && rate.rate ? (0, CurrencyUtils_1.convertAmountToDisplayString)(taxClaimablePercentage * rate.rate, currency) : '';
    const unitToDisplay = translate(`common.${customUnit?.attributes?.unit ?? CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES}`);
    const clearErrorFields = (fieldName) => {
        (0, DistanceRate_1.clearPolicyDistanceRateErrorFields)(policyID, customUnit.customUnitID, rateID, { ...errorFields, [fieldName]: null });
    };
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_DISTANCE_RATES_ENABLED}>
            <ScreenWrapper_1.default testID={PolicyDistanceRateDetailsPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]}>
                <HeaderWithBackButton_1.default title={`${rateValueToDisplay} / ${translate(`common.${customUnit?.attributes?.unit ?? CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES}`)}`}/>
                <ScrollView_1.default contentContainerStyle={styles.flexGrow1} addBottomSafeAreaPadding>
                    <OfflineWithFeedback_1.default errors={(0, ErrorUtils_1.getLatestErrorField)(rate ?? {}, 'enabled')} pendingAction={rate?.pendingFields?.enabled} errorRowStyles={styles.mh5} onClose={() => clearErrorFields('enabled')}>
                        <react_native_1.View style={[styles.flexRow, styles.justifyContentBetween, styles.p5]}>
                            <Text_1.default>{translate('workspace.distanceRates.enableRate')}</Text_1.default>
                            <Switch_1.default isOn={rate?.enabled ?? false} onToggle={toggleRate} accessibilityLabel={translate('workspace.distanceRates.enableRate')} showLockIcon={!canDisableOrDeleteRate}/>
                        </react_native_1.View>
                    </OfflineWithFeedback_1.default>
                    <OfflineWithFeedback_1.default errors={(0, ErrorUtils_1.getLatestErrorField)(rate ?? {}, 'name')} pendingAction={rate?.pendingFields?.name} errorRowStyles={styles.mh5} onClose={() => clearErrorFields('name')}>
                        <MenuItemWithTopDescription_1.default shouldShowRightIcon title={rate.name} description={translate('common.name')} descriptionTextStyle={styles.textNormal} onPress={editRateName}/>
                    </OfflineWithFeedback_1.default>
                    <OfflineWithFeedback_1.default errors={(0, ErrorUtils_1.getLatestErrorField)(rate ?? {}, 'rate')} pendingAction={rate?.pendingFields?.rate ?? rate?.pendingFields?.currency} errorRowStyles={styles.mh5} onClose={() => clearErrorFields('rate')}>
                        <MenuItemWithTopDescription_1.default shouldShowRightIcon title={`${rateValueToDisplay} / ${unitToDisplay}`} description={translate('workspace.distanceRates.rate')} descriptionTextStyle={styles.textNormal} onPress={editRateValue}/>
                    </OfflineWithFeedback_1.default>
                    {isDistanceTrackTaxEnabled && isPolicyTrackTaxEnabled && (<OfflineWithFeedback_1.default errors={(0, ErrorUtils_1.getLatestErrorField)(rate, 'taxRateExternalID')} pendingAction={rate?.pendingFields?.taxRateExternalID} errorRowStyles={styles.mh5} onClose={() => clearErrorFields('taxRateExternalID')}>
                            <react_native_1.View style={styles.w100}>
                                <MenuItemWithTopDescription_1.default title={taxRate} description={translate('workspace.taxes.taxRate')} shouldShowRightIcon onPress={editTaxRateValue}/>
                            </react_native_1.View>
                        </OfflineWithFeedback_1.default>)}
                    {isDistanceTrackTaxEnabled && !!taxRate && isPolicyTrackTaxEnabled && (<OfflineWithFeedback_1.default errors={(0, ErrorUtils_1.getLatestErrorField)(rate, 'taxClaimablePercentage')} pendingAction={rate?.pendingFields?.taxClaimablePercentage} errorRowStyles={styles.mh5} onClose={() => clearErrorFields('taxClaimablePercentage')}>
                            <MenuItemWithTopDescription_1.default shouldShowRightIcon title={taxClaimableValueToDisplay} description={translate('workspace.taxes.taxReclaimableOn')} descriptionTextStyle={styles.textNormal} onPress={editTaxReclaimableValue}/>
                        </OfflineWithFeedback_1.default>)}
                    <MenuItem_1.default icon={Expensicons.Trashcan} title={translate('common.delete')} onPress={() => {
            if (canDisableOrDeleteRate) {
                setIsDeleteModalVisible(true);
                return;
            }
            setIsWarningModalVisible(true);
        }}/>
                    <ConfirmModal_1.default onConfirm={() => setIsWarningModalVisible(false)} onCancel={() => setIsWarningModalVisible(false)} isVisible={isWarningModalVisible} title={translate('workspace.distanceRates.oopsNotSoFast')} prompt={translate('workspace.distanceRates.workspaceNeeds')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>
                    <ConfirmModal_1.default title={translate('workspace.distanceRates.deleteDistanceRate')} isVisible={isDeleteModalVisible} onConfirm={deleteRate} onCancel={() => setIsDeleteModalVisible(false)} prompt={translate('workspace.distanceRates.areYouSureDelete', { count: 1 })} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
                </ScrollView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
PolicyDistanceRateDetailsPage.displayName = 'PolicyDistanceRateDetailsPage';
exports.default = PolicyDistanceRateDetailsPage;
