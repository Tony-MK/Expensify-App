"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const reassure_1 = require("reassure");
const OptimisticReportNames_1 = require("@libs/OptimisticReportNames");
// eslint-disable-next-line no-restricted-syntax -- disabled because we need ReportUtils to mock
const ReportUtils = require("@libs/ReportUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const createCollection_1 = require("../utils/collections/createCollection");
const reports_1 = require("../utils/collections/reports");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
// Mock dependencies
jest.mock('@libs/ReportUtils', () => ({
    // jest.requireActual is necessary to include multi-layered module imports (eg. Report.ts has processReportIDDeeplink() which uses parseReportRouteParams() imported from getReportIDFromUrl.ts)
    // Without jest.requireActual, parseReportRouteParams would be undefined, causing the test to fail.
    ...jest.requireActual('@libs/ReportUtils'),
    // These methods are mocked below in the beforeAll function to return specific values
    isExpenseReport: jest.fn(),
    getTitleReportField: jest.fn(),
}));
jest.mock('@libs/Log', () => ({
    info: jest.fn(),
}));
const mockReportUtils = ReportUtils;
describe('[OptimisticReportNames] Performance Tests', () => {
    const REPORTS_COUNT = 1000;
    const POLICIES_COUNT = 100;
    const mockPolicy = {
        id: 'policy1',
        name: 'Test Policy',
        fieldList: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            text_title: {
                defaultValue: '{report:type} - {report:startdate} - {report:total} {report:currency}',
            },
        },
    };
    const mockPolicies = (0, createCollection_1.default)((item) => `policy_${item.id}`, (index) => ({
        ...mockPolicy,
        id: `policy${index}`,
        name: `Policy ${index}`,
    }), POLICIES_COUNT);
    const mockReports = (0, createCollection_1.default)((item) => `${ONYXKEYS_1.default.COLLECTION.REPORT}${item.reportID}`, (index) => ({
        ...(0, reports_1.createRandomReport)(index),
        policyID: `policy${index % POLICIES_COUNT}`,
        total: -(Math.random() * 100000), // Random negative amount
        currency: 'USD',
        lastVisibleActionCreated: new Date().toISOString(),
    }), REPORTS_COUNT);
    const mockContext = {
        betas: ['authAutoReportTitle'],
        betaConfiguration: {},
        allReports: mockReports,
        allPolicies: mockPolicies,
        allReportNameValuePairs: {},
        allTransactions: {},
    };
    beforeAll(async () => {
        react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
        mockReportUtils.isExpenseReport.mockReturnValue(true);
        mockReportUtils.getTitleReportField.mockReturnValue(mockPolicy.fieldList?.text_title);
        await (0, waitForBatchedUpdates_1.default)();
    });
    afterAll(() => {
        react_native_onyx_1.default.clear();
    });
    describe('Single Report Name Computation', () => {
        test('[OptimisticReportNames] computeReportNameIfNeeded() single report', async () => {
            const report = Object.values(mockReports).at(0);
            const update = {
                key: `report_${report?.reportID}`,
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: { total: -20000 },
            };
            await (0, reassure_1.measureFunction)(() => (0, OptimisticReportNames_1.computeReportNameIfNeeded)(report, update, mockContext));
        });
    });
    describe('Batch Processing Performance', () => {
        test('[OptimisticReportNames] updateOptimisticReportNamesFromUpdates() with 10 new reports', async () => {
            const updates = Array.from({ length: 10 }, (_, i) => ({
                key: `report_new${i}`,
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                value: {
                    reportID: `new${i}`,
                    policyID: `policy${i % 10}`,
                    total: -(Math.random() * 50000),
                    currency: 'USD',
                    lastVisibleActionCreated: new Date().toISOString(),
                },
            }));
            await (0, reassure_1.measureFunction)(() => (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(updates, mockContext));
        });
        test('[OptimisticReportNames] updateOptimisticReportNamesFromUpdates() with 50 existing report updates', async () => {
            const reportKeys = Object.keys(mockReports).slice(0, 50);
            const updates = reportKeys.map((key) => ({
                key,
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: { total: -(Math.random() * 100000) },
            }));
            await (0, reassure_1.measureFunction)(() => (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(updates, mockContext));
        });
        test('[OptimisticReportNames] updateOptimisticReportNamesFromUpdates() with 100 mixed updates', async () => {
            const newReportUpdates = Array.from({ length: 50 }, (_, i) => ({
                key: `report_batch${i}`,
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                value: {
                    reportID: `batch${i}`,
                    policyID: `policy${i % 20}`,
                    total: -(Math.random() * 75000),
                    currency: 'USD',
                    lastVisibleActionCreated: new Date().toISOString(),
                },
            }));
            const existingReportUpdates = Object.keys(mockReports)
                .slice(0, 50)
                .map((key) => ({
                key: key,
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: { total: -(Math.random() * 125000) },
            }));
            const allUpdates = [...newReportUpdates, ...existingReportUpdates];
            await (0, reassure_1.measureFunction)(() => (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(allUpdates, mockContext));
        });
    });
    describe('Policy Update Impact Performance', () => {
        test('[OptimisticReportNames] policy update affecting multiple reports', async () => {
            const policyUpdate = {
                key: 'policy_policy1',
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: { name: 'Updated Policy Name' },
            };
            // This should trigger name computation for all reports using policy1
            await (0, reassure_1.measureFunction)(() => (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)([policyUpdate], mockContext));
        });
        test('[OptimisticReportNames] multiple policy updates', async () => {
            const policyUpdates = Array.from({ length: 10 }, (_, i) => ({
                key: `policy_policy${i}`,
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: { name: `Bulk Updated Policy ${i}` },
            }));
            await (0, reassure_1.measureFunction)(() => (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(policyUpdates, mockContext));
        });
    });
    describe('Large Dataset Performance', () => {
        test('[OptimisticReportNames] processing with large context (1000 reports)', async () => {
            const updates = Array.from({ length: 1000 }, (_, i) => ({
                key: `report_large${i}`,
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                value: {
                    reportID: `large${i}`,
                    policyID: `policy${i % 50}`,
                    total: -(Math.random() * 200000),
                    currency: 'USD',
                    lastVisibleActionCreated: new Date().toISOString(),
                },
            }));
            await (0, reassure_1.measureFunction)(() => (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(updates, mockContext));
        });
        test('[OptimisticReportNames] worst case: many irrelevant updates', async () => {
            // Create updates that won't trigger name computation to test filtering performance
            const irrelevantUpdates = Array.from({ length: 100 }, (_, i) => ({
                key: `transaction_${i}`,
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: { description: `Updated transaction ${i}` },
            }));
            await (0, reassure_1.measureFunction)(() => (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(irrelevantUpdates, mockContext));
        });
    });
    describe('Edge Cases Performance', () => {
        test('[OptimisticReportNames] reports without formulas', async () => {
            // Mock reports with policies that don't have formulas
            const contextWithoutFormulas = {
                ...mockContext,
                allPolicies: (0, createCollection_1.default)((item) => `policy_${item.id}`, (index) => ({
                    id: `policy${index}`,
                    name: `Policy ${index}`,
                    fieldList: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        text_title: {
                            name: 'Title',
                            defaultValue: 'Static Title',
                            fieldID: 'text_title',
                            orderWeight: 0,
                            type: 'text',
                            deletable: true,
                            values: [],
                            keys: [],
                            externalIDs: [],
                            disabledOptions: [],
                            isTax: false,
                        },
                    },
                }), 50),
                allReportNameValuePairs: {},
            };
            const updates = Array.from({ length: 20 }, (_, i) => ({
                key: `report_static${i}`,
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                value: {
                    reportID: `static${i}`,
                    policyID: `policy${i % 10}`,
                    total: -10000,
                    currency: 'USD',
                },
            }));
            await (0, reassure_1.measureFunction)(() => (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(updates, contextWithoutFormulas));
        });
        test('[OptimisticReportNames] missing policies and reports', async () => {
            const contextWithMissingData = {
                betas: ['authAutoReportTitle'],
                betaConfiguration: {},
                allReports: {},
                allPolicies: {},
                allReportNameValuePairs: {},
                allTransactions: {},
            };
            const updates = Array.from({ length: 10 }, (_, i) => ({
                key: `report_missing${i}`,
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                value: {
                    reportID: `missing${i}`,
                    policyID: 'nonexistent',
                    total: -10000,
                    currency: 'USD',
                },
            }));
            await (0, reassure_1.measureFunction)(() => (0, OptimisticReportNames_1.updateOptimisticReportNamesFromUpdates)(updates, contextWithMissingData));
        });
    });
});
