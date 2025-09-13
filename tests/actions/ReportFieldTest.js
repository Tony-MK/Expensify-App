"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const DateUtils_1 = require("@libs/DateUtils");
const WorkspaceReportFieldUtils_1 = require("@libs/WorkspaceReportFieldUtils");
const CONST_1 = require("@src/CONST");
const OnyxUpdateManager_1 = require("@src/libs/actions/OnyxUpdateManager");
const Policy = require("@src/libs/actions/Policy/Policy");
const ReportField = require("@src/libs/actions/Policy/ReportField");
const ReportUtils = require("@src/libs/ReportUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WorkspaceReportFieldForm_1 = require("@src/types/form/WorkspaceReportFieldForm");
const policies_1 = require("../utils/collections/policies");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
(0, OnyxUpdateManager_1.default)();
describe('actions/ReportField', () => {
    function connectToFetchPolicy(policyID) {
        return new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                callback: (workspace) => {
                    react_native_onyx_1.default.disconnect(connection);
                    resolve(workspace);
                },
            });
        });
    }
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    let mockFetch;
    beforeEach(() => {
        global.fetch = TestHelper.getGlobalFetchMock();
        mockFetch = fetch;
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    describe('createReportField', () => {
        it('creates a new text report field of a workspace', async () => {
            mockFetch.pause();
            react_native_onyx_1.default.set(ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM_DRAFT, {});
            await (0, waitForBatchedUpdates_1.default)();
            const policyID = Policy.generatePolicyID();
            const reportFieldName = 'Test Field';
            const reportFieldID = (0, WorkspaceReportFieldUtils_1.generateFieldID)(reportFieldName);
            const reportFieldKey = ReportUtils.getReportFieldKey(reportFieldID);
            const newReportField = {
                name: reportFieldName,
                type: CONST_1.default.REPORT_FIELD_TYPES.TEXT,
                target: 'expense',
                defaultValue: 'Default Value',
                values: [],
                disabledOptions: [],
                fieldID: reportFieldID,
                orderWeight: 1,
                deletable: false,
                keys: [],
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                externalIDs: [],
                isTax: false,
            };
            const createReportFieldArguments = {
                name: reportFieldName,
                type: CONST_1.default.REPORT_FIELD_TYPES.TEXT,
                initialValue: 'Default Value',
            };
            ReportField.createReportField(policyID, createReportFieldArguments);
            await (0, waitForBatchedUpdates_1.default)();
            let policy = await connectToFetchPolicy(policyID);
            // check if the new report field was added to the policy
            expect(policy?.fieldList).toStrictEqual({
                [reportFieldKey]: { ...newReportField, pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD },
            });
            // Check for success data
            mockFetch.resume();
            await (0, waitForBatchedUpdates_1.default)();
            policy = await connectToFetchPolicy(policyID);
            // Check if the policy pending action was cleared
            expect(policy?.fieldList?.[reportFieldKey]?.pendingAction).toBeFalsy();
        });
        it('creates a new date report field of a workspace', async () => {
            mockFetch.pause();
            react_native_onyx_1.default.set(ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM_DRAFT, {});
            await (0, waitForBatchedUpdates_1.default)();
            const policyID = Policy.generatePolicyID();
            const reportFieldName = 'Test Field 2';
            const reportFieldID = (0, WorkspaceReportFieldUtils_1.generateFieldID)(reportFieldName);
            const reportFieldKey = ReportUtils.getReportFieldKey(reportFieldID);
            const defaultDate = DateUtils_1.default.extractDate(new Date().toString());
            const newReportField = {
                name: reportFieldName,
                type: CONST_1.default.REPORT_FIELD_TYPES.DATE,
                target: 'expense',
                defaultValue: defaultDate,
                values: [],
                disabledOptions: [],
                fieldID: reportFieldID,
                orderWeight: 1,
                deletable: false,
                keys: [],
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                externalIDs: [],
                isTax: false,
            };
            const createReportFieldArguments = {
                name: reportFieldName,
                type: CONST_1.default.REPORT_FIELD_TYPES.DATE,
                initialValue: defaultDate,
            };
            ReportField.createReportField(policyID, createReportFieldArguments);
            await (0, waitForBatchedUpdates_1.default)();
            let policy = await connectToFetchPolicy(policyID);
            // check if the new report field was added to the policy
            expect(policy?.fieldList).toStrictEqual({
                [reportFieldKey]: { ...newReportField, pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD },
            });
            // Check for success data
            mockFetch.resume();
            await (0, waitForBatchedUpdates_1.default)();
            policy = await connectToFetchPolicy(policyID);
            // Check if the policy pending action was cleared
            expect(policy?.fieldList?.[reportFieldKey]?.pendingAction).toBeFalsy();
        });
        it('creates a new list report field of a workspace', async () => {
            mockFetch.pause();
            react_native_onyx_1.default.set(ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM_DRAFT, {
                [WorkspaceReportFieldForm_1.default.LIST_VALUES]: ['Value 1', 'Value 2'],
                [WorkspaceReportFieldForm_1.default.DISABLED_LIST_VALUES]: [false, true],
            });
            await (0, waitForBatchedUpdates_1.default)();
            const policyID = Policy.generatePolicyID();
            const reportFieldName = 'Test Field 3';
            const reportFieldID = (0, WorkspaceReportFieldUtils_1.generateFieldID)(reportFieldName);
            const reportFieldKey = ReportUtils.getReportFieldKey(reportFieldID);
            const newReportField = {
                name: reportFieldName,
                type: CONST_1.default.REPORT_FIELD_TYPES.LIST,
                target: 'expense',
                defaultValue: '',
                values: ['Value 1', 'Value 2'],
                disabledOptions: [false, true],
                fieldID: reportFieldID,
                orderWeight: 1,
                deletable: false,
                keys: [],
                externalIDs: [],
                isTax: false,
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            };
            const createReportFieldArguments = {
                name: reportFieldName,
                type: CONST_1.default.REPORT_FIELD_TYPES.LIST,
                initialValue: '',
            };
            ReportField.createReportField(policyID, createReportFieldArguments);
            await (0, waitForBatchedUpdates_1.default)();
            let policy = await connectToFetchPolicy(policyID);
            // check if the new report field was added to the policy
            expect(policy?.fieldList).toStrictEqual({
                [reportFieldKey]: { ...newReportField, pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD },
            });
            // Check for success data
            mockFetch.resume();
            await (0, waitForBatchedUpdates_1.default)();
            policy = await connectToFetchPolicy(policyID);
            // Check if the policy pending action was cleared
            expect(policy?.fieldList?.[reportFieldKey].pendingAction).toBeFalsy();
        });
    });
    describe('deleteReportField', () => {
        it('Deleted a report field from a workspace', async () => {
            const fakePolicy = (0, policies_1.default)(0);
            const reportFieldName = 'Test Field';
            const reportFieldID = (0, WorkspaceReportFieldUtils_1.generateFieldID)(reportFieldName);
            const reportFieldKey = ReportUtils.getReportFieldKey(reportFieldID);
            const fakeReportField = {
                name: reportFieldName,
                type: CONST_1.default.REPORT_FIELD_TYPES.TEXT,
                defaultValue: 'Default Value',
                values: [],
                disabledOptions: [],
                fieldID: reportFieldID,
                orderWeight: 1,
                deletable: false,
                keys: [],
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                value: 'default',
                externalIDs: [],
                isTax: false,
            };
            fakePolicy.fieldList = {
                [reportFieldKey]: fakeReportField,
            };
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            await (0, waitForBatchedUpdates_1.default)();
            let policy = await connectToFetchPolicy(fakePolicy.id);
            // check if the report field exists in the policy
            expect(policy?.fieldList).toStrictEqual({
                [reportFieldKey]: fakeReportField,
            });
            ReportField.deleteReportFields(fakePolicy.id, [reportFieldKey]);
            await (0, waitForBatchedUpdates_1.default)();
            // Check for success data
            mockFetch.resume();
            await (0, waitForBatchedUpdates_1.default)();
            policy = await connectToFetchPolicy(fakePolicy.id);
            // Check if the policy report field was removed
            expect(policy?.fieldList?.[reportFieldKey]).toBeFalsy();
        });
        it('Deleted a report field from a workspace when API fails', async () => {
            const policyID = Policy.generatePolicyID();
            const fakePolicy = (0, policies_1.default)(Number(policyID));
            const reportFieldName = 'Test Field';
            const reportFieldID = (0, WorkspaceReportFieldUtils_1.generateFieldID)(reportFieldName);
            const reportFieldKey = ReportUtils.getReportFieldKey(reportFieldID);
            const fakeReportField = {
                name: reportFieldName,
                type: CONST_1.default.REPORT_FIELD_TYPES.TEXT,
                defaultValue: 'Default Value',
                values: [],
                disabledOptions: [],
                fieldID: reportFieldID,
                orderWeight: 1,
                deletable: false,
                keys: [],
                value: 'default',
                externalIDs: [],
                isTax: false,
            };
            fakePolicy.fieldList = {
                [reportFieldKey]: fakeReportField,
            };
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, fakePolicy);
            await (0, waitForBatchedUpdates_1.default)();
            let policy = await connectToFetchPolicy(policyID);
            // check if the report field exists in the policy
            expect(policy?.fieldList).toStrictEqual({
                [reportFieldKey]: fakeReportField,
            });
            // Check for failure data
            mockFetch.fail();
            ReportField.deleteReportFields(policyID, [reportFieldKey]);
            await (0, waitForBatchedUpdates_1.default)();
            mockFetch.resume();
            await (0, waitForBatchedUpdates_1.default)();
            policy = await connectToFetchPolicy(policyID);
            // check if the deleted report field was reset in the policy
            expect(policy?.fieldList).toStrictEqual({
                [reportFieldKey]: fakeReportField,
            });
        });
    });
    describe('updateReportFieldInitialValue', () => {
        it('updates the initial value of a text report field', async () => {
            mockFetch.pause();
            const policyID = Policy.generatePolicyID();
            const reportFieldName = 'Test Field';
            const oldInitialValue = 'Old initial value';
            const newInitialValue = 'New initial value';
            const reportFieldID = (0, WorkspaceReportFieldUtils_1.generateFieldID)(reportFieldName);
            const reportFieldKey = ReportUtils.getReportFieldKey(reportFieldID);
            const reportField = {
                name: reportFieldName,
                type: CONST_1.default.REPORT_FIELD_TYPES.TEXT,
                defaultValue: oldInitialValue,
                values: [],
                disabledOptions: [],
                fieldID: reportFieldID,
                orderWeight: 1,
                deletable: false,
                keys: [],
                externalIDs: [],
                isTax: false,
            };
            const fakePolicy = (0, policies_1.default)(Number(policyID));
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { ...fakePolicy, fieldList: { [reportFieldKey]: reportField } });
            await (0, waitForBatchedUpdates_1.default)();
            ReportField.updateReportFieldInitialValue(policyID, reportFieldID, newInitialValue);
            await (0, waitForBatchedUpdates_1.default)();
            let policy = await connectToFetchPolicy(policyID);
            // check if the updated report field was set to the policy
            expect(policy?.fieldList).toStrictEqual({
                [reportFieldKey]: {
                    ...reportField,
                    defaultValue: newInitialValue,
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
            });
            // Check for success data
            mockFetch.resume();
            await (0, waitForBatchedUpdates_1.default)();
            policy = await connectToFetchPolicy(policyID);
            // Check if the policy pending action was cleared
            expect(policy?.fieldList?.[reportFieldKey].pendingAction).toBeFalsy();
        });
        it('updates the initial value of a text report field when api returns an error', async () => {
            mockFetch.pause();
            const policyID = Policy.generatePolicyID();
            const reportFieldName = 'Test Field';
            const oldInitialValue = 'Old initial value';
            const newInitialValue = 'New initial value';
            const reportFieldID = (0, WorkspaceReportFieldUtils_1.generateFieldID)(reportFieldName);
            const reportFieldKey = ReportUtils.getReportFieldKey(reportFieldID);
            const reportField = {
                name: reportFieldName,
                type: CONST_1.default.REPORT_FIELD_TYPES.TEXT,
                defaultValue: oldInitialValue,
                values: [],
                disabledOptions: [],
                fieldID: reportFieldID,
                orderWeight: 1,
                deletable: false,
                keys: [],
                externalIDs: [],
                isTax: false,
            };
            const fakePolicy = (0, policies_1.default)(Number(policyID));
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { ...fakePolicy, fieldList: { [reportFieldKey]: reportField } });
            await (0, waitForBatchedUpdates_1.default)();
            ReportField.updateReportFieldInitialValue(policyID, reportFieldID, newInitialValue);
            await (0, waitForBatchedUpdates_1.default)();
            let policy = await connectToFetchPolicy(policyID);
            // check if the updated report field was set to the policy
            expect(policy?.fieldList).toStrictEqual({
                [reportFieldKey]: {
                    ...reportField,
                    defaultValue: newInitialValue,
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
            });
            // Check for failure data
            mockFetch.fail();
            mockFetch.resume();
            await (0, waitForBatchedUpdates_1.default)();
            policy = await connectToFetchPolicy(policyID);
            // check if the updated report field was reset in the policy
            expect(policy?.fieldList).toStrictEqual({
                [reportFieldKey]: reportField,
            });
            // Check if the policy errors was set
            expect(policy?.errorFields?.[reportFieldKey]).toBeTruthy();
        });
    });
    describe('updateReportFieldListValueEnabled', () => {
        it('updates the enabled flag of report field list values', async () => {
            mockFetch.pause();
            const policyID = Policy.generatePolicyID();
            const reportFieldName = 'Test Field';
            const valueIndexesTpUpdate = [1, 2];
            const reportFieldID = (0, WorkspaceReportFieldUtils_1.generateFieldID)(reportFieldName);
            const reportFieldKey = ReportUtils.getReportFieldKey(reportFieldID);
            const reportField = {
                name: reportFieldName,
                type: CONST_1.default.REPORT_FIELD_TYPES.LIST,
                defaultValue: 'Value 2',
                values: ['Value 1', 'Value 2', 'Value 3'],
                disabledOptions: [false, false, true],
                fieldID: reportFieldID,
                orderWeight: 1,
                deletable: false,
                keys: [],
                externalIDs: [],
                isTax: false,
                value: CONST_1.default.REPORT_FIELD_TYPES.LIST,
            };
            const fakePolicy = (0, policies_1.default)(Number(policyID));
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { ...fakePolicy, fieldList: { [reportFieldKey]: reportField } });
            await (0, waitForBatchedUpdates_1.default)();
            ReportField.updateReportFieldListValueEnabled(policyID, reportFieldID, valueIndexesTpUpdate, false);
            await (0, waitForBatchedUpdates_1.default)();
            const policy = await connectToFetchPolicy(policyID);
            // check if the new report field was added to the policy optimistically
            expect(policy?.fieldList).toStrictEqual({
                [reportFieldKey]: {
                    ...reportField,
                    defaultValue: '',
                    disabledOptions: [false, true, true],
                },
            });
        });
    });
    describe('addReportFieldListValue', () => {
        it('adds a new value to a report field list', async () => {
            mockFetch.pause();
            const policyID = Policy.generatePolicyID();
            const reportFieldName = 'Test Field';
            const reportFieldID = (0, WorkspaceReportFieldUtils_1.generateFieldID)(reportFieldName);
            const reportFieldKey = ReportUtils.getReportFieldKey(reportFieldID);
            const reportField = {
                name: reportFieldName,
                type: CONST_1.default.REPORT_FIELD_TYPES.LIST,
                defaultValue: 'Value 2',
                values: ['Value 1', 'Value 2', 'Value 3'],
                disabledOptions: [false, false, true],
                fieldID: reportFieldID,
                orderWeight: 1,
                deletable: false,
                keys: [],
                externalIDs: [],
                isTax: false,
                value: CONST_1.default.REPORT_FIELD_TYPES.LIST,
            };
            const fakePolicy = (0, policies_1.default)(Number(policyID));
            const newListValueName = 'Value 4';
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { ...fakePolicy, fieldList: { [reportFieldKey]: reportField } });
            await (0, waitForBatchedUpdates_1.default)();
            ReportField.addReportFieldListValue(policyID, reportFieldID, newListValueName);
            await (0, waitForBatchedUpdates_1.default)();
            const policy = await connectToFetchPolicy(policyID);
            // Check if the new report field was added to the policy optimistically
            expect(policy?.fieldList).toStrictEqual({
                [reportFieldKey]: {
                    ...reportField,
                    values: [...reportField.values, newListValueName],
                    disabledOptions: [...reportField.disabledOptions, false],
                },
            });
        });
    });
    describe('removeReportFieldListValue', () => {
        it('removes list values from a report field list', async () => {
            mockFetch.pause();
            const policyID = Policy.generatePolicyID();
            const reportFieldName = 'Test Field';
            const reportFieldID = (0, WorkspaceReportFieldUtils_1.generateFieldID)(reportFieldName);
            const reportFieldKey = ReportUtils.getReportFieldKey(reportFieldID);
            const reportField = {
                name: reportFieldName,
                type: CONST_1.default.REPORT_FIELD_TYPES.LIST,
                defaultValue: 'Value 2',
                values: ['Value 1', 'Value 2', 'Value 3'],
                disabledOptions: [false, false, true],
                fieldID: reportFieldID,
                orderWeight: 1,
                deletable: false,
                keys: [],
                externalIDs: [],
                isTax: false,
                value: CONST_1.default.REPORT_FIELD_TYPES.LIST,
            };
            const fakePolicy = (0, policies_1.default)(Number(policyID));
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { ...fakePolicy, fieldList: { [reportFieldKey]: reportField } });
            await (0, waitForBatchedUpdates_1.default)();
            ReportField.removeReportFieldListValue(policyID, reportFieldID, [1, 2]);
            await (0, waitForBatchedUpdates_1.default)();
            const policy = await connectToFetchPolicy(policyID);
            // Check if the values were removed from the report field optimistically
            expect(policy?.fieldList).toStrictEqual({
                [reportFieldKey]: {
                    ...reportField,
                    defaultValue: '',
                    values: ['Value 1'],
                    disabledOptions: [false],
                },
            });
        });
    });
});
