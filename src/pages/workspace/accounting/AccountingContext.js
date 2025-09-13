"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingContextProvider = AccountingContextProvider;
exports.useAccountingContext = useAccountingContext;
const react_1 = require("react");
const AccountingConnectionConfirmationModal_1 = require("@components/AccountingConnectionConfirmationModal");
const useLocalize_1 = require("@hooks/useLocalize");
const connections_1 = require("@libs/actions/connections");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const utils_1 = require("./utils");
const popoverAnchorRefsInitialValue = Object.values(CONST_1.default.POLICY.CONNECTIONS.NAME).reduce((acc, key) => {
    acc[key] = { current: null };
    return acc;
}, {});
const defaultAccountingContext = {
    activeIntegration: undefined,
    startIntegrationFlow: () => { },
    popoverAnchorRefs: {
        current: popoverAnchorRefsInitialValue,
    },
};
const AccountingContext = react_1.default.createContext(defaultAccountingContext);
function AccountingContextProvider({ children, policy }) {
    const popoverAnchorRefs = (0, react_1.useRef)(defaultAccountingContext.popoverAnchorRefs.current);
    const [activeIntegration, setActiveIntegration] = (0, react_1.useState)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const startIntegrationFlow = react_1.default.useCallback((newActiveIntegration) => {
        if (!policyID) {
            return;
        }
        const accountingIntegrationData = (0, utils_1.getAccountingIntegrationData)(newActiveIntegration.name, policyID, translate, undefined, undefined, newActiveIntegration.integrationToDisconnect, newActiveIntegration.shouldDisconnectIntegrationBeforeConnecting, undefined);
        const workspaceUpgradeNavigationDetails = accountingIntegrationData?.workspaceUpgradeNavigationDetails;
        if (workspaceUpgradeNavigationDetails && !(0, PolicyUtils_1.isControlPolicy)(policy)) {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policyID, workspaceUpgradeNavigationDetails.integrationAlias, workspaceUpgradeNavigationDetails.backToAfterWorkspaceUpgradeRoute));
            return;
        }
        setActiveIntegration({
            ...newActiveIntegration,
            key: Math.random(),
        });
    }, [policy, policyID, translate]);
    const closeConfirmationModal = () => {
        setActiveIntegration((prev) => {
            if (prev) {
                return {
                    ...prev,
                    shouldDisconnectIntegrationBeforeConnecting: false,
                    integrationToDisconnect: undefined,
                };
            }
            return undefined;
        });
    };
    const accountingContext = (0, react_1.useMemo)(() => ({
        activeIntegration,
        startIntegrationFlow,
        popoverAnchorRefs,
    }), [activeIntegration, startIntegrationFlow]);
    const renderActiveIntegration = () => {
        if (!policyID || !activeIntegration) {
            return null;
        }
        return (0, utils_1.getAccountingIntegrationData)(activeIntegration.name, policyID, translate, policy, activeIntegration.key)?.setupConnectionFlow;
    };
    const shouldShowConfirmationModal = !!activeIntegration?.shouldDisconnectIntegrationBeforeConnecting && !!activeIntegration?.integrationToDisconnect;
    return (<AccountingContext.Provider value={accountingContext}>
            {children}
            {!shouldShowConfirmationModal && renderActiveIntegration()}
            {shouldShowConfirmationModal && (<AccountingConnectionConfirmationModal_1.default onConfirm={() => {
                if (!policyID || !activeIntegration?.integrationToDisconnect) {
                    return;
                }
                (0, connections_1.removePolicyConnection)(policy, activeIntegration?.integrationToDisconnect);
                closeConfirmationModal();
            }} integrationToConnect={activeIntegration?.name} onCancel={() => {
                setActiveIntegration(undefined);
            }}/>)}
        </AccountingContext.Provider>);
}
function useAccountingContext() {
    return (0, react_1.useContext)(AccountingContext);
}
exports.default = AccountingContext;
