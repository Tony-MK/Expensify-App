"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const NoDropZone_1 = require("@components/DragAndDrop/NoDropZone");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ModalStackNavigators = require("@libs/Navigation/AppNavigator/ModalStackNavigators");
const useRHPScreenOptions_1 = require("@libs/Navigation/AppNavigator/useRHPScreenOptions");
const createPlatformStackNavigator_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigator");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const SCREENS_1 = require("@src/SCREENS");
const NarrowPaneContext_1 = require("./NarrowPaneContext");
const Overlay_1 = require("./Overlay");
const Stack = (0, createPlatformStackNavigator_1.default)();
function PublicRightModalNavigatorComponent({ navigation }) {
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const screenOptions = (0, useRHPScreenOptions_1.default)();
    return (<NarrowPaneContext_1.NarrowPaneContextProvider>
            <NoDropZone_1.default>
                {!shouldUseNarrowLayout && <Overlay_1.default onPress={navigation.goBack}/>}
                <react_native_1.View style={styles.RHPNavigatorContainer(shouldUseNarrowLayout)}>
                    <Stack.Navigator screenOptions={screenOptions} id={NAVIGATORS_1.default.PUBLIC_RIGHT_MODAL_NAVIGATOR}>
                        <Stack.Screen name={SCREENS_1.default.PUBLIC_CONSOLE_DEBUG} component={ModalStackNavigators.ConsoleModalStackNavigator}/>
                    </Stack.Navigator>
                </react_native_1.View>
            </NoDropZone_1.default>
        </NarrowPaneContext_1.NarrowPaneContextProvider>);
}
exports.default = PublicRightModalNavigatorComponent;
