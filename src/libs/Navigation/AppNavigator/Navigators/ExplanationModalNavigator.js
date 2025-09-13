"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const NoDropZone_1 = require("@components/DragAndDrop/NoDropZone");
const ExplanationModal_1 = require("@components/ExplanationModal");
const createPlatformStackNavigator_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigator");
const animation_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/animation");
const SCREENS_1 = require("@src/SCREENS");
const Stack = (0, createPlatformStackNavigator_1.default)();
function ExplanationModalNavigator() {
    return (<NoDropZone_1.default>
            <react_native_1.View>
                <Stack.Navigator screenOptions={{ headerShown: false, animation: animation_1.default.SLIDE_FROM_RIGHT }}>
                    <Stack.Screen name={SCREENS_1.default.EXPLANATION_MODAL.ROOT} component={ExplanationModal_1.default}/>
                </Stack.Navigator>
            </react_native_1.View>
        </NoDropZone_1.default>);
}
ExplanationModalNavigator.displayName = 'ExplanationModalNavigator';
exports.default = ExplanationModalNavigator;
