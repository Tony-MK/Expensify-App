"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OnboardingWrapper_1 = require("@components/OnboardingWrapper");
const BaseOnboardingPurpose_1 = require("./BaseOnboardingPurpose");
function OnboardingPurpose({ ...rest }) {
    return (<OnboardingWrapper_1.default>
            <BaseOnboardingPurpose_1.default shouldUseNativeStyles={false} shouldEnableMaxHeight={false} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>
        </OnboardingWrapper_1.default>);
}
OnboardingPurpose.displayName = 'OnboardingPurpose';
exports.default = OnboardingPurpose;
