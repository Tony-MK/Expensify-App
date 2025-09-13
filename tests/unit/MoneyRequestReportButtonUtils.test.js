"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const MoneyRequestReportUtils_1 = require("@libs/MoneyRequestReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const policies_1 = require("../../__mocks__/reportData/policies");
const reports_1 = require("../../__mocks__/reportData/reports");
const TestHelper = require("../utils/TestHelper");
const mockedReportID = reports_1.iouReportR14932.reportID;
jest.mock('@libs/ReportUtils', () => ({
    getNonHeldAndFullAmount: jest.fn().mockReturnValue({ nonHeldAmount: `$${50}.00`, hasValidNonHeldAmount: true, fullAmount: `$100.00`, currency: 'USD' }),
    hasOnlyHeldExpenses: jest.fn().mockReturnValue(false),
    hasUpdatedTotal: jest.fn().mockReturnValue(true),
    getMoneyRequestSpendBreakdown: jest.fn().mockReturnValue({
        nonReimbursableSpend: 50,
        reimbursableSpend: 50,
        totalDisplaySpend: 100,
    }),
    hasHeldExpenses: jest.fn().mockReturnValue(false),
    parseReportRouteParams: jest.fn().mockReturnValue({
        reportID: mockedReportID,
        isSubReportPageRoute: false,
    }),
}));
jest.mock('@libs/CurrencyUtils', () => ({
    convertToDisplayString: jest.fn().mockImplementation((amountInCents = 0) => `$${amountInCents}.00`),
}));
describe('ReportButtonUtils', () => {
    describe('getTotalAmountForIOUReportPreviewButton', () => {
        beforeAll(async () => {
            react_native_onyx_1.default.init({
                keys: ONYXKEYS_1.default,
            });
            await TestHelper.signInWithTestUser();
        });
        afterAll(() => {
            jest.clearAllMocks();
        });
        it('returns total reimbursable spend for PAY & total value for other buttons', () => {
            expect((0, MoneyRequestReportUtils_1.getTotalAmountForIOUReportPreviewButton)(reports_1.iouReportR14932, policies_1.policy420A, CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.PAY)).toBe(`$50.00`);
            expect((0, MoneyRequestReportUtils_1.getTotalAmountForIOUReportPreviewButton)(reports_1.iouReportR14932, policies_1.policy420A, CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.REVIEW)).toBe(`$100.00`);
            expect((0, MoneyRequestReportUtils_1.getTotalAmountForIOUReportPreviewButton)(reports_1.iouReportR14932, policies_1.policy420A, CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.APPROVE)).toBe(`$100.00`);
            expect((0, MoneyRequestReportUtils_1.getTotalAmountForIOUReportPreviewButton)(reports_1.iouReportR14932, policies_1.policy420A, CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.SUBMIT)).toBe(`$100.00`);
        });
    });
});
