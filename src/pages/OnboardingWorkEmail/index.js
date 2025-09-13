"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OnboardingWrapper_1 = require("@components/OnboardingWrapper");
const BaseOnboardingWorkEmail_1 = require("./BaseOnboardingWorkEmail");
function OnboardingWorkEmail(props) {
    return (<OnboardingWrapper_1.default>
            <BaseOnboardingWorkEmail_1.default shouldUseNativeStyles={false} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>
        </OnboardingWrapper_1.default>);
}
OnboardingWorkEmail.displayName = 'OnboardingWorkEmail';
exports.default = OnboardingWorkEmail;
