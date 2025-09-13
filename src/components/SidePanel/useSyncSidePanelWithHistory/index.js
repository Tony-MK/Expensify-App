"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useSyncSidePanelWithHistory;
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var usePrevious_1 = require("@hooks/usePrevious");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useSidePanel_1 = require("@hooks/useSidePanel");
var Navigation_1 = require("@libs/Navigation/Navigation");
var navigationRef_1 = require("@libs/Navigation/navigationRef");
var CONST_1 = require("@src/CONST");
function toggleSidePanelWithHistory(isVisible) {
    Navigation_1.default.isNavigationReady().then(function () {
        navigationRef_1.default.dispatch({
            type: CONST_1.default.NAVIGATION.ACTION_TYPE.TOGGLE_SIDE_PANEL_WITH_HISTORY,
            payload: { isVisible: isVisible },
        });
    });
}
function useSyncSidePanelWithHistory() {
    var _a = (0, useSidePanel_1.default)(), closeSidePanel = _a.closeSidePanel, openSidePanel = _a.openSidePanel, shouldHideSidePanel = _a.shouldHideSidePanel;
    var isExtraLargeScreenWidth = (0, useResponsiveLayout_1.default)().isExtraLargeScreenWidth;
    var lastHistoryEntry = (0, native_1.useNavigationState)(function (state) { var _a; return (_a = state === null || state === void 0 ? void 0 : state.history) === null || _a === void 0 ? void 0 : _a.at(-1); });
    var previousLastHistoryEntry = (0, usePrevious_1.default)(lastHistoryEntry);
    (0, react_1.useEffect)(function () {
        // If the window width has been expanded and the modal is displayed, remove its history entry.
        // The side panel is only synced with the history when it's displayed as RHP.
        if (!shouldHideSidePanel && isExtraLargeScreenWidth) {
            toggleSidePanelWithHistory(false);
            return;
        }
        // When shouldHideSidePanel changes, synchronize the side panel with the browser history.
        toggleSidePanelWithHistory(!shouldHideSidePanel);
    }, [shouldHideSidePanel, isExtraLargeScreenWidth]);
    (0, react_1.useEffect)(function () {
        // The side panel is synced with the browser history only when displayed in RHP.
        if (isExtraLargeScreenWidth) {
            return;
        }
        var hasHistoryChanged = previousLastHistoryEntry !== lastHistoryEntry;
        // If nothing has changed in the browser history, do nothing.
        if (!hasHistoryChanged) {
            return;
        }
        var hasSidePanelBeenClosed = previousLastHistoryEntry === CONST_1.default.NAVIGATION.CUSTOM_HISTORY_ENTRY_SIDE_PANEL;
        // If the side panel history entry is not the last one and the modal is displayed, close it.
        if (hasSidePanelBeenClosed && !shouldHideSidePanel) {
            closeSidePanel();
            return;
        }
        var hasSidePanelBeenOpened = lastHistoryEntry === CONST_1.default.NAVIGATION.CUSTOM_HISTORY_ENTRY_SIDE_PANEL;
        // If the side panel history entry is the last one and the modal is not displayed, open it.
        if (hasSidePanelBeenOpened && shouldHideSidePanel) {
            openSidePanel();
        }
    }, [closeSidePanel, lastHistoryEntry, previousLastHistoryEntry, openSidePanel, shouldHideSidePanel, isExtraLargeScreenWidth]);
}
