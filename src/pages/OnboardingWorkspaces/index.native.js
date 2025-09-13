"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseOnboardingWorkspaces_1 = require("./BaseOnboardingWorkspaces");
function OnboardingWorkspaces({ ...rest }) {
    return (<BaseOnboardingWorkspaces_1.default shouldUseNativeStyles 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>);
}
OnboardingWorkspaces.displayName = 'OnboardingWorkspaces';
exports.default = OnboardingWorkspaces;
