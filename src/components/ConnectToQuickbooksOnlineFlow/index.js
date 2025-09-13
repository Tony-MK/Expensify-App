"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useEnvironment_1 = require("@hooks/useEnvironment");
const QuickbooksOnline_1 = require("@libs/actions/connections/QuickbooksOnline");
const Link = require("@userActions/Link");
const PolicyAction = require("@userActions/Policy/Policy");
function ConnectToQuickbooksOnlineFlow({ policyID }) {
    const { environmentURL } = (0, useEnvironment_1.default)();
    (0, react_1.useEffect)(() => {
        // Since QBO doesn't support Taxes, we should disable them from the LHN when connecting to QBO
        PolicyAction.enablePolicyTaxes(policyID, false);
        Link.openLink((0, QuickbooksOnline_1.getQuickbooksOnlineSetupLink)(policyID), environmentURL);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    return null;
}
ConnectToQuickbooksOnlineFlow.displayName = 'ConnectToQuickbooksOnlineFlow';
exports.default = ConnectToQuickbooksOnlineFlow;
