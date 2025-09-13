"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const portal_1 = require("@gorhom/portal");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_picker_select_1 = require("react-native-picker-select");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
require("../wdyr");
const ActionSheetAwareScrollView_1 = require("./components/ActionSheetAwareScrollView");
const ActiveElementRoleProvider_1 = require("./components/ActiveElementRoleProvider");
const ColorSchemeWrapper_1 = require("./components/ColorSchemeWrapper");
const ComposeProviders_1 = require("./components/ComposeProviders");
const CurrentUserPersonalDetailsProvider_1 = require("./components/CurrentUserPersonalDetailsProvider");
const CustomStatusBarAndBackground_1 = require("./components/CustomStatusBarAndBackground");
const CustomStatusBarAndBackgroundContextProvider_1 = require("./components/CustomStatusBarAndBackground/CustomStatusBarAndBackgroundContextProvider");
const ErrorBoundary_1 = require("./components/ErrorBoundary");
const FullScreenBlockingViewContextProvider_1 = require("./components/FullScreenBlockingViewContextProvider");
const FullScreenLoaderContext_1 = require("./components/FullScreenLoaderContext");
const HTMLEngineProvider_1 = require("./components/HTMLEngineProvider");
const InitialURLContextProvider_1 = require("./components/InitialURLContextProvider");
const InputBlurContext_1 = require("./components/InputBlurContext");
const KeyboardProvider_1 = require("./components/KeyboardProvider");
const LocaleContextProvider_1 = require("./components/LocaleContextProvider");
const NavigationBar_1 = require("./components/NavigationBar");
const OnyxListItemProvider_1 = require("./components/OnyxListItemProvider");
const PopoverProvider_1 = require("./components/PopoverProvider");
const ProductTrainingContext_1 = require("./components/ProductTrainingContext");
const SafeArea_1 = require("./components/SafeArea");
const ScrollOffsetContextProvider_1 = require("./components/ScrollOffsetContextProvider");
const SearchRouterContext_1 = require("./components/Search/SearchRouter/SearchRouterContext");
const SidePanelContextProvider_1 = require("./components/SidePanel/SidePanelContextProvider");
const SVGDefinitionsProvider_1 = require("./components/SVGDefinitionsProvider");
const ThemeIllustrationsProvider_1 = require("./components/ThemeIllustrationsProvider");
const ThemeProvider_1 = require("./components/ThemeProvider");
const ThemeStylesProvider_1 = require("./components/ThemeStylesProvider");
const FullScreenContext_1 = require("./components/VideoPlayerContexts/FullScreenContext");
const PlaybackContext_1 = require("./components/VideoPlayerContexts/PlaybackContext");
const VideoPopoverMenuContext_1 = require("./components/VideoPlayerContexts/VideoPopoverMenuContext");
const VolumeContext_1 = require("./components/VideoPlayerContexts/VolumeContext");
const withEnvironment_1 = require("./components/withEnvironment");
const withKeyboardState_1 = require("./components/withKeyboardState");
const CONFIG_1 = require("./CONFIG");
const CONST_1 = require("./CONST");
const Expensify_1 = require("./Expensify");
const useCurrentReportID_1 = require("./hooks/useCurrentReportID");
const useDefaultDragAndDrop_1 = require("./hooks/useDefaultDragAndDrop");
const HybridAppHandler_1 = require("./HybridAppHandler");
const OnyxUpdateManager_1 = require("./libs/actions/OnyxUpdateManager");
require("./libs/HybridApp");
const AttachmentModalContext_1 = require("./pages/media/AttachmentModalScreen/AttachmentModalContext");
require("./setup/backgroundTask");
require("./setup/hybridApp");
const SplashScreenStateContext_1 = require("./SplashScreenStateContext");
react_native_1.LogBox.ignoreLogs([
    // Basically it means that if the app goes in the background and back to foreground on Android,
    // the timer is lost. Currently Expensify is using a 30 minutes interval to refresh personal details.
    // More details here: https://git.io/JJYeb
    'Setting a timer for a long period of time',
]);
const fill = { flex: 1 };
const StrictModeWrapper = CONFIG_1.default.USE_REACT_STRICT_MODE_IN_DEV ? react_1.default.StrictMode : ({ children }) => children;
function App() {
    (0, useDefaultDragAndDrop_1.default)();
    (0, OnyxUpdateManager_1.default)();
    return (<StrictModeWrapper>
            <SplashScreenStateContext_1.SplashScreenStateContextProvider>
                <InitialURLContextProvider_1.default>
                    <HybridAppHandler_1.default />

                    <react_native_gesture_handler_1.GestureHandlerRootView style={fill}>
                        {/* Initialize metrics early to ensure the UI renders even when NewDot is hidden.
            This is necessary for iOS HybridApp's SignInPage to appear correctly without the bootsplash.
            See: https://github.com/Expensify/App/pull/65178#issuecomment-3139026551
        */}
                        <react_native_safe_area_context_1.SafeAreaProvider initialMetrics={{
            insets: { top: 0, right: 0, bottom: 0, left: 0 },
            frame: { x: 0, y: 0, width: 0, height: 0 },
        }}>
                            <react_native_1.View style={fill} fsClass={CONST_1.default.FULLSTORY.CLASS.UNMASK}>
                                <ComposeProviders_1.default components={[
            OnyxListItemProvider_1.default,
            CurrentUserPersonalDetailsProvider_1.CurrentUserPersonalDetailsProvider,
            ThemeProvider_1.default,
            ThemeStylesProvider_1.default,
            ThemeIllustrationsProvider_1.default,
            SVGDefinitionsProvider_1.default,
            HTMLEngineProvider_1.default,
            portal_1.PortalProvider,
            SafeArea_1.default,
            LocaleContextProvider_1.LocaleContextProvider,
            PopoverProvider_1.default,
            useCurrentReportID_1.CurrentReportIDContextProvider,
            ScrollOffsetContextProvider_1.default,
            AttachmentModalContext_1.AttachmentModalContextProvider,
            react_native_picker_select_1.PickerStateProvider,
            withEnvironment_1.EnvironmentProvider,
            CustomStatusBarAndBackgroundContextProvider_1.default,
            ActiveElementRoleProvider_1.default,
            ActionSheetAwareScrollView_1.ActionSheetAwareScrollViewProvider,
            PlaybackContext_1.PlaybackContextProvider,
            FullScreenContext_1.FullScreenContextProvider,
            VolumeContext_1.VolumeContextProvider,
            VideoPopoverMenuContext_1.VideoPopoverMenuContextProvider,
            KeyboardProvider_1.default,
            withKeyboardState_1.KeyboardStateProvider,
            SearchRouterContext_1.SearchRouterContextProvider,
            ProductTrainingContext_1.ProductTrainingContextProvider,
            InputBlurContext_1.InputBlurContextProvider,
            FullScreenBlockingViewContextProvider_1.default,
            FullScreenLoaderContext_1.default,
            SidePanelContextProvider_1.default,
        ]}>
                                    <CustomStatusBarAndBackground_1.default />
                                    <ErrorBoundary_1.default errorMessage="NewExpensify crash caught by error boundary">
                                        <ColorSchemeWrapper_1.default>
                                            <Expensify_1.default />
                                        </ColorSchemeWrapper_1.default>
                                    </ErrorBoundary_1.default>
                                    <NavigationBar_1.default />
                                </ComposeProviders_1.default>
                            </react_native_1.View>
                        </react_native_safe_area_context_1.SafeAreaProvider>
                    </react_native_gesture_handler_1.GestureHandlerRootView>
                </InitialURLContextProvider_1.default>
            </SplashScreenStateContext_1.SplashScreenStateContextProvider>
        </StrictModeWrapper>);
}
App.displayName = 'App';
exports.default = App;
