"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModifiedExpenseMessage_1 = require("@libs/ModifiedExpenseMessage");
// eslint-disable-next-line no-restricted-syntax -- this is required to allow mocking
const ReportUtils = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const IntlStore_1 = require("@src/languages/IntlStore");
const Localize_1 = require("@src/libs/Localize");
const reportActions_1 = require("../utils/collections/reportActions");
const reports_1 = require("../utils/collections/reports");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const MOVED_TO_REPORT_ID = '1';
const MOVED_FROM_REPORT_ID = '2';
describe('ModifiedExpenseMessage', () => {
    beforeAll(() => {
        IntlStore_1.default.load(CONST_1.default.LOCALES.EN);
        return (0, waitForBatchedUpdates_1.default)();
    });
    beforeEach(() => {
        // The `getReportName` method is quite complex, and we don't need to test it here
        jest.spyOn(ReportUtils, 'getReportName').mockImplementation((report) => report?.reportName ?? '');
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('getMovedReportID', () => {
        describe('when the report action is a modified expense action', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    movedToReportID: MOVED_TO_REPORT_ID,
                    movedFromReport: MOVED_FROM_REPORT_ID,
                },
            };
            it('returns the movedToReportID when type is REPORT_MOVE_TYPE.TO and movedToReportID exists in reportAction', () => {
                const result = (0, ModifiedExpenseMessage_1.getMovedReportID)(reportAction, CONST_1.default.REPORT.MOVE_TYPE.TO);
                expect(result).toEqual(MOVED_TO_REPORT_ID);
            });
            it('returns the movedFromReport when type is REPORT_MOVE_TYPE.FROM and movedFromReport exists in reportAction', () => {
                const result = (0, ModifiedExpenseMessage_1.getMovedReportID)(reportAction, CONST_1.default.REPORT.MOVE_TYPE.FROM);
                expect(result).toEqual(MOVED_FROM_REPORT_ID);
            });
        });
        describe('when the report action is not a modified expense action', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
                originalMessage: {
                    movedToReportID: MOVED_TO_REPORT_ID,
                    movedFromReport: MOVED_FROM_REPORT_ID,
                },
            };
            it('returns undefined for REPORT_MOVE_TYPE.TO  type', () => {
                const result = (0, ModifiedExpenseMessage_1.getMovedReportID)(reportAction, CONST_1.default.REPORT.MOVE_TYPE.TO);
                expect(result).toBeUndefined();
            });
            it('returns undefined for REPORT_MOVE_TYPE.FROM type', () => {
                const result = (0, ModifiedExpenseMessage_1.getMovedReportID)(reportAction, CONST_1.default.REPORT.MOVE_TYPE.FROM);
                expect(result).toBeUndefined();
            });
        });
        describe('when the original message is missing movedToReportID or movedFromReport', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {},
            };
            it('returns undefined for REPORT_MOVE_TYPE.TO type when movedToReportID is missing', () => {
                const result = (0, ModifiedExpenseMessage_1.getMovedReportID)(reportAction, CONST_1.default.REPORT.MOVE_TYPE.TO);
                expect(result).toBeUndefined();
            });
            it('returns undefined for REPORT_MOVE_TYPE.FROM type when movedFromReport is missing', () => {
                const result = (0, ModifiedExpenseMessage_1.getMovedReportID)(reportAction, CONST_1.default.REPORT.MOVE_TYPE.FROM);
                expect(result).toBeUndefined();
            });
        });
    });
    describe('getMovedFromOrToReportMessage', () => {
        describe('when moving to a report', () => {
            it('returns "moved expense to personal space" message when moving an expense to selfDM', () => {
                const selfDMReport = {
                    ...(0, reports_1.createRandomReport)(1),
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM,
                };
                const result = (0, ModifiedExpenseMessage_1.getMovedFromOrToReportMessage)(undefined, selfDMReport);
                const expectedResult = (0, Localize_1.translate)(CONST_1.default.LOCALES.EN, 'iou.movedToPersonalSpace');
                expect(result).toEqual(expectedResult);
            });
            it('returns "moved expense from personal space to chat with reportName" message when moving an expense to policy expense chat with only reportName', () => {
                const policyExpenseReport = {
                    ...(0, reports_1.createRandomReport)(1),
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                };
                const result = (0, ModifiedExpenseMessage_1.getMovedFromOrToReportMessage)(undefined, policyExpenseReport);
                const expectedResult = (0, Localize_1.translate)(CONST_1.default.LOCALES.EN, 'iou.movedFromPersonalSpace', {
                    reportName: policyExpenseReport.reportName,
                });
                expect(result).toEqual(expectedResult);
            });
            it('returns "moved expense from personal space to policyName" message when moving an expense to policy expense chat with reportName and policyName', () => {
                const policyExpenseReport = {
                    ...(0, reports_1.createRandomReport)(1),
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                    policyName: 'Policy',
                };
                const result = (0, ModifiedExpenseMessage_1.getMovedFromOrToReportMessage)(undefined, policyExpenseReport);
                const expectedResult = (0, Localize_1.translate)(CONST_1.default.LOCALES.EN, 'iou.movedFromPersonalSpace', {
                    reportName: policyExpenseReport.reportName,
                    workspaceName: policyExpenseReport.policyName,
                });
                expect(result).toEqual(expectedResult);
            });
            it('returns "changed the expense" message when moving an expense to policy expense chat without reportName', () => {
                const policyExpenseReport = {
                    ...(0, reports_1.createRandomReport)(1),
                    chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
                    reportName: '',
                };
                const result = (0, ModifiedExpenseMessage_1.getMovedFromOrToReportMessage)(undefined, policyExpenseReport);
                const expectedResult = (0, Localize_1.translate)(CONST_1.default.LOCALES.EN, 'iou.changedTheExpense');
                expect(result).toEqual(expectedResult);
            });
        });
        describe('when moving from a report', () => {
            const movedFromReport = {
                ...(0, reports_1.createRandomReport)(1),
            };
            it('returns "moved expense from reportName" message', () => {
                const result = (0, ModifiedExpenseMessage_1.getMovedFromOrToReportMessage)(movedFromReport, undefined);
                const expectedResult = (0, Localize_1.translate)(CONST_1.default.LOCALES.EN, 'iou.movedFromReport', {
                    reportName: movedFromReport.reportName ?? '',
                });
                expect(result).toEqual(expectedResult);
            });
            it('returns "moved an expense" when reportName is empty', () => {
                const reportWithoutName = {
                    ...(0, reports_1.createRandomReport)(1),
                    reportName: '',
                    chatType: undefined,
                };
                const result = (0, ModifiedExpenseMessage_1.getMovedFromOrToReportMessage)(reportWithoutName, undefined);
                const expectedResult = (0, Localize_1.translate)(CONST_1.default.LOCALES.EN, 'iou.movedFromReport', {
                    reportName: '',
                });
                expect(result).toEqual(expectedResult);
            });
        });
        it('returns undefined when neither movedToReport nor movedFromReport is provided', () => {
            const result = (0, ModifiedExpenseMessage_1.getMovedFromOrToReportMessage)(undefined, undefined);
            expect(result).toBeUndefined();
        });
    });
    describe('getForAction', () => {
        const report = (0, reports_1.createRandomReport)(1);
        describe('when the amount is changed', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    amount: 1800,
                    currency: CONST_1.default.CURRENCY.USD,
                    oldAmount: 1255,
                    oldCurrency: CONST_1.default.CURRENCY.USD,
                },
            };
            it('returns the correct text message', () => {
                const expectedResult = `changed the amount to $18.00 (previously $12.55)`;
                const result = (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID });
                expect(result).toEqual(expectedResult);
            });
        });
        describe('when the amount is changed while the original value was partial', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    amount: 1800,
                    currency: CONST_1.default.CURRENCY.USD,
                    oldAmount: 0,
                    oldCurrency: CONST_1.default.CURRENCY.USD,
                },
            };
            it('returns the correct text message', () => {
                const expectedResult = `set the amount to $18.00`;
                const result = (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID });
                expect(result).toEqual(expectedResult);
            });
        });
        describe('when the amount is changed and the description is removed', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    amount: 1800,
                    currency: CONST_1.default.CURRENCY.USD,
                    oldAmount: 1255,
                    oldCurrency: CONST_1.default.CURRENCY.USD,
                    newComment: '',
                    oldComment: 'this is for the shuttle',
                },
            };
            it('returns the correct text message', () => {
                const expectedResult = 'changed the amount to $18.00 (previously $12.55)\nremoved the description (previously "this is for the shuttle")';
                const result = (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID });
                expect(result).toEqual(expectedResult);
            });
        });
        describe('when the amount is changed, the description is removed, and category is set', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    amount: 1800,
                    currency: CONST_1.default.CURRENCY.USD,
                    oldAmount: 1255,
                    oldCurrency: CONST_1.default.CURRENCY.USD,
                    newComment: '',
                    oldComment: 'this is for the shuttle',
                    category: 'Benefits',
                    oldCategory: '',
                },
            };
            it('returns the correct text message', () => {
                const expectedResult = 'changed the amount to $18.00 (previously $12.55)\nset the category to "Benefits"\nremoved the description (previously "this is for the shuttle")';
                const result = (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID });
                expect(result).toEqual(expectedResult);
            });
        });
        describe('when the amount and merchant are changed', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    merchant: 'Taco Bell',
                    oldMerchant: 'Big Belly',
                    amount: 1800,
                    currency: CONST_1.default.CURRENCY.USD,
                    oldAmount: 1255,
                    oldCurrency: CONST_1.default.CURRENCY.USD,
                },
            };
            it('returns the correct text message', () => {
                const expectedResult = 'changed the amount to $18.00 (previously $12.55) and the merchant to "Taco Bell" (previously "Big Belly")';
                const result = (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID });
                expect(result).toEqual(expectedResult);
            });
        });
        describe('when the amount and merchant are changed, the description is removed, and category is set', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    merchant: 'Taco Bell',
                    oldMerchant: 'Big Belly',
                    amount: 1800,
                    currency: CONST_1.default.CURRENCY.USD,
                    oldAmount: 1255,
                    oldCurrency: CONST_1.default.CURRENCY.USD,
                    newComment: '',
                    oldComment: 'this is for the shuttle',
                    category: 'Benefits',
                    oldCategory: '',
                },
            };
            it('returns the correct text message', () => {
                const expectedResult = 'changed the amount to $18.00 (previously $12.55) and the merchant to "Taco Bell" (previously "Big Belly")\nset the category to "Benefits"\nremoved the description (previously "this is for the shuttle")';
                const result = (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID });
                expect(result).toEqual(expectedResult);
            });
        });
        describe('when the amount, comment and merchant are changed', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    merchant: 'Taco Bell',
                    oldMerchant: 'Big Belly',
                    amount: 1800,
                    currency: CONST_1.default.CURRENCY.USD,
                    oldAmount: 1255,
                    oldCurrency: CONST_1.default.CURRENCY.USD,
                    newComment: 'I bought it on the way',
                    oldComment: 'from the business trip',
                },
            };
            it('returns the correct text message', () => {
                const expectedResult = 'changed the amount to $18.00 (previously $12.55), the description to "I bought it on the way" (previously "from the business trip"), and the merchant to "Taco Bell" (previously "Big Belly")';
                const result = (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID });
                expect(result).toEqual(expectedResult);
            });
        });
        describe('when the merchant is removed', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    merchant: '',
                    oldMerchant: 'Big Belly',
                },
            };
            it('returns the correct text message', () => {
                const expectedResult = `removed the merchant (previously "Big Belly")`;
                const result = (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID });
                expect(result).toEqual(expectedResult);
            });
        });
        describe('when the merchant is changed while the previous merchant was partial', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    merchant: 'KFC',
                    oldMerchant: CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT,
                },
            };
            it('returns the correct text message', () => {
                const expectedResult = `set the merchant to "KFC"`;
                const result = (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID });
                expect(result).toEqual(expectedResult);
            });
        });
        describe('when the merchant and the description are removed', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    merchant: '',
                    oldMerchant: 'Big Belly',
                    newComment: '',
                    oldComment: 'mini shore',
                },
            };
            it('returns the correct text message', () => {
                const expectedResult = `removed the description (previously "mini shore") and the merchant (previously "Big Belly")`;
                const result = (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID });
                expect(result).toEqual(expectedResult);
            });
        });
        describe('when the merchant, the category and the description are removed', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    merchant: '',
                    oldMerchant: 'Big Belly',
                    newComment: '',
                    oldComment: 'mini shore',
                    category: '',
                    oldCategory: 'Benefits',
                },
            };
            it('returns the correct text message', () => {
                const expectedResult = `removed the description (previously "mini shore"), the merchant (previously "Big Belly"), and the category (previously "Benefits")`;
                const result = (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID });
                expect(result).toEqual(expectedResult);
            });
        });
        describe('when the merchant is set', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    oldMerchant: '',
                    merchant: 'Big Belly',
                },
            };
            it('returns the correct text message', () => {
                const expectedResult = `set the merchant to "Big Belly"`;
                const result = (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID });
                expect(result).toEqual(expectedResult);
            });
        });
        describe('when the merchant and the description are set', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    oldMerchant: '',
                    merchant: 'Big Belly',
                    oldComment: '',
                    newComment: 'mini shore',
                },
            };
            it('returns the correct text message', () => {
                const expectedResult = `set the description to "mini shore" and the merchant to "Big Belly"`;
                const result = (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID });
                expect(result).toEqual(expectedResult);
            });
        });
        describe('when the merchant, the category and the description are set', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    oldMerchant: '',
                    merchant: 'Big Belly',
                    oldComment: '',
                    newComment: 'mini shore',
                    oldCategory: '',
                    category: 'Benefits',
                },
            };
            it('returns the correct text message', () => {
                const expectedResult = `set the description to "mini shore", the merchant to "Big Belly", and the category to "Benefits"`;
                const result = (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID });
                expect(result).toEqual(expectedResult);
            });
        });
        describe('when the created date is changed', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    created: '2023-12-27',
                    oldCreated: '2023-12-26',
                },
            };
            it('returns the correct text message', () => {
                const expectedResult = 'changed the date to 2023-12-27 (previously 2023-12-26)';
                const result = (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID });
                expect(result).toEqual(expectedResult);
            });
        });
        describe('when the created date was not changed', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    created: '2023-12-27',
                },
            };
            it('returns the correct text message', () => {
                const expectedResult = 'changed the expense';
                const result = (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID });
                expect(result).toEqual(expectedResult);
            });
        });
        describe('when the distance is changed', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    oldMerchant: '1.00 mi @ $0.70 / mi',
                    merchant: '10.00 mi @ $0.70 / mi',
                    oldAmount: 70,
                    amount: 700,
                    oldCurrency: CONST_1.default.CURRENCY.USD,
                    currency: CONST_1.default.CURRENCY.USD,
                },
            };
            it('then the message says the distance is changed and shows the new and old merchant and amount', () => {
                const expectedResult = `changed the distance to ${reportAction.originalMessage.merchant} (previously ${reportAction.originalMessage.oldMerchant}), which updated the amount to $7.00 (previously $0.70)`;
                const result = (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID });
                expect(result).toEqual(expectedResult);
            });
        });
        describe('when the distance rate is changed', () => {
            const reportAction = {
                ...(0, reportActions_1.default)(1),
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                originalMessage: {
                    oldMerchant: '56.36 mi @ $0.70 / mi',
                    merchant: '56.36 mi @ $0.99 / mi',
                    oldAmount: 3945,
                    amount: 5580,
                    oldCurrency: CONST_1.default.CURRENCY.USD,
                    currency: CONST_1.default.CURRENCY.USD,
                },
            };
            it('then the message says the rate is changed and shows the new and old merchant and amount', () => {
                const expectedResult = `changed the rate to ${reportAction.originalMessage.merchant} (previously ${reportAction.originalMessage.oldMerchant}), which updated the amount to $55.80 (previously $39.45)`;
                const result = (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID });
                expect(result).toEqual(expectedResult);
            });
        });
        describe('when moving an expense', () => {
            it('returns the movedFromOrToReportMessage message when provided', () => {
                const reportAction = {
                    ...(0, reportActions_1.default)(1),
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE,
                };
                const expectedResult = 'moved an expense';
                const movedFromReport = {
                    ...(0, reports_1.createRandomReport)(1),
                    reportName: '',
                    chatType: undefined,
                };
                const result = (0, ModifiedExpenseMessage_1.getForReportAction)({ reportAction, policyID: report.policyID, movedFromReport });
                expect(result).toEqual(expectedResult);
            });
        });
    });
});
