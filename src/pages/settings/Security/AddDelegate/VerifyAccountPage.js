"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const VerifyAccountPageBase_1 = require("@pages/settings/VerifyAccountPageBase");
const ROUTES_1 = require("@src/ROUTES");
function VerifyAccountPage() {
    return (<VerifyAccountPageBase_1.default navigateBackTo={ROUTES_1.default.SETTINGS_SECURITY} navigateForwardTo={ROUTES_1.default.SETTINGS_ADD_DELEGATE}/>);
}
exports.default = VerifyAccountPage;
