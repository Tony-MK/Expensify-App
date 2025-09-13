"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IOU_1 = require("@libs/actions/IOU");
const QuickActionNavigation_1 = require("@libs/actions/QuickActionNavigation");
const Task_1 = require("@libs/actions/Task");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
jest.mock('@libs/actions/IOU', () => ({
    startMoneyRequest: jest.fn(),
}));
jest.mock('@libs/actions/Report', () => ({
    createNewReport: jest.fn(),
}));
jest.mock('@libs/actions/Task', () => ({
    startOutCreateTaskQuickAction: jest.fn(),
}));
describe('IOU Utils', () => {
    // Given navigateToQuickAction is called with quick action argument when clicking on quick action button from Global create menu
    describe('navigateToQuickAction', () => {
        const reportID = (0, ReportUtils_1.generateReportID)();
        it('should be navigated to Manual Submit Expense', () => {
            // When the quick action is REQUEST_MANUAL
            (0, QuickActionNavigation_1.navigateToQuickAction)(true, { action: CONST_1.default.QUICK_ACTIONS.REQUEST_MANUAL, chatReportID: reportID }, (onSelected) => {
                onSelected();
            });
            // Then we should start manual submit request flow
            expect(IOU_1.startMoneyRequest).toHaveBeenCalledWith(CONST_1.default.IOU.TYPE.SUBMIT, reportID, CONST_1.default.IOU.REQUEST_TYPE.MANUAL, true);
        });
        it('should be navigated to Scan receipt Split Expense', () => {
            // When the quick action is SPLIT_SCAN
            (0, QuickActionNavigation_1.navigateToQuickAction)(true, { action: CONST_1.default.QUICK_ACTIONS.SPLIT_SCAN, chatReportID: reportID }, (onSelected) => {
                onSelected();
            });
            // Then we should start scan split request flow
            expect(IOU_1.startMoneyRequest).toHaveBeenCalledWith(CONST_1.default.IOU.TYPE.SPLIT, reportID, CONST_1.default.IOU.REQUEST_TYPE.SCAN, true);
        });
        it('should be navigated to Track distance Expense', () => {
            // When the quick action is TRACK_DISTANCE
            (0, QuickActionNavigation_1.navigateToQuickAction)(true, { action: CONST_1.default.QUICK_ACTIONS.TRACK_DISTANCE, chatReportID: reportID }, (onSelected) => {
                onSelected();
            });
            // Then we should start distance track request flow
            expect(IOU_1.startMoneyRequest).toHaveBeenCalledWith(CONST_1.default.IOU.TYPE.TRACK, reportID, CONST_1.default.IOU.REQUEST_TYPE.DISTANCE, true);
        });
        it('should be navigated to Per Diem Expense', () => {
            // When the quick action is PER_DIEM
            (0, QuickActionNavigation_1.navigateToQuickAction)(true, { action: CONST_1.default.QUICK_ACTIONS.PER_DIEM, chatReportID: reportID }, (onSelected) => {
                onSelected();
            });
            // Then we should start per diem request flow
            expect(IOU_1.startMoneyRequest).toHaveBeenCalledWith(CONST_1.default.IOU.TYPE.SUBMIT, reportID, CONST_1.default.IOU.REQUEST_TYPE.PER_DIEM, true);
        });
    });
});
describe('Non IOU quickActions test:', () => {
    describe('navigateToQuickAction', () => {
        it('starts create task flow for "assignTask" quick action', () => {
            (0, QuickActionNavigation_1.navigateToQuickAction)(true, { action: CONST_1.default.QUICK_ACTIONS.ASSIGN_TASK, targetAccountID: 123 }, (onSelected) => {
                onSelected();
            });
            expect(Task_1.startOutCreateTaskQuickAction).toHaveBeenCalled();
        });
    });
});
