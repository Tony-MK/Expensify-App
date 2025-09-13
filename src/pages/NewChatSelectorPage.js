"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FocusTrapContainerElement_1 = require("@components/FocusTrap/FocusTrapContainerElement");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TabSelector_1 = require("@components/TabSelector/TabSelector");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OnyxTabNavigator_1 = require("@libs/Navigation/OnyxTabNavigator");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const NewChatPage_1 = require("./NewChatPage");
const WorkspaceNewRoomPage_1 = require("./workspace/WorkspaceNewRoomPage");
function NewChatSelectorPage() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    // The focus trap container elements of the header and back button, tab bar, and active tab
    const [headerWithBackBtnContainerElement, setHeaderWithBackButtonContainerElement] = (0, react_1.useState)(null);
    const [tabBarContainerElement, setTabBarContainerElement] = (0, react_1.useState)(null);
    const [activeTabContainerElement, setActiveTabContainerElement] = (0, react_1.useState)(null);
    const [formState] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.NEW_ROOM_FORM, { canBeMissing: true });
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const chatPageInputRef = (0, react_1.useRef)(null);
    const roomPageInputRef = (0, react_1.useRef)(null);
    // Theoretically, the focus trap container element can be null (due to component unmount/remount), so we filter out the null elements
    const containerElements = (0, react_1.useMemo)(() => {
        return [headerWithBackBtnContainerElement, tabBarContainerElement, activeTabContainerElement].filter((element) => !!element);
    }, [headerWithBackBtnContainerElement, tabBarContainerElement, activeTabContainerElement]);
    const onTabFocusTrapContainerElementChanged = (0, react_1.useCallback)((activeTabElement) => {
        setActiveTabContainerElement(activeTabElement ?? null);
    }, []);
    // We're focusing the input using internal onPageSelected to fix input focus inconsistencies on native.
    // More info: https://github.com/Expensify/App/issues/59388
    const onTabSelectFocusHandler = ({ index }) => {
        // We runAfterInteractions since the function is called in the animate block on web-based
        // implementation, this fixes an animation glitch and matches the native internal delay
        react_native_1.InteractionManager.runAfterInteractions(() => {
            // Chat tab (0) / Room tab (1) according to OnyxTabNavigator (see below)
            if (index === 0) {
                chatPageInputRef.current?.focus();
            }
            else if (index === 1) {
                roomPageInputRef.current?.focus();
            }
        });
    };
    const navigateBack = () => {
        Navigation_1.default.closeRHPFlow();
    };
    (0, react_1.useEffect)(() => {
        (0, Report_1.setNewRoomFormLoading)(false);
    }, []);
    return (<ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableKeyboardAvoidingView={false} shouldShowOfflineIndicator={false} shouldEnableMaxHeight testID={NewChatSelectorPage.displayName} focusTrapSettings={{ containerElements }}>
            <FocusTrapContainerElement_1.default onContainerElementChanged={setHeaderWithBackButtonContainerElement} style={[styles.w100]}>
                <HeaderWithBackButton_1.default title={translate('sidebarScreen.fabNewChat')} onBackButtonPress={navigateBack}/>
            </FocusTrapContainerElement_1.default>

            <OnyxTabNavigator_1.default id={CONST_1.default.TAB.NEW_CHAT_TAB_ID} tabBar={TabSelector_1.default} onTabBarFocusTrapContainerElementChanged={setTabBarContainerElement} onActiveTabFocusTrapContainerElementChanged={onTabFocusTrapContainerElementChanged} disableSwipe={!!formState?.isLoading && shouldUseNarrowLayout} onTabSelect={onTabSelectFocusHandler}>
                <OnyxTabNavigator_1.TopTab.Screen name={CONST_1.default.TAB.NEW_CHAT}>
                    {() => (<OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>
                            <NewChatPage_1.default ref={chatPageInputRef}/>
                        </OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>)}
                </OnyxTabNavigator_1.TopTab.Screen>
                <OnyxTabNavigator_1.TopTab.Screen name={CONST_1.default.TAB.NEW_ROOM}>
                    {() => (<OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>
                            <WorkspaceNewRoomPage_1.default ref={roomPageInputRef}/>
                        </OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>)}
                </OnyxTabNavigator_1.TopTab.Screen>
            </OnyxTabNavigator_1.default>
        </ScreenWrapper_1.default>);
}
NewChatSelectorPage.displayName = 'NewChatSelectorPage';
exports.default = NewChatSelectorPage;
