"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApprovalWorkflow = createApprovalWorkflow;
exports.updateApprovalWorkflow = updateApprovalWorkflow;
exports.removeApprovalWorkflow = removeApprovalWorkflow;
exports.setApprovalWorkflowMembers = setApprovalWorkflowMembers;
exports.setApprovalWorkflowApprover = setApprovalWorkflowApprover;
exports.setApprovalWorkflow = setApprovalWorkflow;
exports.clearApprovalWorkflowApprover = clearApprovalWorkflowApprover;
exports.clearApprovalWorkflowApprovers = clearApprovalWorkflowApprovers;
exports.clearApprovalWorkflow = clearApprovalWorkflow;
exports.validateApprovalWorkflow = validateApprovalWorkflow;
const dropRightWhile_1 = require("lodash/dropRightWhile");
const mapKeys_1 = require("lodash/mapKeys");
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const WorkflowUtils_1 = require("@libs/WorkflowUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
let currentApprovalWorkflow;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.APPROVAL_WORKFLOW,
    callback: (approvalWorkflow) => {
        currentApprovalWorkflow = approvalWorkflow;
    },
});
let allPolicies;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.POLICY,
    waitForCollectionCallback: true,
    callback: (value) => (allPolicies = value),
});
let authToken;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.SESSION,
    callback: (value) => {
        authToken = value?.authToken;
    },
});
let personalDetailsByEmail = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
    callback: (personalDetails) => {
        personalDetailsByEmail = (0, mapKeys_1.default)(personalDetails, (value, key) => value?.login ?? key);
    },
});
function createApprovalWorkflow(policyID, approvalWorkflow) {
    const policy = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`];
    if (!authToken || !policy) {
        return;
    }
    const previousEmployeeList = Object.fromEntries(Object.entries(policy.employeeList ?? {}).map(([key, value]) => [key, { ...value, pendingAction: null }]));
    const previousApprovalMode = policy.approvalMode;
    const updatedEmployees = (0, WorkflowUtils_1.convertApprovalWorkflowToPolicyEmployees)({ previousEmployeeList, approvalWorkflow, type: CONST_1.default.APPROVAL_WORKFLOW.TYPE.CREATE });
    // If there are no changes to the employees list, we can exit early
    if ((0, EmptyObject_1.isEmptyObject)(updatedEmployees)) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.APPROVAL_WORKFLOW,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                employeeList: updatedEmployees,
                approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                employeeList: previousEmployeeList,
                approvalMode: previousApprovalMode,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                employeeList: Object.fromEntries(Object.keys(updatedEmployees).map((key) => [key, { pendingAction: null }])),
            },
        },
    ];
    const parameters = { policyID, authToken, employees: JSON.stringify(Object.values(updatedEmployees)) };
    API.write(types_1.WRITE_COMMANDS.CREATE_WORKSPACE_APPROVAL, parameters, { optimisticData, failureData, successData });
}
function updateApprovalWorkflow(policyID, approvalWorkflow, membersToRemove, approversToRemove) {
    const policy = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`];
    if (!authToken || !policy) {
        return;
    }
    const previousDefaultApprover = (0, PolicyUtils_1.getDefaultApprover)(policy);
    const newDefaultApprover = approvalWorkflow.isDefault ? approvalWorkflow.approvers.at(0)?.email : undefined;
    const previousEmployeeList = Object.fromEntries(Object.entries(policy.employeeList ?? {}).map(([key, value]) => [key, { ...value, pendingAction: null }]));
    const updatedEmployees = (0, WorkflowUtils_1.convertApprovalWorkflowToPolicyEmployees)({
        previousEmployeeList,
        approvalWorkflow,
        type: CONST_1.default.APPROVAL_WORKFLOW.TYPE.UPDATE,
        membersToRemove,
        approversToRemove,
    });
    // If there are no changes to the employees list, we can exit early
    if ((0, EmptyObject_1.isEmptyObject)(updatedEmployees) && !newDefaultApprover) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.APPROVAL_WORKFLOW,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                employeeList: updatedEmployees,
                ...(newDefaultApprover ? { approver: newDefaultApprover } : {}),
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                employeeList: previousEmployeeList,
                pendingFields: { employeeList: null },
                ...(newDefaultApprover ? { approver: previousDefaultApprover } : {}),
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                employeeList: Object.fromEntries(Object.keys(updatedEmployees).map((key) => [key, { pendingAction: null, pendingFields: null }])),
            },
        },
    ];
    const parameters = {
        policyID,
        authToken,
        employees: JSON.stringify(Object.values(updatedEmployees)),
        defaultApprover: newDefaultApprover,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_WORKSPACE_APPROVAL, parameters, { optimisticData, failureData, successData });
}
function removeApprovalWorkflow(policyID, approvalWorkflow) {
    const policy = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`];
    if (!authToken || !policy) {
        return;
    }
    const previousEmployeeList = Object.fromEntries(Object.entries(policy.employeeList ?? {}).map(([key, value]) => [key, { ...value, pendingAction: null }]));
    const updatedEmployees = (0, WorkflowUtils_1.convertApprovalWorkflowToPolicyEmployees)({ previousEmployeeList, approvalWorkflow, type: CONST_1.default.APPROVAL_WORKFLOW.TYPE.REMOVE });
    const updatedEmployeeList = { ...previousEmployeeList, ...updatedEmployees };
    const defaultApprover = (0, PolicyUtils_1.getDefaultApprover)(policy);
    // If there is more than one workflow, we need to keep the advanced approval mode (first workflow is the default)
    const hasMoreThanOneWorkflow = Object.values(updatedEmployeeList).some((employee) => !!employee.submitsTo && employee.submitsTo !== defaultApprover);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.APPROVAL_WORKFLOW,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                employeeList: updatedEmployees,
                approvalMode: hasMoreThanOneWorkflow ? CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED : CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                employeeList: previousEmployeeList,
                approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                employeeList: Object.fromEntries(Object.keys(updatedEmployees).map((key) => [key, { pendingAction: null }])),
            },
        },
    ];
    const parameters = { policyID, authToken, employees: JSON.stringify(Object.values(updatedEmployees)) };
    API.write(types_1.WRITE_COMMANDS.REMOVE_WORKSPACE_APPROVAL, parameters, { optimisticData, failureData, successData });
}
/** Set the members of the approval workflow that is currently edited */
function setApprovalWorkflowMembers(members) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.APPROVAL_WORKFLOW, { members, errors: null });
}
/**
 * Set the approver at the specified index in the approval workflow that is currently edited
 * @param approver - The new approver to set
 * @param approverIndex - The index of the approver to set
 * @param policyID - The ID of the policy
 */
function setApprovalWorkflowApprover(approver, approverIndex, policyID) {
    const policy = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`];
    if (!currentApprovalWorkflow || !policy?.employeeList) {
        return;
    }
    const approvers = [...currentApprovalWorkflow.approvers];
    approvers[approverIndex] = approver;
    // Check if the approver forwards to other approvers and add them to the list
    if (policy.employeeList[approver.email]?.forwardsTo) {
        const additionalApprovers = (0, WorkflowUtils_1.calculateApprovers)({ employees: policy.employeeList, firstEmail: approver.email, personalDetailsByEmail });
        approvers.splice(approverIndex, approvers.length, ...additionalApprovers);
    }
    // Always clear the additional approver error when an approver is added
    const errors = { additionalApprover: null };
    // Check for circular references (approver forwards to themselves) and reset other errors
    const updatedApprovers = approvers.map((existingApprover, index) => {
        if (!existingApprover) {
            return;
        }
        const hasCircularReference = approvers.slice(0, index).some((previousApprover) => existingApprover.email === previousApprover?.email);
        if (hasCircularReference) {
            errors[`approver-${index}`] = 'workflowsPage.approverCircularReference';
        }
        else {
            errors[`approver-${index}`] = null;
        }
        return {
            ...existingApprover,
            isCircularReference: hasCircularReference,
        };
    });
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.APPROVAL_WORKFLOW, { approvers: updatedApprovers, errors });
}
/** Clear one approver at the specified index in the approval workflow that is currently edited */
function clearApprovalWorkflowApprover(approverIndex) {
    if (!currentApprovalWorkflow) {
        return;
    }
    const approvers = [...currentApprovalWorkflow.approvers];
    approvers[approverIndex] = undefined;
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.APPROVAL_WORKFLOW, { approvers: (0, dropRightWhile_1.default)(approvers, (approver) => !approver), errors: null });
}
/** Clear all approvers of the approval workflow that is currently edited */
function clearApprovalWorkflowApprovers() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.APPROVAL_WORKFLOW, { approvers: [] });
}
function setApprovalWorkflow(approvalWorkflow) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.APPROVAL_WORKFLOW, approvalWorkflow);
}
function clearApprovalWorkflow() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.APPROVAL_WORKFLOW, null);
}
/**
 * Validates the approval workflow and sets the errors on the approval workflow
 * @param approvalWorkflow the approval workflow to validate
 * @returns true if the approval workflow is valid, false otherwise
 */
function validateApprovalWorkflow(approvalWorkflow) {
    const errors = {};
    approvalWorkflow.approvers.forEach((approver, approverIndex) => {
        if (!approver) {
            errors[`approver-${approverIndex}`] = 'common.error.fieldRequired';
        }
        if (approver?.isCircularReference) {
            errors[`approver-${approverIndex}`] = 'workflowsPage.approverCircularReference';
        }
    });
    if (!approvalWorkflow.members.length && !approvalWorkflow.isDefault) {
        errors.members = 'common.error.fieldRequired';
    }
    if (!approvalWorkflow.approvers.length) {
        errors.additionalApprover = 'common.error.fieldRequired';
    }
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.APPROVAL_WORKFLOW, { errors });
    return (0, EmptyObject_1.isEmptyObject)(errors);
}
