"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line no-restricted-syntax
var PolicyUtils = require("@libs/PolicyUtils");
var QuickActionUtils_1 = require("@libs/QuickActionUtils");
var CONST_1 = require("@src/CONST");
// Mock the PolicyUtils module
jest.mock('@libs/PolicyUtils');
var mockedPolicyUtils = PolicyUtils;
describe('QuickActionUtils', function () {
    describe('isQuickActionAllowed', function () {
        describe('CREATE_REPORT action', function () {
            var createReportAction = {
                action: CONST_1.default.QUICK_ACTIONS.CREATE_REPORT,
                targetAccountID: 123,
                isFirstQuickAction: false,
            };
            beforeEach(function () {
                jest.clearAllMocks();
            });
            it('should return false when shouldShowPolicy returns true and isPolicyExpenseChatEnabled is true', function () {
                var policy = {
                    id: 'policy123',
                    isPolicyExpenseChatEnabled: true,
                };
                mockedPolicyUtils.shouldShowPolicy.mockReturnValue(false);
                var result = (0, QuickActionUtils_1.isQuickActionAllowed)(createReportAction, undefined, policy);
                expect(result).toBe(false);
            });
            it('should return false when shouldShowPolicy returns true but isPolicyExpenseChatEnabled is false', function () {
                var policy = {
                    id: 'policy123',
                    isPolicyExpenseChatEnabled: false,
                };
                mockedPolicyUtils.shouldShowPolicy.mockReturnValue(false);
                var result = (0, QuickActionUtils_1.isQuickActionAllowed)(createReportAction, undefined, policy);
                expect(result).toBe(false);
            });
            it('should return false when shouldShowPolicy returns true but isPolicyExpenseChatEnabled is undefined', function () {
                var policy = {
                    id: 'policy123',
                    // isPolicyExpenseChatEnabled is undefined
                };
                mockedPolicyUtils.shouldShowPolicy.mockReturnValue(true);
                var result = (0, QuickActionUtils_1.isQuickActionAllowed)(createReportAction, undefined, policy);
                expect(result).toBe(false);
            });
            it('should return false when policy is undefined', function () {
                mockedPolicyUtils.shouldShowPolicy.mockReturnValue(false);
                var result = (0, QuickActionUtils_1.isQuickActionAllowed)(createReportAction, undefined, undefined);
                expect(result).toBe(false);
            });
            it('should return false when both conditions are false', function () {
                var policy = {
                    id: 'policy123',
                    isPolicyExpenseChatEnabled: false,
                };
                mockedPolicyUtils.shouldShowPolicy.mockReturnValue(false);
                var result = (0, QuickActionUtils_1.isQuickActionAllowed)(createReportAction, undefined, policy);
                expect(result).toBe(false);
            });
        });
        describe('Manager McTest restrictions', function () {
            var _a;
            var requestScanAction = {
                action: CONST_1.default.QUICK_ACTIONS.REQUEST_SCAN,
                isFirstQuickAction: false,
            };
            // Given a report with Manager McTest
            var reportWithManagerMcTest = {
                reportID: '1',
                participants: (_a = {},
                    _a[CONST_1.default.ACCOUNT_ID.MANAGER_MCTEST] = {
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                    },
                    _a),
            };
            beforeEach(function () {
                jest.clearAllMocks();
            });
            it('should return false when report contains Manager McTest', function () {
                mockedPolicyUtils.shouldShowPolicy.mockReturnValue(false);
                // When the report contains Manager McTest
                var result = (0, QuickActionUtils_1.isQuickActionAllowed)(requestScanAction, reportWithManagerMcTest, undefined);
                // Then it should return false
                expect(result).toBe(false);
            });
        });
    });
});
