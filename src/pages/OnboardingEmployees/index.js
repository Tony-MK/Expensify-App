"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OnboardingWrapper_1 = require("@components/OnboardingWrapper");
const BaseOnboardingEmployees_1 = require("./BaseOnboardingEmployees");
function OnboardingEmployees(props) {
    return (<OnboardingWrapper_1.default>
            <BaseOnboardingEmployees_1.default shouldUseNativeStyles={false} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>
        </OnboardingWrapper_1.default>);
}
OnboardingEmployees.displayName = 'OnboardingEmployees';
exports.default = OnboardingEmployees;
