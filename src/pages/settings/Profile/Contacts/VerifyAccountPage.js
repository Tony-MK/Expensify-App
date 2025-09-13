"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var VerifyAccountPageBase_1 = require("@pages/settings/VerifyAccountPageBase");
function VerifyAccountPage(_a) {
    var _b, _c;
    var route = _a.route;
    // We're moving towards removing route.params?.forwardTo and route.params?.backTo, but for now this page is used in several different flows, so it needs to stay like that.
    // TODO refactor this for 1 route per modal like src/pages/settings/Security/TwoFactorAuth/VerifyAccountPage.tsx and src/pages/settings/Security/AddDelegate/VerifyAccountPage.tsx in follow up PRs
    var navigateForwardTo = (_b = route.params) === null || _b === void 0 ? void 0 : _b.forwardTo;
    var navigateBackTo = (_c = route.params) === null || _c === void 0 ? void 0 : _c.backTo;
    return (<VerifyAccountPageBase_1.default navigateBackTo={navigateBackTo} navigateForwardTo={navigateForwardTo}/>);
}
exports.default = VerifyAccountPage;
