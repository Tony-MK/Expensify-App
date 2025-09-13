"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OnboardingWrapper_1 = require("@components/OnboardingWrapper");
const BaseOnboardingPersonalDetails_1 = require("./BaseOnboardingPersonalDetails");
function OnboardingPersonalDetails({ ...rest }) {
    return (<OnboardingWrapper_1.default>
            <BaseOnboardingPersonalDetails_1.default shouldUseNativeStyles={false} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>
        </OnboardingWrapper_1.default>);
}
OnboardingPersonalDetails.displayName = 'OnboardingPurpose';
exports.default = OnboardingPersonalDetails;
