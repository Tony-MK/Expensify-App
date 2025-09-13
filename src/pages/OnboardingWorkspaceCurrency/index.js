"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OnboardingWrapper_1 = require("@components/OnboardingWrapper");
const BaseOnboardingWorkspaceCurrency_1 = require("./BaseOnboardingWorkspaceCurrency");
function OnboardingWorkspaceCurrency({ ...rest }) {
    return (<OnboardingWrapper_1.default>
            <BaseOnboardingWorkspaceCurrency_1.default shouldUseNativeStyles={false} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>
        </OnboardingWrapper_1.default>);
}
OnboardingWorkspaceCurrency.displayName = 'OnboardingWorkspaceCurrency';
exports.default = OnboardingWorkspaceCurrency;
