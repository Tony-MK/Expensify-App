"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Localize_1 = require("@libs/Localize");
const Welcome_1 = require("@userActions/Welcome");
const BaseOnboardingWorkEmail_1 = require("./BaseOnboardingWorkEmail");
function OnboardingWorkEmail(props) {
    // To block android native back button behavior
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        // Return true to indicate that the back button press is handled here
        const backAction = () => {
            (0, Welcome_1.setOnboardingErrorMessage)((0, Localize_1.translateLocal)('onboarding.purpose.errorBackButton'));
            return true;
        };
        const backHandler = react_native_1.BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []));
    return (<BaseOnboardingWorkEmail_1.default shouldUseNativeStyles 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
}
OnboardingWorkEmail.displayName = 'OnboardingWorkEmail';
exports.default = OnboardingWorkEmail;
