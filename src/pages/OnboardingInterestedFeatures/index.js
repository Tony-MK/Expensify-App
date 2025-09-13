"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var OnboardingWrapper_1 = require("@components/OnboardingWrapper");
var BaseOnboardingInterestedFeatures_1 = require("./BaseOnboardingInterestedFeatures");
function OnboardingInterestedFeatures(props) {
    return (<OnboardingWrapper_1.default>
            <BaseOnboardingInterestedFeatures_1.default shouldUseNativeStyles={false} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>
        </OnboardingWrapper_1.default>);
}
OnboardingInterestedFeatures.displayName = 'OnboardingInterestedFeatures';
exports.default = OnboardingInterestedFeatures;
