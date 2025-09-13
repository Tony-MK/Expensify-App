"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.navigateToQuickAction = navigateToQuickAction;
exports.getQuickActionRequestType = getQuickActionRequestType;
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const IOU_1 = require("./IOU");
const Task_1 = require("./Task");
function getQuickActionRequestType(action) {
    if (!action) {
        return;
    }
    let requestType;
    if ([CONST_1.default.QUICK_ACTIONS.REQUEST_MANUAL, CONST_1.default.QUICK_ACTIONS.SPLIT_MANUAL, CONST_1.default.QUICK_ACTIONS.TRACK_MANUAL].some((a) => a === action)) {
        requestType = CONST_1.default.IOU.REQUEST_TYPE.MANUAL;
    }
    else if ([CONST_1.default.QUICK_ACTIONS.REQUEST_SCAN, CONST_1.default.QUICK_ACTIONS.SPLIT_SCAN, CONST_1.default.QUICK_ACTIONS.TRACK_SCAN].some((a) => a === action)) {
        requestType = CONST_1.default.IOU.REQUEST_TYPE.SCAN;
    }
    else if ([CONST_1.default.QUICK_ACTIONS.REQUEST_DISTANCE, CONST_1.default.QUICK_ACTIONS.SPLIT_DISTANCE, CONST_1.default.QUICK_ACTIONS.TRACK_DISTANCE].some((a) => a === action)) {
        requestType = CONST_1.default.IOU.REQUEST_TYPE.DISTANCE;
    }
    else if (action === CONST_1.default.QUICK_ACTIONS.PER_DIEM) {
        requestType = CONST_1.default.IOU.REQUEST_TYPE.PER_DIEM;
    }
    return requestType;
}
function navigateToQuickAction(isValidReport, quickAction, selectOption, isManualDistanceTrackingEnabled) {
    const reportID = isValidReport && quickAction?.chatReportID ? quickAction?.chatReportID : (0, ReportUtils_1.generateReportID)();
    const requestType = getQuickActionRequestType(quickAction?.action);
    switch (quickAction?.action) {
        case CONST_1.default.QUICK_ACTIONS.REQUEST_MANUAL:
        case CONST_1.default.QUICK_ACTIONS.REQUEST_SCAN:
        case CONST_1.default.QUICK_ACTIONS.PER_DIEM:
            selectOption(() => (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.SUBMIT, reportID, requestType, true), true);
            break;
        case CONST_1.default.QUICK_ACTIONS.SPLIT_MANUAL:
        case CONST_1.default.QUICK_ACTIONS.SPLIT_SCAN:
        case CONST_1.default.QUICK_ACTIONS.SPLIT_DISTANCE:
            selectOption(() => (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.SPLIT, reportID, requestType, true), true);
            break;
        case CONST_1.default.QUICK_ACTIONS.SEND_MONEY:
            selectOption(() => (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.PAY, reportID, undefined, true), false);
            break;
        case CONST_1.default.QUICK_ACTIONS.ASSIGN_TASK:
            selectOption(() => (0, Task_1.startOutCreateTaskQuickAction)(isValidReport ? reportID : '', quickAction.targetAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID), false);
            break;
        case CONST_1.default.QUICK_ACTIONS.TRACK_MANUAL:
        case CONST_1.default.QUICK_ACTIONS.TRACK_SCAN:
            selectOption(() => (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.TRACK, reportID, requestType, true), false);
            break;
        case CONST_1.default.QUICK_ACTIONS.REQUEST_DISTANCE:
            if (isManualDistanceTrackingEnabled) {
                selectOption(() => (0, IOU_1.startDistanceRequest)(CONST_1.default.IOU.TYPE.SUBMIT, reportID, requestType, true), false);
                return;
            }
            selectOption(() => (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.SUBMIT, reportID, requestType, true), true);
            break;
        case CONST_1.default.QUICK_ACTIONS.TRACK_DISTANCE:
            if (isManualDistanceTrackingEnabled) {
                selectOption(() => (0, IOU_1.startDistanceRequest)(CONST_1.default.IOU.TYPE.TRACK, reportID, requestType, true), false);
                return;
            }
            selectOption(() => (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.TRACK, reportID, requestType, true), false);
            break;
        default:
    }
}
