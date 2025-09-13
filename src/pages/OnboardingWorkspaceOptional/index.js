"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OnboardingWrapper_1 = require("@components/OnboardingWrapper");
const BaseOnboardingWorkspaceOptional_1 = require("./BaseOnboardingWorkspaceOptional");
function OnboardingWorkspaceOptional(props) {
    return (<OnboardingWrapper_1.default>
            <BaseOnboardingWorkspaceOptional_1.default shouldUseNativeStyles={false} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>
        </OnboardingWrapper_1.default>);
}
OnboardingWorkspaceOptional.displayName = 'OnboardingWorkspaceOptional';
exports.default = OnboardingWorkspaceOptional;
