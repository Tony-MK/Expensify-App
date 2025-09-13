"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Browser_1 = require("@libs/Browser");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ROUTES_1 = require("@src/ROUTES");
const isMobileWeb = (0, Browser_1.isMobile)();
function ConnectToQuickbooksDesktopFlow({ policyID }) {
    (0, react_1.useEffect)(() => {
        if (isMobileWeb) {
            Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_SETUP_REQUIRED_DEVICE_MODAL.getRoute(policyID));
        }
        else {
            Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_SETUP_MODAL.getRoute(policyID));
        }
    }, [policyID]);
    return null;
}
ConnectToQuickbooksDesktopFlow.displayName = 'ConnectToQuickbooksDesktopFlow';
exports.default = ConnectToQuickbooksDesktopFlow;
