"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useOnyx_1 = require("@hooks/useOnyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const Report_1 = require("@libs/actions/Report");
const getComponentDisplayName_1 = require("@libs/getComponentDisplayName");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const ReportUtils_1 = require("@libs/ReportUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function default_1(WrappedComponent) {
    function WithReportOrNotFound(props, ref) {
        const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${props.route.params.reportID}`, { canBeMissing: true });
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const [parentReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${(0, getNonEmptyStringOnyxID_1.default)(report?.parentReportID)}`, { canBeMissing: true });
        const [reportMetadata] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${props.route.params.reportID}`, { canBeMissing: true });
        const [isLoadingReportData] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_REPORT_DATA, { canBeMissing: true });
        const [betas] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: false });
        const [reportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${props.route.params.reportID}`, { canEvict: false, canBeMissing: true });
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const [parentReportAction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${(0, getNonEmptyStringOnyxID_1.default)(report?.parentReportID)}`, {
            selector: (parentReportActions) => {
                const parentReportActionID = report?.parentReportActionID;
                if (!parentReportActionID) {
                    return null;
                }
                return parentReportActions?.[parentReportActionID] ?? null;
            },
            canEvict: false,
            canBeMissing: true,
        });
        const linkedReportAction = (0, react_1.useMemo)(() => {
            let reportAction = reportActions?.[`${props.route.params.reportActionID}`];
            // Handle threads if needed
            if (!reportAction?.reportActionID) {
                reportAction = parentReportAction ?? undefined;
            }
            return reportAction;
        }, [reportActions, props.route.params.reportActionID, parentReportAction]);
        const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
        // For small screen, we don't call openReport API when we go to a sub report page by deeplink
        // So we need to call openReport here for small screen
        (0, react_1.useEffect)(() => {
            if (!shouldUseNarrowLayout || (!(0, EmptyObject_1.isEmptyObject)(report) && !(0, EmptyObject_1.isEmptyObject)(linkedReportAction))) {
                return;
            }
            (0, Report_1.openReport)(props.route.params.reportID);
            // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
        }, [shouldUseNarrowLayout, props.route.params.reportID]);
        // Perform all the loading checks
        const isLoadingReport = isLoadingReportData && !report?.reportID;
        const isLoadingReportAction = (0, EmptyObject_1.isEmptyObject)(reportActions) || (reportMetadata?.isLoadingInitialReportActions && (0, EmptyObject_1.isEmptyObject)(linkedReportAction));
        const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
        const shouldHideReport = !isLoadingReport && (!report?.reportID || !(0, ReportUtils_1.canAccessReport)(report, betas, isReportArchived));
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if ((isLoadingReport || isLoadingReportAction) && !shouldHideReport) {
            return <FullscreenLoadingIndicator_1.default />;
        }
        // Perform the access/not found checks
        // Be sure to avoid showing the not-found page while the parent report actions are still being read from Onyx. The parentReportAction will be undefined while it's being read from Onyx
        // and then linkedReportAction will either be a valid parentReportAction or an empty object. In the case of an empty object, then it's OK to show the not-found page.
        if (shouldHideReport || (parentReportAction !== undefined && (0, EmptyObject_1.isEmptyObject)(linkedReportAction))) {
            return <NotFoundPage_1.default />;
        }
        return (<WrappedComponent 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props} report={report} parentReport={parentReport} reportAction={linkedReportAction} parentReportAction={parentReportAction} ref={ref}/>);
    }
    WithReportOrNotFound.displayName = `withReportOrNotFound(${(0, getComponentDisplayName_1.default)(WrappedComponent)})`;
    return react_1.default.forwardRef(WithReportOrNotFound);
}
