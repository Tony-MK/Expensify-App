"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line no-restricted-syntax
const PolicyUtils = require("@libs/PolicyUtils");
const QuickActionUtils_1 = require("@libs/QuickActionUtils");
const CONST_1 = require("@src/CONST");
// Mock the PolicyUtils module
jest.mock('@libs/PolicyUtils');
const mockedPolicyUtils = PolicyUtils;
describe('QuickActionUtils', () => {
    describe('isQuickActionAllowed', () => {
        describe('CREATE_REPORT action', () => {
            const createReportAction = {
                action: CONST_1.default.QUICK_ACTIONS.CREATE_REPORT,
                targetAccountID: 123,
                isFirstQuickAction: false,
            };
            beforeEach(() => {
                jest.clearAllMocks();
            });
            it('should return false when shouldShowPolicy returns true and isPolicyExpenseChatEnabled is true', () => {
                const policy = {
                    id: 'policy123',
                    isPolicyExpenseChatEnabled: true,
                };
                mockedPolicyUtils.shouldShowPolicy.mockReturnValue(false);
                const result = (0, QuickActionUtils_1.isQuickActionAllowed)(createReportAction, undefined, policy);
                expect(result).toBe(false);
            });
            it('should return false when shouldShowPolicy returns true but isPolicyExpenseChatEnabled is false', () => {
                const policy = {
                    id: 'policy123',
                    isPolicyExpenseChatEnabled: false,
                };
                mockedPolicyUtils.shouldShowPolicy.mockReturnValue(false);
                const result = (0, QuickActionUtils_1.isQuickActionAllowed)(createReportAction, undefined, policy);
                expect(result).toBe(false);
            });
            it('should return false when shouldShowPolicy returns true but isPolicyExpenseChatEnabled is undefined', () => {
                const policy = {
                    id: 'policy123',
                    // isPolicyExpenseChatEnabled is undefined
                };
                mockedPolicyUtils.shouldShowPolicy.mockReturnValue(true);
                const result = (0, QuickActionUtils_1.isQuickActionAllowed)(createReportAction, undefined, policy);
                expect(result).toBe(false);
            });
            it('should return false when policy is undefined', () => {
                mockedPolicyUtils.shouldShowPolicy.mockReturnValue(false);
                const result = (0, QuickActionUtils_1.isQuickActionAllowed)(createReportAction, undefined, undefined);
                expect(result).toBe(false);
            });
            it('should return false when both conditions are false', () => {
                const policy = {
                    id: 'policy123',
                    isPolicyExpenseChatEnabled: false,
                };
                mockedPolicyUtils.shouldShowPolicy.mockReturnValue(false);
                const result = (0, QuickActionUtils_1.isQuickActionAllowed)(createReportAction, undefined, policy);
                expect(result).toBe(false);
            });
        });
        describe('Manager McTest restrictions', () => {
            const requestScanAction = {
                action: CONST_1.default.QUICK_ACTIONS.REQUEST_SCAN,
                isFirstQuickAction: false,
            };
            // Given a report with Manager McTest
            const reportWithManagerMcTest = {
                reportID: '1',
                participants: {
                    [CONST_1.default.ACCOUNT_ID.MANAGER_MCTEST]: {
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                    },
                },
            };
            beforeEach(() => {
                jest.clearAllMocks();
            });
            it('should return false when report contains Manager McTest', () => {
                mockedPolicyUtils.shouldShowPolicy.mockReturnValue(false);
                // When the report contains Manager McTest
                const result = (0, QuickActionUtils_1.isQuickActionAllowed)(requestScanAction, reportWithManagerMcTest, undefined);
                // Then it should return false
                expect(result).toBe(false);
            });
        });
    });
});
