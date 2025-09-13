"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const BaseOnboardingPersonalDetails_1 = require("./BaseOnboardingPersonalDetails");
function OnboardingPersonalDetails({ ...rest }) {
    const { index: routeIndex } = rest.navigation.getState();
    // To block android native back button behavior
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        // We don't want to block the back button if this is not the first route
        if (routeIndex !== 0) {
            return;
        }
        // Return true to indicate that the back button press is handled here
        const backAction = () => true;
        const backHandler = react_native_1.BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [routeIndex]));
    return (<BaseOnboardingPersonalDetails_1.default shouldUseNativeStyles 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>);
}
OnboardingPersonalDetails.displayName = 'OnboardingPurpose';
exports.default = OnboardingPersonalDetails;
