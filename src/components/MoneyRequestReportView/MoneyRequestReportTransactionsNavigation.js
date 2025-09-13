"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const PrevNextButtons_1 = require("@components/PrevNextButtons");
const useOnyx_1 = require("@hooks/useOnyx");
const TransactionThreadNavigation_1 = require("@libs/actions/TransactionThreadNavigation");
const Navigation_1 = require("@navigation/Navigation");
const navigationRef_1 = require("@navigation/navigationRef");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const getEmptyArray_1 = require("@src/types/utils/getEmptyArray");
function MoneyRequestReportTransactionsNavigation({ currentReportID }) {
    const [reportIDsList = (0, getEmptyArray_1.default)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.TRANSACTION_THREAD_NAVIGATION_REPORT_IDS, {
        canBeMissing: true,
    });
    const { prevReportID, nextReportID } = (0, react_1.useMemo)(() => {
        if (!reportIDsList || reportIDsList.length < 2) {
            return { prevReportID: undefined, nextReportID: undefined };
        }
        const currentReportIndex = reportIDsList.findIndex((id) => id === currentReportID);
        const prevID = currentReportIndex > 0 ? reportIDsList.at(currentReportIndex - 1) : undefined;
        const nextID = currentReportIndex <= reportIDsList.length - 1 ? reportIDsList.at(currentReportIndex + 1) : undefined;
        return { prevReportID: prevID, nextReportID: nextID };
    }, [currentReportID, reportIDsList]);
    /**
     * We clear the sibling transactionThreadIDs when unmounting this component
     * only when the mount actually goes to a different SCREEN (and not a different version of the same SCREEN)
     */
    (0, react_1.useEffect)(() => {
        return () => {
            const focusedRoute = (0, native_1.findFocusedRoute)(navigationRef_1.default.getRootState());
            if (focusedRoute?.name === SCREENS_1.default.SEARCH.REPORT_RHP) {
                return;
            }
            (0, TransactionThreadNavigation_1.clearActiveTransactionThreadIDs)();
        };
    }, []);
    if (reportIDsList.length < 2) {
        return;
    }
    return (<PrevNextButtons_1.default isPrevButtonDisabled={!prevReportID} isNextButtonDisabled={!nextReportID} onNext={(e) => {
            const backTo = Navigation_1.default.getActiveRoute();
            e?.preventDefault();
            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_REPORT.getRoute({ reportID: nextReportID, backTo }), { forceReplace: true });
        }} onPrevious={(e) => {
            const backTo = Navigation_1.default.getActiveRoute();
            e?.preventDefault();
            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_REPORT.getRoute({ reportID: prevReportID, backTo }), { forceReplace: true });
        }}/>);
}
MoneyRequestReportTransactionsNavigation.displayName = 'MoneyRequestReportTransactionsNavigation';
exports.default = MoneyRequestReportTransactionsNavigation;
