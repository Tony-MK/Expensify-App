"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setInitialCreateReportFieldsForm = setInitialCreateReportFieldsForm;
exports.createReportFieldsListValue = createReportFieldsListValue;
exports.renameReportFieldsListValue = renameReportFieldsListValue;
exports.setReportFieldsListValueEnabled = setReportFieldsListValueEnabled;
exports.deleteReportFieldsListValue = deleteReportFieldsListValue;
exports.createReportField = createReportField;
exports.deleteReportFields = deleteReportFields;
exports.updateReportFieldInitialValue = updateReportFieldInitialValue;
exports.updateReportFieldListValueEnabled = updateReportFieldListValueEnabled;
exports.openPolicyReportFieldsPage = openPolicyReportFieldsPage;
exports.addReportFieldListValue = addReportFieldListValue;
exports.removeReportFieldListValue = removeReportFieldListValue;
const cloneDeep_1 = require("lodash/cloneDeep");
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ErrorUtils = require("@libs/ErrorUtils");
const Log_1 = require("@libs/Log");
const ReportUtils = require("@libs/ReportUtils");
const WorkspaceReportFieldUtils = require("@libs/WorkspaceReportFieldUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WorkspaceReportFieldForm_1 = require("@src/types/form/WorkspaceReportFieldForm");
let listValues;
let disabledListValues;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM_DRAFT,
    callback: (value) => {
        if (!value) {
            return;
        }
        listValues = value[WorkspaceReportFieldForm_1.default.LIST_VALUES] ?? [];
        disabledListValues = value[WorkspaceReportFieldForm_1.default.DISABLED_LIST_VALUES] ?? [];
    },
});
let allReports;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT,
    waitForCollectionCallback: true,
    callback: (value) => {
        allReports = value;
    },
});
const allPolicies = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.POLICY,
    callback: (value, key) => {
        if (!key) {
            return;
        }
        if (value === null || value === undefined) {
            // If we are deleting a policy, we have to check every report linked to that policy
            // and unset the draft indicator (pencil icon) alongside removing any draft comments. Clearing these values will keep the newly archived chats from being displayed in the LHN.
            // More info: https://github.com/Expensify/App/issues/14260
            const policyID = key.replace(ONYXKEYS_1.default.COLLECTION.POLICY, '');
            const policyReports = ReportUtils.getAllPolicyReports(policyID);
            const cleanUpMergeQueries = {};
            const cleanUpSetQueries = {};
            policyReports.forEach((policyReport) => {
                if (!policyReport) {
                    return;
                }
                const { reportID } = policyReport;
                cleanUpSetQueries[`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}${reportID}`] = null;
                cleanUpSetQueries[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}${reportID}`] = null;
            });
            react_native_onyx_1.default.mergeCollection(ONYXKEYS_1.default.COLLECTION.REPORT, cleanUpMergeQueries);
            react_native_onyx_1.default.multiSet(cleanUpSetQueries);
            delete allPolicies[key];
            return;
        }
        allPolicies[key] = value;
    },
});
function openPolicyReportFieldsPage(policyID) {
    if (!policyID) {
        Log_1.default.warn('openPolicyReportFieldsPage invalid params', { policyID });
        return;
    }
    const params = {
        policyID,
    };
    API.read(types_1.READ_COMMANDS.OPEN_POLICY_REPORT_FIELDS_PAGE, params);
}
/**
 * Sets the initial form values for the workspace report fields form.
 */
function setInitialCreateReportFieldsForm() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM_DRAFT, {
        [WorkspaceReportFieldForm_1.default.INITIAL_VALUE]: '',
    });
}
/**
 * Creates a new list value in the workspace report fields form.
 */
function createReportFieldsListValue(valueName) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM_DRAFT, {
        [WorkspaceReportFieldForm_1.default.LIST_VALUES]: [...listValues, valueName],
        [WorkspaceReportFieldForm_1.default.DISABLED_LIST_VALUES]: [...disabledListValues, false],
    });
}
/**
 * Renames a list value in the workspace report fields form.
 */
function renameReportFieldsListValue(valueIndex, newValueName) {
    const listValuesCopy = [...listValues];
    listValuesCopy[valueIndex] = newValueName;
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM_DRAFT, {
        [WorkspaceReportFieldForm_1.default.LIST_VALUES]: listValuesCopy,
    });
}
/**
 * Sets the enabled state of a list value in the workspace report fields form.
 */
function setReportFieldsListValueEnabled(valueIndexes, enabled) {
    const disabledListValuesCopy = [...disabledListValues];
    valueIndexes.forEach((valueIndex) => {
        disabledListValuesCopy[valueIndex] = !enabled;
    });
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM_DRAFT, {
        [WorkspaceReportFieldForm_1.default.DISABLED_LIST_VALUES]: disabledListValuesCopy,
    });
}
/**
 * Deletes a list value from the workspace report fields form.
 */
function deleteReportFieldsListValue(valueIndexes) {
    const listValuesCopy = [...listValues];
    const disabledListValuesCopy = [...disabledListValues];
    valueIndexes
        .sort((a, b) => b - a)
        .forEach((valueIndex) => {
        listValuesCopy.splice(valueIndex, 1);
        disabledListValuesCopy.splice(valueIndex, 1);
    });
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM_DRAFT, {
        [WorkspaceReportFieldForm_1.default.LIST_VALUES]: listValuesCopy,
        [WorkspaceReportFieldForm_1.default.DISABLED_LIST_VALUES]: disabledListValuesCopy,
    });
}
/**
 * Creates a new report field.
 */
function createReportField(policyID, { name, type, initialValue }) {
    const previousFieldList = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]?.fieldList ?? {};
    const fieldID = WorkspaceReportFieldUtils.generateFieldID(name);
    const fieldKey = ReportUtils.getReportFieldKey(fieldID);
    const optimisticReportFieldDataForPolicy = {
        name,
        type,
        target: 'expense',
        defaultValue: initialValue,
        values: listValues,
        disabledOptions: disabledListValues,
        fieldID,
        orderWeight: Object.keys(previousFieldList).length + 1,
        deletable: false,
        keys: [],
        externalIDs: [],
        isTax: false,
    };
    const policyExpenseReports = Object.values(allReports ?? {}).filter((report) => report?.policyID === policyID && report.type === CONST_1.default.REPORT.TYPE.EXPENSE);
    const optimisticData = [
        {
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            value: {
                fieldList: {
                    [fieldKey]: { ...optimisticReportFieldDataForPolicy, pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD },
                },
                errorFields: null,
            },
        },
        ...policyExpenseReports.map((report) => ({
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            value: {
                fieldList: {
                    [fieldKey]: { ...optimisticReportFieldDataForPolicy, pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD },
                },
            },
        })),
    ];
    const failureData = [
        {
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            value: {
                fieldList: {
                    [fieldKey]: null,
                },
                errorFields: {
                    [fieldKey]: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.reportFields.genericFailureMessage'),
                },
            },
        },
        ...policyExpenseReports.map((report) => ({
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            value: {
                fieldList: {
                    [fieldKey]: null,
                },
            },
        })),
    ];
    const onyxData = {
        optimisticData,
        successData: [
            {
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: {
                    fieldList: {
                        [fieldKey]: { pendingAction: null },
                    },
                    errorFields: null,
                },
            },
        ],
        failureData,
    };
    const parameters = {
        policyID,
        reportFields: JSON.stringify([optimisticReportFieldDataForPolicy]),
    };
    API.write(types_1.WRITE_COMMANDS.CREATE_WORKSPACE_REPORT_FIELD, parameters, onyxData);
}
function deleteReportFields(policyID, reportFieldsToUpdate) {
    const policy = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`];
    const allReportFields = policy?.fieldList ?? {};
    const updatedReportFields = Object.fromEntries(Object.entries(allReportFields).filter(([key]) => !reportFieldsToUpdate.includes(key)));
    const optimisticReportFields = reportFieldsToUpdate.reduce((acc, reportFieldKey) => {
        acc[reportFieldKey] = { pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE };
        return acc;
    }, {});
    const successReportFields = reportFieldsToUpdate.reduce((acc, reportFieldKey) => {
        acc[reportFieldKey] = null;
        return acc;
    }, {});
    const failureReportFields = reportFieldsToUpdate.reduce((acc, reportFieldKey) => {
        acc[reportFieldKey] = { pendingAction: null };
        return acc;
    }, {});
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    fieldList: optimisticReportFields,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    fieldList: successReportFields,
                    errorFields: null,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    fieldList: failureReportFields,
                    errorFields: {
                        fieldList: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        reportFields: JSON.stringify(Object.values(updatedReportFields)),
    };
    API.write(types_1.WRITE_COMMANDS.DELETE_POLICY_REPORT_FIELD, parameters, onyxData);
}
/**
 * Updates the initial value of a report field.
 */
function updateReportFieldInitialValue(policyID, reportFieldID, newInitialValue) {
    const previousFieldList = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]?.fieldList ?? {};
    const fieldKey = ReportUtils.getReportFieldKey(reportFieldID);
    const updatedReportField = {
        ...previousFieldList[fieldKey],
        defaultValue: newInitialValue,
    };
    const onyxData = {
        optimisticData: [
            {
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: {
                    fieldList: {
                        [fieldKey]: { ...updatedReportField, pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                    },
                    errorFields: null,
                },
            },
        ],
        successData: [
            {
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: {
                    fieldList: {
                        [fieldKey]: { pendingAction: null },
                    },
                    errorFields: null,
                },
            },
        ],
        failureData: [
            {
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: {
                    fieldList: {
                        [fieldKey]: { ...previousFieldList[fieldKey], pendingAction: null },
                    },
                    errorFields: {
                        [fieldKey]: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.reportFields.genericFailureMessage'),
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        reportFields: JSON.stringify([updatedReportField]),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_WORKSPACE_REPORT_FIELD_INITIAL_VALUE, parameters, onyxData);
}
function updateReportFieldListValueEnabled(policyID, reportFieldID, valueIndexes, enabled) {
    const previousFieldList = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]?.fieldList ?? {};
    const fieldKey = ReportUtils.getReportFieldKey(reportFieldID);
    const reportField = previousFieldList[fieldKey];
    const updatedReportField = (0, cloneDeep_1.default)(reportField);
    valueIndexes.forEach((valueIndex) => {
        updatedReportField.disabledOptions[valueIndex] = !enabled;
        const shouldResetDefaultValue = !enabled && reportField.defaultValue === reportField.values.at(valueIndex);
        if (shouldResetDefaultValue) {
            updatedReportField.defaultValue = '';
        }
    });
    // We are using the offline pattern A (optimistic without feedback)
    const onyxData = {
        optimisticData: [
            {
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: {
                    fieldList: {
                        [fieldKey]: updatedReportField,
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        reportFields: JSON.stringify([updatedReportField]),
    };
    API.write(types_1.WRITE_COMMANDS.ENABLE_WORKSPACE_REPORT_FIELD_LIST_VALUE, parameters, onyxData);
}
/**
 * Adds a new option to the list type report field on a workspace.
 */
function addReportFieldListValue(policyID, reportFieldID, valueName) {
    const previousFieldList = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]?.fieldList ?? {};
    const reportFieldKey = ReportUtils.getReportFieldKey(reportFieldID);
    const reportField = previousFieldList[reportFieldKey];
    const updatedReportField = (0, cloneDeep_1.default)(reportField);
    updatedReportField.values.push(valueName);
    updatedReportField.disabledOptions.push(false);
    // We are using the offline pattern A (optimistic without feedback)
    const onyxData = {
        optimisticData: [
            {
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: {
                    fieldList: {
                        [reportFieldKey]: updatedReportField,
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        reportFields: JSON.stringify([updatedReportField]),
    };
    API.write(types_1.WRITE_COMMANDS.CREATE_WORKSPACE_REPORT_FIELD_LIST_VALUE, parameters, onyxData);
}
/**
 * Removes a list value from the workspace report fields.
 */
function removeReportFieldListValue(policyID, reportFieldID, valueIndexes) {
    const previousFieldList = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]?.fieldList ?? {};
    const reportFieldKey = ReportUtils.getReportFieldKey(reportFieldID);
    const reportField = previousFieldList[reportFieldKey];
    const updatedReportField = (0, cloneDeep_1.default)(reportField);
    valueIndexes
        .sort((a, b) => b - a)
        .forEach((valueIndex) => {
        const shouldResetDefaultValue = reportField.defaultValue === reportField.values.at(valueIndex);
        if (shouldResetDefaultValue) {
            updatedReportField.defaultValue = '';
        }
        updatedReportField.values.splice(valueIndex, 1);
        updatedReportField.disabledOptions.splice(valueIndex, 1);
    });
    // We are using the offline pattern A (optimistic without feedback)
    const onyxData = {
        optimisticData: [
            {
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: {
                    fieldList: {
                        [reportFieldKey]: updatedReportField,
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        reportFields: JSON.stringify([updatedReportField]),
    };
    API.write(types_1.WRITE_COMMANDS.REMOVE_WORKSPACE_REPORT_FIELD_LIST_VALUE, parameters, onyxData);
}
