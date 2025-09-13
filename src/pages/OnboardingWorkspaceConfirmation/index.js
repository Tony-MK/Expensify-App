"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OnboardingWrapper_1 = require("@components/OnboardingWrapper");
const BaseOnboardingWorkspaceConfirmation_1 = require("./BaseOnboardingWorkspaceConfirmation");
function OnboardingWorkspaceConfirmation({ ...rest }) {
    return (<OnboardingWrapper_1.default>
            <BaseOnboardingWorkspaceConfirmation_1.default shouldUseNativeStyles={false} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>
        </OnboardingWrapper_1.default>);
}
OnboardingWorkspaceConfirmation.displayName = 'OnboardingWorkspaceConfirmation';
exports.default = OnboardingWorkspaceConfirmation;
