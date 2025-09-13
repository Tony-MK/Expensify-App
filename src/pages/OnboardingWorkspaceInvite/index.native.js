"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const BaseOnboardingWorkspaceInvite_1 = require("./BaseOnboardingWorkspaceInvite");
function OnboardingWorkspaceInvite(props) {
    // To block android native back button behavior
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        // Return true to indicate that the back button press is handled here
        const backAction = () => true;
        const backHandler = react_native_1.BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []));
    return (<BaseOnboardingWorkspaceInvite_1.default shouldUseNativeStyles 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
}
OnboardingWorkspaceInvite.displayName = 'OnboardingWorkspaceInvite';
exports.default = OnboardingWorkspaceInvite;
