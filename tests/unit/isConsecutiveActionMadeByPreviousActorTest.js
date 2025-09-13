"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const CONST_1 = require("@src/CONST");
const ReportTestUtils_1 = require("../utils/ReportTestUtils");
const accountID = 1;
describe('isConsecutiveActionMadeByPreviousActor', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('returns false if current action is missing', () => {
        const result = (0, ReportActionsUtils_1.isConsecutiveActionMadeByPreviousActor)([(0, ReportTestUtils_1.getFakeReportAction)(accountID)], 0);
        expect(result).toBe(false);
    });
    it('returns false if actions are more than 5 minutes apart', () => {
        const actions = [(0, ReportTestUtils_1.getFakeReportAction)(accountID, { created: '2025-01-01T02:00:00Z' }), (0, ReportTestUtils_1.getFakeReportAction)(accountID, { created: '2025-01-01T01:01:00Z' })];
        const result = (0, ReportActionsUtils_1.isConsecutiveActionMadeByPreviousActor)(actions, 0);
        expect(result).toBe(false);
    });
    it('returns false if previous action is CREATED', () => {
        const actions = [(0, ReportTestUtils_1.getFakeReportAction)(accountID), (0, ReportTestUtils_1.getFakeReportAction)(accountID, { actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED })];
        const result = (0, ReportActionsUtils_1.isConsecutiveActionMadeByPreviousActor)(actions, 0);
        expect(result).toBe(false);
    });
    it('returns false if either action is RENAMED', () => {
        const actions = [(0, ReportTestUtils_1.getFakeReportAction)(accountID), (0, ReportTestUtils_1.getFakeReportAction)(accountID, { actionName: CONST_1.default.REPORT.ACTIONS.TYPE.RENAMED })];
        expect((0, ReportActionsUtils_1.isConsecutiveActionMadeByPreviousActor)(actions, 0)).toBe(false);
        expect((0, ReportActionsUtils_1.isConsecutiveActionMadeByPreviousActor)(actions.toReversed(), 0)).toBe(false);
    });
    it('returns false if delegateAccountIDs differ', () => {
        const actions = [(0, ReportTestUtils_1.getFakeReportAction)(accountID, { delegateAccountID: 100 }), (0, ReportTestUtils_1.getFakeReportAction)(accountID, { delegateAccountID: 101 })];
        expect((0, ReportActionsUtils_1.isConsecutiveActionMadeByPreviousActor)(actions, 0)).toBe(false);
    });
    it('returns false if report preview statuses are mismatched', () => {
        const actions = [(0, ReportTestUtils_1.getFakeReportAction)(accountID, { actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW }), (0, ReportTestUtils_1.getFakeReportAction)(accountID)];
        expect((0, ReportActionsUtils_1.isConsecutiveActionMadeByPreviousActor)(actions, 0)).toBe(false);
        expect((0, ReportActionsUtils_1.isConsecutiveActionMadeByPreviousActor)(actions.toReversed(), 0)).toBe(false);
    });
    it('returns false if the current action is SUBMITTED and the current action adminID is different than previous action actorID', () => {
        const actions = [(0, ReportTestUtils_1.getFakeReportAction)(accountID, { adminAccountID: 3 }), (0, ReportTestUtils_1.getFakeReportAction)(2)];
        const isConsecutiveActionMadeByPreviousActor = (0, ReportActionsUtils_1.isConsecutiveActionMadeByPreviousActor)(actions, 0);
        expect(isConsecutiveActionMadeByPreviousActor).toBe(false);
    });
    it('returns false if the current action is SUBMITTED and the current action adminID is different than previous action actorID', () => {
        const actions = [(0, ReportTestUtils_1.getFakeReportAction)(accountID, { adminAccountID: 3 }), (0, ReportTestUtils_1.getFakeReportAction)(2)];
        const isConsecutiveActionMadeByPreviousActor = (0, ReportActionsUtils_1.isConsecutiveActionMadeByPreviousActor)(actions, 0);
        expect(isConsecutiveActionMadeByPreviousActor).toBe(false);
    });
    it('returns false if the previous action is SUBMITTED and the previous action adminID is different than current action actorID', () => {
        const actions = [(0, ReportTestUtils_1.getFakeReportAction)(2, { actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT }), (0, ReportTestUtils_1.getFakeReportAction)(accountID, { adminAccountID: 3 })];
        const isConsecutiveActionMadeByPreviousActor = (0, ReportActionsUtils_1.isConsecutiveActionMadeByPreviousActor)(actions, 0);
        expect(isConsecutiveActionMadeByPreviousActor).toBe(false);
    });
    it('returns false if the current action is SUBMITTED and the previous action was made by a different actor', () => {
        const actions = [(0, ReportTestUtils_1.getFakeReportAction)(accountID), (0, ReportTestUtils_1.getFakeReportAction)(2)];
        const isConsecutiveActionMadeByPreviousActor = (0, ReportActionsUtils_1.isConsecutiveActionMadeByPreviousActor)(actions, 0);
        expect(isConsecutiveActionMadeByPreviousActor).toBe(false);
    });
    it('returns true if the current action is SUBMITTED and the previous action was made by the same actor', () => {
        const actions = [
            (0, ReportTestUtils_1.getFakeReportAction)(accountID, { actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT }),
            (0, ReportTestUtils_1.getFakeReportAction)(accountID, { actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT }),
        ];
        const isConsecutiveActionMadeByPreviousActor = (0, ReportActionsUtils_1.isConsecutiveActionMadeByPreviousActor)(actions, 0);
        expect(isConsecutiveActionMadeByPreviousActor).toBe(true);
    });
});
