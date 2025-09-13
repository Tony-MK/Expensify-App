"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isQuickActionAllowed = exports.getIOUType = exports.getQuickActionTitle = exports.getQuickActionIcon = void 0;
const Expensicons = require("@components/Icon/Expensicons");
const CONST_1 = require("@src/CONST");
const getIconForAction_1 = require("./getIconForAction");
const ReportUtils_1 = require("./ReportUtils");
const getQuickActionIcon = (action) => {
    switch (action) {
        case CONST_1.default.QUICK_ACTIONS.REQUEST_MANUAL:
            return (0, getIconForAction_1.default)(CONST_1.default.IOU.TYPE.REQUEST);
        case CONST_1.default.QUICK_ACTIONS.REQUEST_SCAN:
            return Expensicons.ReceiptScan;
        case CONST_1.default.QUICK_ACTIONS.REQUEST_DISTANCE:
            return Expensicons.Car;
        case CONST_1.default.QUICK_ACTIONS.PER_DIEM:
            return Expensicons.CalendarSolid;
        case CONST_1.default.QUICK_ACTIONS.SPLIT_MANUAL:
        case CONST_1.default.QUICK_ACTIONS.SPLIT_SCAN:
        case CONST_1.default.QUICK_ACTIONS.SPLIT_DISTANCE:
            return (0, getIconForAction_1.default)(CONST_1.default.IOU.TYPE.SPLIT);
        case CONST_1.default.QUICK_ACTIONS.SEND_MONEY:
            return (0, getIconForAction_1.default)(CONST_1.default.IOU.TYPE.SEND);
        case CONST_1.default.QUICK_ACTIONS.ASSIGN_TASK:
            return Expensicons.Task;
        case CONST_1.default.QUICK_ACTIONS.TRACK_DISTANCE:
            return Expensicons.Car;
        case CONST_1.default.QUICK_ACTIONS.TRACK_MANUAL:
            return (0, getIconForAction_1.default)(CONST_1.default.IOU.TYPE.TRACK);
        case CONST_1.default.QUICK_ACTIONS.TRACK_SCAN:
            return Expensicons.ReceiptScan;
        case CONST_1.default.QUICK_ACTIONS.CREATE_REPORT:
            return Expensicons.Document;
        default:
            return Expensicons.MoneyCircle;
    }
};
exports.getQuickActionIcon = getQuickActionIcon;
const getIOUType = (action) => {
    switch (action) {
        case CONST_1.default.QUICK_ACTIONS.REQUEST_MANUAL:
        case CONST_1.default.QUICK_ACTIONS.REQUEST_SCAN:
        case CONST_1.default.QUICK_ACTIONS.REQUEST_DISTANCE:
        case CONST_1.default.QUICK_ACTIONS.PER_DIEM:
            return CONST_1.default.IOU.TYPE.SUBMIT;
        case CONST_1.default.QUICK_ACTIONS.SPLIT_MANUAL:
        case CONST_1.default.QUICK_ACTIONS.SPLIT_SCAN:
        case CONST_1.default.QUICK_ACTIONS.SPLIT_DISTANCE:
            return CONST_1.default.IOU.TYPE.SPLIT;
        case CONST_1.default.QUICK_ACTIONS.TRACK_DISTANCE:
        case CONST_1.default.QUICK_ACTIONS.TRACK_MANUAL:
        case CONST_1.default.QUICK_ACTIONS.TRACK_SCAN:
            return CONST_1.default.IOU.TYPE.TRACK;
        case CONST_1.default.QUICK_ACTIONS.SEND_MONEY:
            return CONST_1.default.IOU.TYPE.PAY;
        default:
            return undefined;
    }
};
exports.getIOUType = getIOUType;
const getQuickActionTitle = (action) => {
    switch (action) {
        case CONST_1.default.QUICK_ACTIONS.REQUEST_MANUAL:
        case CONST_1.default.QUICK_ACTIONS.TRACK_MANUAL:
            return 'quickAction.requestMoney';
        case CONST_1.default.QUICK_ACTIONS.REQUEST_SCAN:
        case CONST_1.default.QUICK_ACTIONS.TRACK_SCAN:
            return 'quickAction.scanReceipt';
        case CONST_1.default.QUICK_ACTIONS.REQUEST_DISTANCE:
        case CONST_1.default.QUICK_ACTIONS.TRACK_DISTANCE:
            return 'quickAction.recordDistance';
        case CONST_1.default.QUICK_ACTIONS.PER_DIEM:
            return 'quickAction.perDiem';
        case CONST_1.default.QUICK_ACTIONS.SPLIT_MANUAL:
            return 'quickAction.splitBill';
        case CONST_1.default.QUICK_ACTIONS.SPLIT_SCAN:
            return 'quickAction.splitScan';
        case CONST_1.default.QUICK_ACTIONS.SPLIT_DISTANCE:
            return 'quickAction.splitDistance';
        case CONST_1.default.QUICK_ACTIONS.SEND_MONEY:
            return 'quickAction.paySomeone';
        case CONST_1.default.QUICK_ACTIONS.ASSIGN_TASK:
            return 'quickAction.assignTask';
        default:
            return '';
    }
};
exports.getQuickActionTitle = getQuickActionTitle;
const isManagerMcTestQuickActionReport = (report) => {
    return !!report?.participants?.[CONST_1.default.ACCOUNT_ID.MANAGER_MCTEST];
};
const isQuickActionAllowed = (quickAction, quickActionReport, quickActionPolicy, isReportArchived = false) => {
    const iouType = getIOUType(quickAction?.action);
    if (iouType) {
        // We're disabling QAB for Manager McTest reports to prevent confusion when submitting real data for Manager McTest
        const isReportHasManagerMCTest = isManagerMcTestQuickActionReport(quickActionReport);
        if (isReportHasManagerMCTest) {
            return false;
        }
        return (0, ReportUtils_1.canCreateRequest)(quickActionReport, quickActionPolicy, iouType, isReportArchived);
    }
    if (quickAction?.action === CONST_1.default.QUICK_ACTIONS.PER_DIEM) {
        return !!quickActionPolicy?.arePerDiemRatesEnabled;
    }
    // We don't want to show this QAB since this is already available in the FloatingActionButtonAndPopover
    // In the future, we will remove this when the BE no longer returns this action
    if (quickAction?.action === CONST_1.default.QUICK_ACTIONS.CREATE_REPORT) {
        return false;
    }
    return true;
};
exports.isQuickActionAllowed = isQuickActionAllowed;
