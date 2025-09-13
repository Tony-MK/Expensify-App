"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDescriptionForPolicyDomainCard = exports.sortWorkspacesBySelected = exports.isPolicyOwner = exports.isPolicyEmployee = exports.isPolicyAuditor = exports.isPolicyUser = exports.isPolicyAdmin = exports.isUserPolicyAdmin = void 0;
exports.canEditTaxRate = canEditTaxRate;
exports.escapeTagName = escapeTagName;
exports.getActivePolicies = getActivePolicies;
exports.getPerDiemCustomUnits = getPerDiemCustomUnits;
exports.getAdminEmployees = getAdminEmployees;
exports.getCleanedTagName = getCleanedTagName;
exports.getCommaSeparatedTagNameWithSanitizedColons = getCommaSeparatedTagNameWithSanitizedColons;
exports.getConnectedIntegration = getConnectedIntegration;
exports.getValidConnectedIntegration = getValidConnectedIntegration;
exports.getCountOfEnabledTagsOfList = getCountOfEnabledTagsOfList;
exports.getIneligibleInvitees = getIneligibleInvitees;
exports.getMemberAccountIDsForWorkspace = getMemberAccountIDsForWorkspace;
exports.getNumericValue = getNumericValue;
exports.isMultiLevelTags = isMultiLevelTags;
exports.getPersonalPolicy = getPersonalPolicy;
exports.getPolicy = getPolicy;
exports.getPolicyBrickRoadIndicatorStatus = getPolicyBrickRoadIndicatorStatus;
exports.getPolicyEmployeeListByIdWithoutCurrentUser = getPolicyEmployeeListByIdWithoutCurrentUser;
exports.getSortedTagKeys = getSortedTagKeys;
exports.getTagList = getTagList;
exports.getTagListByOrderWeight = getTagListByOrderWeight;
exports.getTagListName = getTagListName;
exports.getTagLists = getTagLists;
exports.getTaxByID = getTaxByID;
exports.getUnitRateValue = getUnitRateValue;
exports.getRateDisplayValue = getRateDisplayValue;
exports.goBackFromInvalidPolicy = goBackFromInvalidPolicy;
exports.hasAccountingConnections = hasAccountingConnections;
exports.shouldShowSyncError = shouldShowSyncError;
exports.shouldShowCustomUnitsError = shouldShowCustomUnitsError;
exports.shouldShowEmployeeListError = shouldShowEmployeeListError;
exports.hasIntegrationAutoSync = hasIntegrationAutoSync;
exports.hasPolicyCategoriesError = hasPolicyCategoriesError;
exports.shouldShowPolicyError = shouldShowPolicyError;
exports.shouldShowPolicyErrorFields = shouldShowPolicyErrorFields;
exports.shouldShowTaxRateError = shouldShowTaxRateError;
exports.isControlOnAdvancedApprovalMode = isControlOnAdvancedApprovalMode;
exports.isExpensifyTeam = isExpensifyTeam;
exports.isDeletedPolicyEmployee = isDeletedPolicyEmployee;
exports.isInstantSubmitEnabled = isInstantSubmitEnabled;
exports.isDelayedSubmissionEnabled = isDelayedSubmissionEnabled;
exports.getCorrectedAutoReportingFrequency = getCorrectedAutoReportingFrequency;
exports.isPaidGroupPolicy = isPaidGroupPolicy;
exports.isPendingDeletePolicy = isPendingDeletePolicy;
exports.isPolicyFeatureEnabled = isPolicyFeatureEnabled;
exports.isPolicyMember = isPolicyMember;
exports.isPolicyPayer = isPolicyPayer;
exports.arePaymentsEnabled = arePaymentsEnabled;
exports.isSubmitAndClose = isSubmitAndClose;
exports.isTaxTrackingEnabled = isTaxTrackingEnabled;
exports.shouldShowPolicy = shouldShowPolicy;
exports.getActiveAdminWorkspaces = getActiveAdminWorkspaces;
exports.hasActiveAdminWorkspaces = hasActiveAdminWorkspaces;
exports.getOwnedPaidPolicies = getOwnedPaidPolicies;
exports.canSendInvoiceFromWorkspace = canSendInvoiceFromWorkspace;
exports.canSubmitPerDiemExpenseFromWorkspace = canSubmitPerDiemExpenseFromWorkspace;
exports.canSendInvoice = canSendInvoice;
exports.hasDependentTags = hasDependentTags;
exports.hasVBBA = hasVBBA;
exports.getXeroTenants = getXeroTenants;
exports.findCurrentXeroOrganization = findCurrentXeroOrganization;
exports.getCurrentXeroOrganizationName = getCurrentXeroOrganizationName;
exports.getXeroBankAccounts = getXeroBankAccounts;
exports.findSelectedVendorWithDefaultSelect = findSelectedVendorWithDefaultSelect;
exports.findSelectedBankAccountWithDefaultSelect = findSelectedBankAccountWithDefaultSelect;
exports.navigateToReceiptPartnersPage = navigateToReceiptPartnersPage;
exports.findSelectedInvoiceItemWithDefaultSelect = findSelectedInvoiceItemWithDefaultSelect;
exports.findSelectedTaxAccountWithDefaultSelect = findSelectedTaxAccountWithDefaultSelect;
exports.findSelectedSageVendorWithDefaultSelect = findSelectedSageVendorWithDefaultSelect;
exports.hasPolicyWithXeroConnection = hasPolicyWithXeroConnection;
exports.getNetSuiteVendorOptions = getNetSuiteVendorOptions;
exports.canUseTaxNetSuite = canUseTaxNetSuite;
exports.canUseProvincialTaxNetSuite = canUseProvincialTaxNetSuite;
exports.getFilteredReimbursableAccountOptions = getFilteredReimbursableAccountOptions;
exports.getNetSuiteReimbursableAccountOptions = getNetSuiteReimbursableAccountOptions;
exports.getFilteredCollectionAccountOptions = getFilteredCollectionAccountOptions;
exports.getNetSuiteCollectionAccountOptions = getNetSuiteCollectionAccountOptions;
exports.getFilteredApprovalAccountOptions = getFilteredApprovalAccountOptions;
exports.getNetSuiteApprovalAccountOptions = getNetSuiteApprovalAccountOptions;
exports.getNetSuitePayableAccountOptions = getNetSuitePayableAccountOptions;
exports.getNetSuiteReceivableAccountOptions = getNetSuiteReceivableAccountOptions;
exports.getNetSuiteInvoiceItemOptions = getNetSuiteInvoiceItemOptions;
exports.getNetSuiteTaxAccountOptions = getNetSuiteTaxAccountOptions;
exports.getSageIntacctVendors = getSageIntacctVendors;
exports.getSageIntacctNonReimbursableActiveDefaultVendor = getSageIntacctNonReimbursableActiveDefaultVendor;
exports.getSageIntacctCreditCards = getSageIntacctCreditCards;
exports.getSageIntacctBankAccounts = getSageIntacctBankAccounts;
exports.getDistanceRateCustomUnit = getDistanceRateCustomUnit;
exports.getPerDiemCustomUnit = getPerDiemCustomUnit;
exports.getDistanceRateCustomUnitRate = getDistanceRateCustomUnitRate;
exports.getPerDiemRateCustomUnitRate = getPerDiemRateCustomUnitRate;
exports.removePendingFieldsFromCustomUnit = removePendingFieldsFromCustomUnit;
exports.goBackWhenEnableFeature = goBackWhenEnableFeature;
exports.navigateToExpensifyCardPage = navigateToExpensifyCardPage;
exports.getIntegrationLastSuccessfulDate = getIntegrationLastSuccessfulDate;
exports.getCurrentConnectionName = getCurrentConnectionName;
exports.getCustomersOrJobsLabelNetSuite = getCustomersOrJobsLabelNetSuite;
exports.getDefaultApprover = getDefaultApprover;
exports.getApprovalWorkflow = getApprovalWorkflow;
exports.getReimburserAccountID = getReimburserAccountID;
exports.isControlPolicy = isControlPolicy;
exports.isCollectPolicy = isCollectPolicy;
exports.isNetSuiteCustomSegmentRecord = isNetSuiteCustomSegmentRecord;
exports.getNameFromNetSuiteCustomField = getNameFromNetSuiteCustomField;
exports.isNetSuiteCustomFieldPropertyEditable = isNetSuiteCustomFieldPropertyEditable;
exports.getCurrentSageIntacctEntityName = getCurrentSageIntacctEntityName;
exports.hasNoPolicyOtherThanPersonalType = hasNoPolicyOtherThanPersonalType;
exports.getCurrentTaxID = getCurrentTaxID;
exports.areSettingsInErrorFields = areSettingsInErrorFields;
exports.settingsPendingAction = settingsPendingAction;
exports.getGroupPaidPoliciesWithExpenseChatEnabled = getGroupPaidPoliciesWithExpenseChatEnabled;
exports.getForwardsToAccount = getForwardsToAccount;
exports.getSubmitToAccountID = getSubmitToAccountID;
exports.getWorkspaceAccountID = getWorkspaceAccountID;
exports.getAllTaxRates = getAllTaxRatesNamesAndKeys;
exports.getTagNamesFromTagsLists = getTagNamesFromTagsLists;
exports.getTagApproverRule = getTagApproverRule;
exports.getDomainNameForPolicy = getDomainNameForPolicy;
exports.hasUnsupportedIntegration = hasUnsupportedIntegration;
exports.hasSupportedOnlyOnOldDotIntegration = hasSupportedOnlyOnOldDotIntegration;
exports.getWorkflowApprovalsUnavailable = getWorkflowApprovalsUnavailable;
exports.getNetSuiteImportCustomFieldLabel = getNetSuiteImportCustomFieldLabel;
exports.getUserFriendlyWorkspaceType = getUserFriendlyWorkspaceType;
exports.isPolicyAccessible = isPolicyAccessible;
exports.hasOtherControlWorkspaces = hasOtherControlWorkspaces;
exports.getManagerAccountEmail = getManagerAccountEmail;
exports.getRuleApprovers = getRuleApprovers;
exports.canModifyPlan = canModifyPlan;
exports.getAdminsPrivateEmailDomains = getAdminsPrivateEmailDomains;
exports.getPolicyNameByID = getPolicyNameByID;
exports.getMostFrequentEmailDomain = getMostFrequentEmailDomain;
exports.getManagerAccountID = getManagerAccountID;
exports.isPreferredExporter = isPreferredExporter;
exports.areAllGroupPoliciesExpenseChatDisabled = areAllGroupPoliciesExpenseChatDisabled;
exports.getCountOfRequiredTagLists = getCountOfRequiredTagLists;
exports.getActiveEmployeeWorkspaces = getActiveEmployeeWorkspaces;
exports.isCurrentUserMemberOfAnyPolicy = isCurrentUserMemberOfAnyPolicy;
exports.getPolicyRole = getPolicyRole;
exports.hasIndependentTags = hasIndependentTags;
exports.getLengthOfTag = getLengthOfTag;
exports.isPolicyMemberWithoutPendingDelete = isPolicyMemberWithoutPendingDelete;
exports.getPolicyEmployeeAccountIDs = getPolicyEmployeeAccountIDs;
exports.isMemberPolicyAdmin = isMemberPolicyAdmin;
const expensify_common_1 = require("expensify-common");
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const NetSuiteCustomFieldForm_1 = require("@src/types/form/NetSuiteCustomFieldForm");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const connections_1 = require("./actions/connections");
const QuickbooksOnline_1 = require("./actions/connections/QuickbooksOnline");
const Report_1 = require("./actions/Report");
const CategoryUtils_1 = require("./CategoryUtils");
const Localize_1 = require("./Localize");
const Navigation_1 = require("./Navigation/Navigation");
const NetworkStore_1 = require("./Network/NetworkStore");
const PersonalDetailsUtils_1 = require("./PersonalDetailsUtils");
const TransactionUtils_1 = require("./TransactionUtils");
const ValidationUtils_1 = require("./ValidationUtils");
let allPolicies;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.POLICY,
    waitForCollectionCallback: true,
    callback: (value) => (allPolicies = value),
});
/**
 * Filter out the active policies, which will exclude policies with pending deletion
 * and policies the current user doesn't belong to.
 * These are policies that we can use to create reports with in NewDot.
 */
function getActivePolicies(policies, currentUserLogin) {
    return Object.values(policies ?? {}).filter((policy) => !!policy && policy.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE && !!policy.name && !!policy.id && !!getPolicyRole(policy, currentUserLogin));
}
/**
 * Filter out the active policies, which will exclude policies with pending deletion
 * and policies the current user doesn't belong to.
 * These will be policies that has expense chat enabled.
 * These are policies that we can use to create reports with in NewDot.
 */
function getActivePoliciesWithExpenseChat(policies, currentUserLogin) {
    return Object.values(policies ?? {}).filter((policy) => !!policy &&
        policy.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE &&
        !!policy.name &&
        !!policy.id &&
        !!getPolicyRole(policy, currentUserLogin) &&
        policy.isPolicyExpenseChatEnabled);
}
function getPerDiemCustomUnits(policies, email) {
    return getActivePoliciesWithExpenseChat(policies, email)
        .map((mappedPolicy) => ({ policyID: mappedPolicy.id, customUnit: getPerDiemCustomUnit(mappedPolicy) }))
        // We filter out custom units that are undefine but ts cant' figure it out.
        .filter(({ customUnit }) => !(0, EmptyObject_1.isEmptyObject)(customUnit) && !!customUnit.enabled);
}
/**
 * Checks if the current user is an admin of the policy.
 */
const isPolicyAdmin = (policy, currentUserLogin) => getPolicyRole(policy, currentUserLogin) === CONST_1.default.POLICY.ROLE.ADMIN;
exports.isPolicyAdmin = isPolicyAdmin;
/**
 * Checks if we have any errors stored within the policy?.employeeList. Determines whether we should show a red brick road error or not.
 */
function shouldShowEmployeeListError(policy) {
    return isPolicyAdmin(policy) && Object.values(policy?.employeeList ?? {}).some((employee) => Object.keys(employee?.errors ?? {}).length > 0);
}
/**
 *  Check if the policy has any tax rate errors.
 */
function shouldShowTaxRateError(policy) {
    return (isPolicyAdmin(policy) &&
        Object.values(policy?.taxRates?.taxes ?? {}).some((taxRate) => Object.keys(taxRate?.errors ?? {}).length > 0 || Object.values(taxRate?.errorFields ?? {}).some(Boolean)));
}
/**
 * Check if the policy has any errors within the categories.
 */
function hasPolicyCategoriesError(policyCategories) {
    return Object.keys(policyCategories ?? {}).some((categoryName) => Object.keys(policyCategories?.[categoryName]?.errors ?? {}).length > 0);
}
/**
 * Checks if the policy had a sync error.
 */
function shouldShowSyncError(policy, isSyncInProgress) {
    return isPolicyAdmin(policy) && Object.keys(policy?.connections ?? {}).some((connection) => !!(0, connections_1.hasSynchronizationErrorMessage)(policy, connection, isSyncInProgress));
}
/**
 * Check if the policy has any error fields.
 */
function shouldShowPolicyErrorFields(policy) {
    return isPolicyAdmin(policy) && Object.values(policy?.errorFields ?? {}).some((fieldErrors) => Object.keys(fieldErrors ?? {}).length > 0);
}
/**
 * Check if the policy has any errors, and if it doesn't, then check if it has any error fields.
 */
function shouldShowPolicyError(policy) {
    return Object.keys(policy?.errors ?? {}).length > 0 ? isPolicyAdmin(policy) : shouldShowPolicyErrorFields(policy);
}
/**
 * Checks if we have any errors stored within the policy custom units.
 */
function shouldShowCustomUnitsError(policy) {
    return isPolicyAdmin(policy) && Object.keys(policy?.customUnits?.errors ?? {}).length > 0;
}
function getNumericValue(value, toLocaleDigit) {
    const numValue = parseFloat(value.toString().replace(toLocaleDigit('.'), '.'));
    if (Number.isNaN(numValue)) {
        return NaN;
    }
    // Rounding to 4 decimal places
    return parseFloat(numValue.toFixed(CONST_1.default.MAX_TAX_RATE_DECIMAL_PLACES));
}
/**
 * Retrieves the distance custom unit object for the given policy
 */
function getDistanceRateCustomUnit(policy) {
    return Object.values(policy?.customUnits ?? {}).find((unit) => unit.name === CONST_1.default.CUSTOM_UNITS.NAME_DISTANCE);
}
/**
 * Retrieves the per diem custom unit object for the given policy
 */
function getPerDiemCustomUnit(policy) {
    return Object.values(policy?.customUnits ?? {}).find((unit) => unit.name === CONST_1.default.CUSTOM_UNITS.NAME_PER_DIEM_INTERNATIONAL);
}
/**
 * Retrieves custom unit rate object from the given customUnitRateID
 */
function getDistanceRateCustomUnitRate(policy, customUnitRateID) {
    const distanceUnit = getDistanceRateCustomUnit(policy);
    return distanceUnit?.rates[customUnitRateID];
}
/**
 * Retrieves custom unit rate object from the given customUnitRateID
 */
function getPerDiemRateCustomUnitRate(policy, customUnitRateID) {
    const perDiemUnit = getPerDiemCustomUnit(policy);
    return perDiemUnit?.rates[customUnitRateID];
}
function getRateDisplayValue(value, toLocaleDigit, withDecimals) {
    const numValue = getNumericValue(value, toLocaleDigit);
    if (Number.isNaN(numValue)) {
        return '';
    }
    if (withDecimals) {
        const decimalPart = numValue.toString().split('.').at(1) ?? '';
        // Set the fraction digits to be between 2 and 4 (OD Behavior)
        const fractionDigits = Math.min(Math.max(decimalPart.length, CONST_1.default.MIN_TAX_RATE_DECIMAL_PLACES), CONST_1.default.MAX_TAX_RATE_DECIMAL_PLACES);
        return Number(numValue).toFixed(fractionDigits).toString().replace('.', toLocaleDigit('.'));
    }
    return numValue.toString().replace('.', toLocaleDigit('.')).substring(0, value.toString().length);
}
function getUnitRateValue(toLocaleDigit, customUnitRate, withDecimals) {
    return getRateDisplayValue((customUnitRate?.rate ?? 0) / CONST_1.default.POLICY.CUSTOM_UNIT_RATE_BASE_OFFSET, toLocaleDigit, withDecimals);
}
/**
 * Get the brick road indicator status for a policy. The policy has an error status if there is a policy member error, a custom unit error or a field error.
 */
function getPolicyBrickRoadIndicatorStatus(policy, isConnectionInProgress) {
    if (shouldShowEmployeeListError(policy) ||
        shouldShowCustomUnitsError(policy) ||
        shouldShowPolicyErrorFields(policy) ||
        shouldShowSyncError(policy, isConnectionInProgress) ||
        (0, QuickbooksOnline_1.shouldShowQBOReimbursableExportDestinationAccountError)(policy)) {
        return CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR;
    }
    return undefined;
}
function getPolicyRole(policy, currentUserLogin) {
    if (policy?.role) {
        return policy.role;
    }
    if (!currentUserLogin) {
        return;
    }
    return policy?.employeeList?.[currentUserLogin]?.role;
}
function getPolicyNameByID(policyID) {
    return allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]?.name ?? '';
}
/**
 * Check if the policy can be displayed
 * If shouldShowPendingDeletePolicy is true, show the policy pending deletion.
 * If shouldShowPendingDeletePolicy is false, show the policy pending deletion only if there is an error.
 * Note: Using a local ONYXKEYS.NETWORK subscription will cause a delay in
 * updating the screen. Passing the offline status from the component.
 */
function shouldShowPolicy(policy, shouldShowPendingDeletePolicy, currentUserLogin) {
    return (!!policy?.isJoinRequestPending ||
        (!!policy &&
            policy?.type !== CONST_1.default.POLICY.TYPE.PERSONAL &&
            (shouldShowPendingDeletePolicy || policy?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || Object.keys(policy.errors ?? {}).length > 0) &&
            !!getPolicyRole(policy, currentUserLogin)));
}
/**
 * Checks if a specific user is a member of the policy.
 */
function isPolicyMember(policy, userLogin) {
    return !!policy && !!userLogin && !!policy.employeeList?.[userLogin];
}
function isPolicyMemberWithoutPendingDelete(currentUserLogin, policy) {
    if (!currentUserLogin || !policy?.id) {
        return false;
    }
    const policyEmployee = policy?.employeeList?.[currentUserLogin];
    return !!policyEmployee && policyEmployee.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
}
function isPolicyPayer(policy, currentUserLogin) {
    if (!policy) {
        return false;
    }
    const isAdmin = policy.role === CONST_1.default.POLICY.ROLE.ADMIN;
    const isReimburser = policy.reimburser === currentUserLogin;
    if (policy.reimbursementChoice === CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_YES) {
        return policy.reimburser ? isReimburser : isAdmin;
    }
    if (policy.reimbursementChoice === CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_MANUAL) {
        return isAdmin;
    }
    return false;
}
function isExpensifyTeam(email) {
    const emailDomain = expensify_common_1.Str.extractEmailDomain(email ?? '');
    return emailDomain === CONST_1.default.EXPENSIFY_PARTNER_NAME || emailDomain === CONST_1.default.EMAIL.GUIDES_DOMAIN;
}
/**
 * Checks if the user with login is an admin of the policy.
 */
const isUserPolicyAdmin = (policy, login) => !!(policy && policy.employeeList && login && policy.employeeList[login]?.role === CONST_1.default.POLICY.ROLE.ADMIN);
exports.isUserPolicyAdmin = isUserPolicyAdmin;
/**
 * Checks if the current user is of the role "user" on the policy.
 */
const isPolicyUser = (policy, currentUserLogin) => getPolicyRole(policy, currentUserLogin) === CONST_1.default.POLICY.ROLE.USER;
exports.isPolicyUser = isPolicyUser;
/**
 * Checks if the current user is an auditor of the policy
 */
const isPolicyAuditor = (policy, currentUserLogin) => (policy?.role ?? (currentUserLogin && policy?.employeeList?.[currentUserLogin]?.role)) === CONST_1.default.POLICY.ROLE.AUDITOR;
exports.isPolicyAuditor = isPolicyAuditor;
const isPolicyEmployee = (policyID, policy) => {
    return !!policyID && policyID === policy?.id;
};
exports.isPolicyEmployee = isPolicyEmployee;
/**
 * Checks if the current user is an owner (creator) of the policy.
 */
const isPolicyOwner = (policy, currentUserAccountID) => !!currentUserAccountID && policy?.ownerAccountID === currentUserAccountID;
exports.isPolicyOwner = isPolicyOwner;
/**
 * Create an object mapping member emails to their accountIDs. Filter for members without errors if includeMemberWithErrors is false, and get the login email from the personalDetail object using the accountID.
 *
 * If includeMemberWithErrors is false, We only return members without errors. Otherwise, the members with errors would immediately be removed before the user has a chance to read the error.
 */
function getMemberAccountIDsForWorkspace(employeeList, includeMemberWithErrors = false, includeMemberWithPendingDelete = true) {
    const members = employeeList ?? {};
    const memberEmailsToAccountIDs = {};
    Object.keys(members).forEach((email) => {
        if (!includeMemberWithErrors) {
            const member = members?.[email];
            if (Object.keys(member?.errors ?? {})?.length > 0) {
                return;
            }
        }
        if (!includeMemberWithPendingDelete) {
            const member = members?.[email];
            if (member.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE) {
                return;
            }
        }
        const personalDetail = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(email);
        if (!personalDetail?.login) {
            return;
        }
        memberEmailsToAccountIDs[email] = Number(personalDetail.accountID);
    });
    return memberEmailsToAccountIDs;
}
/**
 * Get login list that we should not show in the workspace invite options
 */
function getIneligibleInvitees(employeeList) {
    const policyEmployeeList = employeeList ?? {};
    const memberEmailsToExclude = [...CONST_1.default.EXPENSIFY_EMAILS];
    Object.keys(policyEmployeeList).forEach((email) => {
        const policyEmployee = policyEmployeeList?.[email];
        // Policy members that are pending delete or have errors are not valid and we should show them in the invite options (don't exclude them).
        if (policyEmployee?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || Object.keys(policyEmployee?.errors ?? {}).length > 0) {
            return;
        }
        if (!email) {
            return;
        }
        memberEmailsToExclude.push(email);
    });
    return memberEmailsToExclude;
}
function getSortedTagKeys(policyTagList) {
    if ((0, EmptyObject_1.isEmptyObject)(policyTagList)) {
        return [];
    }
    return Object.keys(policyTagList).sort((key1, key2) => policyTagList[key1].orderWeight - policyTagList[key2].orderWeight);
}
/**
 * Gets a tag name of policy tags based on a tag's orderWeight.
 */
function getTagListName(policyTagList, orderWeight) {
    if ((0, EmptyObject_1.isEmptyObject)(policyTagList)) {
        return '';
    }
    return Object.values(policyTagList).find((tag) => tag.orderWeight === orderWeight)?.name ?? '';
}
/**
 * Gets all tag lists of a policy
 */
function getTagLists(policyTagList) {
    if ((0, EmptyObject_1.isEmptyObject)(policyTagList)) {
        return [];
    }
    return Object.values(policyTagList)
        .filter((policyTagListValue) => policyTagListValue !== null)
        .sort((tagA, tagB) => tagA.orderWeight - tagB.orderWeight);
}
/**
 * Gets a tag list of a policy by a tag index
 */
function getTagList(policyTagList, tagIndex) {
    const tagLists = getTagLists(policyTagList);
    return (tagLists.at(tagIndex) ?? {
        name: '',
        required: false,
        tags: {},
        orderWeight: 0,
    });
}
/**
 * Gets a tag list of a policy by a tag's orderWeight.
 */
function getTagListByOrderWeight(policyTagList, orderWeight) {
    const tagListEmpty = {
        name: '',
        required: false,
        tags: {},
        orderWeight: 0,
    };
    if ((0, EmptyObject_1.isEmptyObject)(policyTagList)) {
        return tagListEmpty;
    }
    return Object.values(policyTagList).find((tag) => tag.orderWeight === orderWeight) ?? tagListEmpty;
}
function getTagNamesFromTagsLists(policyTagLists) {
    const uniqueTagNames = new Set();
    for (const policyTagList of Object.values(policyTagLists ?? {})) {
        for (const tag of Object.values(policyTagList.tags ?? {})) {
            uniqueTagNames.add(tag.name);
        }
    }
    return Array.from(uniqueTagNames);
}
/**
 * Cleans up escaping of colons (used to create multi-level tags, e.g. "Parent: Child") in the tag name we receive from the backend
 */
function getCleanedTagName(tag) {
    return tag?.replace(/\\:/g, CONST_1.default.COLON);
}
/**
 * Converts a colon-delimited tag string into a comma-separated string, filtering out empty tags.
 */
function getCommaSeparatedTagNameWithSanitizedColons(tag) {
    return (0, TransactionUtils_1.getTagArrayFromName)(tag)
        .filter((tagItem) => tagItem !== '')
        .map(getCleanedTagName)
        .join(', ');
}
function getLengthOfTag(tag) {
    if (!tag) {
        return 0;
    }
    return (0, TransactionUtils_1.getTagArrayFromName)(tag).length;
}
/**
 * Escape colon from tag name
 */
function escapeTagName(tag) {
    return tag?.replaceAll(CONST_1.default.COLON, '\\:');
}
/**
 * Gets a count of enabled tags of a policy
 */
function getCountOfEnabledTagsOfList(policyTags) {
    if (!policyTags) {
        return 0;
    }
    return Object.values(policyTags).filter((policyTag) => policyTag.enabled).length;
}
/**
 * Gets count of required tag lists of a policy
 */
function getCountOfRequiredTagLists(policyTagLists) {
    if (!policyTagLists) {
        return 0;
    }
    return Object.values(policyTagLists).filter((tagList) => tagList.required).length;
}
/**
 * Whether the policy has multi-level tags
 */
function isMultiLevelTags(policyTagList) {
    return Object.keys(policyTagList ?? {}).length > 1;
}
function isPendingDeletePolicy(policy) {
    return policy?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
}
function isPaidGroupPolicy(policy) {
    return policy?.type === CONST_1.default.POLICY.TYPE.TEAM || policy?.type === CONST_1.default.POLICY.TYPE.CORPORATE;
}
function getOwnedPaidPolicies(policies, currentUserAccountID) {
    return Object.values(policies ?? {}).filter((policy) => isPolicyOwner(policy, currentUserAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID) && isPaidGroupPolicy(policy));
}
function isControlPolicy(policy) {
    return policy?.type === CONST_1.default.POLICY.TYPE.CORPORATE;
}
function isCollectPolicy(policy) {
    return policy?.type === CONST_1.default.POLICY.TYPE.TEAM;
}
function isTaxTrackingEnabled(isPolicyExpenseChat, policy, isDistanceRequest, isPerDiemRequest = false) {
    if (isPerDiemRequest) {
        return false;
    }
    const distanceUnit = getDistanceRateCustomUnit(policy);
    const customUnitID = distanceUnit?.customUnitID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const isPolicyTaxTrackingEnabled = isPolicyExpenseChat && policy?.tax?.trackingEnabled;
    const isTaxEnabledForDistance = isPolicyTaxTrackingEnabled && !!customUnitID && policy?.customUnits?.[customUnitID]?.attributes?.taxEnabled;
    return !!(isDistanceRequest ? isTaxEnabledForDistance : isPolicyTaxTrackingEnabled);
}
/**
 * Checks if policy's scheduled submit / auto reporting frequency is "instant".
 * Note: Free policies have "instant" submit always enabled.
 */
function isInstantSubmitEnabled(policy) {
    return policy?.autoReporting === true && policy?.autoReportingFrequency === CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT;
}
/**
 * Checks if policy's scheduled submit / auto reporting frequency is not "instant".
 */
function isDelayedSubmissionEnabled(policy) {
    return policy?.autoReporting === true && policy?.autoReportingFrequency !== CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT;
}
/**
 * This gets a "corrected" value for autoReportingFrequency. The purpose of this function is to encapsulate some logic around the "immediate" frequency.
 *
 * - "immediate" is actually not immediate. For that you want "instant".
 * - (immediate && harvesting.enabled) === daily
 * - (immediate && !harvesting.enabled) === manual
 *
 * Note that "daily" and "manual" only exist as options for the API, not in the database or Onyx.
 */
function getCorrectedAutoReportingFrequency(policy) {
    if (policy?.autoReportingFrequency !== CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE) {
        return policy?.autoReportingFrequency;
    }
    if (policy?.harvesting?.enabled) {
        // This is actually not really "immediate". It's "daily". Surprise!
        return CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE;
    }
    // "manual" is really just "immediate" (aka "daily") with harvesting disabled
    return CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MANUAL;
}
/**
 * Checks if policy's approval mode is "optional", a.k.a. "Submit & Close"
 */
function isSubmitAndClose(policy) {
    return policy?.approvalMode === CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL;
}
function arePaymentsEnabled(policy) {
    return policy?.reimbursementChoice !== CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_NO;
}
function isControlOnAdvancedApprovalMode(policy) {
    return policy?.type === CONST_1.default.POLICY.TYPE.CORPORATE && getApprovalWorkflow(policy) === CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED;
}
/**
 * Whether the policy has active accounting integration connections.
 * `getCurrentConnectionName` only returns connections supported in NewDot.
 * `hasSupportedOnlyOnOldDotIntegration` detects connections that are supported only on OldDot.
 */
function hasAccountingConnections(policy) {
    return !!getCurrentConnectionName(policy) || hasSupportedOnlyOnOldDotIntegration(policy);
}
function getPolicyEmployeeListByIdWithoutCurrentUser(policies, currentPolicyID, currentUserAccountID) {
    const policy = policies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${currentPolicyID}`] ?? null;
    const policyMemberEmailsToAccountIDs = getMemberAccountIDsForWorkspace(policy?.employeeList);
    return Object.values(policyMemberEmailsToAccountIDs)
        .map((policyMemberAccountID) => Number(policyMemberAccountID))
        .filter((policyMemberAccountID) => policyMemberAccountID !== currentUserAccountID);
}
function getPolicyEmployeeAccountIDs(policy, currentUserAccountID) {
    if (!policy) {
        return [];
    }
    const policyMemberEmailsToAccountIDs = getMemberAccountIDsForWorkspace(policy?.employeeList);
    return Object.values(policyMemberEmailsToAccountIDs)
        .map((policyMemberAccountID) => Number(policyMemberAccountID))
        .filter((policyMemberAccountID) => policyMemberAccountID !== currentUserAccountID);
}
function goBackFromInvalidPolicy() {
    Navigation_1.default.goBack(ROUTES_1.default.WORKSPACES_LIST.route);
}
/** Get a tax with given ID from policy */
function getTaxByID(policy, taxID) {
    return policy?.taxRates?.taxes?.[taxID];
}
/** Get a tax rate object built like Record<TaxRateName, RelatedTaxRateKeys>.
 * We want to allow user to choose over TaxRateName and there might be a situation when one TaxRateName has two possible keys in different policies */
function getAllTaxRatesNamesAndKeys() {
    const allTaxRates = {};
    Object.values(allPolicies ?? {})?.forEach((policy) => {
        if (!policy?.taxRates?.taxes) {
            return;
        }
        Object.entries(policy?.taxRates?.taxes).forEach(([taxRateKey, taxRate]) => {
            if (!allTaxRates[taxRate.name]) {
                allTaxRates[taxRate.name] = [taxRateKey];
                return;
            }
            if (allTaxRates[taxRate.name].includes(taxRateKey)) {
                return;
            }
            allTaxRates[taxRate.name].push(taxRateKey);
        });
    });
    return allTaxRates;
}
/**
 * Whether the tax rate can be deleted and disabled
 */
function canEditTaxRate(policy, taxID) {
    return policy.taxRates?.defaultExternalID !== taxID && policy.taxRates?.foreignTaxDefault !== taxID;
}
function isPolicyFeatureEnabled(policy, featureName) {
    if (featureName === CONST_1.default.POLICY.MORE_FEATURES.ARE_TAXES_ENABLED) {
        return !!policy?.tax?.trackingEnabled;
    }
    if (featureName === CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED) {
        return policy?.[featureName] ? !!policy?.[featureName] : !(0, EmptyObject_1.isEmptyObject)(policy?.connections);
    }
    return !!policy?.[featureName];
}
function getApprovalWorkflow(policy) {
    if (policy?.type === CONST_1.default.POLICY.TYPE.PERSONAL) {
        return CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL;
    }
    return policy?.approvalMode ?? CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED;
}
function getDefaultApprover(policy) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return policy?.approver || policy?.owner || '';
}
function getRuleApprovers(policy, expenseReport) {
    const categoryApprovers = [];
    const tagApprovers = [];
    const allReportTransactions = (0, TransactionUtils_1.getAllSortedTransactions)(expenseReport?.reportID);
    // Before submitting to their `submitsTo` (in a policy on Advanced Approvals), submit to category/tag approvers.
    // Category approvers are prioritized, then tag approvers.
    for (let i = 0; i < allReportTransactions.length; i++) {
        const transaction = allReportTransactions.at(i);
        const tag = (0, TransactionUtils_1.getTag)(transaction);
        const category = (0, TransactionUtils_1.getCategory)(transaction);
        const categoryApprover = (0, CategoryUtils_1.getCategoryApproverRule)(policy?.rules?.approvalRules ?? [], category)?.approver;
        const tagApprover = getTagApproverRule(policy, tag)?.approver;
        if (categoryApprover) {
            categoryApprovers.push(categoryApprover);
        }
        if (tagApprover) {
            tagApprovers.push(tagApprover);
        }
    }
    return [...categoryApprovers, ...tagApprovers];
}
function getManagerAccountID(policy, expenseReport) {
    const employeeAccountID = expenseReport?.ownerAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const employeeLogin = (0, PersonalDetailsUtils_1.getLoginsByAccountIDs)([employeeAccountID]).at(0) ?? '';
    const defaultApprover = getDefaultApprover(policy);
    // For policy using the optional or basic workflow, the manager is the policy default approver.
    if ([CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL, CONST_1.default.POLICY.APPROVAL_MODE.BASIC].includes(getApprovalWorkflow(policy))) {
        return (0, PersonalDetailsUtils_1.getAccountIDsByLogins)([defaultApprover]).at(0) ?? -1;
    }
    const employee = policy?.employeeList?.[employeeLogin];
    if (!employee && !defaultApprover) {
        return -1;
    }
    return (0, PersonalDetailsUtils_1.getAccountIDsByLogins)([employee?.submitsTo ?? defaultApprover]).at(0) ?? -1;
}
/**
 * Returns the accountID to whom the given expenseReport submits reports to in the given Policy.
 */
function getSubmitToAccountID(policy, expenseReport) {
    const ruleApprovers = getRuleApprovers(policy, expenseReport);
    const employeeAccountID = expenseReport?.ownerAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const employeeLogin = (0, PersonalDetailsUtils_1.getLoginsByAccountIDs)([employeeAccountID]).at(0) ?? '';
    if (ruleApprovers.length > 0 && ruleApprovers.at(0) === employeeLogin && policy?.preventSelfApproval) {
        ruleApprovers.shift();
    }
    if (ruleApprovers.length > 0 && !isSubmitAndClose(policy)) {
        return (0, PersonalDetailsUtils_1.getAccountIDsByLogins)([ruleApprovers.at(0) ?? '']).at(0) ?? -1;
    }
    return getManagerAccountID(policy, expenseReport);
}
function getManagerAccountEmail(policy, expenseReport) {
    const managerAccountID = getManagerAccountID(policy, expenseReport);
    return (0, PersonalDetailsUtils_1.getLoginsByAccountIDs)([managerAccountID]).at(0) ?? '';
}
/**
 * Returns the email of the account to forward the report to depending on the approver's approval limit.
 * Used for advanced approval mode only.
 */
function getForwardsToAccount(policy, employeeEmail, reportTotal) {
    if (!isControlOnAdvancedApprovalMode(policy)) {
        return '';
    }
    const employee = policy?.employeeList?.[employeeEmail];
    if (!employee) {
        return '';
    }
    const positiveReportTotal = Math.abs(reportTotal);
    if (employee.approvalLimit && employee.overLimitForwardsTo && positiveReportTotal > employee.approvalLimit) {
        return employee.overLimitForwardsTo;
    }
    return employee.forwardsTo ?? '';
}
/**
 * Returns the accountID of the policy reimburser, if not available returns -1.
 */
function getReimburserAccountID(policy) {
    const reimburserEmail = policy?.achAccount?.reimburser ?? '';
    return reimburserEmail ? ((0, PersonalDetailsUtils_1.getAccountIDsByLogins)([reimburserEmail]).at(0) ?? -1) : -1;
}
function getPersonalPolicy() {
    return Object.values(allPolicies ?? {}).find((policy) => policy?.type === CONST_1.default.POLICY.TYPE.PERSONAL);
}
function getAdminEmployees(policy) {
    if (!policy || !policy.employeeList) {
        return [];
    }
    return Object.keys(policy.employeeList)
        .map((email) => ({ ...policy.employeeList?.[email], email }))
        .filter((employee) => employee.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE && employee.role === CONST_1.default.POLICY.ROLE.ADMIN);
}
/**
 * Returns the policy of the report
 * @deprecated Get the data straight from Onyx - This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
 */
function getPolicy(policyID, policies = allPolicies) {
    if (!policies || !policyID) {
        return undefined;
    }
    return policies[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`];
}
/** Return active policies where current user is an admin */
function getActiveAdminWorkspaces(policies, currentUserLogin) {
    const activePolicies = getActivePolicies(policies, currentUserLogin);
    return activePolicies.filter((policy) => shouldShowPolicy(policy, (0, NetworkStore_1.isOffline)(), currentUserLogin) && isPolicyAdmin(policy, currentUserLogin));
}
/** Return active policies where current user is an employee (of the role "user") */
function getActiveEmployeeWorkspaces(policies, currentUserLogin) {
    const activePolicies = getActivePolicies(policies, currentUserLogin);
    return activePolicies.filter((policy) => shouldShowPolicy(policy, (0, NetworkStore_1.isOffline)(), currentUserLogin) && isPolicyUser(policy, currentUserLogin));
}
/**
 * Checks whether the current user has a policy with admin access
 */
function hasActiveAdminWorkspaces(currentUserLogin) {
    return getActiveAdminWorkspaces(allPolicies, currentUserLogin).length > 0;
}
/**
 *
 * Checks whether the current user has a policy with Xero accounting software integration
 */
function hasPolicyWithXeroConnection(currentUserLogin) {
    return getActiveAdminWorkspaces(allPolicies, currentUserLogin)?.some((policy) => !!policy?.connections?.[CONST_1.default.POLICY.CONNECTIONS.NAME.XERO]);
}
/** Whether the user can send invoice from the workspace */
function canSendInvoiceFromWorkspace(policyID) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    return policy?.areInvoicesEnabled ?? false;
}
/** Whether the user can submit per diem expense from the workspace */
function canSubmitPerDiemExpenseFromWorkspace(policy) {
    const perDiemCustomUnit = getPerDiemCustomUnit(policy);
    return !!policy?.isPolicyExpenseChatEnabled && !(0, EmptyObject_1.isEmptyObject)(perDiemCustomUnit) && !!perDiemCustomUnit?.enabled;
}
/** Whether the user can send invoice */
function canSendInvoice(policies, currentUserLogin) {
    return getActiveAdminWorkspaces(policies, currentUserLogin).some((policy) => canSendInvoiceFromWorkspace(policy.id));
}
function hasDependentTags(policy, policyTagList) {
    if (!policy?.hasMultipleTagLists) {
        return false;
    }
    return Object.values(policyTagList ?? {}).some((tagList) => Object.values(tagList.tags).some((tag) => !!tag.rules?.parentTagsFilter || !!tag.parentTagsFilter));
}
function hasIndependentTags(policy, policyTagList) {
    if (!policy?.hasMultipleTagLists) {
        return false;
    }
    return Object.values(policyTagList ?? {}).every((tagList) => Object.values(tagList.tags).every((tag) => !tag.rules?.parentTagsFilter && !tag.parentTagsFilter));
}
/** Get the Xero organizations connected to the policy */
function getXeroTenants(policy) {
    // Due to the way optional chain is being handled in this useMemo we are forced to use this approach to properly handle undefined values
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (!policy || !policy.connections || !policy.connections.xero || !policy.connections.xero.data) {
        return [];
    }
    return policy.connections.xero.data.tenants ?? [];
}
function findCurrentXeroOrganization(tenants, organizationID) {
    return tenants?.find((tenant) => tenant.id === organizationID);
}
function getCurrentXeroOrganizationName(policy) {
    return findCurrentXeroOrganization(getXeroTenants(policy), policy?.connections?.xero?.config?.tenantID)?.name;
}
function getXeroBankAccounts(policy, selectedBankAccountId) {
    const bankAccounts = policy?.connections?.xero?.data?.bankAccounts ?? [];
    return (bankAccounts ?? []).map(({ id, name }) => ({
        value: id,
        text: name,
        keyForList: id,
        isSelected: selectedBankAccountId === id,
    }));
}
function areSettingsInErrorFields(settings, errorFields) {
    if (settings === undefined || errorFields === undefined) {
        return false;
    }
    const keys = Object.keys(errorFields);
    return settings.some((setting) => keys.includes(setting));
}
function settingsPendingAction(settings, pendingFields) {
    if (settings === undefined || pendingFields === undefined) {
        return null;
    }
    const key = Object.keys(pendingFields).find((setting) => settings.includes(setting));
    if (!key) {
        return;
    }
    return pendingFields[key];
}
function findSelectedVendorWithDefaultSelect(vendors, selectedVendorId) {
    const selectedVendor = (vendors ?? []).find(({ id }) => id === selectedVendorId);
    return selectedVendor ?? vendors?.[0] ?? undefined;
}
function findSelectedSageVendorWithDefaultSelect(vendors, selectedVendorID) {
    const selectedVendor = (vendors ?? []).find(({ id }) => id === selectedVendorID);
    return selectedVendor ?? vendors?.[0] ?? undefined;
}
function findSelectedBankAccountWithDefaultSelect(accounts, selectedBankAccountId) {
    const selectedBankAccount = (accounts ?? []).find(({ id }) => id === selectedBankAccountId);
    return selectedBankAccount ?? accounts?.[0] ?? undefined;
}
function findSelectedInvoiceItemWithDefaultSelect(invoiceItems, selectedItemId) {
    const selectedInvoiceItem = (invoiceItems ?? []).find(({ id }) => id === selectedItemId);
    return selectedInvoiceItem ?? invoiceItems?.[0] ?? undefined;
}
function findSelectedTaxAccountWithDefaultSelect(taxAccounts, selectedAccountId) {
    const selectedTaxAccount = (taxAccounts ?? []).find(({ externalID }) => externalID === selectedAccountId);
    return selectedTaxAccount ?? taxAccounts?.[0] ?? undefined;
}
function getNetSuiteVendorOptions(policy, selectedVendorId) {
    const vendors = policy?.connections?.netsuite?.options.data.vendors;
    const selectedVendor = findSelectedVendorWithDefaultSelect(vendors, selectedVendorId);
    return (vendors ?? []).map(({ id, name }) => ({
        value: id,
        text: name,
        keyForList: id,
        isSelected: selectedVendor?.id === id,
    }));
}
function getNetSuitePayableAccountOptions(policy, selectedBankAccountId) {
    const payableAccounts = policy?.connections?.netsuite?.options.data.payableList;
    const selectedPayableAccount = findSelectedBankAccountWithDefaultSelect(payableAccounts, selectedBankAccountId);
    return (payableAccounts ?? []).map(({ id, name }) => ({
        value: id,
        text: name,
        keyForList: id,
        isSelected: selectedPayableAccount?.id === id,
    }));
}
function getNetSuiteReceivableAccountOptions(policy, selectedBankAccountId) {
    const receivableAccounts = policy?.connections?.netsuite?.options.data.receivableList;
    const selectedReceivableAccount = findSelectedBankAccountWithDefaultSelect(receivableAccounts, selectedBankAccountId);
    return (receivableAccounts ?? []).map(({ id, name }) => ({
        value: id,
        text: name,
        keyForList: id,
        isSelected: selectedReceivableAccount?.id === id,
    }));
}
function getNetSuiteInvoiceItemOptions(policy, selectedItemId) {
    const invoiceItems = policy?.connections?.netsuite?.options.data.items;
    const selectedInvoiceItem = findSelectedInvoiceItemWithDefaultSelect(invoiceItems, selectedItemId);
    return (invoiceItems ?? []).map(({ id, name }) => ({
        value: id,
        text: name,
        keyForList: id,
        isSelected: selectedInvoiceItem?.id === id,
    }));
}
function getNetSuiteTaxAccountOptions(policy, subsidiaryCountry, selectedAccountId) {
    const taxAccounts = policy?.connections?.netsuite?.options.data.taxAccountsList;
    const accountOptions = (taxAccounts ?? []).filter(({ country }) => country === subsidiaryCountry);
    const selectedTaxAccount = findSelectedTaxAccountWithDefaultSelect(accountOptions, selectedAccountId);
    return accountOptions.map(({ externalID, name }) => ({
        value: externalID,
        text: name,
        keyForList: externalID,
        isSelected: selectedTaxAccount?.externalID === externalID,
    }));
}
function canUseTaxNetSuite(canUseNetSuiteUSATax, subsidiaryCountry) {
    return !!canUseNetSuiteUSATax || CONST_1.default.NETSUITE_TAX_COUNTRIES.includes(subsidiaryCountry ?? '');
}
function canUseProvincialTaxNetSuite(subsidiaryCountry) {
    return subsidiaryCountry === '_canada';
}
function getFilteredReimbursableAccountOptions(payableAccounts) {
    return (payableAccounts ?? []).filter(({ type }) => type === CONST_1.default.NETSUITE_ACCOUNT_TYPE.BANK || type === CONST_1.default.NETSUITE_ACCOUNT_TYPE.CREDIT_CARD);
}
function getNetSuiteReimbursableAccountOptions(policy, selectedBankAccountId) {
    const payableAccounts = policy?.connections?.netsuite?.options.data.payableList;
    const accountOptions = getFilteredReimbursableAccountOptions(payableAccounts);
    const selectedPayableAccount = findSelectedBankAccountWithDefaultSelect(accountOptions, selectedBankAccountId);
    return accountOptions.map(({ id, name }) => ({
        value: id,
        text: name,
        keyForList: id,
        isSelected: selectedPayableAccount?.id === id,
    }));
}
function getFilteredCollectionAccountOptions(payableAccounts) {
    return (payableAccounts ?? []).filter(({ type }) => type === CONST_1.default.NETSUITE_ACCOUNT_TYPE.BANK);
}
function getNetSuiteCollectionAccountOptions(policy, selectedBankAccountId) {
    const payableAccounts = policy?.connections?.netsuite?.options.data.payableList;
    const accountOptions = getFilteredCollectionAccountOptions(payableAccounts);
    const selectedPayableAccount = findSelectedBankAccountWithDefaultSelect(accountOptions, selectedBankAccountId);
    return accountOptions.map(({ id, name }) => ({
        value: id,
        text: name,
        keyForList: id,
        isSelected: selectedPayableAccount?.id === id,
    }));
}
function getFilteredApprovalAccountOptions(payableAccounts) {
    return (payableAccounts ?? []).filter(({ type }) => type === CONST_1.default.NETSUITE_ACCOUNT_TYPE.ACCOUNTS_PAYABLE);
}
function getNetSuiteApprovalAccountOptions(policy, selectedBankAccountId) {
    const payableAccounts = policy?.connections?.netsuite?.options.data.payableList;
    const defaultApprovalAccount = {
        id: CONST_1.default.NETSUITE_APPROVAL_ACCOUNT_DEFAULT,
        name: (0, Localize_1.translateLocal)('workspace.netsuite.advancedConfig.defaultApprovalAccount'),
        type: CONST_1.default.NETSUITE_ACCOUNT_TYPE.ACCOUNTS_PAYABLE,
    };
    const accountOptions = getFilteredApprovalAccountOptions([defaultApprovalAccount].concat(payableAccounts ?? []));
    const selectedPayableAccount = findSelectedBankAccountWithDefaultSelect(accountOptions, selectedBankAccountId);
    return accountOptions.map(({ id, name }) => ({
        value: id,
        text: name,
        keyForList: id,
        isSelected: selectedPayableAccount?.id === id,
    }));
}
function getCustomersOrJobsLabelNetSuite(policy, translate) {
    const importMapping = policy?.connections?.netsuite?.options?.config?.syncOptions?.mapping;
    if (!importMapping?.customers && !importMapping?.jobs) {
        return undefined;
    }
    const importFields = [];
    const importCustomer = importMapping?.customers ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT;
    const importJobs = importMapping?.jobs ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT;
    if (importCustomer === CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT && importJobs === CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT) {
        return undefined;
    }
    const importedValue = importMapping?.customers !== CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT ? importCustomer : importJobs;
    if (importCustomer !== CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT) {
        importFields.push(translate('workspace.netsuite.import.customersOrJobs.customers'));
    }
    if (importJobs !== CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT) {
        importFields.push(translate('workspace.netsuite.import.customersOrJobs.jobs'));
    }
    const importedValueLabel = translate(`workspace.netsuite.import.customersOrJobs.label`, {
        importFields,
        importType: translate(`workspace.accounting.importTypes.${importedValue}`).toLowerCase(),
    });
    return importedValueLabel.charAt(0).toUpperCase() + importedValueLabel.slice(1);
}
function getNetSuiteImportCustomFieldLabel(policy, importField, translate, localeCompare) {
    const fieldData = policy?.connections?.netsuite?.options?.config.syncOptions?.[importField] ?? [];
    if (fieldData.length === 0) {
        return undefined;
    }
    const mappingSet = new Set(fieldData.map((item) => item.mapping));
    const importedTypes = Array.from(mappingSet)
        .sort((a, b) => localeCompare(b, a))
        .map((mapping) => translate(`workspace.netsuite.import.importTypes.${mapping !== '' ? mapping : 'TAG'}.label`).toLowerCase());
    return translate(`workspace.netsuite.import.importCustomFields.label`, { importedTypes });
}
function isNetSuiteCustomSegmentRecord(customField) {
    return 'segmentName' in customField;
}
function getNameFromNetSuiteCustomField(customField) {
    return 'segmentName' in customField ? customField.segmentName : customField.listName;
}
function isNetSuiteCustomFieldPropertyEditable(customField, fieldName) {
    const fieldsAllowedToEdit = isNetSuiteCustomSegmentRecord(customField) ? [NetSuiteCustomFieldForm_1.default.SEGMENT_NAME, NetSuiteCustomFieldForm_1.default.INTERNAL_ID, NetSuiteCustomFieldForm_1.default.SCRIPT_ID, NetSuiteCustomFieldForm_1.default.MAPPING] : [NetSuiteCustomFieldForm_1.default.MAPPING];
    const fieldKey = fieldName;
    return fieldsAllowedToEdit.includes(fieldKey);
}
function getIntegrationLastSuccessfulDate(getLocalDateFromDatetime, connection, connectionSyncProgress) {
    let syncSuccessfulDate;
    if (!connection) {
        return undefined;
    }
    if (connection?.lastSyncDate) {
        syncSuccessfulDate = connection?.lastSyncDate;
    }
    else {
        syncSuccessfulDate = connection?.lastSync?.successfulDate;
    }
    const connectionSyncTimeStamp = getLocalDateFromDatetime(connectionSyncProgress?.timestamp).toISOString();
    if (connectionSyncProgress &&
        connectionSyncProgress.stageInProgress === CONST_1.default.POLICY.CONNECTIONS.SYNC_STAGE_NAME.JOB_DONE &&
        syncSuccessfulDate &&
        connectionSyncTimeStamp > getLocalDateFromDatetime(syncSuccessfulDate).toISOString()) {
        syncSuccessfulDate = connectionSyncTimeStamp;
    }
    return syncSuccessfulDate;
}
function getCurrentSageIntacctEntityName(policy, defaultNameIfNoEntity) {
    const currentEntityID = policy?.connections?.intacct?.config?.entity;
    if (!currentEntityID) {
        return defaultNameIfNoEntity;
    }
    const entities = policy?.connections?.intacct?.data?.entities;
    return entities?.find((entity) => entity.id === currentEntityID)?.name;
}
function getSageIntacctBankAccounts(policy, selectedBankAccountId) {
    const bankAccounts = policy?.connections?.intacct?.data?.bankAccounts ?? [];
    return (bankAccounts ?? []).map(({ id, name }) => ({
        value: id,
        text: name,
        keyForList: id,
        isSelected: selectedBankAccountId === id,
    }));
}
function getSageIntacctVendors(policy, selectedVendorId) {
    const vendors = policy?.connections?.intacct?.data?.vendors ?? [];
    return vendors.map(({ id, value }) => ({
        value: id,
        text: value,
        keyForList: id,
        isSelected: selectedVendorId === id,
    }));
}
function getSageIntacctNonReimbursableActiveDefaultVendor(policy) {
    const { nonReimbursableCreditCardChargeDefaultVendor: creditCardDefaultVendor, nonReimbursableVendor: expenseReportDefaultVendor, nonReimbursable, } = policy?.connections?.intacct?.config.export ?? {};
    return nonReimbursable === CONST_1.default.SAGE_INTACCT_NON_REIMBURSABLE_EXPENSE_TYPE.CREDIT_CARD_CHARGE ? creditCardDefaultVendor : expenseReportDefaultVendor;
}
function getSageIntacctCreditCards(policy, selectedAccount) {
    const creditCards = policy?.connections?.intacct?.data?.creditCards ?? [];
    return creditCards.map(({ name }) => ({
        value: name,
        text: name,
        keyForList: name,
        isSelected: name === selectedAccount,
    }));
}
/**
 * Sort the workspaces by their name, while keeping the selected one at the beginning.
 * @param workspace1 Details of the first workspace to be compared.
 * @param workspace2 Details of the second workspace to be compared.
 * @param selectedWorkspaceID ID of the selected workspace which needs to be at the beginning.
 */
const sortWorkspacesBySelected = (workspace1, workspace2, selectedWorkspaceIDs, localeCompare) => {
    if (workspace1.policyID && selectedWorkspaceIDs?.includes(workspace1?.policyID) && workspace2.policyID && selectedWorkspaceIDs?.includes(workspace2.policyID)) {
        return localeCompare(workspace1.name?.toLowerCase() ?? '', workspace2.name?.toLowerCase() ?? '');
    }
    if (workspace1.policyID && selectedWorkspaceIDs?.includes(workspace1?.policyID)) {
        return -1;
    }
    if (workspace2.policyID && selectedWorkspaceIDs?.includes(workspace2.policyID)) {
        return 1;
    }
    return localeCompare(workspace1.name?.toLowerCase() ?? '', workspace2.name?.toLowerCase() ?? '');
};
exports.sortWorkspacesBySelected = sortWorkspacesBySelected;
/**
 * Takes removes pendingFields and errorFields from a customUnit
 */
function removePendingFieldsFromCustomUnit(customUnit) {
    const cleanedCustomUnit = { ...customUnit };
    delete cleanedCustomUnit.pendingFields;
    delete cleanedCustomUnit.errorFields;
    return cleanedCustomUnit;
}
function goBackWhenEnableFeature(policyID) {
    setTimeout(() => {
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_INITIAL.getRoute(policyID));
    }, CONST_1.default.WORKSPACE_ENABLE_FEATURE_REDIRECT_DELAY);
}
function navigateToExpensifyCardPage(policyID) {
    Navigation_1.default.setNavigationActionToMicrotaskQueue(() => {
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD.getRoute(policyID));
    });
}
function navigateToReceiptPartnersPage(policyID) {
    Navigation_1.default.setNavigationActionToMicrotaskQueue(() => {
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_RECEIPT_PARTNERS.getRoute(policyID));
    });
}
function getConnectedIntegration(policy, accountingIntegrations) {
    return (accountingIntegrations ?? Object.values(CONST_1.default.POLICY.CONNECTIONS.NAME)).find((integration) => !!policy?.connections?.[integration]);
}
function getValidConnectedIntegration(policy, accountingIntegrations) {
    return (accountingIntegrations ?? Object.values(CONST_1.default.POLICY.CONNECTIONS.NAME)).find((integration) => !!policy?.connections?.[integration] && !(0, connections_1.isAuthenticationError)(policy, integration));
}
function hasIntegrationAutoSync(policy, connectedIntegration) {
    return (connectedIntegration && policy?.connections?.[connectedIntegration]?.config?.autoSync?.enabled) ?? false;
}
function hasUnsupportedIntegration(policy) {
    return Object.values(CONST_1.default.POLICY.CONNECTIONS.UNSUPPORTED_NAMES).some((integration) => !!policy?.connections?.[integration]);
}
function hasSupportedOnlyOnOldDotIntegration(policy) {
    return Object.values(CONST_1.default.POLICY.CONNECTIONS.SUPPORTED_ONLY_ON_OLDDOT).some((integration) => !!policy?.connections?.[integration]);
}
function getCurrentConnectionName(policy) {
    const accountingIntegrations = Object.values(CONST_1.default.POLICY.CONNECTIONS.NAME);
    const connectionKey = accountingIntegrations.find((integration) => !!policy?.connections?.[integration]);
    return connectionKey ? CONST_1.default.POLICY.CONNECTIONS.NAME_USER_FRIENDLY[connectionKey] : undefined;
}
/**
 * Check if the policy member is deleted from the workspace
 */
function isDeletedPolicyEmployee(policyEmployee, isOffline) {
    return !isOffline && policyEmployee.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE && (0, EmptyObject_1.isEmptyObject)(policyEmployee.errors);
}
function hasNoPolicyOtherThanPersonalType() {
    return (Object.values(allPolicies ?? {}).filter((policy) => policy && policy.type !== CONST_1.default.POLICY.TYPE.PERSONAL && policy.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE)
        .length === 0);
}
function getCurrentTaxID(policy, taxID) {
    return Object.keys(policy?.taxRates?.taxes ?? {}).find((taxIDKey) => policy?.taxRates?.taxes?.[taxIDKey].previousTaxCode === taxID || taxIDKey === taxID);
}
function getWorkspaceAccountID(policyID) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    if (!policy) {
        return 0;
    }
    return policy.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
}
function hasVBBA(policyID) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    return !!policy?.achAccount?.bankAccountID;
}
function getTagApproverRule(policyOrID, tagName) {
    if (!policyOrID) {
        return;
    }
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = typeof policyOrID === 'string' ? getPolicy(policyOrID) : policyOrID;
    const approvalRules = policy?.rules?.approvalRules ?? [];
    const approverRule = approvalRules.find((rule) => rule.applyWhen.find(({ condition, field, value }) => condition === CONST_1.default.POLICY.RULE_CONDITIONS.MATCHES && field === CONST_1.default.POLICY.FIELDS.TAG && value === tagName));
    return approverRule;
}
function getDomainNameForPolicy(policyID) {
    if (!policyID) {
        return '';
    }
    return `${CONST_1.default.EXPENSIFY_POLICY_DOMAIN}${policyID.toLowerCase()}${CONST_1.default.EXPENSIFY_POLICY_DOMAIN_EXTENSION}`;
}
function getWorkflowApprovalsUnavailable(policy) {
    return policy?.approvalMode === CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL || !!policy?.errorFields?.approvalMode;
}
function getUserFriendlyWorkspaceType(workspaceType) {
    switch (workspaceType) {
        case CONST_1.default.POLICY.TYPE.CORPORATE:
            return (0, Localize_1.translateLocal)('workspace.type.control');
        case CONST_1.default.POLICY.TYPE.TEAM:
            return (0, Localize_1.translateLocal)('workspace.type.collect');
        default:
            return (0, Localize_1.translateLocal)('workspace.type.free');
    }
}
function isPolicyAccessible(policy) {
    return (!(0, EmptyObject_1.isEmptyObject)(policy) && (Object.keys(policy).length !== 1 || (0, EmptyObject_1.isEmptyObject)(policy.errors)) && !!policy?.id && policy?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
}
function areAllGroupPoliciesExpenseChatDisabled(policies = allPolicies) {
    const groupPolicies = Object.values(policies ?? {}).filter((policy) => isPaidGroupPolicy(policy));
    if (groupPolicies.length === 0) {
        return false;
    }
    return !groupPolicies.some((policy) => !!policy?.isPolicyExpenseChatEnabled);
}
function getGroupPaidPoliciesWithExpenseChatEnabled(policies = allPolicies) {
    if ((0, EmptyObject_1.isEmptyObject)(policies)) {
        return CONST_1.default.EMPTY_ARRAY;
    }
    return Object.values(policies).filter((policy) => isPaidGroupPolicy(policy) && policy?.isPolicyExpenseChatEnabled);
}
function hasOtherControlWorkspaces(currentPolicyID) {
    const otherControlWorkspaces = Object.values(allPolicies ?? {}).filter((policy) => policy?.id !== currentPolicyID && isPolicyAdmin(policy) && isControlPolicy(policy));
    return otherControlWorkspaces.length > 0;
}
// If no policyID is provided, it indicates the workspace upgrade/downgrade URL
// is being accessed from the Subscriptions page without a specific policyID.
// In this case, check if the user is an admin on more than one policy.
// If the user is an admin for multiple policies, we can render the page as it contains a condition
// to navigate them to the Workspaces page when no policyID is provided, instead of showing the Upgrade/Downgrade button.
// If the user is not an admin for multiple policies, they are not allowed to perform this action, and the NotFoundPage is displayed.
function canModifyPlan(policyID) {
    const currentUserAccountID = (0, Report_1.getCurrentUserAccountID)();
    const ownerPolicies = getOwnedPaidPolicies(allPolicies, currentUserAccountID);
    if (!policyID) {
        return ownerPolicies.length > 1;
    }
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = getPolicy(policyID);
    return !!policy && isPolicyAdmin(policy);
}
function getAdminsPrivateEmailDomains(policy) {
    if (!policy) {
        return [];
    }
    const adminDomains = Object.entries(policy.employeeList ?? {}).reduce((domains, [email, employee]) => {
        if (employee.role !== CONST_1.default.POLICY.ROLE.ADMIN) {
            return domains;
        }
        domains.push(expensify_common_1.Str.extractEmailDomain(email).toLowerCase());
        return domains;
    }, []);
    const ownerDomains = policy.owner ? [expensify_common_1.Str.extractEmailDomain(policy.owner).toLowerCase()] : [];
    const privateDomains = [...new Set(adminDomains.concat(ownerDomains))].filter((domain) => !(0, ValidationUtils_1.isPublicDomain)(domain));
    // If the policy is not owned by Expensify there is no point in showing the domain for provisioning.
    if (!isExpensifyTeam(policy.owner)) {
        return privateDomains.filter((domain) => domain !== CONST_1.default.EXPENSIFY_PARTNER_NAME && domain !== CONST_1.default.EMAIL.GUIDES_DOMAIN);
    }
    return privateDomains;
}
/**
 * Determines the most frequent domain from the `acceptedDomains` list
 * that appears in the email addresses of policy members.
 *
 * @param acceptedDomains - List of domains to consider.
 * @param policy - The policy object.
 */
function getMostFrequentEmailDomain(acceptedDomains, policy) {
    if (!policy) {
        return undefined;
    }
    const domainOccurrences = {};
    Object.keys(policy.employeeList ?? {})
        .concat(policy.owner)
        .map((email) => expensify_common_1.Str.extractEmailDomain(email).toLowerCase())
        .forEach((memberDomain) => {
        if (!acceptedDomains.includes(memberDomain)) {
            return;
        }
        domainOccurrences[memberDomain] = (domainOccurrences[memberDomain] || 0) + 1;
    });
    let mostFrequent = { domain: '', count: 0 };
    Object.entries(domainOccurrences).forEach(([domain, count]) => {
        if (count <= mostFrequent.count) {
            return;
        }
        mostFrequent = { domain, count };
    });
    if (mostFrequent.count === 0) {
        return undefined;
    }
    return mostFrequent.domain;
}
const getDescriptionForPolicyDomainCard = (domainName) => {
    // A domain name containing a policyID indicates that this is a workspace feed
    const policyID = domainName.match(CONST_1.default.REGEX.EXPENSIFY_POLICY_DOMAIN_NAME)?.[1];
    if (policyID) {
        // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
        // eslint-disable-next-line deprecation/deprecation
        const policy = getPolicy(policyID.toUpperCase());
        return policy?.name ?? domainName;
    }
    return domainName;
};
exports.getDescriptionForPolicyDomainCard = getDescriptionForPolicyDomainCard;
function isPreferredExporter(policy) {
    const user = (0, Report_1.getCurrentUserEmail)();
    const exporters = [
        policy.connections?.intacct?.config?.export?.exporter,
        policy.connections?.netsuite?.options?.config?.exporter,
        policy.connections?.quickbooksDesktop?.config?.export?.exporter,
        policy.connections?.quickbooksOnline?.config?.export?.exporter,
        policy.connections?.xero?.config?.export?.exporter,
    ];
    return exporters.some((exporter) => exporter && exporter === user);
}
/**
 * Checks if the current user is a member of any policyExpenseChatEnabled policy
 */
function isCurrentUserMemberOfAnyPolicy() {
    return Object.values(allPolicies ?? {}).some((policy) => policy?.isPolicyExpenseChatEnabled && policy?.id && policy.id !== CONST_1.default.POLICY.ID_FAKE);
}
/**
 * Whether the given policy member is an admin of the given policy
 */
function isMemberPolicyAdmin(policy, memberEmail) {
    if (!policy || !memberEmail) {
        return false;
    }
    const admins = getAdminEmployees(policy);
    return admins.some((admin) => admin.email === memberEmail);
}
