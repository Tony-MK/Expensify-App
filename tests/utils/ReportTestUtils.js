"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMockedReportActionsMap = exports.getMockedSortedReportActions = exports.getFakeReportAction = void 0;
const CONST_1 = require("@src/CONST");
const reportActions_1 = require("./collections/reportActions");
const actionNames = [CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT, CONST_1.default.REPORT.ACTIONS.TYPE.IOU, CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW, CONST_1.default.REPORT.ACTIONS.TYPE.CLOSED];
const getFakeReportAction = (index, overrides = {}) => ({
    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED,
    actorAccountID: index,
    automatic: false,
    avatar: '',
    created: '2023-09-12 16:27:35.124',
    isAttachmentOnly: true,
    isFirstItem: false,
    lastModified: '2021-07-14T15:00:00Z',
    message: [
        {
            html: 'hey',
            isDeletedParentAction: false,
            isEdited: false,
            text: 'test',
            type: 'TEXT',
            whisperedTo: [],
        },
    ],
    originalMessage: {
        html: 'hey',
        lastModified: '2021-07-14T15:00:00Z',
        // IOUReportID: index,
        linkedReportID: index.toString(),
        whisperedTo: [],
        reason: '',
        violationName: '',
    },
    pendingAction: null,
    person: [
        {
            type: 'TEXT',
            style: 'strong',
            text: 'email@test.com',
        },
    ],
    reportActionID: index.toString(),
    sequenceNumber: 0,
    shouldShow: true,
    ...overrides,
});
exports.getFakeReportAction = getFakeReportAction;
const getMockedSortedReportActions = (length = 100) => Array.from({ length }, (element, index) => {
    const actionName = index === 0 ? 'CREATED' : 'ADDCOMMENT';
    return getFakeReportAction(index + 1, { actionName });
}).reverse();
exports.getMockedSortedReportActions = getMockedSortedReportActions;
const getMockedReportActionsMap = (length = 100) => {
    const mockReports = Array.from({ length }, (element, index) => {
        const reportID = index + 1;
        const actionName = index === 0 ? 'CREATED' : (actionNames.at(index % actionNames.length) ?? 'CREATED');
        const reportAction = {
            ...(0, reportActions_1.default)(reportID),
            actionName,
            originalMessage: {
                linkedReportID: reportID.toString(),
            },
        };
        return { [reportID]: reportAction };
    });
    return Object.assign({}, ...mockReports);
};
exports.getMockedReportActionsMap = getMockedReportActionsMap;
