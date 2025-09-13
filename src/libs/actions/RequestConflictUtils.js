"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enablePolicyFeatureCommand = void 0;
exports.resolveDuplicationConflictAction = resolveDuplicationConflictAction;
exports.resolveOpenReportDuplicationConflictAction = resolveOpenReportDuplicationConflictAction;
exports.resolveCommentDeletionConflicts = resolveCommentDeletionConflicts;
exports.resolveEditCommentWithNewAddCommentRequest = resolveEditCommentWithNewAddCommentRequest;
exports.createUpdateCommentMatcher = createUpdateCommentMatcher;
exports.resolveEnableFeatureConflicts = resolveEnableFeatureConflicts;
const react_native_onyx_1 = require("react-native-onyx");
const types_1 = require("@libs/API/types");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const addNewMessage = new Set([types_1.WRITE_COMMANDS.ADD_COMMENT, types_1.WRITE_COMMANDS.ADD_ATTACHMENT, types_1.WRITE_COMMANDS.ADD_TEXT_AND_ATTACHMENT]);
const commentsToBeDeleted = new Set([
    types_1.WRITE_COMMANDS.ADD_COMMENT,
    types_1.WRITE_COMMANDS.ADD_ATTACHMENT,
    types_1.WRITE_COMMANDS.ADD_TEXT_AND_ATTACHMENT,
    types_1.WRITE_COMMANDS.UPDATE_COMMENT,
    types_1.WRITE_COMMANDS.ADD_EMOJI_REACTION,
    types_1.WRITE_COMMANDS.REMOVE_EMOJI_REACTION,
]);
const enablePolicyFeatureCommand = [
    types_1.WRITE_COMMANDS.ENABLE_POLICY_DISTANCE_RATES,
    types_1.WRITE_COMMANDS.ENABLE_POLICY_EXPENSIFY_CARDS,
    types_1.WRITE_COMMANDS.ENABLE_POLICY_COMPANY_CARDS,
    types_1.WRITE_COMMANDS.ENABLE_POLICY_CONNECTIONS,
    types_1.WRITE_COMMANDS.TOGGLE_RECEIPT_PARTNERS,
    types_1.WRITE_COMMANDS.ENABLE_POLICY_CATEGORIES,
    types_1.WRITE_COMMANDS.ENABLE_POLICY_TAGS,
    types_1.WRITE_COMMANDS.ENABLE_POLICY_TAXES,
    types_1.WRITE_COMMANDS.ENABLE_POLICY_REPORT_FIELDS,
    types_1.WRITE_COMMANDS.ENABLE_POLICY_WORKFLOWS,
    types_1.WRITE_COMMANDS.SET_POLICY_RULES_ENABLED,
    types_1.WRITE_COMMANDS.ENABLE_POLICY_INVOICING,
];
exports.enablePolicyFeatureCommand = enablePolicyFeatureCommand;
function createUpdateCommentMatcher(reportActionID) {
    return function (request) {
        return request.command === types_1.WRITE_COMMANDS.UPDATE_COMMENT && request.data?.reportActionID === reportActionID;
    };
}
/**
 * Determines the appropriate action for handling duplication conflicts in persisted requests.
 *
 * This method checks if any request in the list of persisted requests matches the criteria defined by the request matcher function.
 * - If no match is found, it suggests adding the request to the list, indicating a 'push' action.
 * - If a match is found, it suggests updating the existing entry, indicating a 'replace' action at the found index.
 */
function resolveDuplicationConflictAction(persistedRequests, requestMatcher) {
    const index = persistedRequests.findIndex(requestMatcher);
    if (index === -1) {
        return {
            conflictAction: {
                type: 'push',
            },
        };
    }
    return {
        conflictAction: {
            type: 'replace',
            index,
        },
    };
}
function resolveOpenReportDuplicationConflictAction(persistedRequests, parameters) {
    for (let index = 0; index < persistedRequests.length; index++) {
        const request = persistedRequests.at(index);
        if (request && request.command === types_1.WRITE_COMMANDS.OPEN_REPORT && request.data?.reportID === parameters.reportID && request.data?.emailList === parameters.emailList) {
            // If the previous request had guided setup data, we can safely ignore the new request
            if (request.data.guidedSetupData) {
                return {
                    conflictAction: {
                        type: 'noAction',
                    },
                };
            }
            // In other cases it's safe to replace the previous request with the new one
            return {
                conflictAction: {
                    type: 'replace',
                    index,
                },
            };
        }
    }
    // If we didn't find any request to replace, we should push the new request
    return {
        conflictAction: {
            type: 'push',
        },
    };
}
function resolveCommentDeletionConflicts(persistedRequests, reportActionID, originalReportID) {
    const commentIndicesToDelete = [];
    const commentCouldBeThread = {};
    let addCommentFound = false;
    persistedRequests.forEach((request, index) => {
        // If the request will open a Thread, we should not delete the comment and we should send all the requests
        if (request.command === types_1.WRITE_COMMANDS.OPEN_REPORT && request.data?.parentReportActionID === reportActionID && reportActionID in commentCouldBeThread) {
            const indexToRemove = commentCouldBeThread[reportActionID];
            commentIndicesToDelete.splice(indexToRemove, 1);
            // The new message performs some changes in Onyx, we want to keep those changes.
            addCommentFound = false;
            return;
        }
        if (!commentsToBeDeleted.has(request.command) || request.data?.reportActionID !== reportActionID) {
            return;
        }
        // If we find a new message, we probably want to remove it and not perform any request given that the server
        // doesn't know about it yet.
        if (addNewMessage.has(request.command) && !request.isRollback) {
            addCommentFound = true;
            commentCouldBeThread[reportActionID] = commentIndicesToDelete.length;
        }
        commentIndicesToDelete.push(index);
    });
    if (commentIndicesToDelete.length === 0) {
        return {
            conflictAction: {
                type: 'push',
            },
        };
    }
    if (addCommentFound) {
        // The new message performs some changes in Onyx, so we need to rollback those changes.
        const rollbackData = [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${originalReportID}`,
                value: {
                    [reportActionID]: null,
                },
            },
        ];
        react_native_onyx_1.default.update(rollbackData);
    }
    return {
        conflictAction: {
            type: 'delete',
            indices: commentIndicesToDelete,
            pushNewRequest: !addCommentFound,
        },
    };
}
function resolveEditCommentWithNewAddCommentRequest(persistedRequests, parameters, reportActionID, addCommentIndex) {
    const indicesToDelete = [];
    persistedRequests.forEach((request, index) => {
        if (request.command !== types_1.WRITE_COMMANDS.UPDATE_COMMENT || request.data?.reportActionID !== reportActionID) {
            return;
        }
        indicesToDelete.push(index);
    });
    const currentAddComment = persistedRequests.at(addCommentIndex);
    let nextAction = null;
    if (currentAddComment) {
        currentAddComment.data = { ...currentAddComment.data, ...parameters };
        nextAction = {
            type: 'replace',
            index: addCommentIndex,
            request: currentAddComment,
        };
        if (indicesToDelete.length === 0) {
            return {
                conflictAction: nextAction,
            };
        }
    }
    return {
        conflictAction: {
            type: 'delete',
            indices: indicesToDelete,
            pushNewRequest: false,
            nextAction,
        },
    };
}
function resolveEnableFeatureConflicts(command, persistedRequests, parameters) {
    const deleteRequestIndex = persistedRequests.findIndex((request) => request.command === command && request.data?.policyID === parameters.policyID && request.data?.enabled !== parameters.enabled);
    if (deleteRequestIndex === -1) {
        return {
            conflictAction: {
                type: 'push',
            },
        };
    }
    return {
        conflictAction: {
            type: 'delete',
            indices: [deleteRequestIndex],
            pushNewRequest: false,
        },
    };
}
