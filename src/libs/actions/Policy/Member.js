"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMembers = removeMembers;
exports.buildUpdateWorkspaceMembersRoleOnyxData = buildUpdateWorkspaceMembersRoleOnyxData;
exports.updateWorkspaceMembersRole = updateWorkspaceMembersRole;
exports.requestWorkspaceOwnerChange = requestWorkspaceOwnerChange;
exports.clearWorkspaceOwnerChangeFlow = clearWorkspaceOwnerChangeFlow;
exports.buildAddMembersToWorkspaceOnyxData = buildAddMembersToWorkspaceOnyxData;
exports.addMembersToWorkspace = addMembersToWorkspace;
exports.clearDeleteMemberError = clearDeleteMemberError;
exports.clearAddMemberError = clearAddMemberError;
exports.openWorkspaceMembersPage = openWorkspaceMembersPage;
exports.setWorkspaceInviteMembersDraft = setWorkspaceInviteMembersDraft;
exports.inviteMemberToWorkspace = inviteMemberToWorkspace;
exports.joinAccessiblePolicy = joinAccessiblePolicy;
exports.askToJoinPolicy = askToJoinPolicy;
exports.acceptJoinRequest = acceptJoinRequest;
exports.declineJoinRequest = declineJoinRequest;
exports.isApprover = isApprover;
exports.importPolicyMembers = importPolicyMembers;
exports.downloadMembersCSV = downloadMembersCSV;
exports.clearInviteDraft = clearInviteDraft;
exports.buildRoomMembersOnyxData = buildRoomMembersOnyxData;
exports.openPolicyMemberProfilePage = openPolicyMemberProfilePage;
exports.setWorkspaceInviteRoleDraft = setWorkspaceInviteRoleDraft;
exports.clearWorkspaceInviteRoleDraft = clearWorkspaceInviteRoleDraft;
exports.setImportedSpreadsheetMemberData = setImportedSpreadsheetMemberData;
exports.clearImportedSpreadsheetMemberData = clearImportedSpreadsheetMemberData;
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ApiUtils = require("@libs/ApiUtils");
const DateUtils_1 = require("@libs/DateUtils");
const ErrorUtils = require("@libs/ErrorUtils");
const fileDownload_1 = require("@libs/fileDownload");
const Localize_1 = require("@libs/Localize");
const Log_1 = require("@libs/Log");
const enhanceParameters_1 = require("@libs/Network/enhanceParameters");
const Parser_1 = require("@libs/Parser");
const PersonalDetailsUtils = require("@libs/PersonalDetailsUtils");
const PhoneNumber = require("@libs/PhoneNumber");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportActionsUtils = require("@libs/ReportActionsUtils");
const ReportUtils = require("@libs/ReportUtils");
const FormActions = require("@userActions/FormActions");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const Policy_1 = require("./Policy");
const allPolicies = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.POLICY,
    callback: (val, key) => {
        if (!key) {
            return;
        }
        if (val === null || val === undefined) {
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
        allPolicies[key] = val;
    },
});
let allReportActions;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
    waitForCollectionCallback: true,
    callback: (actions) => (allReportActions = actions),
});
let sessionEmail = '';
let sessionAccountID = 0;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.SESSION,
    callback: (val) => {
        sessionEmail = val?.email ?? '';
        sessionAccountID = val?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    },
});
let allPersonalDetails;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
    callback: (val) => (allPersonalDetails = val),
});
let policyOwnershipChecks;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.POLICY_OWNERSHIP_CHANGE_CHECKS,
    callback: (value) => {
        policyOwnershipChecks = value ?? {};
    },
});
/** Check if the passed employee is an approver in the policy's employeeList */
function isApprover(policy, employeeAccountID) {
    const employeeLogin = allPersonalDetails?.[employeeAccountID]?.login;
    if (policy?.approver === employeeLogin) {
        return true;
    }
    return Object.values(policy?.employeeList ?? {}).some((employee) => employee?.submitsTo === employeeLogin || employee?.forwardsTo === employeeLogin || employee?.overLimitForwardsTo === employeeLogin);
}
/**
 * Returns the policy of the report
 * @deprecated Get the data straight from Onyx - This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
 */
function getPolicy(policyID) {
    if (!allPolicies || !policyID) {
        return undefined;
    }
    return allPolicies[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`];
}
/**
 * Build optimistic data for adding members to the announcement/admins room
 */
function buildRoomMembersOnyxData(roomType, policyID, accountIDs) {
    const report = ReportUtils.getRoom(roomType, policyID);
    const reportMetadata = ReportUtils.getReportMetadata(report?.reportID);
    const roomMembers = {
        optimisticData: [],
        failureData: [],
        successData: [],
    };
    if (!report || accountIDs.length === 0) {
        return roomMembers;
    }
    const participantAccountIDs = [...Object.keys(report.participants ?? {}).map(Number), ...accountIDs];
    const pendingChatMembers = ReportUtils.getPendingChatMembers(accountIDs, reportMetadata?.pendingChatMembers ?? [], CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
    roomMembers.optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.reportID}`,
        value: {
            participants: ReportUtils.buildParticipantsFromAccountIDs(participantAccountIDs),
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${report?.reportID}`,
        value: {
            pendingChatMembers,
        },
    });
    roomMembers.failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.reportID}`,
        value: {
            participants: accountIDs.reduce((acc, curr) => {
                Object.assign(acc, { [curr]: null });
                return acc;
            }, {}),
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${report?.reportID}`,
        value: {
            pendingChatMembers: reportMetadata?.pendingChatMembers ?? null,
        },
    });
    roomMembers.successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${report?.reportID}`,
        value: {
            pendingChatMembers: reportMetadata?.pendingChatMembers ?? null,
        },
    });
    return roomMembers;
}
/**
 * Updates the import spreadsheet data according to the result of the import
 */
function updateImportSpreadsheetData(addedMembersLength, updatedMembersLength) {
    const onyxData = {
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.IMPORTED_SPREADSHEET,
                value: {
                    shouldFinalModalBeOpened: true,
                    importFinalModal: {
                        title: (0, Localize_1.translateLocal)('spreadsheet.importSuccessfulTitle'),
                        prompt: (0, Localize_1.translateLocal)('spreadsheet.importMembersSuccessfulDescription', { added: addedMembersLength, updated: updatedMembersLength }),
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.IMPORTED_SPREADSHEET,
                value: {
                    shouldFinalModalBeOpened: true,
                    importFinalModal: { title: (0, Localize_1.translateLocal)('spreadsheet.importFailedTitle'), prompt: (0, Localize_1.translateLocal)('spreadsheet.importFailedDescription') },
                },
            },
        ],
    };
    return onyxData;
}
/**
 * Build optimistic data for removing users from the announcement/admins room
 */
function removeOptimisticRoomMembers(roomType, policyID, policyName, accountIDs) {
    const roomMembers = {
        optimisticData: [],
        failureData: [],
        successData: [],
    };
    if (!policyID) {
        return roomMembers;
    }
    const report = ReportUtils.getRoom(roomType, policyID);
    const reportMetadata = ReportUtils.getReportMetadata(report?.reportID);
    if (!report) {
        return roomMembers;
    }
    const pendingChatMembers = ReportUtils.getPendingChatMembers(accountIDs, reportMetadata?.pendingChatMembers ?? [], CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
    roomMembers.optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
        value: {
            ...(accountIDs.includes(sessionAccountID)
                ? {
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                    oldPolicyName: policyName,
                }
                : {}),
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${report.reportID}`,
        value: {
            pendingChatMembers,
        },
    });
    roomMembers.failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
        value: {
            ...(accountIDs.includes(sessionAccountID)
                ? {
                    statusNum: report.statusNum,
                    stateNum: report.stateNum,
                    oldPolicyName: report.oldPolicyName,
                }
                : {}),
        },
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${report.reportID}`,
        value: {
            pendingChatMembers: reportMetadata?.pendingChatMembers ?? null,
        },
    });
    roomMembers.successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${report.reportID}`,
        value: {
            pendingChatMembers: reportMetadata?.pendingChatMembers ?? null,
        },
    });
    return roomMembers;
}
/**
 * This function will reset the preferred exporter to the owner of the workspace
 * if the current preferred exporter is removed from the admin role.
 * @param [policyID] The id of the policy.
 * @param [loginList] The logins of the users whose roles are being updated to non-admin role or are removed from a workspace
 */
function resetAccountingPreferredExporter(policyID, loginList) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const owner = policy?.owner ?? ReportUtils.getPersonalDetailsForAccountID(policy?.ownerAccountID).login ?? '';
    const optimisticData = [];
    const successData = [];
    const failureData = [];
    const policyKey = `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`;
    const adminLoginList = loginList.filter((login) => (0, PolicyUtils_1.isUserPolicyAdmin)(policy, login));
    const connections = [CONST_1.default.POLICY.CONNECTIONS.NAME.XERO, CONST_1.default.POLICY.CONNECTIONS.NAME.QBO, CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT, CONST_1.default.POLICY.CONNECTIONS.NAME.QBD];
    if (!adminLoginList.length) {
        return { optimisticData, successData, failureData };
    }
    connections.forEach((connection) => {
        const exporter = policy?.connections?.[connection]?.config.export.exporter;
        if (!exporter || !adminLoginList.includes(exporter)) {
            return;
        }
        const pendingFieldKey = connection === CONST_1.default.POLICY.CONNECTIONS.NAME.QBO ? CONST_1.default.QUICKBOOKS_CONFIG.EXPORT : CONST_1.default.QUICKBOOKS_CONFIG.EXPORTER;
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: policyKey,
            value: {
                connections: {
                    [connection]: {
                        config: {
                            export: { exporter: owner },
                            pendingFields: { [pendingFieldKey]: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                        },
                    },
                },
            },
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: policyKey,
            value: {
                connections: { [connection]: { config: { pendingFields: { [pendingFieldKey]: null } } } },
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: policyKey,
            value: {
                connections: {
                    [connection]: {
                        config: {
                            export: { exporter: policy?.connections?.[connection]?.config.export.exporter },
                            pendingFields: { [pendingFieldKey]: null },
                        },
                    },
                },
            },
        });
    });
    const exporter = policy?.connections?.netsuite?.options.config.exporter;
    if (exporter && adminLoginList.includes(exporter)) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: policyKey,
            value: {
                connections: { netsuite: { options: { config: { exporter: owner, pendingFields: { exporter: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE } } } } },
            },
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: policyKey,
            value: {
                connections: { netsuite: { options: { config: { pendingFields: { exporter: null } } } } },
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: policyKey,
            value: { connections: { netsuite: { options: { config: { exporter: policy?.connections?.netsuite?.options.config.exporter, pendingFields: { exporter: null } } } } } },
        });
    }
    return { optimisticData, successData, failureData };
}
/**
 * Remove the passed members from the policy employeeList
 * Please see https://github.com/Expensify/App/blob/main/README.md#Security for more details
 */
function removeMembers(accountIDs, policyID) {
    // In case user selects only themselves (admin), their email will be filtered out and the members
    // array passed will be empty, prevent the function from proceeding in that case as there is no one to remove
    if (accountIDs.length === 0) {
        return;
    }
    const policyKey = `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`;
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const workspaceChats = ReportUtils.getWorkspaceChats(policyID, accountIDs);
    const emailList = accountIDs.map((accountID) => allPersonalDetails?.[accountID]?.login).filter((login) => !!login);
    const optimisticClosedReportActions = workspaceChats.map(() => ReportUtils.buildOptimisticClosedReportAction(sessionEmail, policy?.name ?? '', CONST_1.default.REPORT.ARCHIVE_REASON.REMOVED_FROM_POLICY));
    const announceRoomMembers = removeOptimisticRoomMembers(CONST_1.default.REPORT.CHAT_TYPE.POLICY_ANNOUNCE, policy?.id, policy?.name ?? '', accountIDs);
    const adminRoomMembers = removeOptimisticRoomMembers(CONST_1.default.REPORT.CHAT_TYPE.POLICY_ADMINS, policy?.id, policy?.name ?? '', accountIDs.filter((accountID) => {
        const login = allPersonalDetails?.[accountID]?.login;
        const role = login ? policy?.employeeList?.[login]?.role : '';
        return role === CONST_1.default.POLICY.ROLE.ADMIN || role === CONST_1.default.POLICY.ROLE.AUDITOR;
    }));
    const preferredExporterOnyxData = resetAccountingPreferredExporter(policyID, emailList);
    const optimisticMembersState = {};
    const successMembersState = {};
    const failureMembersState = {};
    emailList.forEach((email) => {
        optimisticMembersState[email] = { pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE };
        successMembersState[email] = null;
        failureMembersState[email] = { errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.people.error.genericRemove') };
    });
    Object.keys(policy?.employeeList ?? {}).forEach((employeeEmail) => {
        const employee = policy?.employeeList?.[employeeEmail];
        optimisticMembersState[employeeEmail] = optimisticMembersState[employeeEmail] ?? {};
        failureMembersState[employeeEmail] = failureMembersState[employeeEmail] ?? {};
        if (employee?.submitsTo && emailList.includes(employee?.submitsTo)) {
            optimisticMembersState[employeeEmail] = {
                ...optimisticMembersState[employeeEmail],
                submitsTo: policy?.owner,
            };
            failureMembersState[employeeEmail] = {
                ...failureMembersState[employeeEmail],
                submitsTo: employee?.submitsTo,
            };
        }
        if (employee?.forwardsTo && emailList.includes(employee?.forwardsTo)) {
            optimisticMembersState[employeeEmail] = {
                ...optimisticMembersState[employeeEmail],
                forwardsTo: policy?.owner,
            };
            failureMembersState[employeeEmail] = {
                ...failureMembersState[employeeEmail],
                forwardsTo: employee?.forwardsTo,
            };
        }
        if (employee?.overLimitForwardsTo && emailList.includes(employee?.overLimitForwardsTo)) {
            optimisticMembersState[employeeEmail] = {
                ...optimisticMembersState[employeeEmail],
                overLimitForwardsTo: policy?.owner,
            };
            failureMembersState[employeeEmail] = {
                ...failureMembersState[employeeEmail],
                overLimitForwardsTo: employee?.overLimitForwardsTo,
            };
        }
    });
    const approvalRules = policy?.rules?.approvalRules ?? [];
    const optimisticApprovalRules = approvalRules.filter((rule) => !emailList.includes(rule?.approver ?? ''));
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: policyKey,
            value: {
                employeeList: optimisticMembersState,
                approver: emailList.includes(policy?.approver ?? '') ? policy?.owner : policy?.approver,
                rules: {
                    ...(policy?.rules ?? {}),
                    approvalRules: optimisticApprovalRules,
                },
            },
        },
    ];
    optimisticData.push(...announceRoomMembers.optimisticData, ...adminRoomMembers.optimisticData, ...preferredExporterOnyxData.optimisticData);
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: policyKey,
            value: { employeeList: successMembersState },
        },
    ];
    successData.push(...announceRoomMembers.successData, ...adminRoomMembers.successData, ...preferredExporterOnyxData.successData);
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: policyKey,
            value: { employeeList: failureMembersState, approver: policy?.approver, rules: policy?.rules },
        },
    ];
    failureData.push(...announceRoomMembers.failureData, ...adminRoomMembers.failureData, ...preferredExporterOnyxData.failureData);
    const pendingChatMembers = ReportUtils.getPendingChatMembers(accountIDs, [], CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
    workspaceChats.forEach((report) => {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.reportID}`,
            value: {
                statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                oldPolicyName: policy?.name,
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${report?.reportID}`,
            value: {
                pendingChatMembers,
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report?.reportID}`,
            value: {
                private_isArchived: true,
            },
        });
        const currentTime = DateUtils_1.default.getDBTime();
        const reportActions = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report?.reportID}`] ?? {};
        Object.values(reportActions).forEach((action) => {
            if (action.actionName !== CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW) {
                return;
            }
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${action.childReportID}`,
                value: {
                    private_isArchived: currentTime,
                },
            });
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${action.childReportID}`,
                value: {
                    private_isArchived: null,
                },
            });
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${report?.reportID}`,
            value: {
                pendingChatMembers: null,
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${report?.reportID}`,
            value: {
                pendingChatMembers: null,
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report?.reportID}`,
            value: {
                private_isArchived: false,
            },
        });
    });
    // comment out for time this issue would be resolved https://github.com/Expensify/App/issues/35952
    // optimisticClosedReportActions.forEach((reportAction, index) => {
    //     optimisticData.push({
    //         onyxMethod: Onyx.METHOD.MERGE,
    //         key: `${ONYXKEYS.COLLECTION.REPORT_ACTIONS}${workspaceChats?.[index]?.reportID}`,
    //         value: {[reportAction.reportActionID]: reportAction as ReportAction},
    //     });
    // });
    // If the policy has primaryLoginsInvited, then it displays informative messages on the members page about which primary logins were added by secondary logins.
    // If we delete all these logins then we should clear the informative messages since they are no longer relevant.
    if (!(0, EmptyObject_1.isEmptyObject)(policy?.primaryLoginsInvited ?? {})) {
        // Take the current policy members and remove them optimistically
        const employeeListEmails = Object.keys(allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]?.employeeList ?? {});
        const remainingLogins = employeeListEmails.filter((email) => !emailList.includes(email));
        const invitedPrimaryToSecondaryLogins = {};
        if (policy?.primaryLoginsInvited) {
            Object.keys(policy.primaryLoginsInvited).forEach((key) => (invitedPrimaryToSecondaryLogins[policy.primaryLoginsInvited?.[key] ?? ''] = key));
        }
        // Then, if no remaining members exist that were invited by a secondary login, clear the informative messages
        if (!remainingLogins.some((remainingLogin) => !!invitedPrimaryToSecondaryLogins[remainingLogin])) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: policyKey,
                value: {
                    primaryLoginsInvited: null,
                },
            });
        }
    }
    const filteredWorkspaceChats = workspaceChats.filter((report) => report !== null);
    filteredWorkspaceChats.forEach(({ reportID, stateNum, statusNum, oldPolicyName = null }) => {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                stateNum,
                statusNum,
                oldPolicyName,
            },
        });
    });
    optimisticClosedReportActions.forEach((reportAction, index) => {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${workspaceChats?.at(index)?.reportID}`,
            value: { [reportAction.reportActionID]: null },
        });
    });
    const params = {
        emailList: emailList.join(','),
        policyID,
    };
    API.write(types_1.WRITE_COMMANDS.DELETE_MEMBERS_FROM_WORKSPACE, params, { optimisticData, successData, failureData });
}
function buildUpdateWorkspaceMembersRoleOnyxData(policyID, accountIDs, newRole) {
    const previousEmployeeList = { ...allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]?.employeeList };
    const memberRoles = accountIDs.reduce((result, accountID) => {
        if (!allPersonalDetails?.[accountID]?.login) {
            return result;
        }
        result.push({
            accountID,
            email: allPersonalDetails?.[accountID]?.login ?? '',
            role: newRole,
        });
        return result;
    }, []);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                employeeList: {
                    ...memberRoles.reduce((member, current) => {
                        // eslint-disable-next-line no-param-reassign
                        member[current.email] = { role: current?.role, pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE };
                        return member;
                    }, {}),
                },
                errors: null,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                employeeList: {
                    ...memberRoles.reduce((member, current) => {
                        // eslint-disable-next-line no-param-reassign
                        member[current.email] = { role: current?.role, pendingAction: null };
                        return member;
                    }, {}),
                },
                errors: null,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                employeeList: previousEmployeeList,
                errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.editor.genericFailureMessage'),
            },
        },
    ];
    if (newRole !== CONST_1.default.POLICY.ROLE.ADMIN) {
        const preferredExporterOnyxData = resetAccountingPreferredExporter(policyID, memberRoles.map((member) => member.email));
        optimisticData.push(...preferredExporterOnyxData.optimisticData);
        successData.push(...preferredExporterOnyxData.successData);
        failureData.push(...preferredExporterOnyxData.failureData);
    }
    const adminRoom = ReportUtils.getAllPolicyReports(policyID).find(ReportUtils.isAdminRoom);
    if (adminRoom) {
        const failureDataParticipants = { ...adminRoom.participants };
        const optimisticParticipants = {};
        if (newRole === CONST_1.default.POLICY.ROLE.ADMIN || newRole === CONST_1.default.POLICY.ROLE.AUDITOR) {
            accountIDs.forEach((accountID) => {
                if (adminRoom?.participants?.[accountID]) {
                    return;
                }
                optimisticParticipants[accountID] = { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS };
                failureDataParticipants[accountID] = null;
            });
        }
        else {
            accountIDs.forEach((accountID) => {
                if (!adminRoom?.participants?.[accountID]) {
                    return;
                }
                optimisticParticipants[accountID] = null;
            });
        }
        if (!(0, EmptyObject_1.isEmptyObject)(optimisticParticipants)) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${adminRoom.reportID}`,
                value: {
                    participants: optimisticParticipants,
                },
            });
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${adminRoom.reportID}`,
                value: {
                    participants: failureDataParticipants,
                },
            });
        }
    }
    return { optimisticData, successData, failureData, memberRoles };
}
function updateWorkspaceMembersRole(policyID, accountIDs, newRole) {
    const { optimisticData, successData, failureData, memberRoles } = buildUpdateWorkspaceMembersRoleOnyxData(policyID, accountIDs, newRole);
    const params = {
        policyID,
        employees: JSON.stringify(memberRoles.map((item) => ({ email: item.email, role: item.role }))),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_WORKSPACE_MEMBERS_ROLE, params, { optimisticData, successData, failureData });
}
function requestWorkspaceOwnerChange(policyID) {
    if (!policyID) {
        return;
    }
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const ownershipChecks = { ...policyOwnershipChecks?.[policyID] };
    const changeOwnerErrors = Object.keys(policy?.errorFields?.changeOwner ?? {});
    if (changeOwnerErrors && changeOwnerErrors.length > 0) {
        const currentError = changeOwnerErrors.at(0);
        if (currentError === CONST_1.default.POLICY.OWNERSHIP_ERRORS.AMOUNT_OWED) {
            ownershipChecks.shouldClearOutstandingBalance = true;
        }
        if (currentError === CONST_1.default.POLICY.OWNERSHIP_ERRORS.OWNER_OWES_AMOUNT) {
            ownershipChecks.shouldTransferAmountOwed = true;
        }
        if (currentError === CONST_1.default.POLICY.OWNERSHIP_ERRORS.SUBSCRIPTION) {
            ownershipChecks.shouldTransferSubscription = true;
        }
        if (currentError === CONST_1.default.POLICY.OWNERSHIP_ERRORS.DUPLICATE_SUBSCRIPTION) {
            ownershipChecks.shouldTransferSingleSubscription = true;
        }
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.POLICY_OWNERSHIP_CHANGE_CHECKS, {
            [policyID]: ownershipChecks,
        });
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                errorFields: null,
                isLoading: true,
                isChangeOwnerSuccessful: false,
                isChangeOwnerFailed: false,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                isLoading: false,
                isChangeOwnerSuccessful: true,
                isChangeOwnerFailed: false,
                owner: sessionEmail,
                ownerAccountID: sessionAccountID,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                isLoading: false,
                isChangeOwnerSuccessful: false,
                isChangeOwnerFailed: true,
            },
        },
    ];
    const params = {
        policyID,
        ...ownershipChecks,
    };
    API.write(types_1.WRITE_COMMANDS.REQUEST_WORKSPACE_OWNER_CHANGE, params, { optimisticData, successData, failureData });
}
function clearWorkspaceOwnerChangeFlow(policyID) {
    if (!policyID) {
        return;
    }
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.POLICY_OWNERSHIP_CHANGE_CHECKS, null);
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
        errorFields: null,
        isLoading: false,
        isChangeOwnerSuccessful: false,
        isChangeOwnerFailed: false,
    });
}
function buildAddMembersToWorkspaceOnyxData(invitedEmailsToAccountIDs, policyID, policyMemberAccountIDs, role, formatPhoneNumber, policyExpenseChatNotificationPreference) {
    const logins = Object.keys(invitedEmailsToAccountIDs).map((memberLogin) => PhoneNumber.addSMSDomainIfPhoneNumber(memberLogin));
    const accountIDs = Object.values(invitedEmailsToAccountIDs);
    const policyKey = `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`;
    const { newAccountIDs, newLogins } = PersonalDetailsUtils.getNewAccountIDsAndLogins(logins, accountIDs);
    const newPersonalDetailsOnyxData = PersonalDetailsUtils.getPersonalDetailsOnyxDataForOptimisticUsers(newLogins, newAccountIDs, formatPhoneNumber);
    const announceRoomMembers = buildRoomMembersOnyxData(CONST_1.default.REPORT.CHAT_TYPE.POLICY_ANNOUNCE, policyID, accountIDs);
    const adminRoomMembers = buildRoomMembersOnyxData(CONST_1.default.REPORT.CHAT_TYPE.POLICY_ADMINS, policyID, role === CONST_1.default.POLICY.ROLE.ADMIN || role === CONST_1.default.POLICY.ROLE.AUDITOR ? accountIDs : []);
    const optimisticAnnounceChat = ReportUtils.buildOptimisticAnnounceChat(policyID, [...policyMemberAccountIDs, ...accountIDs]);
    const announceRoomChat = optimisticAnnounceChat.announceChatData;
    // create onyx data for policy expense chats for each new member
    const membersChats = (0, Policy_1.createPolicyExpenseChats)(policyID, invitedEmailsToAccountIDs, undefined, policyExpenseChatNotificationPreference);
    const optimisticMembersState = {};
    const successMembersState = {};
    const failureMembersState = {};
    logins.forEach((email) => {
        optimisticMembersState[email] = {
            email,
            pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            role,
            submitsTo: (0, PolicyUtils_1.getDefaultApprover)(allPolicies?.[policyKey]),
        };
        successMembersState[email] = { pendingAction: null };
        failureMembersState[email] = {
            errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.people.error.genericAdd'),
        };
    });
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: policyKey,
            // Convert to object with each key containing {pendingAction: 'add'}
            value: {
                employeeList: optimisticMembersState,
            },
        },
    ];
    optimisticData.push(...newPersonalDetailsOnyxData.optimisticData, ...membersChats.onyxOptimisticData, ...announceRoomChat.onyxOptimisticData, ...announceRoomMembers.optimisticData, ...adminRoomMembers.optimisticData);
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: policyKey,
            value: {
                employeeList: successMembersState,
            },
        },
    ];
    successData.push(...newPersonalDetailsOnyxData.finallyData, ...membersChats.onyxSuccessData, ...announceRoomChat.onyxSuccessData, ...announceRoomMembers.successData, ...adminRoomMembers.successData);
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: policyKey,
            // Convert to object with each key containing the error. We don't
            // need to remove the members since that is handled by onClose of OfflineWithFeedback.
            value: {
                employeeList: failureMembersState,
            },
        },
    ];
    failureData.push(...membersChats.onyxFailureData, ...announceRoomChat.onyxFailureData, ...announceRoomMembers.failureData, ...adminRoomMembers.failureData);
    return { optimisticData, successData, failureData, optimisticAnnounceChat, membersChats, logins };
}
/**
 * Adds members to the specified workspace/policyID
 * Please see https://github.com/Expensify/App/blob/main/README.md#Security for more details
 */
function addMembersToWorkspace(invitedEmailsToAccountIDs, welcomeNote, policyID, policyMemberAccountIDs, role, formatPhoneNumber) {
    const { optimisticData, successData, failureData, optimisticAnnounceChat, membersChats, logins } = buildAddMembersToWorkspaceOnyxData(invitedEmailsToAccountIDs, policyID, policyMemberAccountIDs, role, formatPhoneNumber);
    const params = {
        employees: JSON.stringify(logins.map((login) => ({ email: login, role }))),
        ...(optimisticAnnounceChat.announceChatReportID ? { announceChatReportID: optimisticAnnounceChat.announceChatReportID } : {}),
        ...(optimisticAnnounceChat.announceChatReportActionID ? { announceCreatedReportActionID: optimisticAnnounceChat.announceChatReportActionID } : {}),
        welcomeNote: Parser_1.default.replace(welcomeNote, {
            shouldEscapeText: false,
        }),
        policyID,
    };
    if (!(0, EmptyObject_1.isEmptyObject)(membersChats.reportCreationData)) {
        params.reportCreationData = JSON.stringify(membersChats.reportCreationData);
    }
    API.write(types_1.WRITE_COMMANDS.ADD_MEMBERS_TO_WORKSPACE, params, { optimisticData, successData, failureData });
}
function importPolicyMembers(policyID, members) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    const { added, updated } = members.reduce((acc, curr) => {
        const employee = policy?.employeeList?.[curr.email];
        if (employee) {
            if (curr.role !== employee.role || curr.submitsTo !== employee.submitsTo || curr.forwardsTo !== employee.forwardsTo) {
                acc.updated++;
            }
        }
        else {
            acc.added++;
        }
        return acc;
    }, { added: 0, updated: 0 });
    const onyxData = updateImportSpreadsheetData(added, updated);
    const parameters = {
        policyID,
        employees: JSON.stringify(members.map((member) => ({ email: member.email, role: member.role, submitsTo: member.submitsTo, forwardsTo: member.forwardsTo }))),
    };
    API.write(types_1.WRITE_COMMANDS.IMPORT_MEMBERS_SPREADSHEET, parameters, onyxData);
}
/**
 * Invite member to the specified policyID
 * Please see https://github.com/Expensify/App/blob/main/README.md#Security for more details
 */
function inviteMemberToWorkspace(policyID, inviterEmail) {
    const memberJoinKey = `${ONYXKEYS_1.default.COLLECTION.POLICY_JOIN_MEMBER}${policyID}`;
    const optimisticMembersState = { policyID, inviterEmail };
    const failureMembersState = { policyID, inviterEmail };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: memberJoinKey,
            value: optimisticMembersState,
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: memberJoinKey,
            value: { ...failureMembersState, errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('iou.error.genericEditFailureMessage') },
        },
    ];
    const params = { policyID, inviterEmail };
    API.write(types_1.WRITE_COMMANDS.JOIN_POLICY_VIA_INVITE_LINK, params, { optimisticData, failureData });
}
/**
 * Add member to the selected private domain workspace based on policyID
 */
function joinAccessiblePolicy(policyID) {
    const memberJoinKey = `${ONYXKEYS_1.default.COLLECTION.POLICY_JOIN_MEMBER}${policyID}`;
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: memberJoinKey,
            value: { policyID },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: memberJoinKey,
            value: { policyID, errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.people.error.genericAdd') },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.JOIN_ACCESSIBLE_POLICY, { policyID }, { optimisticData, failureData });
}
/**
 * Ask the policy admin to add member to the selected private domain workspace based on policyID
 */
function askToJoinPolicy(policyID) {
    const memberJoinKey = `${ONYXKEYS_1.default.COLLECTION.POLICY_JOIN_MEMBER}${policyID}`;
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: memberJoinKey,
            value: { policyID },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: memberJoinKey,
            value: { policyID, errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.people.error.genericAdd') },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.ASK_TO_JOIN_POLICY, { policyID }, { optimisticData, failureData });
}
/**
 * Removes an error after trying to delete a member
 */
function clearDeleteMemberError(policyID, accountID) {
    const email = allPersonalDetails?.[accountID]?.login ?? '';
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
        employeeList: {
            [email]: {
                pendingAction: null,
                errors: null,
            },
        },
    });
}
/**
 * Removes an error after trying to add a member
 */
function clearAddMemberError(policyID, accountID) {
    const email = allPersonalDetails?.[accountID]?.login ?? '';
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
        employeeList: {
            [email]: null,
        },
    });
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.PERSONAL_DETAILS_LIST}`, {
        [accountID]: null,
    });
}
function openWorkspaceMembersPage(policyID, clientMemberEmails) {
    if (!policyID || !clientMemberEmails) {
        Log_1.default.warn('openWorkspaceMembersPage invalid params', { policyID, clientMemberEmails });
        return;
    }
    const params = {
        policyID,
        clientMemberEmails: JSON.stringify(clientMemberEmails),
    };
    API.read(types_1.READ_COMMANDS.OPEN_WORKSPACE_MEMBERS_PAGE, params);
}
function openPolicyMemberProfilePage(policyID, accountID) {
    const params = {
        policyID,
        accountID,
    };
    API.read(types_1.READ_COMMANDS.OPEN_POLICY_MEMBER_PROFILE_PAGE, params);
}
function setWorkspaceInviteMembersDraft(policyID, invitedEmailsToAccountIDs) {
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_INVITE_MEMBERS_DRAFT}${policyID}`, invitedEmailsToAccountIDs);
}
function setWorkspaceInviteRoleDraft(policyID, role) {
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_INVITE_ROLE_DRAFT}${policyID}`, role);
}
function clearWorkspaceInviteRoleDraft(policyID) {
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_INVITE_ROLE_DRAFT}${policyID}`, null);
}
/**
 * Accept user join request to a workspace
 */
function acceptJoinRequest(reportID, reportAction) {
    if (!reportAction || !reportID) {
        Log_1.default.warn('acceptJoinRequest missing reportID or reportAction', { reportAction, reportID });
        return;
    }
    const choice = CONST_1.default.REPORT.ACTIONABLE_MENTION_JOIN_WORKSPACE_RESOLUTION.ACCEPT;
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [reportAction.reportActionID]: {
                    originalMessage: { choice },
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [reportAction.reportActionID]: {
                    originalMessage: { choice },
                    pendingAction: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [reportAction.reportActionID]: {
                    originalMessage: { choice: '' },
                    pendingAction: null,
                },
            },
        },
    ];
    const accountIDToApprove = ReportActionsUtils.isActionableJoinRequest(reportAction)
        ? (ReportActionsUtils.getOriginalMessage(reportAction)?.accountID ?? reportAction?.actorAccountID)
        : CONST_1.default.DEFAULT_NUMBER_ID;
    const parameters = {
        requests: JSON.stringify({
            [ReportActionsUtils.isActionableJoinRequest(reportAction) ? (ReportActionsUtils.getOriginalMessage(reportAction)?.policyID ?? CONST_1.default.DEFAULT_NUMBER_ID) : CONST_1.default.DEFAULT_NUMBER_ID]: {
                requests: [{ accountID: accountIDToApprove, adminsRoomMessageReportActionID: reportAction.reportActionID }],
            },
        }),
    };
    API.write(types_1.WRITE_COMMANDS.ACCEPT_JOIN_REQUEST, parameters, { optimisticData, failureData, successData });
}
/**
 * Decline user join request to a workspace
 */
function declineJoinRequest(reportID, reportAction) {
    if (!reportAction || !reportID) {
        Log_1.default.warn('declineJoinRequest missing reportID or reportAction', { reportAction, reportID });
        return;
    }
    const choice = CONST_1.default.REPORT.ACTIONABLE_MENTION_JOIN_WORKSPACE_RESOLUTION.DECLINE;
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [reportAction.reportActionID]: {
                    originalMessage: { choice },
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [reportAction.reportActionID]: {
                    originalMessage: { choice },
                    pendingAction: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [reportAction.reportActionID]: {
                    originalMessage: { choice: '' },
                    pendingAction: null,
                },
            },
        },
    ];
    const accountIDToApprove = ReportActionsUtils.isActionableJoinRequest(reportAction)
        ? (ReportActionsUtils.getOriginalMessage(reportAction)?.accountID ?? reportAction?.actorAccountID)
        : CONST_1.default.DEFAULT_NUMBER_ID;
    const parameters = {
        requests: JSON.stringify({
            [ReportActionsUtils.isActionableJoinRequest(reportAction) ? (ReportActionsUtils.getOriginalMessage(reportAction)?.policyID ?? CONST_1.default.DEFAULT_NUMBER_ID) : CONST_1.default.DEFAULT_NUMBER_ID]: {
                requests: [{ accountID: accountIDToApprove, adminsRoomMessageReportActionID: reportAction.reportActionID }],
            },
        }),
    };
    API.write(types_1.WRITE_COMMANDS.DECLINE_JOIN_REQUEST, parameters, { optimisticData, failureData, successData });
}
function downloadMembersCSV(policyID, onDownloadFailed) {
    const finalParameters = (0, enhanceParameters_1.default)(types_1.WRITE_COMMANDS.EXPORT_MEMBERS_CSV, {
        policyID,
    });
    const fileName = 'Members.csv';
    const formData = new FormData();
    Object.entries(finalParameters).forEach(([key, value]) => {
        formData.append(key, String(value));
    });
    (0, fileDownload_1.default)(ApiUtils.getCommandURL({ command: types_1.WRITE_COMMANDS.EXPORT_MEMBERS_CSV }), fileName, '', false, formData, CONST_1.default.NETWORK.METHOD.POST, onDownloadFailed);
}
function clearInviteDraft(policyID) {
    setWorkspaceInviteMembersDraft(policyID, {});
    FormActions.clearDraftValues(ONYXKEYS_1.default.FORMS.WORKSPACE_INVITE_MESSAGE_FORM);
}
function setImportedSpreadsheetMemberData(memberData) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.IMPORTED_SPREADSHEET_MEMBER_DATA, memberData);
}
function clearImportedSpreadsheetMemberData() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.IMPORTED_SPREADSHEET_MEMBER_DATA, null);
}
