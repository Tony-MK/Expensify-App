"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OnboardingWrapper_1 = require("@components/OnboardingWrapper");
const BaseOnboardingPrivateDomain_1 = require("./BaseOnboardingPrivateDomain");
function OnboardingPrivateDomain(props) {
    return (<OnboardingWrapper_1.default>
            <BaseOnboardingPrivateDomain_1.default shouldUseNativeStyles={false} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>
        </OnboardingWrapper_1.default>);
}
OnboardingPrivateDomain.displayName = 'OnboardingPrivateDomain';
exports.default = OnboardingPrivateDomain;
