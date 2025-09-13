"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const react_native_1 = require("@testing-library/react-native");
const react_native_2 = require("react-native");
const react_native_onyx_1 = require("react-native-onyx");
const OnyxUtils_1 = require("react-native-onyx/dist/OnyxUtils");
const ComposeProviders_1 = require("@components/ComposeProviders");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const reportAttributes_1 = require("@libs/actions/OnyxDerived/configs/reportAttributes");
const OnyxDerived_1 = require("@userActions/OnyxDerived");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const reports_1 = require("../utils/collections/reports");
const transaction_1 = require("../utils/collections/transaction");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const renderLocaleContextProvider = () => {
    return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider]}>
            <react_native_2.View>TEST</react_native_2.View>
        </ComposeProviders_1.default>);
};
describe('OnyxDerived', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
        (0, OnyxDerived_1.default)();
    });
    beforeEach(async () => {
        await react_native_onyx_1.default.clear();
    });
    describe('reportAttributes', () => {
        const mockReport = {
            reportID: `test_1`,
            reportName: 'Test Report',
            type: 'chat',
            chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
            lastVisibleActionCreated: '2023-01-01T00:00:00.000Z',
            lastMessageText: 'Test message',
            lastActorAccountID: 1,
            lastMessageHtml: '<p>Test message</p>',
            policyID: '123',
            ownerAccountID: 1,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
        };
        it('returns empty reports when dependencies are not set', async () => {
            await (0, waitForBatchedUpdates_1.default)();
            const derivedReportAttributes = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES);
            expect(derivedReportAttributes).toMatchObject({
                reports: {},
            });
        });
        it('computes report attributes when reports are set', async () => {
            renderLocaleContextProvider();
            await (0, waitForBatchedUpdates_1.default)();
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockReport.reportID}`, mockReport);
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE, 'en');
            const derivedReportAttributes = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES);
            expect(derivedReportAttributes).toMatchObject({
                reports: {
                    [mockReport.reportID]: {
                        reportName: mockReport.reportName,
                    },
                },
            });
        });
        it('updates when locale changes', async () => {
            renderLocaleContextProvider();
            await (0, waitForBatchedUpdates_1.default)();
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockReport.reportID}`, mockReport);
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE, 'es');
            const derivedReportAttributes = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES);
            expect(derivedReportAttributes).toMatchObject({
                locale: 'es',
            });
        });
        it('should contain both report attributes update when there are report and transaction updates', async () => {
            await (0, waitForBatchedUpdates_1.default)();
            // Given 2 reports and 1 transaction
            const reportID1 = '0';
            const reportID2 = '1';
            const reports = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID1}`]: (0, reports_1.createRandomReport)(Number(reportID1)),
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID2}`]: (0, reports_1.createRandomReport)(Number(reportID2)),
            };
            const transaction = (0, transaction_1.default)(1);
            // When the report attributes are recomputed with both report and transaction updates
            reportAttributes_1.default.compute([reports, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], { areAllConnectionsSet: true });
            const reportAttributesComputedValue = reportAttributes_1.default.compute([reports, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], {
                sourceValues: {
                    [ONYXKEYS_1.default.COLLECTION.REPORT]: {
                        [`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID1}`]: reports[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID1}`],
                    },
                    [ONYXKEYS_1.default.COLLECTION.TRANSACTION]: {
                        [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`]: transaction,
                    },
                },
                areAllConnectionsSet: true,
            }).reports;
            // Then the computed report attributes should contain both reports
            expect(Object.keys(reportAttributesComputedValue)).toEqual([reportID1, reportID2]);
        });
        it('should not recompute reportAttributes when personalDetailsList changes without displayName change', async () => {
            renderLocaleContextProvider();
            await (0, waitForBatchedUpdates_1.default)();
            // Set up initial state with report and personalDetailsList
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockReport.reportID}`, mockReport);
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE, 'en');
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
                '1': {
                    accountID: 1,
                    displayName: 'John Doe',
                    login: 'john.doe@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                },
            });
            await (0, waitForBatchedUpdates_1.default)();
            // Get initial computed value
            const initialDerivedReportAttributes = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES);
            // Spy on generateReportAttributes - this function should NOT be called
            // when the optimization kicks in and skips the computation
            const generateReportAttributesSpy = jest.spyOn(require('@libs/ReportUtils'), 'generateReportAttributes');
            // Change only the login (not displayName) - this should trigger the optimization
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
                '1': {
                    login: 'john.newemail@example.com',
                },
            });
            await (0, waitForBatchedUpdates_1.default)();
            // The generateReportAttributes function should not have been called
            // because the optimization should have returned early
            expect(generateReportAttributesSpy).not.toHaveBeenCalled();
            // Get the computed value after login change
            const derivedReportAttributesAfterLoginChange = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES);
            // And the values should be preserved correctly
            expect(derivedReportAttributesAfterLoginChange).toEqual(initialDerivedReportAttributes);
            generateReportAttributesSpy.mockRestore();
        });
        it('should recompute reportAttributes when personalDetailsList displayName changes', async () => {
            renderLocaleContextProvider();
            await (0, waitForBatchedUpdates_1.default)();
            // Set up initial state with report and personalDetailsList
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockReport.reportID}`, mockReport);
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE, 'en');
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
                '1': {
                    accountID: 1,
                    displayName: 'John Doe',
                    login: 'john.doe@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                },
            });
            await (0, waitForBatchedUpdates_1.default)();
            // Get initial computed value reference
            const initialDerivedReportAttributes = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES);
            // Change the displayName - this should trigger full recomputation
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
                '1': {
                    displayName: 'Jane Doe',
                    firstName: 'Jane',
                },
            });
            await (0, waitForBatchedUpdates_1.default)();
            // Get the computed value after displayName change
            const derivedReportAttributesAfterDisplayNameChange = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES);
            // The computed value should not be the same object (new computation happened)
            expect(derivedReportAttributesAfterDisplayNameChange).not.toBe(initialDerivedReportAttributes);
        });
        describe('reportErrors', () => {
            it('returns empty errors when no errors exist', async () => {
                const report = (0, reports_1.createRandomReport)(1);
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
                await (0, waitForBatchedUpdates_1.default)();
                const derivedReportAttributes = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES);
                expect(derivedReportAttributes?.reports[report.reportID].reportErrors).toEqual({});
            });
            it('combines report error fields with report action errors', async () => {
                const report = {
                    ...(0, reports_1.createRandomReport)(1),
                    errorFields: {
                        field1: {
                            '1234567890': 'Error message 1',
                        },
                    },
                };
                const reportActions = {
                    '1': {
                        reportActionID: '1',
                        actionName: 'ADDCOMMENT',
                        created: '2024-01-01',
                        message: [{ html: 'some content', text: 'some content', type: 'text' }],
                        errors: {
                            field2: {
                                '1234567891': 'Error message 2',
                            },
                        },
                    },
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`, reportActions);
                await (0, waitForBatchedUpdates_1.default)();
                const derivedReportAttributes = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES);
                await (0, waitForBatchedUpdates_1.default)();
                expect(derivedReportAttributes?.reports[report.reportID].reportErrors).toEqual({
                    '1234567890': 'Error message 1',
                    '1234567891': 'Error message 2',
                });
            });
            it('handles multiple error sources', async () => {
                const report = {
                    ...(0, reports_1.createRandomReport)(1),
                    errorFields: {
                        field1: {
                            '1234567890': 'Error message 1',
                        },
                        field2: {
                            '1234567891': 'Error message 2',
                        },
                    },
                };
                const reportActions = {
                    '1': {
                        reportActionID: '1',
                        actionName: 'ADDCOMMENT',
                        created: '2024-01-01',
                        message: [{ html: 'some content', text: 'some content', type: 'text' }],
                        errors: {
                            field3: {
                                '1234567892': 'Error message 3',
                            },
                        },
                    },
                    '2': {
                        reportActionID: '2',
                        actionName: 'ADDCOMMENT',
                        created: '2024-01-01',
                        message: [{ html: 'some content', text: 'some content', type: 'text' }],
                        errors: {
                            field4: {
                                '1234567893': 'Error message 4',
                            },
                        },
                    },
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`, reportActions);
                await (0, waitForBatchedUpdates_1.default)();
                const derivedReportAttributes = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES);
                expect(derivedReportAttributes?.reports[report.reportID].reportErrors).toEqual({
                    '1234567890': 'Error message 1',
                    '1234567891': 'Error message 2',
                    '1234567892': 'Error message 3',
                    '1234567893': 'Error message 4',
                });
            });
            it('handles empty error objects in sources', async () => {
                const report = {
                    ...(0, reports_1.createRandomReport)(1),
                    errorFields: {
                        field1: {},
                        field2: {
                            '1234567890': 'Error message 1',
                        },
                    },
                };
                const reportActions = {
                    '1': {
                        reportActionID: '1',
                        actionName: 'ADDCOMMENT',
                        created: '2024-01-01',
                        message: [{ html: 'some content', text: 'some content', type: 'text' }],
                        errors: {},
                    },
                    '2': {
                        reportActionID: '2',
                        actionName: 'ADDCOMMENT',
                        created: '2024-01-01',
                        message: [{ html: 'some content', text: 'some content', type: 'text' }],
                        errors: {
                            field3: {
                                '1234567891': 'Error message 2',
                            },
                        },
                    },
                };
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`, reportActions);
                await (0, waitForBatchedUpdates_1.default)();
                const derivedReportAttributes = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES);
                expect(derivedReportAttributes?.reports[report.reportID].reportErrors).toEqual({
                    '1234567890': 'Error message 1',
                    '1234567891': 'Error message 2',
                });
            });
        });
    });
});
