"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OnboardingWrapper_1 = require("@components/OnboardingWrapper");
const BaseOnboardingWorkspaceInvite_1 = require("./BaseOnboardingWorkspaceInvite");
function OnboardingWorkspaceInvite({ ...rest }) {
    return (<OnboardingWrapper_1.default>
            <BaseOnboardingWorkspaceInvite_1.default shouldUseNativeStyles={false} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>
        </OnboardingWrapper_1.default>);
}
OnboardingWorkspaceInvite.displayName = 'OnboardingWorkspaceInvite';
exports.default = OnboardingWorkspaceInvite;
