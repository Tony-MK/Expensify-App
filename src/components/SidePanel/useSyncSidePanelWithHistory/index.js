"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useSyncSidePanelWithHistory;
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const usePrevious_1 = require("@hooks/usePrevious");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSidePanel_1 = require("@hooks/useSidePanel");
const Navigation_1 = require("@libs/Navigation/Navigation");
const navigationRef_1 = require("@libs/Navigation/navigationRef");
const CONST_1 = require("@src/CONST");
function toggleSidePanelWithHistory(isVisible) {
    Navigation_1.default.isNavigationReady().then(() => {
        navigationRef_1.default.dispatch({
            type: CONST_1.default.NAVIGATION.ACTION_TYPE.TOGGLE_SIDE_PANEL_WITH_HISTORY,
            payload: { isVisible },
        });
    });
}
function useSyncSidePanelWithHistory() {
    const { closeSidePanel, openSidePanel, shouldHideSidePanel } = (0, useSidePanel_1.default)();
    const { isExtraLargeScreenWidth } = (0, useResponsiveLayout_1.default)();
    const lastHistoryEntry = (0, native_1.useNavigationState)((state) => state?.history?.at(-1));
    const previousLastHistoryEntry = (0, usePrevious_1.default)(lastHistoryEntry);
    (0, react_1.useEffect)(() => {
        // If the window width has been expanded and the modal is displayed, remove its history entry.
        // The side panel is only synced with the history when it's displayed as RHP.
        if (!shouldHideSidePanel && isExtraLargeScreenWidth) {
            toggleSidePanelWithHistory(false);
            return;
        }
        // When shouldHideSidePanel changes, synchronize the side panel with the browser history.
        toggleSidePanelWithHistory(!shouldHideSidePanel);
    }, [shouldHideSidePanel, isExtraLargeScreenWidth]);
    (0, react_1.useEffect)(() => {
        // The side panel is synced with the browser history only when displayed in RHP.
        if (isExtraLargeScreenWidth) {
            return;
        }
        const hasHistoryChanged = previousLastHistoryEntry !== lastHistoryEntry;
        // If nothing has changed in the browser history, do nothing.
        if (!hasHistoryChanged) {
            return;
        }
        const hasSidePanelBeenClosed = previousLastHistoryEntry === CONST_1.default.NAVIGATION.CUSTOM_HISTORY_ENTRY_SIDE_PANEL;
        // If the side panel history entry is not the last one and the modal is displayed, close it.
        if (hasSidePanelBeenClosed && !shouldHideSidePanel) {
            closeSidePanel();
            return;
        }
        const hasSidePanelBeenOpened = lastHistoryEntry === CONST_1.default.NAVIGATION.CUSTOM_HISTORY_ENTRY_SIDE_PANEL;
        // If the side panel history entry is the last one and the modal is not displayed, open it.
        if (hasSidePanelBeenOpened && shouldHideSidePanel) {
            openSidePanel();
        }
    }, [closeSidePanel, lastHistoryEntry, previousLastHistoryEntry, openSidePanel, shouldHideSidePanel, isExtraLargeScreenWidth]);
}
