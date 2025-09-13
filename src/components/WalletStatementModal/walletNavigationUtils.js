"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
/**
 * Handles navigation for wallet statement actions
 */
function handleWalletStatementNavigation(type, url) {
    if (!type || (type !== CONST_1.default.WALLET.WEB_MESSAGE_TYPE.STATEMENT && type !== CONST_1.default.WALLET.WEB_MESSAGE_TYPE.CONCIERGE)) {
        return;
    }
    if (type === CONST_1.default.WALLET.WEB_MESSAGE_TYPE.CONCIERGE) {
        (0, Report_1.navigateToConciergeChat)();
        return;
    }
    if (type === CONST_1.default.WALLET.WEB_MESSAGE_TYPE.STATEMENT && url) {
        const iouRoutes = {
            [CONST_1.default.WALLET.STATEMENT_ACTIONS.SUBMIT_EXPENSE]: ROUTES_1.default.MONEY_REQUEST_CREATE.getRoute(CONST_1.default.IOU.ACTION.CREATE, CONST_1.default.IOU.TYPE.SUBMIT, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, (0, ReportUtils_1.generateReportID)()),
            [CONST_1.default.WALLET.STATEMENT_ACTIONS.PAY_SOMEONE]: ROUTES_1.default.MONEY_REQUEST_CREATE.getRoute(CONST_1.default.IOU.ACTION.CREATE, CONST_1.default.IOU.TYPE.PAY, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, String(CONST_1.default.DEFAULT_NUMBER_ID)),
            [CONST_1.default.WALLET.STATEMENT_ACTIONS.SPLIT_EXPENSE]: ROUTES_1.default.MONEY_REQUEST_CREATE.getRoute(CONST_1.default.IOU.ACTION.CREATE, CONST_1.default.IOU.TYPE.SPLIT, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, (0, ReportUtils_1.generateReportID)()),
        };
        const navigateToIOURoute = Object.keys(iouRoutes).find((iouRoute) => url.includes(iouRoute));
        if (navigateToIOURoute && iouRoutes[navigateToIOURoute]) {
            Navigation_1.default.navigate(iouRoutes[navigateToIOURoute]);
        }
    }
}
exports.default = handleWalletStatementNavigation;
