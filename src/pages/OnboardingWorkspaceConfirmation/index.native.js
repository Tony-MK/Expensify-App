"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseOnboardingWorkspaceConfirmation_1 = require("./BaseOnboardingWorkspaceConfirmation");
function OnboardingWorkspaceConfirmation({ ...rest }) {
    return (<BaseOnboardingWorkspaceConfirmation_1.default shouldUseNativeStyles 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>);
}
OnboardingWorkspaceConfirmation.displayName = 'OnboardingWorkspaceConfirmation';
exports.default = OnboardingWorkspaceConfirmation;
