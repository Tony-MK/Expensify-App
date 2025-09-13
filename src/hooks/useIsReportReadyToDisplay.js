"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ReportUtils_1 = require("@libs/ReportUtils");
function useIsReportReadyToDisplay(report, reportIDFromRoute, isReportArchived = false) {
    /**
     * When false the report is not ready to be fully displayed
     */
    const isCurrentReportLoadedFromOnyx = (0, react_1.useMemo)(() => {
        // This is necessary so that when we are retrieving the next report data from Onyx the ReportActionsView will remount completely
        const isTransitioning = report && report?.reportID !== reportIDFromRoute;
        return reportIDFromRoute !== '' && !!report?.reportID && !isTransitioning;
    }, [report, reportIDFromRoute]);
    const isEditingDisabled = (0, react_1.useMemo)(() => !isCurrentReportLoadedFromOnyx || !(0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived), [isCurrentReportLoadedFromOnyx, report, isReportArchived]);
    return {
        isCurrentReportLoadedFromOnyx,
        isEditingDisabled,
    };
}
exports.default = useIsReportReadyToDisplay;
