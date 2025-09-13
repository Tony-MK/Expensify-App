"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOptimisticPolicyRecentlyUsedTags = buildOptimisticPolicyRecentlyUsedTags;
exports.setPolicyRequiresTag = setPolicyRequiresTag;
exports.setPolicyTagsRequired = setPolicyTagsRequired;
exports.createPolicyTag = createPolicyTag;
exports.clearPolicyTagErrors = clearPolicyTagErrors;
exports.clearPolicyTagListErrors = clearPolicyTagListErrors;
exports.clearPolicyTagListErrorField = clearPolicyTagListErrorField;
exports.deletePolicyTags = deletePolicyTags;
exports.enablePolicyTags = enablePolicyTags;
exports.setWorkspaceTagRequired = setWorkspaceTagRequired;
exports.openPolicyTagsPage = openPolicyTagsPage;
exports.renamePolicyTag = renamePolicyTag;
exports.renamePolicyTagList = renamePolicyTagList;
exports.setWorkspaceTagEnabled = setWorkspaceTagEnabled;
exports.setPolicyTagGLCode = setPolicyTagGLCode;
exports.setPolicyTagApprover = setPolicyTagApprover;
exports.importPolicyTags = importPolicyTags;
exports.downloadTagsCSV = downloadTagsCSV;
exports.getPolicyTagsData = getPolicyTagsData;
exports.downloadMultiLevelIndependentTagsCSV = downloadMultiLevelIndependentTagsCSV;
exports.cleanPolicyTags = cleanPolicyTags;
exports.setImportedSpreadsheetIsImportingMultiLevelTags = setImportedSpreadsheetIsImportingMultiLevelTags;
exports.setImportedSpreadsheetIsImportingIndependentMultiLevelTags = setImportedSpreadsheetIsImportingIndependentMultiLevelTags;
exports.setImportedSpreadsheetIsFirstLineHeader = setImportedSpreadsheetIsFirstLineHeader;
exports.setImportedSpreadsheetIsGLAdjacent = setImportedSpreadsheetIsGLAdjacent;
exports.setImportedSpreadsheetFileURI = setImportedSpreadsheetFileURI;
exports.importMultiLevelTags = importMultiLevelTags;
const cloneDeep_1 = require("lodash/cloneDeep");
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ApiUtils = require("@libs/ApiUtils");
const ErrorUtils = require("@libs/ErrorUtils");
const fileDownload_1 = require("@libs/fileDownload");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const getIsNarrowLayout_1 = require("@libs/getIsNarrowLayout");
const Localize_1 = require("@libs/Localize");
const Log_1 = require("@libs/Log");
const enhanceParameters_1 = require("@libs/Network/enhanceParameters");
const PolicyUtils = require("@libs/PolicyUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
let allPolicyTags = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.POLICY_TAGS,
    waitForCollectionCallback: true,
    callback: (value) => {
        if (!value) {
            allPolicyTags = {};
            return;
        }
        allPolicyTags = value;
    },
});
let allRecentlyUsedTags = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_TAGS,
    waitForCollectionCallback: true,
    callback: (val) => (allRecentlyUsedTags = val),
});
function openPolicyTagsPage(policyID) {
    if (!policyID) {
        Log_1.default.warn('openPolicyTagsPage invalid params', { policyID });
        return;
    }
    const params = {
        policyID,
    };
    API.read(types_1.READ_COMMANDS.OPEN_POLICY_TAGS_PAGE, params);
}
function buildOptimisticPolicyRecentlyUsedTags(policyID, transactionTags) {
    if (!policyID || !transactionTags) {
        return {};
    }
    const policyTags = allPolicyTags?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`] ?? {};
    const policyTagKeys = PolicyUtils.getSortedTagKeys(policyTags);
    const policyRecentlyUsedTags = allRecentlyUsedTags?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_TAGS}${policyID}`] ?? {};
    const newOptimisticPolicyRecentlyUsedTags = {};
    (0, TransactionUtils_1.getTagArrayFromName)(transactionTags).forEach((tag, index) => {
        if (!tag) {
            return;
        }
        const tagListKey = policyTagKeys.at(index) ?? '';
        newOptimisticPolicyRecentlyUsedTags[tagListKey] = [...new Set([tag, ...(policyRecentlyUsedTags[tagListKey] ?? [])])];
    });
    return newOptimisticPolicyRecentlyUsedTags;
}
function updateImportSpreadsheetData(tagsLength) {
    const onyxData = {
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.IMPORTED_SPREADSHEET,
                value: {
                    shouldFinalModalBeOpened: true,
                    importFinalModal: {
                        title: (0, Localize_1.translateLocal)('spreadsheet.importSuccessfulTitle'),
                        prompt: (0, Localize_1.translateLocal)('spreadsheet.importTagsSuccessfulDescription', { tags: tagsLength }),
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
function createPolicyTag(policyID, tagName) {
    const policyTag = PolicyUtils.getTagLists(allPolicyTags?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`] ?? {})?.at(0) ?? {};
    const newTagName = PolicyUtils.escapeTagName(tagName);
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [policyTag.name]: {
                        tags: {
                            [newTagName]: {
                                name: newTagName,
                                enabled: true,
                                errors: null,
                                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                            },
                        },
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [policyTag.name]: {
                        tags: {
                            [newTagName]: {
                                errors: null,
                                pendingAction: null,
                            },
                        },
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [policyTag.name]: {
                        tags: {
                            [newTagName]: {
                                errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.tags.genericFailureMessage'),
                            },
                        },
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        tags: JSON.stringify([{ name: newTagName }]),
    };
    API.write(types_1.WRITE_COMMANDS.CREATE_POLICY_TAG, parameters, onyxData);
}
function importPolicyTags(policyID, tags) {
    const onyxData = updateImportSpreadsheetData(tags.length);
    const parameters = {
        policyID,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        tags: JSON.stringify(tags.map((tag) => ({ name: tag.name, enabled: tag.enabled, 'GL Code': tag['GL Code'] }))),
    };
    API.write(types_1.WRITE_COMMANDS.IMPORT_TAGS_SPREADSHEET, parameters, onyxData);
}
function setWorkspaceTagEnabled(policyID, tagsToUpdate, tagListIndex) {
    const policyTag = PolicyUtils.getTagLists(allPolicyTags?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`] ?? {})?.at(tagListIndex);
    if (!policyTag || tagListIndex === -1) {
        return;
    }
    const optimisticPolicyTagsData = {
        ...Object.keys(tagsToUpdate).reduce((acc, key) => {
            acc[key] = {
                ...policyTag.tags[key],
                ...tagsToUpdate[key],
                errors: null,
                pendingFields: {
                    ...policyTag.tags[key]?.pendingFields,
                    enabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
            };
            return acc;
        }, {}),
    };
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [policyTag.name]: {
                        tags: optimisticPolicyTagsData,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [policyTag.name]: {
                        tags: {
                            ...Object.keys(tagsToUpdate).reduce((acc, key) => {
                                acc[key] = {
                                    ...policyTag.tags[key],
                                    ...tagsToUpdate[key],
                                    errors: null,
                                    pendingFields: {
                                        ...policyTag.tags[key].pendingFields,
                                        enabled: null,
                                    },
                                    pendingAction: null,
                                };
                                return acc;
                            }, {}),
                        },
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [policyTag.name]: {
                        tags: {
                            ...Object.keys(tagsToUpdate).reduce((acc, key) => {
                                acc[key] = {
                                    ...policyTag.tags[key],
                                    ...tagsToUpdate[key],
                                    errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.tags.genericFailureMessage'),
                                    pendingFields: {
                                        ...policyTag.tags[key].pendingFields,
                                        enabled: null,
                                    },
                                    pendingAction: null,
                                };
                                return acc;
                            }, {}),
                        },
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        tags: JSON.stringify(Object.keys(tagsToUpdate).map((key) => tagsToUpdate[key])),
        tagListIndex,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_TAGS_ENABLED, parameters, onyxData);
}
function setWorkspaceTagRequired(policyID, tagListIndexes, isRequired, policyTags) {
    if (!policyTags) {
        return;
    }
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    ...Object.keys(policyTags).reduce((acc, key) => {
                        if (tagListIndexes.includes(policyTags[key].orderWeight)) {
                            acc[key] = {
                                ...acc[key],
                                required: isRequired,
                                errors: undefined,
                                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                pendingFields: {
                                    required: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                },
                            };
                            return acc;
                        }
                        return acc;
                    }, {}),
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    ...Object.keys(policyTags).reduce((acc, key) => {
                        if (tagListIndexes.includes(policyTags[key].orderWeight)) {
                            acc[key] = {
                                ...acc[key],
                                errors: undefined,
                                pendingAction: null,
                                pendingFields: {
                                    required: null,
                                },
                            };
                            return acc;
                        }
                        return acc;
                    }, {}),
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    ...Object.keys(policyTags).reduce((acc, key) => {
                        acc[key] = {
                            ...acc[key],
                            errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.tags.genericFailureMessage'),
                            pendingAction: null,
                            pendingFields: {
                                required: null,
                            },
                        };
                        return acc;
                    }, {}),
                },
            },
        ],
    };
    const parameters = {
        policyID,
        tagListIndexes,
        isRequired,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_TAG_LISTS_REQUIRED, parameters, onyxData);
}
function deletePolicyTags(policyID, tagsToDelete) {
    const policyTag = PolicyUtils.getTagLists(allPolicyTags?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`] ?? {})?.at(0);
    if (!policyTag) {
        return;
    }
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [policyTag.name]: {
                        tags: {
                            ...tagsToDelete.reduce((acc, tagName) => {
                                acc[tagName] = { pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE, enabled: false };
                                return acc;
                            }, {}),
                        },
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [policyTag.name]: {
                        tags: {
                            ...tagsToDelete.reduce((acc, tagName) => {
                                acc[tagName] = null;
                                return acc;
                            }, {}),
                        },
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [policyTag.name]: {
                        tags: {
                            ...tagsToDelete.reduce((acc, tagName) => {
                                acc[tagName] = {
                                    pendingAction: null,
                                    errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.tags.deleteFailureMessage'),
                                    enabled: !!policyTag?.tags[tagName]?.enabled,
                                };
                                return acc;
                            }, {}),
                        },
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        tags: JSON.stringify(tagsToDelete),
    };
    API.write(types_1.WRITE_COMMANDS.DELETE_POLICY_TAGS, parameters, onyxData);
}
function clearPolicyTagErrors(policyID, tagName, tagListIndex) {
    const tagListName = PolicyUtils.getTagListName(allPolicyTags?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`], tagListIndex);
    const tag = allPolicyTags?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`]?.[tagListName].tags?.[tagName];
    if (!tag) {
        return;
    }
    if (tag.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD) {
        react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`, {
            [tagListName]: {
                tags: {
                    [tagName]: null,
                },
            },
        });
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`, {
        [tagListName]: {
            tags: {
                [tagName]: {
                    errors: null,
                    pendingAction: null,
                },
            },
        },
    });
}
function clearPolicyTagListErrorField(policyID, tagListIndex, errorField) {
    const policyTag = PolicyUtils.getTagLists(allPolicyTags?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`] ?? {})?.at(tagListIndex);
    if (!policyTag) {
        return;
    }
    if (!policyTag.name) {
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`, {
        [policyTag.name]: {
            errorFields: {
                [errorField]: null,
            },
        },
    });
}
function clearPolicyTagListErrors(policyID, tagListIndex) {
    const policyTag = PolicyUtils.getTagLists(allPolicyTags?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`] ?? {})?.at(tagListIndex);
    if (!policyTag) {
        return;
    }
    if (!policyTag.name) {
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`, {
        [policyTag.name]: {
            errors: null,
        },
    });
}
function renamePolicyTag(policyID, policyTag, tagListIndex) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = PolicyUtils.getPolicy(policyID);
    const tagList = PolicyUtils.getTagLists(allPolicyTags?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`] ?? {})?.at(tagListIndex);
    if (!tagList) {
        return;
    }
    const tag = tagList.tags?.[policyTag.oldName];
    const oldTagName = policyTag.oldName;
    const newTagName = PolicyUtils.escapeTagName(policyTag.newName);
    const policyTagRule = PolicyUtils.getTagApproverRule(policyID, oldTagName);
    const approvalRules = policy?.rules?.approvalRules ?? [];
    const updatedApprovalRules = (0, cloneDeep_1.default)(approvalRules);
    // Its related by name, so the corresponding rule has to be updated to handle offline scenario
    if (policyTagRule) {
        const indexToUpdate = updatedApprovalRules.findIndex((rule) => rule.id === policyTagRule.id);
        policyTagRule.applyWhen = policyTagRule.applyWhen.map((ruleCondition) => {
            const { value, field, condition } = ruleCondition;
            if (value === policyTag.oldName && field === CONST_1.default.POLICY.FIELDS.TAG && condition === CONST_1.default.POLICY.RULE_CONDITIONS.MATCHES) {
                return { ...ruleCondition, value: policyTag.newName };
            }
            return ruleCondition;
        });
        updatedApprovalRules[indexToUpdate] = policyTagRule;
    }
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [tagList?.name]: {
                        tags: {
                            [oldTagName]: null,
                            [newTagName]: {
                                ...tag,
                                name: newTagName,
                                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                pendingFields: {
                                    ...tag.pendingFields,
                                    name: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                },
                                previousTagName: oldTagName,
                                errors: null,
                            },
                        },
                    },
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    rules: {
                        approvalRules: updatedApprovalRules,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [tagList.name]: {
                        tags: {
                            [newTagName]: {
                                pendingAction: null,
                                pendingFields: {
                                    ...tag.pendingFields,
                                    name: null,
                                },
                            },
                        },
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [tagList.name]: {
                        tags: {
                            [newTagName]: null,
                            [oldTagName]: {
                                ...tag,
                                pendingAction: null,
                                pendingFields: {
                                    ...tag.pendingFields,
                                    name: null,
                                },
                                errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.tags.genericFailureMessage'),
                            },
                        },
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        oldName: oldTagName,
        newName: newTagName,
        tagListIndex,
    };
    API.write(types_1.WRITE_COMMANDS.RENAME_POLICY_TAG, parameters, onyxData);
}
function enablePolicyTags(policyID, enabled) {
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areTagsEnabled: enabled,
                    pendingFields: {
                        areTagsEnabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: {
                        areTagsEnabled: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areTagsEnabled: !enabled,
                    pendingFields: {
                        areTagsEnabled: null,
                    },
                },
            },
        ],
    };
    const policyTagList = allPolicyTags?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`];
    if (!policyTagList) {
        const defaultTagList = {
            Tag: {
                name: 'Tag',
                orderWeight: 0,
                required: false,
                tags: {},
            },
        };
        onyxData.optimisticData?.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
            value: defaultTagList,
        });
        onyxData.failureData?.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
            value: null,
        });
    }
    else if (!enabled) {
        const policyTag = PolicyUtils.getTagLists(policyTagList).at(0);
        if (!policyTag) {
            return;
        }
        onyxData.optimisticData?.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
            value: {
                [policyTag.name]: {
                    tags: Object.fromEntries(Object.keys(policyTag.tags).map((tagName) => [
                        tagName,
                        {
                            enabled: false,
                        },
                    ])),
                },
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                requiresTag: false,
            },
        });
    }
    const parameters = { policyID, enabled };
    API.writeWithNoDuplicatesEnableFeatureConflicts(types_1.WRITE_COMMANDS.ENABLE_POLICY_TAGS, parameters, onyxData);
    if (enabled && (0, getIsNarrowLayout_1.default)()) {
        (0, PolicyUtils_1.goBackWhenEnableFeature)(policyID);
    }
}
function cleanPolicyTags(policyID) {
    // We do not have any optimistic data or success data for this command as this action cannot be done offline
    API.write(types_1.WRITE_COMMANDS.CLEAN_POLICY_TAGS, { policyID });
}
function setImportedSpreadsheetIsImportingMultiLevelTags(isImportingMultiLevelTags) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { isImportingMultiLevelTags });
}
function setImportedSpreadsheetIsImportingIndependentMultiLevelTags(isImportingIndependentMultiLevelTags) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { isImportingIndependentMultiLevelTags });
}
function setImportedSpreadsheetIsFirstLineHeader(containsHeader) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { containsHeader });
}
function setImportedSpreadsheetIsGLAdjacent(isGLAdjacent) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { isGLAdjacent });
}
function setImportedSpreadsheetFileURI(fileURI) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { fileURI });
}
function importMultiLevelTags(policyID, spreadsheet) {
    if (!spreadsheet) {
        return;
    }
    const onyxData = {
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    hasMultipleTagLists: true,
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.IMPORTED_SPREADSHEET,
                value: {
                    shouldFinalModalBeOpened: true,
                    importFinalModal: { title: (0, Localize_1.translateLocal)('spreadsheet.importSuccessfulTitle'), prompt: (0, Localize_1.translateLocal)('spreadsheet.importMultiLevelTagsSuccessfulDescription') },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    hasMultipleTagLists: false,
                },
            },
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
    (0, FileUtils_1.readFileAsync)(spreadsheet?.fileURI ?? '', spreadsheet?.fileName ?? CONST_1.default.MULTI_LEVEL_TAGS_FILE_NAME, (file) => {
        const parameters = {
            policyID,
            isFirstLineHeader: spreadsheet?.containsHeader,
            isIndependent: spreadsheet?.isImportingIndependentMultiLevelTags,
            isGLAdjacent: spreadsheet?.isGLAdjacent,
            file,
        };
        API.write(types_1.WRITE_COMMANDS.IMPORT_MULTI_LEVEL_TAGS, parameters, onyxData);
    }, () => { }, spreadsheet?.fileType ?? CONST_1.default.SHARE_FILE_MIMETYPE.CSV);
}
function renamePolicyTagList(policyID, policyTagListName, policyTags, tagListIndex) {
    const newName = policyTagListName.newName;
    const oldName = policyTagListName.oldName;
    const oldPolicyTags = policyTags?.[oldName] ?? {};
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [newName]: { ...oldPolicyTags, name: newName, pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD, errors: null },
                    [oldName]: null,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [newName]: { pendingAction: null },
                    [oldName]: null,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [newName]: null,
                    [oldName]: {
                        ...oldPolicyTags,
                        pendingAction: null,
                        errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.tags.genericFailureMessage'),
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        oldName,
        newName,
        tagListIndex,
    };
    API.write(types_1.WRITE_COMMANDS.RENAME_POLICY_TAG_LIST, parameters, onyxData);
}
function setPolicyRequiresTag(policyID, requiresTag) {
    const policyTags = allPolicyTags?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`] ?? {};
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    requiresTag,
                    errors: { requiresTag: null },
                    pendingFields: {
                        requiresTag: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    errors: {
                        requiresTag: null,
                    },
                    pendingFields: {
                        requiresTag: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    requiresTag: !requiresTag,
                    errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.tags.genericFailureMessage'),
                    pendingFields: {
                        requiresTag: null,
                    },
                },
            },
        ],
    };
    const getUpdatedTagsData = (required) => ({
        key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        value: {
            ...Object.keys(policyTags).reduce((acc, key) => {
                acc[key] = {
                    ...acc[key],
                    required,
                };
                return acc;
            }, {}),
        },
    });
    onyxData.optimisticData?.push(getUpdatedTagsData(requiresTag));
    onyxData.failureData?.push(getUpdatedTagsData(!requiresTag));
    onyxData.successData?.push(getUpdatedTagsData(requiresTag));
    const parameters = {
        policyID,
        requiresTag,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_REQUIRES_TAG, parameters, onyxData);
}
function setPolicyTagsRequired(policyID, requiresTag, tagListIndex) {
    const policyTag = PolicyUtils.getTagLists(allPolicyTags?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`] ?? {})?.at(tagListIndex);
    if (!policyTag) {
        return;
    }
    if (!policyTag.name) {
        return;
    }
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [policyTag.name]: {
                        required: requiresTag,
                        pendingFields: { required: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                        errorFields: { required: null },
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [policyTag.name]: {
                        pendingFields: { required: null },
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [policyTag.name]: {
                        required: policyTag.required,
                        pendingFields: { required: null },
                        errorFields: {
                            required: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.tags.genericFailureMessage'),
                        },
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        tagListIndex,
        requireTagList: requiresTag,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_TAGS_REQUIRED, parameters, onyxData);
}
function setPolicyTagGLCode(policyID, tagName, tagListIndex, glCode) {
    const tagListName = PolicyUtils.getTagListName(allPolicyTags?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`], tagListIndex);
    const policyTagToUpdate = allPolicyTags?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`]?.[tagListName]?.tags?.[tagName] ?? {};
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [tagListName]: {
                        tags: {
                            [tagName]: {
                                ...policyTagToUpdate,
                                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                pendingFields: {
                                    // eslint-disable-next-line @typescript-eslint/naming-convention
                                    'GL Code': CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                },
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                'GL Code': glCode,
                            },
                        },
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [tagListName]: {
                        tags: {
                            [tagName]: {
                                errors: null,
                                pendingAction: null,
                                pendingFields: {
                                    // eslint-disable-next-line @typescript-eslint/naming-convention
                                    'GL Code': null,
                                },
                            },
                        },
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`,
                value: {
                    [tagListName]: {
                        tags: {
                            [tagName]: {
                                ...policyTagToUpdate,
                                errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.tags.updateGLCodeFailureMessage'),
                            },
                        },
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        tagName,
        tagListName,
        tagListIndex,
        glCode,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_POLICY_TAG_GL_CODE, parameters, onyxData);
}
function setPolicyTagApprover(policyID, tag, approver) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = PolicyUtils.getPolicy(policyID);
    const prevApprovalRules = policy?.rules?.approvalRules ?? [];
    const approverRuleToUpdate = PolicyUtils.getTagApproverRule(policyID, tag);
    const filteredApprovalRules = approverRuleToUpdate ? prevApprovalRules.filter((rule) => rule.id !== approverRuleToUpdate.id) : prevApprovalRules;
    const toBeUnselected = approverRuleToUpdate?.approver === approver;
    const updatedApproverRule = approverRuleToUpdate
        ? { ...approverRuleToUpdate, approver }
        : {
            applyWhen: [
                {
                    condition: CONST_1.default.POLICY.RULE_CONDITIONS.MATCHES,
                    field: CONST_1.default.POLICY.FIELDS.TAG,
                    value: tag,
                },
            ],
            approver,
            id: '-1',
        };
    const updatedApprovalRules = toBeUnselected ? filteredApprovalRules : [...filteredApprovalRules, updatedApproverRule];
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    rules: {
                        approvalRules: updatedApprovalRules,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    rules: {
                        approvalRules: updatedApprovalRules,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    rules: {
                        approvalRules: prevApprovalRules,
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        tagName: tag,
        approver: toBeUnselected ? null : approver,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_TAG_APPROVER, parameters, onyxData);
}
function downloadTagsCSV(policyID, onDownloadFailed) {
    const finalParameters = (0, enhanceParameters_1.default)(types_1.WRITE_COMMANDS.EXPORT_TAGS_CSV, {
        policyID,
    });
    const fileName = 'Tags.csv';
    const formData = new FormData();
    Object.entries(finalParameters).forEach(([key, value]) => {
        formData.append(key, String(value));
    });
    (0, fileDownload_1.default)(ApiUtils.getCommandURL({ command: types_1.WRITE_COMMANDS.EXPORT_TAGS_CSV }), fileName, '', false, formData, CONST_1.default.NETWORK.METHOD.POST, onDownloadFailed);
}
function downloadMultiLevelIndependentTagsCSV(policyID, onDownloadFailed) {
    const finalParameters = (0, enhanceParameters_1.default)(types_1.WRITE_COMMANDS.EXPORT_MULTI_LEVEL_TAGS_CSV, {
        policyID,
    });
    const fileName = 'MultiLevelTags.csv';
    const formData = new FormData();
    Object.entries(finalParameters).forEach(([key, value]) => {
        formData.append(key, String(value));
    });
    (0, fileDownload_1.default)(ApiUtils.getCommandURL({ command: types_1.WRITE_COMMANDS.EXPORT_MULTI_LEVEL_TAGS_CSV }), fileName, '', false, formData, CONST_1.default.NETWORK.METHOD.POST, onDownloadFailed);
}
function getPolicyTagsData(policyID) {
    return allPolicyTags?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`] ?? {};
}
