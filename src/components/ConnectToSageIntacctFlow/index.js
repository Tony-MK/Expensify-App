"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const connections_1 = require("@libs/actions/connections");
const Policy_1 = require("@libs/actions/Policy/Policy");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function ConnectToSageIntacctFlow({ policyID }) {
    const hasPoliciesConnectedToSageIntacct = !!(0, Policy_1.getAdminPoliciesConnectedToSageIntacct)().length;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`);
    const shouldGoToEnterCredentials = (0, connections_1.isAuthenticationError)(policy, CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT);
    (0, react_1.useEffect)(() => {
        if (shouldGoToEnterCredentials) {
            Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_ENTER_CREDENTIALS.getRoute(policyID));
            return;
        }
        if (!hasPoliciesConnectedToSageIntacct) {
            Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_PREREQUISITES.getRoute(policyID));
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_EXISTING_CONNECTIONS.getRoute(policyID));
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    return null;
}
exports.default = ConnectToSageIntacctFlow;
