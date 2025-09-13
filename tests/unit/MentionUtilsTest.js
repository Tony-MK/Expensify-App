"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MentionUtils_1 = require("@libs/MentionUtils");
const CONST_1 = require("@src/CONST");
describe('MentionUtils', () => {
    describe('getReportMentionDetails', () => {
        it('should return the room report ID', () => {
            const reportID = '1';
            const mentionDetails = (0, MentionUtils_1.getReportMentionDetails)('', { policyID: '1' }, { [reportID]: { reportID, reportName: '#hello', policyID: '1', chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM } }, { data: '#hello' });
            expect(mentionDetails?.reportID).toBe(reportID);
        });
        it('should return undefined report ID when the report is not a room', () => {
            const reportID = '1';
            const mentionDetails = (0, MentionUtils_1.getReportMentionDetails)('', { policyID: '1' }, { [reportID]: { reportID, reportName: '#hello', policyID: '1' } }, { data: '#hello' });
            expect(mentionDetails?.reportID).toBeUndefined();
        });
    });
});
