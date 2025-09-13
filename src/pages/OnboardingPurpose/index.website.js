"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseOnboardingPurpose_1 = require("./BaseOnboardingPurpose");
function OnboardingPurpose({ ...rest }) {
    return (<BaseOnboardingPurpose_1.default shouldUseNativeStyles={false} shouldEnableMaxHeight 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>);
}
OnboardingPurpose.displayName = 'OnboardingPurpose';
exports.default = OnboardingPurpose;
