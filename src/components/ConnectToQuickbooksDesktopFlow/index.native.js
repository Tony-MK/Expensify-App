"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ROUTES_1 = require("@src/ROUTES");
function ConnectToQuickbooksDesktopFlow({ policyID }) {
    (0, react_1.useEffect)(() => {
        Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_SETUP_REQUIRED_DEVICE_MODAL.getRoute(policyID));
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    return null;
}
ConnectToQuickbooksDesktopFlow.displayName = 'ConnectToQuickbooksDesktopFlow';
exports.default = ConnectToQuickbooksDesktopFlow;
