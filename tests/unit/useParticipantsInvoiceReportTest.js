"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const useParticipantsInvoiceReport_1 = require("@hooks/useParticipantsInvoiceReport");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const reports_1 = require("../utils/collections/reports");
const accountID = 12345;
const mockPolicyID = '123';
const activeReportID = 12;
const archivedReportID = 233;
const activeBusinessReportID = 456;
const archivedBusinessReportID = 789;
const activeBusinessPolicyID = 'active_policy_123';
const archivedBusinessPolicyID = 'archived_policy_456';
const activeIndividualInvoiceReceiver = {
    accountID,
    type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL,
};
const archivedIndividualReportInvoiceReceiver = {
    accountID: 67890,
    type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL,
};
const archivedReportNameValuePairs = {
    private_isArchived: '12-3-2024',
};
const activeBusinessInvoiceReceiver = {
    policyID: activeBusinessPolicyID,
    type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.BUSINESS,
};
const archivedBusinessInvoiceReceiver = {
    policyID: archivedBusinessPolicyID,
    type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.BUSINESS,
};
const mockActiveIndividualInvoiceReport = { ...(0, reports_1.createInvoiceRoom)(activeReportID), invoiceReceiver: activeIndividualInvoiceReceiver, policyID: mockPolicyID };
const mockArchivedIndividualInvoiceReport = { ...(0, reports_1.createInvoiceRoom)(archivedReportID), invoiceReceiver: archivedIndividualReportInvoiceReceiver, policyID: mockPolicyID };
const mockActiveBusinessInvoiceReport = { ...(0, reports_1.createInvoiceRoom)(activeBusinessReportID), invoiceReceiver: activeBusinessInvoiceReceiver, policyID: activeBusinessPolicyID };
const mockArchivedBusinessInvoiceReport = { ...(0, reports_1.createInvoiceRoom)(archivedBusinessReportID), invoiceReceiver: archivedBusinessInvoiceReceiver, policyID: archivedBusinessPolicyID };
describe('useParticipantsInvoiceReport', () => {
    describe('Individual Invoice Receiver', () => {
        beforeEach(() => {
            react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
        });
        afterEach(() => {
            react_native_onyx_1.default.clear();
        });
        it('should return the invoice report when there is an active individual invoice report', async () => {
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockActiveIndividualInvoiceReport?.reportID}`, mockActiveIndividualInvoiceReport);
            const { result, rerender } = (0, react_native_1.renderHook)(({ receiverID, receiverType, policyID }) => (0, useParticipantsInvoiceReport_1.default)(receiverID, receiverType, policyID), {
                initialProps: { receiverID: accountID, receiverType: activeIndividualInvoiceReceiver.type, policyID: mockPolicyID },
            });
            // Should return the active individual invoice report when receiverID, receiverType, and policyID match
            expect(result.current).toEqual(mockActiveIndividualInvoiceReport);
            // Should return undefined when the receiverID does not match
            const differentReceiverID = 99999;
            rerender({ receiverID: differentReceiverID, receiverType: activeIndividualInvoiceReceiver.type, policyID: mockPolicyID });
            expect(result.current).toBeUndefined();
            // Should return undefined when when policyID does not match
            const differentPolicyID = 'different_policyID_999807';
            rerender({ receiverID: accountID, receiverType: activeIndividualInvoiceReceiver.type, policyID: differentPolicyID });
            expect(result.current).toBeUndefined();
        });
        it('should return undefined when the invoice report is archived', async () => {
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockArchivedIndividualInvoiceReport?.reportID}`, mockArchivedIndividualInvoiceReport);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${mockArchivedIndividualInvoiceReport?.reportID}`, archivedReportNameValuePairs);
            const { result } = (0, react_native_1.renderHook)(({ receiverID, receiverType, policyID }) => (0, useParticipantsInvoiceReport_1.default)(receiverID, receiverType, policyID), {
                initialProps: { receiverID: archivedIndividualReportInvoiceReceiver.accountID, receiverType: archivedIndividualReportInvoiceReceiver.type, policyID: mockPolicyID },
            });
            // Should return undefined when the invoice report is archived
            expect(result.current).toBeUndefined();
        });
        it('should return undefined when the report is not an invoice report', async () => {
            const expenseReport = { ...(0, reports_1.createExpenseReport)(5645), invoiceReceiver: activeIndividualInvoiceReceiver, policyID: mockPolicyID };
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`, expenseReport);
            const { result } = (0, react_native_1.renderHook)(({ receiverID, receiverType, policyID }) => (0, useParticipantsInvoiceReport_1.default)(receiverID, receiverType, policyID), {
                initialProps: { receiverID: accountID, receiverType: activeIndividualInvoiceReceiver.type, policyID: mockPolicyID },
            });
            expect(result.current).toBeUndefined();
        });
    });
    describe('Business Invoice Receiver', () => {
        beforeAll(() => {
            react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
        });
        afterAll(() => {
            react_native_onyx_1.default.clear();
        });
        it('should return the invoice report when there is an active business invoice report', async () => {
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockActiveBusinessInvoiceReport?.reportID}`, mockActiveBusinessInvoiceReport);
            const { result, rerender } = (0, react_native_1.renderHook)(({ receiverID, receiverType, policyID }) => (0, useParticipantsInvoiceReport_1.default)(receiverID, receiverType, policyID), {
                initialProps: { receiverID: activeBusinessInvoiceReceiver.policyID, receiverType: activeBusinessInvoiceReceiver.type, policyID: activeBusinessPolicyID },
            });
            // Should return the active business invoice report when receiverID, receiverType, and policyID match
            expect(result.current).toEqual(mockActiveBusinessInvoiceReport);
            // Should return undefined when business policyID does not match
            const differentBusinessPolicyID = 'different_business_policy_123';
            rerender({ receiverID: differentBusinessPolicyID, receiverType: activeBusinessInvoiceReceiver.type, policyID: activeBusinessPolicyID });
            expect(result.current).toBeUndefined();
        });
        it('should return undefined when the invoice report is archived', async () => {
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockArchivedBusinessInvoiceReport?.reportID}`, mockArchivedBusinessInvoiceReport);
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${mockArchivedBusinessInvoiceReport?.reportID}`, archivedReportNameValuePairs);
            const { result } = (0, react_native_1.renderHook)(({ receiverID, receiverType, policyID }) => (0, useParticipantsInvoiceReport_1.default)(receiverID, receiverType, policyID), {
                initialProps: { receiverID: archivedBusinessInvoiceReceiver.policyID, receiverType: archivedBusinessInvoiceReceiver.type, policyID: archivedBusinessPolicyID },
            });
            // Should return undefined when the business invoice report is archived
            expect(result.current).toBeUndefined();
        });
    });
});
