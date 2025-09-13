"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseOnboardingAccounting_1 = require("./BaseOnboardingAccounting");
function OnboardingAccounting(props) {
    return (<BaseOnboardingAccounting_1.default shouldUseNativeStyles 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
}
OnboardingAccounting.displayName = 'OnboardingAccounting';
exports.default = OnboardingAccounting;
