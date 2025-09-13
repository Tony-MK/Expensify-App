"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function IOURequestRedirectToStartPage({ route: { params: { iouType, iouRequestType }, }, }) {
    const isIouTypeValid = Object.values(CONST_1.default.IOU.TYPE).includes(iouType);
    const isIouRequestTypeValid = Object.values(CONST_1.default.IOU.REQUEST_TYPE).includes(iouRequestType);
    (0, react_1.useEffect)(() => {
        if (!isIouTypeValid || !isIouRequestTypeValid) {
            return;
        }
        // Dismiss this modal because the redirects below will open a new modal and there shouldn't be two modals stacked on top of each other.
        Navigation_1.default.dismissModal();
        // Redirect the person to the right start page using a random reportID
        const optimisticReportID = (0, ReportUtils_1.generateReportID)();
        if (iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE) {
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_CREATE_TAB_DISTANCE.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, optimisticReportID));
        }
        else if (iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.MANUAL) {
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_CREATE_TAB_MANUAL.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, optimisticReportID));
        }
        else if (iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.SCAN) {
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_CREATE_TAB_SCAN.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, optimisticReportID));
        }
        else if (iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MAP) {
            Navigation_1.default.navigate(ROUTES_1.default.DISTANCE_REQUEST_CREATE_TAB_MAP.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, optimisticReportID));
        }
        else if (iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MANUAL) {
            Navigation_1.default.navigate(ROUTES_1.default.DISTANCE_REQUEST_CREATE_TAB_MANUAL.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, optimisticReportID));
        }
        // This useEffect should only run on mount which is why there are no dependencies being passed in the second parameter
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    if (!isIouTypeValid || !isIouRequestTypeValid) {
        return (<ScreenWrapper_1.default testID={IOURequestRedirectToStartPage.displayName}>
                <FullPageNotFoundView_1.default shouldShow/>
            </ScreenWrapper_1.default>);
    }
    return null;
}
IOURequestRedirectToStartPage.displayName = 'IOURequestRedirectToStartPage';
exports.default = IOURequestRedirectToStartPage;
