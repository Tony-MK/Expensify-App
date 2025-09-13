"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const react_1 = require("react");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useOnyx_1 = require("@hooks/useOnyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const getComponentDisplayName_1 = require("@libs/getComponentDisplayName");
const ReportUtils_1 = require("@libs/ReportUtils");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function default_1(WrappedComponent, shouldIncludeDeprecatedIOUType = false) {
    // eslint-disable-next-line rulesdir/no-negated-variables
    function WithWritableReportOrNotFound(props) {
        const { route } = props;
        const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${route.params.reportID}`, { canBeMissing: true });
        const [isLoadingApp = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
        const [reportDraft] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT}${route.params.reportID}`, { canBeMissing: true });
        const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
        const iouTypeParamIsInvalid = !Object.values(CONST_1.default.IOU.TYPE)
            .filter((type) => shouldIncludeDeprecatedIOUType || (type !== CONST_1.default.IOU.TYPE.REQUEST && type !== CONST_1.default.IOU.TYPE.SEND))
            .includes(route.params?.iouType);
        const isEditing = 'action' in route.params && route.params?.action === CONST_1.default.IOU.ACTION.EDIT;
        (0, react_1.useEffect)(() => {
            if (!!report?.reportID || !route.params.reportID || !!reportDraft || !isEditing) {
                return;
            }
            (0, Report_1.openReport)(route.params.reportID);
            // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
        }, []);
        if (isEditing && isLoadingApp) {
            return <FullscreenLoadingIndicator_1.default />;
        }
        if (iouTypeParamIsInvalid || !(0, ReportUtils_1.canUserPerformWriteAction)(report ?? { reportID: '' }, isReportArchived)) {
            return <FullPageNotFoundView_1.default shouldShow/>;
        }
        return (<WrappedComponent 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props} report={report} reportDraft={reportDraft}/>);
    }
    WithWritableReportOrNotFound.displayName = `withWritableReportOrNotFound(${(0, getComponentDisplayName_1.default)(WrappedComponent)})`;
    return WithWritableReportOrNotFound;
}
