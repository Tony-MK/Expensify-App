"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const Navigation_1 = require("@navigation/Navigation");
const SCREENS_1 = require("@src/SCREENS");
const useResponsiveLayout_1 = require("./useResponsiveLayout");
/**
 * Hook that returns a function to check if the currently active route remains the same as the route on which the component was initially rendered.
 * The `isOnInitialRenderedRouteRef` is set to `false` every time the component experiences a 'blur' event,
 * except when opening an attachments modal, which is treated as an exception and does not trigger a reference update because the attachments modal display overlap and we want to use shared VideoPlayer.
 *
 * @return Function that checks if the route where the component was initially rendered matches the current active route.
 */
function useCheckIfRouteHasRemainedUnchanged(videoUrl) {
    // Determines whether the component is still rendered on the initially rendered route.
    const isOnInitialRenderedRouteRef = (0, react_1.useRef)(undefined);
    const navigation = (0, native_1.useNavigation)();
    const { shouldUseNarrowLayout, isInNarrowPaneModal } = (0, useResponsiveLayout_1.default)();
    /**
     * Return true only when on the initially rendered route or the video is currently playing in attachment modal.
     */
    const hasRouteRemainedUnchanged = (0, react_1.useCallback)(() => {
        if (navigation.isFocused()) {
            return true;
        }
        // If navigating away from the initially rendered route or attachment route
        if (!isOnInitialRenderedRouteRef.current) {
            return false;
        }
        // If on AttachmentModal, only play when the source parameters match videoUrl ensures correct play VideoPlayer share for this one
        const currentRoute = Navigation_1.navigationRef.getCurrentRoute();
        if (currentRoute?.name === SCREENS_1.default.ATTACHMENTS &&
            currentRoute?.params &&
            'source' in currentRoute.params &&
            currentRoute.params.source === videoUrl &&
            // Because the video player is shared only on large screens
            // Allow in RHP in cases where we're in RHP on the Search page
            (!shouldUseNarrowLayout || isInNarrowPaneModal)) {
            return true;
        }
        return false;
    }, [shouldUseNarrowLayout, isInNarrowPaneModal, videoUrl, navigation]);
    // Initialize and check if starting with the attachment modal
    (0, react_1.useEffect)(() => {
        Navigation_1.default.isNavigationReady().then(() => {
            if (isOnInitialRenderedRouteRef.current !== undefined) {
                return;
            }
            const route = Navigation_1.navigationRef.getCurrentRoute();
            // If the app is launched with the attachment route, it will always remain on the report screen.
            // Thus, it can be considered as still being on the rendered route.
            isOnInitialRenderedRouteRef.current = navigation.isFocused() || route?.name === SCREENS_1.default.ATTACHMENTS;
        });
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(() => {
        const unsubscribeFocus = navigation.addListener('focus', () => {
            isOnInitialRenderedRouteRef.current = true;
        });
        const unsubscribeBlur = navigation.addListener('blur', () => {
            const route = Navigation_1.navigationRef.getCurrentRoute();
            if (route?.name === SCREENS_1.default.ATTACHMENTS) {
                // Skip route update when attachment modal is opened
                return;
            }
            isOnInitialRenderedRouteRef.current = false;
        });
        return () => {
            unsubscribeFocus();
            unsubscribeBlur();
        };
    }, [navigation]);
    return hasRouteRemainedUnchanged;
}
exports.default = useCheckIfRouteHasRemainedUnchanged;
