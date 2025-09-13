"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const connections_1 = require("@libs/actions/connections");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function QuickBooksDesktopSetupFlowSyncPage({ route }) {
    const policyID = route.params.policyID;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID ?? '-1'}`);
    const [connectionSyncProgress] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS}${policyID ?? '-1'}`);
    (0, react_1.useEffect)(() => {
        if (!policyID) {
            return;
        }
        const isSyncInProgress = (0, connections_1.isConnectionInProgress)(connectionSyncProgress, policy);
        if (!isSyncInProgress) {
            (0, connections_1.syncConnection)(policy, CONST_1.default.POLICY.CONNECTIONS.NAME.QBD, true);
        }
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_ACCOUNTING.getRoute(policyID));
        // disabling this rule, as we want this to run only on the first render
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    return null;
}
QuickBooksDesktopSetupFlowSyncPage.displayName = 'QuickBooksDesktopSetupFlowSyncPage';
exports.default = QuickBooksDesktopSetupFlowSyncPage;
