"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AutoSubmitModal_1 = require("@components/AutoSubmitModal");
const NoDropZone_1 = require("@components/DragAndDrop/NoDropZone");
const createPlatformStackNavigator_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigator");
const animation_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/animation");
const ChangePolicyEducationalModal_1 = require("@pages/ChangePolicyEducationalModal");
const ProcessMoneyRequestHoldPage_1 = require("@pages/ProcessMoneyRequestHoldPage");
const TrackTrainingPage_1 = require("@pages/TrackTrainingPage");
const SCREENS_1 = require("@src/SCREENS");
const Stack = (0, createPlatformStackNavigator_1.default)();
function FeatureTrainingModalNavigator() {
    return (<NoDropZone_1.default>
            <react_native_1.View>
                <Stack.Navigator screenOptions={{ headerShown: false, animation: animation_1.default.SLIDE_FROM_RIGHT }}>
                    <Stack.Screen name={SCREENS_1.default.FEATURE_TRAINING_ROOT} component={TrackTrainingPage_1.default}/>
                    <Stack.Screen name={SCREENS_1.default.PROCESS_MONEY_REQUEST_HOLD_ROOT} component={ProcessMoneyRequestHoldPage_1.default}/>
                    <Stack.Screen name={SCREENS_1.default.CHANGE_POLICY_EDUCATIONAL_ROOT} component={ChangePolicyEducationalModal_1.default}/>
                    <Stack.Screen name={SCREENS_1.default.AUTO_SUBMIT_ROOT} component={AutoSubmitModal_1.default}/>
                </Stack.Navigator>
            </react_native_1.View>
        </NoDropZone_1.default>);
}
FeatureTrainingModalNavigator.displayName = 'FeatureTrainingModalNavigator';
exports.default = FeatureTrainingModalNavigator;
