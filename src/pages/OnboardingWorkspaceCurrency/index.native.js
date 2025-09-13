"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseOnboardingWorkspaceCurrency_1 = require("./BaseOnboardingWorkspaceCurrency");
function OnboardingWorkspaceCurrency({ ...rest }) {
    return (<BaseOnboardingWorkspaceCurrency_1.default shouldUseNativeStyles 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>);
}
OnboardingWorkspaceCurrency.displayName = 'OnboardingWorkspaceCurrency';
exports.default = OnboardingWorkspaceCurrency;
