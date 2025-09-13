"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useExpensifyCardFeeds_1 = require("@hooks/useExpensifyCardFeeds");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const AccountingUtils_1 = require("@libs/AccountingUtils");
const PolicyConnections_1 = require("@libs/actions/PolicyConnections");
const CardUtils_1 = require("@libs/CardUtils");
const Navigation_1 = require("@navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Card_1 = require("@userActions/Card");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function CardReconciliationPage({ policy, route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const workspaceAccountID = policy?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const policyID = policy?.id;
    const allCardSettings = (0, useExpensifyCardFeeds_1.default)(policyID);
    const { environmentURL } = (0, useEnvironment_1.default)();
    const fullySetUpCardSetting = (0, react_1.useMemo)(() => {
        const entries = Object.entries(allCardSettings ?? {});
        const initialValue = {
            key: '',
            cardSetting: {
                monthlySettlementDate: new Date(),
                isMonthlySettlementAllowed: false,
                paymentBankAccountID: CONST_1.default.DEFAULT_NUMBER_ID,
            },
        };
        return entries.reduce((acc, [key, cardSetting]) => {
            if (cardSetting && (0, CardUtils_1.isExpensifyCardFullySetUp)(policy, cardSetting)) {
                return {
                    key,
                    cardSetting,
                };
            }
            return acc;
        }, initialValue);
    }, [allCardSettings, policy]);
    const domainID = fullySetUpCardSetting.key.split('_').at(-1);
    const effectiveDomainID = Number(domainID ?? workspaceAccountID);
    const [isContinuousReconciliationOn] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.EXPENSIFY_CARD_USE_CONTINUOUS_RECONCILIATION}${effectiveDomainID}`, { canBeMissing: true });
    const [currentConnectionName] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.EXPENSIFY_CARD_CONTINUOUS_RECONCILIATION_CONNECTION}${effectiveDomainID}`, { canBeMissing: true });
    const [bankAccountList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true });
    const paymentBankAccountID = fullySetUpCardSetting.cardSetting?.paymentBankAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const bankAccountTitle = bankAccountList?.[paymentBankAccountID]?.title ?? '';
    const { connection } = route.params;
    const connectionName = (0, AccountingUtils_1.getConnectionNameFromRouteParam)(connection);
    const autoSync = !!policy?.connections?.[connectionName]?.config?.autoSync?.enabled;
    const shouldShow = !!fullySetUpCardSetting.cardSetting?.paymentBankAccountID;
    const handleToggleContinuousReconciliation = (value) => {
        (0, Card_1.toggleContinuousReconciliation)(effectiveDomainID, value, connectionName, currentConnectionName);
        if (value) {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_ACCOUNTING_RECONCILIATION_ACCOUNT_SETTINGS.getRoute(policyID, connection));
        }
    };
    const accountingAdvancedSettingsLink = (0, react_1.useMemo)(() => {
        if (!policyID) {
            return '';
        }
        const backTo = ROUTES_1.default.WORKSPACE_ACCOUNTING_CARD_RECONCILIATION.getRoute(policyID, connection);
        switch (connection) {
            case CONST_1.default.POLICY.CONNECTIONS.ROUTE.QBO:
                return `${environmentURL}/${ROUTES_1.default.WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_AUTO_SYNC.getRoute(policyID, backTo)}`;
            case CONST_1.default.POLICY.CONNECTIONS.ROUTE.XERO:
                return `${environmentURL}/${ROUTES_1.default.POLICY_ACCOUNTING_XERO_AUTO_SYNC.getRoute(policyID, backTo)}`;
            case CONST_1.default.POLICY.CONNECTIONS.ROUTE.NETSUITE:
                return `${environmentURL}/${ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_AUTO_SYNC.getRoute(policyID, backTo)}`;
            case CONST_1.default.POLICY.CONNECTIONS.ROUTE.SAGE_INTACCT:
                return `${environmentURL}/${ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_ADVANCED.getRoute(policyID)}`;
            case CONST_1.default.POLICY.CONNECTIONS.ROUTE.QBD:
                return `${environmentURL}/${ROUTES_1.default.WORKSPACE_ACCOUNTING_QUICKBOOKS_DESKTOP_ADVANCED.getRoute(policyID, backTo)}`;
            default:
                return '';
        }
    }, [connection, policyID, environmentURL]);
    const fetchPolicyAccountingData = (0, react_1.useCallback)(() => {
        if (!policyID) {
            return;
        }
        (0, PolicyConnections_1.openPolicyAccountingPage)(policyID);
    }, [policyID]);
    (0, react_1.useEffect)(() => {
        if (isContinuousReconciliationOn !== undefined) {
            return;
        }
        fetchPolicyAccountingData();
    }, [isContinuousReconciliationOn, fetchPolicyAccountingData]);
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} shouldBeBlocked={!shouldShow}>
            <ScreenWrapper_1.default shouldEnableMaxHeight testID={CardReconciliationPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.accounting.cardReconciliation')}/>
                <ScrollView_1.default contentContainerStyle={styles.pb5} addBottomSafeAreaPadding>
                    <ToggleSettingsOptionRow_1.default key={translate('workspace.accounting.continuousReconciliation')} title={translate('workspace.accounting.continuousReconciliation')} subtitle={translate('workspace.accounting.saveHoursOnReconciliation')} shouldPlaceSubtitleBelowSwitch switchAccessibilityLabel={translate('workspace.accounting.continuousReconciliation')} disabled={!autoSync} isActive={!!isContinuousReconciliationOn} onToggle={handleToggleContinuousReconciliation} wrapperStyle={styles.ph5}/>
                    {!autoSync && (<react_native_1.View style={[styles.renderHTML, styles.ph5, styles.mt2]}>
                            <RenderHTML_1.default html={translate('workspace.accounting.enableContinuousReconciliation', {
                accountingAdvancedSettingsLink,
                connectionName: CONST_1.default.POLICY.CONNECTIONS.NAME_USER_FRIENDLY[connectionName],
            })}/>
                        </react_native_1.View>)}
                    {!!paymentBankAccountID && !!isContinuousReconciliationOn && (<MenuItemWithTopDescription_1.default style={styles.mt5} title={bankAccountTitle} description={translate('workspace.accounting.reconciliationAccount')} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_ACCOUNTING_RECONCILIATION_ACCOUNT_SETTINGS.getRoute(policyID, connection))}/>)}
                </ScrollView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
CardReconciliationPage.displayName = 'CardReconciliationPage';
exports.default = (0, withPolicyConnections_1.default)(CardReconciliationPage);
