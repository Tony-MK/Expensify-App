"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowContextMenuContext = void 0;
exports.showContextMenuForReport = showContextMenuForReport;
const react_1 = require("react");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const ReportUtils_1 = require("@libs/ReportUtils");
const ReportActionContextMenu_1 = require("@pages/home/report/ContextMenu/ReportActionContextMenu");
const CONST_1 = require("@src/CONST");
const ShowContextMenuContext = (0, react_1.createContext)({
    anchor: null,
    onShowContextMenu: (callback) => callback(),
    report: undefined,
    isReportArchived: false,
    action: undefined,
    transactionThreadReport: undefined,
    checkIfContextMenuActive: () => { },
    isDisabled: true,
    shouldDisplayContextMenu: true,
});
exports.ShowContextMenuContext = ShowContextMenuContext;
ShowContextMenuContext.displayName = 'ShowContextMenuContext';
/**
 * Show the report action context menu.
 *
 * @param event - Press event object
 * @param anchor - Context menu anchor
 * @param reportID - Active Report ID
 * @param action - ReportAction for ContextMenu
 * @param checkIfContextMenuActive Callback to update context menu active state
 * @param isArchivedRoom - Is the report an archived room
 */
function showContextMenuForReport(event, anchor, reportID, action, checkIfContextMenuActive, isArchivedRoom = false) {
    if (!(0, DeviceCapabilities_1.canUseTouchScreen)()) {
        return;
    }
    (0, ReportActionContextMenu_1.showContextMenu)({
        type: CONST_1.default.CONTEXT_MENU_TYPES.REPORT_ACTION,
        event,
        selection: '',
        contextMenuAnchor: anchor,
        report: {
            reportID,
            originalReportID: reportID ? (0, ReportUtils_1.getOriginalReportID)(reportID, action) : undefined,
            isArchivedRoom,
        },
        reportAction: {
            reportActionID: action?.reportActionID,
        },
        callbacks: {
            onShow: checkIfContextMenuActive,
            onHide: checkIfContextMenuActive,
        },
    });
}
