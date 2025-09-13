"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const BaseOnboardingPurpose_1 = require("./BaseOnboardingPurpose");
function OnboardingPurpose({ ...rest }) {
    // To block android native back button behavior
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        // Return true to indicate that the back button press is handled here
        const backAction = () => true;
        const backHandler = react_native_1.BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []));
    return (<BaseOnboardingPurpose_1.default shouldUseNativeStyles shouldEnableMaxHeight={false} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>);
}
OnboardingPurpose.displayName = 'OnboardingPurpose';
exports.default = OnboardingPurpose;
