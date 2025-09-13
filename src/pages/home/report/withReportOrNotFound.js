"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
/* eslint-disable rulesdir/no-negated-variables */
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useOnyx_1 = require("@hooks/useOnyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const Report_1 = require("@libs/actions/Report");
const getComponentDisplayName_1 = require("@libs/getComponentDisplayName");
const ReportUtils_1 = require("@libs/ReportUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function default_1(shouldRequireReportID = true) {
    return function (WrappedComponent) {
        function WithReportOrNotFound(props, ref) {
            const [betas] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: false });
            const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${props.route.params.reportID}`, { canBeMissing: true });
            const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.policyID}`, { canBeMissing: true });
            const [reportMetadata] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${props.route.params.reportID}`, { canBeMissing: true });
            const [isLoadingReportData] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_REPORT_DATA, { canBeMissing: true });
            const isFocused = (0, native_1.useIsFocused)();
            const contentShown = react_1.default.useRef(false);
            const isReportIdInRoute = !!props.route.params.reportID?.length;
            const isReportLoaded = !(0, EmptyObject_1.isEmptyObject)(report) && !!report?.reportID;
            const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
            // The `isLoadingInitialReportActions` value will become `false` only after the first OpenReport API call is finished (either succeeded or failed)
            const shouldFetchReport = isReportIdInRoute && reportMetadata?.isLoadingInitialReportActions !== false;
            // When accessing certain report-dependant pages (e.g. Task Title) by deeplink, the OpenReport API is not called,
            // So we need to call OpenReport API here to make sure the report data is loaded if it exists on the Server
            (0, react_1.useEffect)(() => {
                if (isReportLoaded || !shouldFetchReport) {
                    // If the report is not required or is already loaded, we don't need to call the API
                    return;
                }
                (0, Report_1.openReport)(props.route.params.reportID);
                // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
            }, [shouldFetchReport, isReportLoaded, props.route.params.reportID]);
            if (shouldRequireReportID || isReportIdInRoute) {
                const shouldShowFullScreenLoadingIndicator = !isReportLoaded && (isLoadingReportData !== false || shouldFetchReport);
                const shouldShowNotFoundPage = !isReportLoaded || !(0, ReportUtils_1.canAccessReport)(report, betas, isReportArchived);
                // If the content was shown, but it's not anymore, that means the report was deleted, and we are probably navigating out of this screen.
                // Return null for this case to avoid rendering FullScreenLoadingIndicator or NotFoundPage when animating transition.
                // eslint-disable-next-line react-compiler/react-compiler
                if (shouldShowNotFoundPage && contentShown.current && !isFocused) {
                    return null;
                }
                if (shouldShowFullScreenLoadingIndicator) {
                    return <FullscreenLoadingIndicator_1.default />;
                }
                if (shouldShowNotFoundPage) {
                    return <NotFoundPage_1.default isReportRelatedPage/>;
                }
            }
            // eslint-disable-next-line react-compiler/react-compiler
            if (!contentShown.current) {
                // eslint-disable-next-line react-compiler/react-compiler
                contentShown.current = true;
            }
            return (<WrappedComponent 
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props} report={report} betas={betas} policy={policy} reportMetadata={reportMetadata} isLoadingReportData={isLoadingReportData} ref={ref}/>);
        }
        WithReportOrNotFound.displayName = `withReportOrNotFound(${(0, getComponentDisplayName_1.default)(WrappedComponent)})`;
        return react_1.default.forwardRef(WithReportOrNotFound);
    };
}
