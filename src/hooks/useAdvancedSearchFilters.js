"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CardUtils_1 = require("@libs/CardUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const useLocalize_1 = require("./useLocalize");
const useOnyx_1 = require("./useOnyx");
const useWorkspaceList_1 = require("./useWorkspaceList");
/**
 * typeFiltersKeys is stored as an object keyed by the different search types.
 * Each value is then an array of arrays where each inner array is a separate section in the UI.
 */
const typeFiltersKeys = {
    [CONST_1.default.SEARCH.DATA_TYPES.EXPENSE]: [
        [
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TYPE,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TO,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.KEYWORD,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.STATUS,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POLICY_ID,
            CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.GROUP_BY,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.GROUP_CURRENCY,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.HAS,
        ],
        [
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPENSE_TYPE,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.MERCHANT,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DATE,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.AMOUNT,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CURRENCY,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PURCHASE_AMOUNT,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PURCHASE_CURRENCY,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CATEGORY,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAG,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DESCRIPTION,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POSTED,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAX_RATE,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.REIMBURSABLE,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.BILLABLE,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ATTENDEE,
        ],
        [
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ACTION,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.REPORT_ID,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TOTAL,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.SUBMITTED,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.APPROVED,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PAID,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPORTED,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_TYPE,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_ID,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWN,
        ],
    ],
    [CONST_1.default.SEARCH.DATA_TYPES.INVOICE]: [
        [
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TYPE,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TO,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.KEYWORD,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.STATUS,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POLICY_ID,
        ],
        [
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.MERCHANT,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DATE,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.AMOUNT,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CURRENCY,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PURCHASE_AMOUNT,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PURCHASE_CURRENCY,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CATEGORY,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAG,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DESCRIPTION,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POSTED,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAX_RATE,
        ],
        [
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ACTION,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TOTAL,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.REPORT_ID,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.SUBMITTED,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.APPROVED,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PAID,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPORTED,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_TYPE,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_ID,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWN,
        ],
    ],
    [CONST_1.default.SEARCH.DATA_TYPES.TRIP]: [
        [
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TYPE,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TO,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.KEYWORD,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.STATUS,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POLICY_ID,
            CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.GROUP_BY,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.GROUP_CURRENCY,
        ],
        [
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.MERCHANT,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DATE,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.AMOUNT,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CURRENCY,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PURCHASE_AMOUNT,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PURCHASE_CURRENCY,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CATEGORY,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAG,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DESCRIPTION,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POSTED,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAX_RATE,
        ],
        [
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ACTION,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TOTAL,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.REPORT_ID,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.SUBMITTED,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.APPROVED,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PAID,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPORTED,
        ],
    ],
    [CONST_1.default.SEARCH.DATA_TYPES.CHAT]: [
        [
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TYPE,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TO,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.IN,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.KEYWORD,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.STATUS,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POLICY_ID,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DATE,
        ],
    ],
    [CONST_1.default.SEARCH.DATA_TYPES.TASK]: [
        [
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TYPE,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TITLE,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DESCRIPTION,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.IN,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ASSIGNEE,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.STATUS,
            CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DATE,
        ],
    ],
};
function shouldDisplayFilter(numberOfFilters, isFeatureEnabled, singlePolicyCondition = false) {
    return (numberOfFilters !== 0 || singlePolicyCondition) && isFeatureEnabled;
}
function isFeatureEnabledInPolicies(policies, featureName) {
    if ((0, EmptyObject_1.isEmptyObject)(policies)) {
        return false;
    }
    return Object.values(policies).some((policy) => (0, PolicyUtils_1.isPolicyFeatureEnabled)(policy, featureName));
}
function useAdvancedSearchFilters() {
    const { localeCompare } = (0, useLocalize_1.default)();
    const [searchAdvancedFilters = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true });
    const policyID = searchAdvancedFilters.policyID;
    const groupBy = searchAdvancedFilters.groupBy;
    const [userCardList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: false });
    const [workspaceCardFeeds] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST, { canBeMissing: false });
    const allCards = (0, react_1.useMemo)(() => (0, CardUtils_1.mergeCardListWithWorkspaceFeeds)(workspaceCardFeeds ?? CONST_1.default.EMPTY_OBJECT, userCardList, true), [userCardList, workspaceCardFeeds]);
    const taxRates = (0, PolicyUtils_1.getAllTaxRates)();
    const [policies = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false });
    const [allPolicyCategories = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES, {
        canBeMissing: false,
        selector: (policyCategories) => Object.fromEntries(Object.entries(policyCategories ?? {}).filter(([, categories]) => {
            const availableCategories = Object.values(categories ?? {}).filter((category) => category.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
            return availableCategories.length > 0;
        })),
    });
    const selectedPolicyCategories = (0, SearchQueryUtils_1.getAllPolicyValues)(policyID, ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES, allPolicyCategories);
    const [allPolicyTagLists = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_TAGS, { canBeMissing: false });
    const selectedPolicyTagLists = (0, SearchQueryUtils_1.getAllPolicyValues)(policyID, ONYXKEYS_1.default.COLLECTION.POLICY_TAGS, allPolicyTagLists);
    const tagListsUnpacked = Object.values(allPolicyTagLists ?? {})
        .filter((item) => !!item)
        .map(PolicyUtils_1.getTagNamesFromTagsLists)
        .flat();
    const [currentUserLogin] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false, selector: (session) => session?.email });
    const { sections: workspaces } = (0, useWorkspaceList_1.default)({
        policies,
        currentUserLogin,
        shouldShowPendingDeletePolicy: false,
        selectedPolicyIDs: undefined,
        searchTerm: '',
        localeCompare,
    });
    // When looking if a user has any categories to display, we want to ignore the policies that are of type PERSONAL
    const nonPersonalPolicyCategoryIds = Object.values(policies)
        .filter((policy) => !!(policy && policy.type !== CONST_1.default.POLICY.TYPE.PERSONAL))
        .map((policy) => `${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policy.id}`);
    const nonPersonalPolicyCategoryCount = Object.keys(allPolicyCategories).filter((policyCategoryId) => nonPersonalPolicyCategoryIds.includes(policyCategoryId)).length;
    const areCategoriesEnabled = isFeatureEnabledInPolicies(policies, CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED);
    const areTagsEnabled = isFeatureEnabledInPolicies(policies, CONST_1.default.POLICY.MORE_FEATURES.ARE_TAGS_ENABLED);
    const areCardsEnabled = isFeatureEnabledInPolicies(policies, CONST_1.default.POLICY.MORE_FEATURES.ARE_COMPANY_CARDS_ENABLED) ||
        isFeatureEnabledInPolicies(policies, CONST_1.default.POLICY.MORE_FEATURES.ARE_EXPENSIFY_CARDS_ENABLED);
    const areTaxEnabled = isFeatureEnabledInPolicies(policies, CONST_1.default.POLICY.MORE_FEATURES.ARE_TAXES_ENABLED);
    const shouldDisplayAttendeeFilter = isFeatureEnabledInPolicies(policies, CONST_1.default.POLICY.MORE_FEATURES.IS_ATTENDEE_TRACKING_ENABLED);
    const shouldDisplayCategoryFilter = shouldDisplayFilter(nonPersonalPolicyCategoryCount, areCategoriesEnabled, selectedPolicyCategories?.length > 0);
    const shouldDisplayTagFilter = shouldDisplayFilter(tagListsUnpacked.length, areTagsEnabled, !!selectedPolicyTagLists);
    const shouldDisplayCardFilter = shouldDisplayFilter(Object.keys(allCards).length, areCardsEnabled);
    const shouldDisplayTaxFilter = shouldDisplayFilter(Object.keys(taxRates).length, areTaxEnabled);
    const shouldDisplayWorkspaceFilter = workspaces.some((section) => section.data.length !== 0);
    const shouldDisplayGroupByFilter = !!groupBy && groupBy !== CONST_1.default.SEARCH.GROUP_BY.REPORTS;
    const shouldDisplayGroupCurrencyFilter = shouldDisplayGroupByFilter;
    let currentType = searchAdvancedFilters?.type ?? CONST_1.default.SEARCH.DATA_TYPES.EXPENSE;
    if (!Object.keys(typeFiltersKeys).includes(currentType)) {
        currentType = CONST_1.default.SEARCH.DATA_TYPES.EXPENSE;
    }
    return {
        currentType,
        typeFiltersKeys: typeFiltersKeys[currentType]
            .map((section) => section
            .map((key) => {
            if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CATEGORY && !shouldDisplayCategoryFilter) {
                return;
            }
            if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAG && !shouldDisplayTagFilter) {
                return;
            }
            if ((key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID || key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POSTED) && !shouldDisplayCardFilter) {
                return;
            }
            if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAX_RATE && !shouldDisplayTaxFilter) {
                return;
            }
            if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POLICY_ID && !shouldDisplayWorkspaceFilter) {
                return;
            }
            if (key === CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.GROUP_BY && !shouldDisplayGroupByFilter) {
                return;
            }
            if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.GROUP_CURRENCY && !shouldDisplayGroupCurrencyFilter) {
                return;
            }
            if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ATTENDEE && !shouldDisplayAttendeeFilter) {
                return;
            }
            return key;
        })
            .filter((filter) => !!filter))
            .filter((section) => !!section.length),
    };
}
exports.default = useAdvancedSearchFilters;
