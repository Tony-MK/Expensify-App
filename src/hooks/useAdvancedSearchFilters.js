"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var CardUtils_1 = require("@libs/CardUtils");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
var useLocalize_1 = require("./useLocalize");
var useOnyx_1 = require("./useOnyx");
var useWorkspaceList_1 = require("./useWorkspaceList");
/**
 * typeFiltersKeys is stored as an object keyed by the different search types.
 * Each value is then an array of arrays where each inner array is a separate section in the UI.
 */
var typeFiltersKeys = (_a = {},
    _a[CONST_1.default.SEARCH.DATA_TYPES.EXPENSE] = [
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
    _a[CONST_1.default.SEARCH.DATA_TYPES.INVOICE] = [
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
    _a[CONST_1.default.SEARCH.DATA_TYPES.TRIP] = [
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
    _a[CONST_1.default.SEARCH.DATA_TYPES.CHAT] = [
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
    _a[CONST_1.default.SEARCH.DATA_TYPES.TASK] = [
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
    _a);
function shouldDisplayFilter(numberOfFilters, isFeatureEnabled, singlePolicyCondition) {
    if (singlePolicyCondition === void 0) { singlePolicyCondition = false; }
    return (numberOfFilters !== 0 || singlePolicyCondition) && isFeatureEnabled;
}
function isFeatureEnabledInPolicies(policies, featureName) {
    if ((0, EmptyObject_1.isEmptyObject)(policies)) {
        return false;
    }
    return Object.values(policies).some(function (policy) { return (0, PolicyUtils_1.isPolicyFeatureEnabled)(policy, featureName); });
}
function useAdvancedSearchFilters() {
    var _a;
    var localeCompare = (0, useLocalize_1.default)().localeCompare;
    var _b = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true })[0], searchAdvancedFilters = _b === void 0 ? (0, EmptyObject_1.getEmptyObject)() : _b;
    var policyID = searchAdvancedFilters.policyID;
    var groupBy = searchAdvancedFilters.groupBy;
    var userCardList = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: false })[0];
    var workspaceCardFeeds = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST, { canBeMissing: false })[0];
    var allCards = (0, react_1.useMemo)(function () { return (0, CardUtils_1.mergeCardListWithWorkspaceFeeds)(workspaceCardFeeds !== null && workspaceCardFeeds !== void 0 ? workspaceCardFeeds : CONST_1.default.EMPTY_OBJECT, userCardList, true); }, [userCardList, workspaceCardFeeds]);
    var taxRates = (0, PolicyUtils_1.getAllTaxRates)();
    var _c = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false })[0], policies = _c === void 0 ? (0, EmptyObject_1.getEmptyObject)() : _c;
    var _d = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES, {
        canBeMissing: false,
        selector: function (policyCategories) {
            return Object.fromEntries(Object.entries(policyCategories !== null && policyCategories !== void 0 ? policyCategories : {}).filter(function (_a) {
                var categories = _a[1];
                var availableCategories = Object.values(categories !== null && categories !== void 0 ? categories : {}).filter(function (category) { return category.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE; });
                return availableCategories.length > 0;
            }));
        },
    })[0], allPolicyCategories = _d === void 0 ? (0, EmptyObject_1.getEmptyObject)() : _d;
    var selectedPolicyCategories = (0, SearchQueryUtils_1.getAllPolicyValues)(policyID, ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES, allPolicyCategories);
    var _e = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_TAGS, { canBeMissing: false })[0], allPolicyTagLists = _e === void 0 ? (0, EmptyObject_1.getEmptyObject)() : _e;
    var selectedPolicyTagLists = (0, SearchQueryUtils_1.getAllPolicyValues)(policyID, ONYXKEYS_1.default.COLLECTION.POLICY_TAGS, allPolicyTagLists);
    var tagListsUnpacked = Object.values(allPolicyTagLists !== null && allPolicyTagLists !== void 0 ? allPolicyTagLists : {})
        .filter(function (item) { return !!item; })
        .map(PolicyUtils_1.getTagNamesFromTagsLists)
        .flat();
    var currentUserLogin = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false, selector: function (session) { return session === null || session === void 0 ? void 0 : session.email; } })[0];
    var workspaces = (0, useWorkspaceList_1.default)({
        policies: policies,
        currentUserLogin: currentUserLogin,
        shouldShowPendingDeletePolicy: false,
        selectedPolicyIDs: undefined,
        searchTerm: '',
        localeCompare: localeCompare,
    }).sections;
    // When looking if a user has any categories to display, we want to ignore the policies that are of type PERSONAL
    var nonPersonalPolicyCategoryIds = Object.values(policies)
        .filter(function (policy) { return !!(policy && policy.type !== CONST_1.default.POLICY.TYPE.PERSONAL); })
        .map(function (policy) { return "".concat(ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES).concat(policy.id); });
    var nonPersonalPolicyCategoryCount = Object.keys(allPolicyCategories).filter(function (policyCategoryId) { return nonPersonalPolicyCategoryIds.includes(policyCategoryId); }).length;
    var areCategoriesEnabled = isFeatureEnabledInPolicies(policies, CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED);
    var areTagsEnabled = isFeatureEnabledInPolicies(policies, CONST_1.default.POLICY.MORE_FEATURES.ARE_TAGS_ENABLED);
    var areCardsEnabled = isFeatureEnabledInPolicies(policies, CONST_1.default.POLICY.MORE_FEATURES.ARE_COMPANY_CARDS_ENABLED) ||
        isFeatureEnabledInPolicies(policies, CONST_1.default.POLICY.MORE_FEATURES.ARE_EXPENSIFY_CARDS_ENABLED);
    var areTaxEnabled = isFeatureEnabledInPolicies(policies, CONST_1.default.POLICY.MORE_FEATURES.ARE_TAXES_ENABLED);
    var shouldDisplayAttendeeFilter = isFeatureEnabledInPolicies(policies, CONST_1.default.POLICY.MORE_FEATURES.IS_ATTENDEE_TRACKING_ENABLED);
    var shouldDisplayCategoryFilter = shouldDisplayFilter(nonPersonalPolicyCategoryCount, areCategoriesEnabled, (selectedPolicyCategories === null || selectedPolicyCategories === void 0 ? void 0 : selectedPolicyCategories.length) > 0);
    var shouldDisplayTagFilter = shouldDisplayFilter(tagListsUnpacked.length, areTagsEnabled, !!selectedPolicyTagLists);
    var shouldDisplayCardFilter = shouldDisplayFilter(Object.keys(allCards).length, areCardsEnabled);
    var shouldDisplayTaxFilter = shouldDisplayFilter(Object.keys(taxRates).length, areTaxEnabled);
    var shouldDisplayWorkspaceFilter = workspaces.some(function (section) { return section.data.length !== 0; });
    var shouldDisplayGroupByFilter = !!groupBy && groupBy !== CONST_1.default.SEARCH.GROUP_BY.REPORTS;
    var shouldDisplayGroupCurrencyFilter = shouldDisplayGroupByFilter;
    var currentType = (_a = searchAdvancedFilters === null || searchAdvancedFilters === void 0 ? void 0 : searchAdvancedFilters.type) !== null && _a !== void 0 ? _a : CONST_1.default.SEARCH.DATA_TYPES.EXPENSE;
    if (!Object.keys(typeFiltersKeys).includes(currentType)) {
        currentType = CONST_1.default.SEARCH.DATA_TYPES.EXPENSE;
    }
    return {
        currentType: currentType,
        typeFiltersKeys: typeFiltersKeys[currentType]
            .map(function (section) {
            return section
                .map(function (key) {
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
                .filter(function (filter) { return !!filter; });
        })
            .filter(function (section) { return !!section.length; }),
    };
}
exports.default = useAdvancedSearchFilters;
