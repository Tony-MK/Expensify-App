"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomDate = void 0;
exports.default = createRandomReportAction;
const falso_1 = require("@ngneat/falso");
const date_fns_1 = require("date-fns");
const CONST_1 = require("@src/CONST");
const flattenActionNamesValues = (actionNames) => {
    let result = [];
    Object.values(actionNames).forEach((value) => {
        if (typeof value === 'object') {
            result = result.concat(flattenActionNamesValues(value));
        }
        else {
            result.push(value);
        }
    });
    return result;
};
const getRandomDate = () => {
    const randomTimestamp = Math.random() * new Date().getTime();
    const randomDate = new Date(randomTimestamp);
    const formattedDate = (0, date_fns_1.format)(randomDate, CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
    return formattedDate;
};
exports.getRandomDate = getRandomDate;
const deprecatedReportActions = [
    CONST_1.default.REPORT.ACTIONS.TYPE.DELETED_ACCOUNT,
    CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_REQUESTED,
    CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_SETUP_REQUESTED,
    CONST_1.default.REPORT.ACTIONS.TYPE.DONATION,
];
function createRandomReportAction(index) {
    return {
        // We need to assert the type of actionName so that rest of the properties are inferred correctly
        actionName: (0, falso_1.rand)(flattenActionNamesValues(CONST_1.default.REPORT.ACTIONS.TYPE).filter((actionType) => !deprecatedReportActions.includes(actionType))),
        reportActionID: index.toString(),
        actorAccountID: index,
        person: [
            {
                type: (0, falso_1.randWord)(),
                style: (0, falso_1.randWord)(),
                text: (0, falso_1.randWord)(),
            },
        ],
        created: getRandomDate(),
        message: [
            {
                type: (0, falso_1.randWord)(),
                html: (0, falso_1.randWord)(),
                style: (0, falso_1.randWord)(),
                text: (0, falso_1.randWord)(),
                isEdited: (0, falso_1.randBoolean)(),
                isDeletedParentAction: (0, falso_1.randBoolean)(),
                whisperedTo: (0, falso_1.randAggregation)(),
            },
        ],
        originalMessage: {
            html: (0, falso_1.randWord)(),
            lastModified: getRandomDate(),
            whisperedTo: (0, falso_1.randAggregation)(),
        },
        avatar: (0, falso_1.randWord)(),
        automatic: (0, falso_1.randBoolean)(),
        shouldShow: (0, falso_1.randBoolean)(),
        lastModified: getRandomDate(),
        delegateAccountID: index,
        errors: {},
        isAttachmentOnly: (0, falso_1.randBoolean)(),
    };
}
