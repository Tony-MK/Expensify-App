"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.originalMessageR14932 = exports.actionR98765 = exports.actionR14932 = void 0;
const CONST_1 = require("@src/CONST");
const usersIDs = [15593135, 51760358, 26502375];
const amount = 10402;
const currency = CONST_1.default.CURRENCY.USD;
const REPORT_R98765 = {
    IOUReportID: 'IOU_REPORT_ID_R98765',
    IOUTransactionID: 'TRANSACTION_ID_R98765',
    reportActionID: 'REPORT_ACTION_ID_R98765',
    childReportID: 'CHILD_REPORT_ID_R98765',
};
const REPORT_R14932 = {
    IOUReportID: 'IOU_REPORT_ID_R14932',
    IOUTransactionID: 'TRANSACTION_ID_R14932',
    reportActionID: 'REPORT_ACTION_ID_R14932',
    childReportID: 'CHILD_REPORT_ID_R14932',
};
const originalMessageR14932 = {
    currency,
    amount,
    IOUReportID: REPORT_R14932.IOUReportID,
    IOUTransactionID: REPORT_R14932.IOUTransactionID,
    participantAccountIDs: usersIDs,
    type: CONST_1.default.IOU.TYPE.CREATE,
    lastModified: '2025-02-14 08:12:05.165',
    comment: '',
};
exports.originalMessageR14932 = originalMessageR14932;
const message = [
    {
        type: CONST_1.default.REPORT.MESSAGE.TYPE.COMMENT,
        html: '$0.01 expense',
        text: '$0.01 expense',
        isEdited: false,
        whisperedTo: [],
        isDeletedParentAction: false,
        deleted: '',
    },
];
const person = [
    {
        type: 'TEXT',
        style: 'strong',
        text: 'John Smith',
    },
];
const actionR14932 = {
    person,
    message,
    reportActionID: REPORT_R14932.reportActionID,
    childReportID: REPORT_R14932.childReportID,
    originalMessage: originalMessageR14932,
    actorAccountID: usersIDs.at(0),
    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
    childType: CONST_1.default.REPORT.TYPE.CHAT,
    childReportName: 'Expense #R14932',
    created: '2025-02-14 08:12:05.165',
};
exports.actionR14932 = actionR14932;
const originalMessageR98765 = {
    amount,
    currency,
    IOUReportID: REPORT_R98765.IOUReportID,
    IOUTransactionID: REPORT_R98765.IOUTransactionID,
    participantAccountIDs: usersIDs,
    type: CONST_1.default.IOU.TYPE.CREATE,
    comment: '',
    lastModified: '2025-02-20 08:10:05.165',
};
const actionR98765 = {
    message,
    person,
    reportActionID: REPORT_R98765.reportActionID,
    childReportID: REPORT_R98765.childReportID,
    originalMessage: originalMessageR98765,
    actorAccountID: usersIDs.at(0),
    childType: CONST_1.default.REPORT.TYPE.CHAT,
    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
    created: '2025-02-14 08:12:05.165',
};
exports.actionR98765 = actionR98765;
