"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOptimisticPolicyCategories = buildOptimisticPolicyCategories;
exports.buildOptimisticMccGroup = buildOptimisticMccGroup;
exports.buildOptimisticPolicyRecentlyUsedCategories = buildOptimisticPolicyRecentlyUsedCategories;
exports.clearCategoryErrors = clearCategoryErrors;
exports.createPolicyCategory = createPolicyCategory;
exports.deleteWorkspaceCategories = deleteWorkspaceCategories;
exports.downloadCategoriesCSV = downloadCategoriesCSV;
exports.enablePolicyCategories = enablePolicyCategories;
exports.getPolicyCategories = getPolicyCategories;
exports.getPolicyCategoriesData = getPolicyCategoriesData;
exports.importPolicyCategories = importPolicyCategories;
exports.openPolicyCategoriesPage = openPolicyCategoriesPage;
exports.removePolicyCategoryReceiptsRequired = removePolicyCategoryReceiptsRequired;
exports.renamePolicyCategory = renamePolicyCategory;
exports.setPolicyCategoryApprover = setPolicyCategoryApprover;
exports.setPolicyCategoryDescriptionRequired = setPolicyCategoryDescriptionRequired;
exports.buildOptimisticPolicyWithExistingCategories = buildOptimisticPolicyWithExistingCategories;
exports.setPolicyCategoryGLCode = setPolicyCategoryGLCode;
exports.setPolicyCategoryMaxAmount = setPolicyCategoryMaxAmount;
exports.setPolicyCategoryPayrollCode = setPolicyCategoryPayrollCode;
exports.setPolicyCategoryReceiptsRequired = setPolicyCategoryReceiptsRequired;
exports.setPolicyCategoryTax = setPolicyCategoryTax;
exports.setPolicyCustomUnitDefaultCategory = setPolicyCustomUnitDefaultCategory;
exports.setWorkspaceCategoryDescriptionHint = setWorkspaceCategoryDescriptionHint;
exports.setWorkspaceCategoryEnabled = setWorkspaceCategoryEnabled;
exports.setWorkspaceRequiresCategory = setWorkspaceRequiresCategory;
const cloneDeep_1 = require("lodash/cloneDeep");
const union_1 = require("lodash/union");
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ApiUtils = require("@libs/ApiUtils");
const CategoryUtils = require("@libs/CategoryUtils");
const CurrencyUtils = require("@libs/CurrencyUtils");
const ErrorUtils = require("@libs/ErrorUtils");
const fileDownload_1 = require("@libs/fileDownload");
const getIsNarrowLayout_1 = require("@libs/getIsNarrowLayout");
const Localize_1 = require("@libs/Localize");
const Log_1 = require("@libs/Log");
const enhanceParameters_1 = require("@libs/Network/enhanceParameters");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const Task_1 = require("@userActions/Task");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
let allRecentlyUsedCategories = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_CATEGORIES,
    waitForCollectionCallback: true,
    callback: (val) => (allRecentlyUsedCategories = val),
});
let allPolicyCategories = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES,
    waitForCollectionCallback: true,
    callback: (val) => (allPolicyCategories = val),
});
function appendSetupCategoriesOnboardingData(onyxData) {
    const finishOnboardingTaskData = (0, Task_1.getFinishOnboardingTaskOnyxData)('setupCategories');
    onyxData.optimisticData?.push(...(finishOnboardingTaskData.optimisticData ?? []));
    onyxData.successData?.push(...(finishOnboardingTaskData.successData ?? []));
    onyxData.failureData?.push(...(finishOnboardingTaskData.failureData ?? []));
    return onyxData;
}
function buildOptimisticPolicyWithExistingCategories(policyID, categories) {
    const categoriesValues = Object.values(categories);
    const optimisticCategoryMap = categoriesValues.reduce((acc, category) => {
        acc[category.name] = {
            ...category,
            errors: null,
            pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
        };
        return acc;
    }, {});
    const successCategoryMap = categoriesValues.reduce((acc, category) => {
        acc[category.name] = {
            errors: null,
            pendingAction: null,
        };
        return acc;
    }, {});
    const failureCategoryMap = categoriesValues.reduce((acc, category) => {
        acc[category.name] = {
            errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.categories.createFailureMessage'),
        };
        return acc;
    }, {});
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: optimisticCategoryMap,
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES_DRAFT}${policyID}`,
                value: null,
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: successCategoryMap,
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: failureCategoryMap,
            },
        ],
    };
    return onyxData;
}
function buildOptimisticPolicyCategories(policyID, categories) {
    const optimisticCategoryMap = categories.reduce((acc, category) => {
        acc[category] = {
            name: category,
            enabled: true,
            errors: null,
            pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
        };
        return acc;
    }, {});
    const successCategoryMap = categories.reduce((acc, category) => {
        acc[category] = {
            errors: null,
            pendingAction: null,
        };
        return acc;
    }, {});
    const failureCategoryMap = categories.reduce((acc, category) => {
        acc[category] = {
            errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.categories.createFailureMessage'),
        };
        return acc;
    }, {});
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: optimisticCategoryMap,
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES_DRAFT}${policyID}`,
                value: null,
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: successCategoryMap,
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: failureCategoryMap,
            },
        ],
    };
    return onyxData;
}
function buildOptimisticMccGroup() {
    const optimisticMccGroup = {
        mccGroup: {
            airlines: {
                category: CONST_1.default.POLICY.DEFAULT_CATEGORIES.TRAVEL,
                groupID: 'airlines',
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
            commuter: {
                category: CONST_1.default.POLICY.DEFAULT_CATEGORIES.CAR,
                groupID: 'commuter',
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
            gas: {
                category: CONST_1.default.POLICY.DEFAULT_CATEGORIES.CAR,
                groupID: 'gas',
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
            goods: {
                category: CONST_1.default.POLICY.DEFAULT_CATEGORIES.MATERIALS,
                groupID: 'goods',
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
            groceries: {
                category: CONST_1.default.POLICY.DEFAULT_CATEGORIES.MEALS_AND_ENTERTAINMENT,
                groupID: 'groceries',
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
            hotel: {
                category: CONST_1.default.POLICY.DEFAULT_CATEGORIES.TRAVEL,
                groupID: 'hotel',
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
            mail: {
                category: CONST_1.default.POLICY.DEFAULT_CATEGORIES.OFFICE_SUPPLIES,
                groupID: 'mail',
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
            meals: {
                category: CONST_1.default.POLICY.DEFAULT_CATEGORIES.MEALS_AND_ENTERTAINMENT,
                groupID: 'meals',
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
            rental: {
                category: CONST_1.default.POLICY.DEFAULT_CATEGORIES.TRAVEL,
                groupID: 'rental',
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
            services: {
                category: CONST_1.default.POLICY.DEFAULT_CATEGORIES.PROFESSIONAL_SERVICES,
                groupID: 'services',
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
            taxi: {
                category: CONST_1.default.POLICY.DEFAULT_CATEGORIES.TRAVEL,
                groupID: 'taxi',
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
            uncategorized: {
                category: CONST_1.default.POLICY.DEFAULT_CATEGORIES.OTHER,
                groupID: 'uncategorized',
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
            utilities: {
                category: CONST_1.default.POLICY.DEFAULT_CATEGORIES.UTILITIES,
                groupID: 'utilities',
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
        },
    };
    const successMccGroup = { mccGroup: {} };
    Object.keys(optimisticMccGroup.mccGroup).forEach((key) => (successMccGroup.mccGroup[key] = { pendingAction: null }));
    const mccGroupData = {
        optimisticData: optimisticMccGroup,
        successData: successMccGroup,
        failureData: { mccGroup: null },
    };
    return mccGroupData;
}
function updateImportSpreadsheetData(categoriesLength) {
    const onyxData = {
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.IMPORTED_SPREADSHEET,
                value: {
                    shouldFinalModalBeOpened: true,
                    importFinalModal: {
                        title: (0, Localize_1.translateLocal)('spreadsheet.importSuccessfulTitle'),
                        prompt: (0, Localize_1.translateLocal)('spreadsheet.importCategoriesSuccessfulDescription', { categories: categoriesLength }),
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
function openPolicyCategoriesPage(policyID) {
    if (!policyID) {
        Log_1.default.warn('openPolicyCategoriesPage invalid params', { policyID });
        return;
    }
    const params = {
        policyID,
    };
    API.read(types_1.READ_COMMANDS.OPEN_POLICY_CATEGORIES_PAGE, params);
}
function getPolicyCategories(policyID) {
    if (!policyID || policyID === '-1' || policyID === CONST_1.default.POLICY.ID_FAKE) {
        Log_1.default.warn('GetPolicyCategories invalid params', { policyID });
        return;
    }
    const params = {
        policyID,
    };
    API.read(types_1.READ_COMMANDS.GET_POLICY_CATEGORIES, params);
}
function buildOptimisticPolicyRecentlyUsedCategories(policyID, category) {
    if (!policyID || !category) {
        return [];
    }
    const policyRecentlyUsedCategories = allRecentlyUsedCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_CATEGORIES}${policyID}`] ?? [];
    return (0, union_1.default)([category], policyRecentlyUsedCategories);
}
function setWorkspaceCategoryEnabled(policyID, categoriesToUpdate, policyTagLists = {}, allTransactionViolations = {}) {
    const policyCategories = allPolicyCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`] ?? {};
    const optimisticPolicyCategoriesData = {
        ...Object.keys(categoriesToUpdate).reduce((acc, key) => {
            acc[key] = {
                ...categoriesToUpdate[key],
                errors: null,
                pendingFields: {
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
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: optimisticPolicyCategoriesData,
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    ...Object.keys(categoriesToUpdate).reduce((acc, key) => {
                        acc[key] = {
                            errors: null,
                            pendingFields: {
                                enabled: null,
                            },
                            pendingAction: null,
                        };
                        return acc;
                    }, {}),
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    ...Object.keys(categoriesToUpdate).reduce((acc, key) => {
                        acc[key] = {
                            ...policyCategories[key],
                            errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.categories.updateFailureMessage'),
                            pendingFields: {
                                enabled: null,
                            },
                            pendingAction: null,
                        };
                        return acc;
                    }, {}),
                },
            },
        ],
    };
    (0, ReportUtils_1.pushTransactionViolationsOnyxData)(onyxData, policyID, policyTagLists, policyCategories, allTransactionViolations, {}, optimisticPolicyCategoriesData);
    appendSetupCategoriesOnboardingData(onyxData);
    const parameters = {
        policyID,
        categories: JSON.stringify(Object.keys(categoriesToUpdate).map((key) => categoriesToUpdate[key])),
    };
    API.write(types_1.WRITE_COMMANDS.SET_WORKSPACE_CATEGORIES_ENABLED, parameters, onyxData);
}
function setPolicyCategoryDescriptionRequired(policyID, categoryName, areCommentsRequired) {
    const policyCategoryToUpdate = allPolicyCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`]?.[categoryName];
    const originalAreCommentsRequired = policyCategoryToUpdate?.areCommentsRequired;
    const originalCommentHint = policyCategoryToUpdate?.commentHint;
    // When areCommentsRequired is set to false, commentHint has to be reset
    const updatedCommentHint = areCommentsRequired ? allPolicyCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`]?.[categoryName]?.commentHint : '';
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        pendingFields: {
                            areCommentsRequired: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        },
                        areCommentsRequired,
                        commentHint: updatedCommentHint,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        pendingAction: null,
                        pendingFields: {
                            areCommentsRequired: null,
                        },
                        areCommentsRequired,
                        commentHint: updatedCommentHint,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                        pendingAction: null,
                        pendingFields: {
                            areCommentsRequired: null,
                        },
                        areCommentsRequired: originalAreCommentsRequired,
                        commentHint: originalCommentHint,
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        categoryName,
        areCommentsRequired,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_CATEGORY_DESCRIPTION_REQUIRED, parameters, onyxData);
}
function setPolicyCategoryReceiptsRequired(policyID, categoryName, maxAmountNoReceipt) {
    const originalMaxAmountNoReceipt = allPolicyCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`]?.[categoryName]?.maxAmountNoReceipt;
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        pendingFields: {
                            maxAmountNoReceipt: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        },
                        maxAmountNoReceipt,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        pendingAction: null,
                        pendingFields: {
                            maxAmountNoReceipt: null,
                        },
                        maxAmountNoReceipt,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                        pendingAction: null,
                        pendingFields: {
                            maxAmountNoReceipt: null,
                        },
                        maxAmountNoReceipt: originalMaxAmountNoReceipt,
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        categoryName,
        maxExpenseAmountNoReceipt: maxAmountNoReceipt,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_CATEGORY_RECEIPTS_REQUIRED, parameters, onyxData);
}
function removePolicyCategoryReceiptsRequired(policyID, categoryName) {
    const originalMaxAmountNoReceipt = allPolicyCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`]?.[categoryName]?.maxAmountNoReceipt;
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        pendingFields: {
                            maxAmountNoReceipt: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        },
                        maxAmountNoReceipt: null,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        pendingAction: null,
                        pendingFields: {
                            maxAmountNoReceipt: null,
                        },
                        maxAmountNoReceipt: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                        pendingAction: null,
                        pendingFields: {
                            maxAmountNoReceipt: null,
                        },
                        maxAmountNoReceipt: originalMaxAmountNoReceipt,
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        categoryName,
    };
    API.write(types_1.WRITE_COMMANDS.REMOVE_POLICY_CATEGORY_RECEIPTS_REQUIRED, parameters, onyxData);
}
function createPolicyCategory(policyID, categoryName) {
    const onyxData = buildOptimisticPolicyCategories(policyID, [categoryName]);
    appendSetupCategoriesOnboardingData(onyxData);
    const parameters = {
        policyID,
        categories: JSON.stringify([{ name: categoryName }]),
    };
    API.write(types_1.WRITE_COMMANDS.CREATE_WORKSPACE_CATEGORIES, parameters, onyxData);
}
function importPolicyCategories(policyID, categories) {
    const uniqueCategories = categories.reduce((acc, category) => {
        if (!category.name) {
            return acc;
        }
        acc[category.name] = category;
        return acc;
    }, {});
    const categoriesLength = Object.keys(uniqueCategories).length;
    const onyxData = updateImportSpreadsheetData(categoriesLength);
    const parameters = {
        policyID,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        categories: JSON.stringify([...categories.map((category) => ({ name: category.name, enabled: category.enabled, 'GL Code': String(category['GL Code']) }))]),
    };
    API.write(types_1.WRITE_COMMANDS.IMPORT_CATEGORIES_SPREADSHEET, parameters, onyxData);
}
function renamePolicyCategory(policyID, policyCategory) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = (0, PolicyUtils_1.getPolicy)(policyID);
    const policyCategoryToUpdate = allPolicyCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`]?.[policyCategory.oldName];
    const policyCategoryApproverRule = CategoryUtils.getCategoryApproverRule(policy?.rules?.approvalRules ?? [], policyCategory.oldName);
    const policyCategoryExpenseRule = CategoryUtils.getCategoryExpenseRule(policy?.rules?.expenseRules ?? [], policyCategory.oldName);
    const approvalRules = policy?.rules?.approvalRules ?? [];
    const expenseRules = policy?.rules?.expenseRules ?? [];
    const mccGroup = policy?.mccGroup ?? {};
    const updatedApprovalRules = (0, cloneDeep_1.default)(approvalRules);
    const updatedExpenseRules = (0, cloneDeep_1.default)(expenseRules);
    const clonedMccGroup = (0, cloneDeep_1.default)(mccGroup);
    const updatedMccGroup = CategoryUtils.updateCategoryInMccGroup(clonedMccGroup, policyCategory.oldName, policyCategory.newName);
    const updatedMccGroupWithClearedPendingAction = CategoryUtils.updateCategoryInMccGroup(clonedMccGroup, policyCategory.oldName, policyCategory.newName, true);
    if (policyCategoryExpenseRule) {
        const ruleIndex = updatedExpenseRules.findIndex((rule) => rule.id === policyCategoryExpenseRule.id);
        policyCategoryExpenseRule.applyWhen = policyCategoryExpenseRule.applyWhen.map((applyWhen) => ({
            ...applyWhen,
            ...(applyWhen.field === CONST_1.default.POLICY.FIELDS.CATEGORY && applyWhen.value === policyCategory.oldName && { value: policyCategory.newName }),
        }));
        updatedExpenseRules[ruleIndex] = policyCategoryExpenseRule;
    }
    // Its related by name, so the corresponding rule has to be updated to handle offline scenario
    if (policyCategoryApproverRule) {
        const indexToUpdate = updatedApprovalRules.findIndex((rule) => rule.id === policyCategoryApproverRule.id);
        policyCategoryApproverRule.applyWhen = policyCategoryApproverRule.applyWhen.map((ruleCondition) => {
            const { value, field, condition } = ruleCondition;
            if (value === policyCategory.oldName && field === CONST_1.default.POLICY.FIELDS.CATEGORY && condition === CONST_1.default.POLICY.RULE_CONDITIONS.MATCHES) {
                return { ...ruleCondition, value: policyCategory.newName };
            }
            return ruleCondition;
        });
        updatedApprovalRules[indexToUpdate] = policyCategoryApproverRule;
    }
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [policyCategory.oldName]: null,
                    [policyCategory.newName]: {
                        ...policyCategoryToUpdate,
                        errors: null,
                        name: policyCategory.newName,
                        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        pendingFields: {
                            ...(policyCategoryToUpdate?.pendingFields ?? {}),
                            name: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        },
                        previousCategoryName: policyCategory.oldName,
                    },
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    rules: {
                        approvalRules: updatedApprovalRules,
                        expenseRules: updatedExpenseRules,
                    },
                    mccGroup: updatedMccGroup,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    mccGroup: updatedMccGroupWithClearedPendingAction,
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [policyCategory.newName]: {
                        pendingAction: null,
                        pendingFields: {
                            name: null,
                        },
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [policyCategory.newName]: null,
                    [policyCategory.oldName]: {
                        ...policyCategoryToUpdate,
                        errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.categories.updateFailureMessage'),
                    },
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    rules: {
                        approvalRules,
                    },
                    mccGroup,
                },
            },
        ],
    };
    const parameters = {
        policyID,
        categories: JSON.stringify({ [policyCategory.oldName]: policyCategory.newName }),
    };
    API.write(types_1.WRITE_COMMANDS.RENAME_WORKSPACE_CATEGORY, parameters, onyxData);
}
function setPolicyCategoryPayrollCode(policyID, categoryName, payrollCode) {
    const policyCategoryToUpdate = allPolicyCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`]?.[categoryName] ?? {};
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        ...policyCategoryToUpdate,
                        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        pendingFields: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            'Payroll Code': CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        },
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Payroll Code': payrollCode,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        ...policyCategoryToUpdate,
                        pendingAction: null,
                        pendingFields: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            'Payroll Code': null,
                        },
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Payroll Code': payrollCode,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        ...policyCategoryToUpdate,
                        errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.categories.updatePayrollCodeFailureMessage'),
                        pendingAction: null,
                        pendingFields: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            'Payroll Code': null,
                        },
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        categoryName,
        payrollCode,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_POLICY_CATEGORY_PAYROLL_CODE, parameters, onyxData);
}
function setPolicyCategoryGLCode(policyID, categoryName, glCode) {
    const policyCategoryToUpdate = allPolicyCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`]?.[categoryName] ?? {};
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        ...policyCategoryToUpdate,
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
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        ...policyCategoryToUpdate,
                        pendingAction: null,
                        pendingFields: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            'GL Code': null,
                        },
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'GL Code': glCode,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        ...policyCategoryToUpdate,
                        errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.categories.updateGLCodeFailureMessage'),
                        pendingAction: null,
                        pendingFields: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            'GL Code': null,
                        },
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        categoryName,
        glCode,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_POLICY_CATEGORY_GL_CODE, parameters, onyxData);
}
function setWorkspaceRequiresCategory(policyID, requiresCategory, policyTagLists = {}, allTransactionViolations = {}) {
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    requiresCategory,
                    errors: {
                        requiresCategory: null,
                    },
                    pendingFields: {
                        requiresCategory: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
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
                        requiresCategory: null,
                    },
                    pendingFields: {
                        requiresCategory: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    requiresCategory: !requiresCategory,
                    errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.categories.updateFailureMessage'),
                    pendingFields: {
                        requiresCategory: null,
                    },
                },
            },
        ],
    };
    (0, ReportUtils_1.pushTransactionViolationsOnyxData)(onyxData, policyID, policyTagLists, allPolicyCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`] ?? {}, allTransactionViolations, {
        requiresCategory,
    });
    const parameters = {
        policyID,
        requiresCategory,
    };
    API.write(types_1.WRITE_COMMANDS.SET_WORKSPACE_REQUIRES_CATEGORY, parameters, onyxData);
}
function clearCategoryErrors(policyID, categoryName) {
    const category = allPolicyCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`]?.[categoryName];
    if (!category) {
        return;
    }
    if (category.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD) {
        react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`, {
            [category.name]: null,
        });
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`, {
        [category.name]: {
            errors: null,
        },
    });
}
function deleteWorkspaceCategories(policyID, categoryNamesToDelete, policyTagLists = {}, transactionViolations = {}) {
    const policyCategories = allPolicyCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`] ?? {};
    const optimisticPolicyCategoriesData = categoryNamesToDelete.reduce((acc, categoryName) => {
        acc[categoryName] = { pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE, enabled: false };
        return acc;
    }, {});
    const shouldDisableRequiresCategory = !(0, OptionsListUtils_1.hasEnabledOptions)(Object.values(policyCategories).filter((category) => !categoryNamesToDelete.includes(category.name) && category.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE));
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: optimisticPolicyCategoriesData,
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: categoryNamesToDelete.reduce((acc, categoryName) => {
                    acc[categoryName] = null;
                    return acc;
                }, {}),
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: categoryNamesToDelete.reduce((acc, categoryName) => {
                    acc[categoryName] = {
                        pendingAction: null,
                        errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('workspace.categories.deleteFailureMessage'),
                        enabled: !!policyCategories?.[categoryName]?.enabled,
                    };
                    return acc;
                }, {}),
            },
        ],
    };
    const optimisticPolicyData = shouldDisableRequiresCategory ? { requiresCategory: false } : {};
    (0, ReportUtils_1.pushTransactionViolationsOnyxData)(onyxData, policyID, policyTagLists, policyCategories, transactionViolations, optimisticPolicyData, optimisticPolicyCategoriesData);
    appendSetupCategoriesOnboardingData(onyxData);
    const parameters = {
        policyID,
        categories: JSON.stringify(categoryNamesToDelete),
    };
    API.write(types_1.WRITE_COMMANDS.DELETE_WORKSPACE_CATEGORIES, parameters, onyxData);
}
function enablePolicyCategories(policyID, enabled, policyTagLists = {}, allTransactionViolations = {}, shouldGoBack = true) {
    const onyxUpdatesToDisableCategories = [];
    if (!enabled) {
        onyxUpdatesToDisableCategories.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
            value: Object.fromEntries(Object.entries(allPolicyCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`] ?? {}).map(([categoryName]) => [
                categoryName,
                {
                    enabled: false,
                },
            ])),
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                requiresCategory: false,
            },
        });
    }
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areCategoriesEnabled: enabled,
                    pendingFields: {
                        areCategoriesEnabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
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
                        areCategoriesEnabled: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areCategoriesEnabled: !enabled,
                    pendingFields: {
                        areCategoriesEnabled: null,
                    },
                },
            },
        ],
    };
    const policyUpdate = {
        areCategoriesEnabled: enabled,
        requiresCategory: enabled,
        pendingFields: {
            areCategoriesEnabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
        },
    };
    const policyCategories = allPolicyCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`] ?? {};
    const policyCategoriesUpdate = Object.fromEntries(Object.entries(policyCategories).map(([categoryName]) => [categoryName, { name: categoryName, enabled }]));
    (0, ReportUtils_1.pushTransactionViolationsOnyxData)(onyxData, policyID, policyTagLists, policyCategories, allTransactionViolations, policyUpdate, policyCategoriesUpdate);
    if (onyxUpdatesToDisableCategories.length > 0) {
        onyxData.optimisticData?.push(...onyxUpdatesToDisableCategories);
    }
    const parameters = { policyID, enabled };
    API.writeWithNoDuplicatesEnableFeatureConflicts(types_1.WRITE_COMMANDS.ENABLE_POLICY_CATEGORIES, parameters, onyxData);
    if (enabled && (0, getIsNarrowLayout_1.default)() && shouldGoBack) {
        (0, PolicyUtils_1.goBackWhenEnableFeature)(policyID);
    }
}
function setPolicyCustomUnitDefaultCategory(policyID, customUnitID, oldCategory, category) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                customUnits: {
                    [customUnitID]: {
                        defaultCategory: category,
                        pendingFields: { defaultCategory: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                    },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                customUnits: {
                    [customUnitID]: {
                        pendingFields: { defaultCategory: null },
                    },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                customUnits: {
                    [customUnitID]: {
                        defaultCategory: oldCategory,
                        errorFields: { defaultCategory: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage') },
                        pendingFields: { defaultCategory: null },
                    },
                },
            },
        },
    ];
    const params = {
        policyID,
        customUnitID,
        category,
    };
    API.write(types_1.WRITE_COMMANDS.SET_CUSTOM_UNIT_DEFAULT_CATEGORY, params, { optimisticData, successData, failureData });
}
function downloadCategoriesCSV(policyID, onDownloadFailed) {
    const finalParameters = (0, enhanceParameters_1.default)(types_1.WRITE_COMMANDS.EXPORT_CATEGORIES_CSV, {
        policyID,
    });
    const fileName = 'Categories.csv';
    const formData = new FormData();
    Object.entries(finalParameters).forEach(([key, value]) => {
        formData.append(key, String(value));
    });
    (0, fileDownload_1.default)(ApiUtils.getCommandURL({ command: types_1.WRITE_COMMANDS.EXPORT_CATEGORIES_CSV }), fileName, '', false, formData, CONST_1.default.NETWORK.METHOD.POST, onDownloadFailed);
}
function setWorkspaceCategoryDescriptionHint(policyID, categoryName, commentHint) {
    const originalCommentHint = allPolicyCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`]?.[categoryName]?.commentHint;
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        pendingFields: {
                            commentHint: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        },
                        commentHint,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        pendingAction: null,
                        pendingFields: {
                            commentHint: null,
                        },
                        commentHint,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                        pendingAction: null,
                        pendingFields: {
                            commentHint: null,
                        },
                        commentHint: originalCommentHint,
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        categoryName,
        commentHint,
    };
    API.write(types_1.WRITE_COMMANDS.SET_WORKSPACE_CATEGORY_DESCRIPTION_HINT, parameters, onyxData);
}
function setPolicyCategoryMaxAmount(policyID, categoryName, maxExpenseAmount, expenseLimitType) {
    const policyCategoryToUpdate = allPolicyCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`]?.[categoryName];
    const originalMaxExpenseAmount = policyCategoryToUpdate?.maxExpenseAmount;
    const originalExpenseLimitType = policyCategoryToUpdate?.expenseLimitType;
    const parsedMaxExpenseAmount = maxExpenseAmount === '' ? null : CurrencyUtils.convertToBackendAmount(parseFloat(maxExpenseAmount));
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        pendingFields: {
                            maxExpenseAmount: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                            expenseLimitType: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        },
                        maxExpenseAmount: parsedMaxExpenseAmount,
                        expenseLimitType,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        pendingAction: null,
                        pendingFields: {
                            maxExpenseAmount: null,
                            expenseLimitType: null,
                        },
                        maxExpenseAmount: parsedMaxExpenseAmount,
                        expenseLimitType,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`,
                value: {
                    [categoryName]: {
                        errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                        pendingAction: null,
                        pendingFields: {
                            maxExpenseAmount: null,
                            expenseLimitType: null,
                        },
                        maxExpenseAmount: originalMaxExpenseAmount,
                        expenseLimitType: originalExpenseLimitType,
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        categoryName,
        maxExpenseAmount: parsedMaxExpenseAmount,
        expenseLimitType,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_CATEGORY_MAX_AMOUNT, parameters, onyxData);
}
function setPolicyCategoryApprover(policyID, categoryName, approver, approvalRules) {
    let updatedApprovalRules = (0, cloneDeep_1.default)(approvalRules);
    const existingCategoryApproverRule = CategoryUtils.getCategoryApproverRule(updatedApprovalRules, categoryName);
    let newApprover = approver;
    if (!existingCategoryApproverRule) {
        updatedApprovalRules.push({
            approver,
            applyWhen: [
                {
                    condition: CONST_1.default.POLICY.RULE_CONDITIONS.MATCHES,
                    field: 'category',
                    value: categoryName,
                },
            ],
        });
    }
    else if (existingCategoryApproverRule?.approver === approver) {
        updatedApprovalRules = updatedApprovalRules.filter((rule) => rule.approver !== approver);
        newApprover = '';
    }
    else {
        const indexToUpdate = updatedApprovalRules.indexOf(existingCategoryApproverRule);
        const approvalRule = updatedApprovalRules.at(indexToUpdate);
        if (approvalRule && indexToUpdate !== -1) {
            approvalRule.approver = approver;
        }
    }
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
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    rules: {
                        approvalRules,
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        categoryName,
        approver: newApprover,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_CATEGORY_APPROVER, parameters, onyxData);
}
function setPolicyCategoryTax(policyID, categoryName, taxID) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = (0, PolicyUtils_1.getPolicy)(policyID);
    const expenseRules = policy?.rules?.expenseRules ?? [];
    const updatedExpenseRules = (0, cloneDeep_1.default)(expenseRules);
    const existingCategoryExpenseRule = updatedExpenseRules.find((rule) => rule.applyWhen.some((when) => when.value === categoryName));
    if (!existingCategoryExpenseRule) {
        updatedExpenseRules.push({
            tax: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                field_id_TAX: {
                    externalID: taxID,
                },
            },
            applyWhen: [
                {
                    condition: CONST_1.default.POLICY.RULE_CONDITIONS.MATCHES,
                    field: 'category',
                    value: categoryName,
                },
            ],
        });
    }
    else {
        const indexToUpdate = updatedExpenseRules.indexOf(existingCategoryExpenseRule);
        const expenseRule = updatedExpenseRules.at(indexToUpdate);
        if (expenseRule && indexToUpdate !== -1) {
            expenseRule.tax.field_id_TAX.externalID = taxID;
        }
    }
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    rules: {
                        expenseRules: updatedExpenseRules,
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
                        expenseRules,
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        categoryName,
        taxID,
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_CATEGORY_TAX, parameters, onyxData);
}
function getPolicyCategoriesData(policyID) {
    return allPolicyCategories?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`] ?? {};
}
