"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const NoDropZone_1 = require("@components/DragAndDrop/NoDropZone");
const MigratedUserWelcomeModal_1 = require("@components/MigratedUserWelcomeModal");
const createPlatformStackNavigator_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigator");
const SCREENS_1 = require("@src/SCREENS");
const Stack = (0, createPlatformStackNavigator_1.default)();
function MigratedUserWelcomeModalNavigator() {
    return (<NoDropZone_1.default>
            <react_native_1.View>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name={SCREENS_1.default.MIGRATED_USER_WELCOME_MODAL.ROOT} component={MigratedUserWelcomeModal_1.default}/>
                </Stack.Navigator>
            </react_native_1.View>
        </NoDropZone_1.default>);
}
MigratedUserWelcomeModalNavigator.displayName = 'MigratedUserWelcomeModalNavigator';
exports.default = MigratedUserWelcomeModalNavigator;
