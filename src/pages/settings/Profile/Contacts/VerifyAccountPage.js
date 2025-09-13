"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const VerifyAccountPageBase_1 = require("@pages/settings/VerifyAccountPageBase");
function VerifyAccountPage({ route }) {
    // We're moving towards removing route.params?.forwardTo and route.params?.backTo, but for now this page is used in several different flows, so it needs to stay like that.
    // TODO refactor this for 1 route per modal like src/pages/settings/Security/TwoFactorAuth/VerifyAccountPage.tsx and src/pages/settings/Security/AddDelegate/VerifyAccountPage.tsx in follow up PRs
    const navigateForwardTo = route.params?.forwardTo;
    const navigateBackTo = route.params?.backTo;
    return (<VerifyAccountPageBase_1.default navigateBackTo={navigateBackTo} navigateForwardTo={navigateForwardTo}/>);
}
exports.default = VerifyAccountPage;
