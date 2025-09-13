"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Browser_1 = require("@libs/Browser");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ROUTES_1 = require("@src/ROUTES");
var isMobileWeb = (0, Browser_1.isMobile)();
function ConnectToQuickbooksDesktopFlow(_a) {
    var policyID = _a.policyID;
    (0, react_1.useEffect)(function () {
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
