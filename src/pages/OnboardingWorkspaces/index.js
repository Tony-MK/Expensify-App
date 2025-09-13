"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OnboardingWrapper_1 = require("@components/OnboardingWrapper");
const BaseOnboardingWorkspaces_1 = require("./BaseOnboardingWorkspaces");
function OnboardingWorkspaces({ ...rest }) {
    return (<OnboardingWrapper_1.default>
            <BaseOnboardingWorkspaces_1.default shouldUseNativeStyles={false} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>
        </OnboardingWrapper_1.default>);
}
OnboardingWorkspaces.displayName = 'OnboardingWorkspaces';
exports.default = OnboardingWorkspaces;
