"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const CustomDevMenu_1 = require("@components/CustomDevMenu");
const FocusTrapForScreen_1 = require("@components/FocusTrap/FocusTrapForScreen");
const HeaderGap_1 = require("@components/HeaderGap");
const InitialURLContextProvider_1 = require("@components/InitialURLContextProvider");
const withNavigationFallback_1 = require("@components/withNavigationFallback");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const NarrowPaneContext_1 = require("@libs/Navigation/AppNavigator/Navigators/NarrowPaneContext");
const Navigation_1 = require("@libs/Navigation/Navigation");
const HybridApp_1 = require("@userActions/HybridApp");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ScreenWrapperContainer_1 = require("./ScreenWrapperContainer");
const ScreenWrapperOfflineIndicatorContext_1 = require("./ScreenWrapperOfflineIndicatorContext");
const ScreenWrapperOfflineIndicators_1 = require("./ScreenWrapperOfflineIndicators");
const ScreenWrapperStatusContext_1 = require("./ScreenWrapperStatusContext");
function ScreenWrapper({ navigation: navigationProp, children, style, bottomContent, headerGapStyles, offlineIndicatorStyle, disableOfflineIndicatorSafeAreaPadding, shouldShowOfflineIndicator: shouldShowSmallScreenOfflineIndicator, shouldShowOfflineIndicatorInWideScreen: shouldShowWideScreenOfflineIndicator, shouldMobileOfflineIndicatorStickToBottom: shouldSmallScreenOfflineIndicatorStickToBottomProp, shouldDismissKeyboardBeforeClose, onEntryTransitionEnd, includePaddingTop = true, includeSafeAreaPaddingBottom: includeSafeAreaPaddingBottomProp = true, enableEdgeToEdgeBottomSafeAreaPadding: enableEdgeToEdgeBottomSafeAreaPaddingProp, shouldKeyboardOffsetBottomSafeAreaPadding: shouldKeyboardOffsetBottomSafeAreaPaddingProp, isOfflineIndicatorTranslucent, focusTrapSettings, ref, ...restContainerProps }) {
    /**
     * We are only passing navigation as prop from
     * ReportScreen -> ScreenWrapper
     *
     * so in other places where ScreenWrapper is used, we need to
     * fallback to useNavigation.
     */
    const navigationFallback = (0, native_1.useNavigation)();
    const navigation = navigationProp ?? navigationFallback;
    const isFocused = (0, native_1.useIsFocused)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout for a case where we want to show the offline indicator only on small screens
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth, shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isDevelopment } = (0, useEnvironment_1.default)();
    const [didScreenTransitionEnd, setDidScreenTransitionEnd] = (0, react_1.useState)(false);
    // When the `enableEdgeToEdgeBottomSafeAreaPadding` prop is explicitly set, we enable edge-to-edge mode.
    const isUsingEdgeToEdgeMode = enableEdgeToEdgeBottomSafeAreaPaddingProp !== undefined;
    const enableEdgeToEdgeBottomSafeAreaPadding = enableEdgeToEdgeBottomSafeAreaPaddingProp ?? false;
    const { insets, safeAreaPaddingBottomStyle } = (0, useSafeAreaPaddings_1.default)(isUsingEdgeToEdgeMode);
    // We enable all of these flags by default, if we are using edge-to-edge mode.
    const shouldSmallScreenOfflineIndicatorStickToBottom = shouldSmallScreenOfflineIndicatorStickToBottomProp ?? isUsingEdgeToEdgeMode;
    const shouldKeyboardOffsetBottomSafeAreaPadding = shouldKeyboardOffsetBottomSafeAreaPaddingProp ?? isUsingEdgeToEdgeMode;
    // We disable legacy bottom safe area padding handling, if we are using edge-to-edge mode.
    const includeSafeAreaPaddingBottom = isUsingEdgeToEdgeMode ? false : includeSafeAreaPaddingBottomProp;
    const isSafeAreaTopPaddingApplied = includePaddingTop;
    const statusContextValue = (0, react_1.useMemo)(() => ({ didScreenTransitionEnd, isSafeAreaTopPaddingApplied, isSafeAreaBottomPaddingApplied: includeSafeAreaPaddingBottom }), [didScreenTransitionEnd, includeSafeAreaPaddingBottom, isSafeAreaTopPaddingApplied]);
    // This context allows us to disable the safe area padding offsetting the offline indicator in scrollable components like 'ScrollView', 'SelectionList' or 'FormProvider'.
    // This is useful e.g. for the RightModalNavigator, where we want to avoid the safe area padding offsetting the offline indicator because we only show the offline indicator on small screens.
    const { isInNarrowPane } = (0, react_1.useContext)(NarrowPaneContext_1.default);
    const { addSafeAreaPadding, showOnSmallScreens, showOnWideScreens, originalValues } = (0, react_1.useContext)(ScreenWrapperOfflineIndicatorContext_1.default);
    const offlineIndicatorContextValue = (0, react_1.useMemo)(() => {
        const newAddSafeAreaPadding = isInNarrowPane ? isSmallScreenWidth : addSafeAreaPadding;
        const newOriginalValues = originalValues ?? {
            addSafeAreaPadding: newAddSafeAreaPadding,
            showOnSmallScreens,
            showOnWideScreens,
        };
        return {
            // Allows for individual screens to disable the offline indicator safe area padding for the screen and all nested ScreenWrapper components.
            addSafeAreaPadding: disableOfflineIndicatorSafeAreaPadding === undefined ? (newAddSafeAreaPadding ?? true) : !disableOfflineIndicatorSafeAreaPadding,
            // Prevent any nested ScreenWrapper components from rendering another offline indicator.
            showOnSmallScreens: false,
            showOnWideScreens: false,
            // Pass down the original values by the outermost ScreenWrapperOfflineIndicatorContext.Provider,
            // to allow nested ScreenWrapperOfflineIndicatorContext.Provider to access these values. (e.g. in Modals)
            originalValues: newOriginalValues,
        };
    }, [addSafeAreaPadding, disableOfflineIndicatorSafeAreaPadding, isInNarrowPane, isSmallScreenWidth, originalValues, showOnSmallScreens, showOnWideScreens]);
    /** If there is no bottom content, the mobile offline indicator will stick to the bottom of the screen by default. */
    const displayStickySmallScreenOfflineIndicator = shouldSmallScreenOfflineIndicatorStickToBottom && !bottomContent;
    const displaySmallScreenOfflineIndicator = isSmallScreenWidth && (shouldShowSmallScreenOfflineIndicator ?? showOnSmallScreens ?? true);
    const displayWideScreenOfflineIndicator = !shouldUseNarrowLayout && (shouldShowWideScreenOfflineIndicator ?? showOnWideScreens ?? false);
    /** In edge-to-edge mode, we always want to apply the bottom safe area padding to the mobile offline indicator. */
    const addSmallScreenOfflineIndicatorBottomSafeAreaPadding = isUsingEdgeToEdgeMode ? enableEdgeToEdgeBottomSafeAreaPadding : !includeSafeAreaPaddingBottom;
    /** If we currently show the offline indicator and it has bottom safe area padding, we need to offset the bottom safe area padding in the KeyboardAvoidingView. */
    const { isOffline } = (0, useNetwork_1.default)();
    const shouldOffsetMobileOfflineIndicator = displaySmallScreenOfflineIndicator && addSmallScreenOfflineIndicatorBottomSafeAreaPadding && isOffline;
    const { initialURL } = (0, react_1.useContext)(InitialURLContextProvider_1.InitialURLContext);
    const [isSingleNewDotEntry = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.HYBRID_APP, { selector: (hybridApp) => hybridApp?.isSingleNewDotEntry, canBeMissing: true });
    (0, native_1.usePreventRemove)(isSingleNewDotEntry && !!initialURL?.endsWith(Navigation_1.default.getActiveRouteWithoutParams()), () => {
        if (!CONFIG_1.default.IS_HYBRID_APP) {
            return;
        }
        (0, HybridApp_1.closeReactNativeApp)({ shouldSetNVP: false });
    });
    (0, react_1.useEffect)(() => {
        // On iOS, the transitionEnd event doesn't trigger some times. As such, we need to set a timeout
        const timeout = setTimeout(() => {
            setDidScreenTransitionEnd(true);
            onEntryTransitionEnd?.();
        }, CONST_1.default.SCREEN_TRANSITION_END_TIMEOUT);
        const unsubscribeTransitionEnd = navigation.addListener('transitionEnd', (event) => {
            // Prevent firing the prop callback when user is exiting the page.
            if (event?.data?.closing) {
                return;
            }
            clearTimeout(timeout);
            setDidScreenTransitionEnd(true);
            onEntryTransitionEnd?.();
        });
        // We need to have this prop to remove keyboard before going away from the screen, to avoid previous screen look weird for a brief moment,
        // also we need to have generic control in future - to prevent closing keyboard for some rare cases in which beforeRemove has limitations
        // described here https://reactnavigation.org/docs/preventing-going-back/#limitations
        const beforeRemoveSubscription = shouldDismissKeyboardBeforeClose
            ? navigation.addListener('beforeRemove', () => {
                if (!react_native_1.Keyboard.isVisible()) {
                    return;
                }
                react_native_1.Keyboard.dismiss();
            })
            : undefined;
        return () => {
            clearTimeout(timeout);
            if (unsubscribeTransitionEnd) {
                unsubscribeTransitionEnd();
            }
            if (beforeRemoveSubscription) {
                beforeRemoveSubscription();
            }
        };
        // Rule disabled because this effect is only for component did mount & will component unmount lifecycle event
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    const ChildrenContent = (0, react_1.useMemo)(() => {
        return (
        // If props.children is a function, call it to provide the insets to the children.
        typeof children === 'function' ? children({ insets, safeAreaPaddingBottomStyle, didScreenTransitionEnd }) : children);
    }, [children, insets, safeAreaPaddingBottomStyle, didScreenTransitionEnd]);
    return (<FocusTrapForScreen_1.default focusTrapSettings={focusTrapSettings}>
            <ScreenWrapperContainer_1.default ref={ref} style={[styles.flex1, style]} bottomContent={bottomContent} didScreenTransitionEnd={didScreenTransitionEnd} shouldKeyboardOffsetBottomSafeAreaPadding={shouldKeyboardOffsetBottomSafeAreaPadding || shouldOffsetMobileOfflineIndicator} enableEdgeToEdgeBottomSafeAreaPadding={enableEdgeToEdgeBottomSafeAreaPaddingProp} includePaddingTop={includePaddingTop} includeSafeAreaPaddingBottom={includeSafeAreaPaddingBottom} isFocused={isFocused} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restContainerProps}>
                <HeaderGap_1.default styles={headerGapStyles}/>
                {isDevelopment && <CustomDevMenu_1.default />}
                <ScreenWrapperStatusContext_1.default.Provider value={statusContextValue}>
                    <ScreenWrapperOfflineIndicatorContext_1.default.Provider value={offlineIndicatorContextValue}>
                        {ChildrenContent}

                        <ScreenWrapperOfflineIndicators_1.default offlineIndicatorStyle={offlineIndicatorStyle} shouldShowOfflineIndicator={displaySmallScreenOfflineIndicator} shouldShowOfflineIndicatorInWideScreen={displayWideScreenOfflineIndicator} shouldMobileOfflineIndicatorStickToBottom={displayStickySmallScreenOfflineIndicator} isOfflineIndicatorTranslucent={isOfflineIndicatorTranslucent} extraContent={bottomContent} addBottomSafeAreaPadding={addSmallScreenOfflineIndicatorBottomSafeAreaPadding}/>
                    </ScreenWrapperOfflineIndicatorContext_1.default.Provider>
                </ScreenWrapperStatusContext_1.default.Provider>
            </ScreenWrapperContainer_1.default>
        </FocusTrapForScreen_1.default>);
}
ScreenWrapper.displayName = 'ScreenWrapper';
exports.default = (0, withNavigationFallback_1.default)(ScreenWrapper);
