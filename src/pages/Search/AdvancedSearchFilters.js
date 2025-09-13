"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Button_1 = require("@components/Button");
var FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
var MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var ScrollView_1 = require("@components/ScrollView");
var SpacerView_1 = require("@components/SpacerView");
var Text_1 = require("@components/Text");
var useAdvancedSearchFilters_1 = require("@hooks/useAdvancedSearchFilters");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useSingleExecution_1 = require("@hooks/useSingleExecution");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var useWaitForNavigation_1 = require("@hooks/useWaitForNavigation");
var useWorkspaceList_1 = require("@hooks/useWorkspaceList");
var Search_1 = require("@libs/actions/Search");
var CardFeedUtils_1 = require("@libs/CardFeedUtils");
var CardUtils_1 = require("@libs/CardUtils");
var CurrencyUtils_1 = require("@libs/CurrencyUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
var SearchUIUtils_1 = require("@libs/SearchUIUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var SearchAdvancedFiltersForm_1 = require("@src/types/form/SearchAdvancedFiltersForm");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
var baseFilterConfig = {
    type: {
        getTitle: getFilterDisplayTitle,
        description: 'common.type',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TYPE),
    },
    groupBy: {
        getTitle: getFilterDisplayTitle,
        description: 'search.groupBy',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.GROUP_BY),
    },
    status: {
        getTitle: getStatusFilterDisplayTitle,
        description: 'common.status',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.STATUS),
    },
    date: {
        getTitle: getFilterDisplayTitle,
        description: 'common.date',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DATE),
    },
    submitted: {
        getTitle: getFilterDisplayTitle,
        description: 'search.filters.submitted',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.SUBMITTED),
    },
    approved: {
        getTitle: getFilterDisplayTitle,
        description: 'search.filters.approved',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.APPROVED),
    },
    paid: {
        getTitle: getFilterDisplayTitle,
        description: 'search.filters.paid',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PAID),
    },
    exported: {
        getTitle: getFilterDisplayTitle,
        description: 'search.filters.exported',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPORTED),
    },
    posted: {
        getTitle: getFilterDisplayTitle,
        description: 'search.filters.posted',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POSTED),
    },
    withdrawn: {
        getTitle: getFilterDisplayTitle,
        description: 'search.filters.withdrawn',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWN),
    },
    currency: {
        getTitle: getFilterDisplayTitle,
        description: 'common.currency',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CURRENCY),
    },
    groupCurrency: {
        getTitle: getFilterDisplayTitle,
        description: 'common.groupCurrency',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.GROUP_CURRENCY),
    },
    merchant: {
        getTitle: getFilterDisplayTitle,
        description: 'common.merchant',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.MERCHANT),
    },
    description: {
        getTitle: getFilterDisplayTitle,
        description: 'common.description',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DESCRIPTION),
    },
    reportID: {
        getTitle: getFilterDisplayTitle,
        description: 'common.reportID',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.REPORT_ID),
    },
    amount: {
        getTitle: getFilterDisplayTitle,
        description: 'iou.amount',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.AMOUNT),
    },
    total: {
        getTitle: getFilterDisplayTitle,
        description: 'common.total',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TOTAL),
    },
    category: {
        getTitle: getFilterDisplayTitle,
        description: 'common.category',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CATEGORY),
    },
    keyword: {
        getTitle: getFilterDisplayTitle,
        description: 'search.filters.keywords',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.KEYWORD),
    },
    cardID: {
        getTitle: getFilterCardDisplayTitle,
        description: 'common.card',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.CARD_ID),
    },
    taxRate: {
        getTitle: getFilterTaxRateDisplayTitle,
        description: 'workspace.taxes.taxRate',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.TAX_RATE),
    },
    expenseType: {
        getTitle: getFilterExpenseDisplayTitle,
        description: 'search.expenseType',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.EXPENSE_TYPE),
    },
    withdrawalType: {
        getTitle: getFilterDisplayTitle,
        description: 'search.withdrawalType',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.WITHDRAWAL_TYPE),
    },
    withdrawalID: {
        getTitle: getFilterDisplayTitle,
        description: 'common.withdrawalID',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.WITHDRAWAL_ID),
    },
    tag: {
        getTitle: getFilterDisplayTitle,
        description: 'common.tag',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAG),
    },
    has: {
        getTitle: getFilterDisplayTitle,
        description: 'search.has',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.HAS),
    },
    from: {
        getTitle: getFilterParticipantDisplayTitle,
        description: 'common.from',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM),
    },
    to: {
        getTitle: getFilterParticipantDisplayTitle,
        description: 'common.to',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TO),
    },
    attendee: {
        getTitle: getFilterParticipantDisplayTitle,
        description: 'iou.attendees',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.ATTENDEE),
    },
    in: {
        getTitle: getFilterInDisplayTitle,
        description: 'common.in',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.IN),
    },
    title: {
        getTitle: getFilterDisplayTitle,
        description: 'common.title',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TITLE),
    },
    assignee: {
        getTitle: getFilterParticipantDisplayTitle,
        description: 'common.assignee',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ASSIGNEE),
    },
    reimbursable: {
        getTitle: getFilterDisplayTitle,
        description: 'common.reimbursable',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.REIMBURSABLE),
    },
    billable: {
        getTitle: getFilterDisplayTitle,
        description: 'common.billable',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.BILLABLE),
    },
    policyID: {
        getTitle: getFilterWorkspaceDisplayTitle,
        description: 'workspace.common.workspace',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.POLICY_ID),
    },
    purchaseAmount: {
        getTitle: getFilterDisplayTitle,
        description: 'common.purchaseAmount',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.PURCHASE_AMOUNT),
    },
    purchaseCurrency: {
        getTitle: getFilterDisplayTitle,
        description: 'search.filters.purchaseCurrency',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.PURCHASE_CURRENCY),
    },
    action: {
        getTitle: getFilterDisplayTitle,
        description: 'common.action',
        route: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.ACTION),
    },
};
function getFilterWorkspaceDisplayTitle(filters, policies) {
    return policies
        .filter(function (value) { var _a; return value.policyID && ((_a = filters.policyID) === null || _a === void 0 ? void 0 : _a.includes(value.policyID)); })
        .map(function (value) { return value.text; })
        .join(', ');
}
function getFilterCardDisplayTitle(filters, cards, translate) {
    var _a, _b;
    var cardIdsFilter = (_a = filters[CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID]) !== null && _a !== void 0 ? _a : [];
    var feedFilter = (_b = filters[CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FEED]) !== null && _b !== void 0 ? _b : [];
    var workspaceCardFeeds = Object.entries(cards).reduce(function (workspaceCardsFeed, _a) {
        var _b;
        var cardID = _a[0], card = _a[1];
        var feedKey = "".concat((0, CardFeedUtils_1.createCardFeedKey)(card.fundID, card.bank));
        var workspaceFeedKey = (0, CardFeedUtils_1.getWorkspaceCardFeedKey)(feedKey);
        /* eslint-disable no-param-reassign */
        (_b = workspaceCardsFeed[workspaceFeedKey]) !== null && _b !== void 0 ? _b : (workspaceCardsFeed[workspaceFeedKey] = {});
        workspaceCardsFeed[workspaceFeedKey][cardID] = card;
        /* eslint-enable no-param-reassign */
        return workspaceCardsFeed;
    }, {});
    var cardFeedNamesWithType = (0, CardFeedUtils_1.getCardFeedNamesWithType)({
        workspaceCardFeeds: workspaceCardFeeds,
        translate: translate,
    });
    var cardNames = Object.values(cards)
        .filter(function (card) { return cardIdsFilter.includes(card.cardID.toString()) && !feedFilter.includes((0, CardFeedUtils_1.createCardFeedKey)(card.fundID, card.bank)); })
        .map(function (card) { return (0, CardUtils_1.getCardDescription)(card); });
    var feedNames = Object.keys(cardFeedNamesWithType)
        .filter(function (workspaceCardFeedKey) {
        var feedKey = (0, CardFeedUtils_1.getCardFeedKey)(workspaceCardFeeds, workspaceCardFeedKey);
        return !!feedKey && feedFilter.includes(feedKey);
    })
        .map(function (cardFeedKey) { return cardFeedNamesWithType[cardFeedKey].name; });
    return __spreadArray(__spreadArray([], feedNames, true), cardNames, true).join(', ');
}
function getFilterParticipantDisplayTitle(accountIDs, personalDetails, formatPhoneNumber) {
    var selectedPersonalDetails = accountIDs.map(function (id) { return personalDetails === null || personalDetails === void 0 ? void 0 : personalDetails[id]; });
    return selectedPersonalDetails
        .map(function (personalDetail) {
        var _a;
        if (!personalDetail) {
            return '';
        }
        return (0, PersonalDetailsUtils_1.createDisplayName)((_a = personalDetail.login) !== null && _a !== void 0 ? _a : '', personalDetail, formatPhoneNumber);
    })
        .filter(Boolean)
        .join(', ');
}
function getFilterDisplayTitle(filters, filterKey, translate, localeCompare) {
    var _a, _b, _c;
    var key = filterKey;
    if (SearchAdvancedFiltersForm_1.DATE_FILTER_KEYS.includes(filterKey)) {
        var keyOn = "".concat(filterKey).concat(CONST_1.default.SEARCH.DATE_MODIFIERS.ON);
        var keyAfter = "".concat(filterKey).concat(CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER);
        var keyBefore = "".concat(filterKey).concat(CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE);
        var dateOn = filters[keyOn];
        var dateAfter = filters[keyAfter];
        var dateBefore = filters[keyBefore];
        var dateValue = [];
        if (dateOn) {
            dateValue.push((0, SearchQueryUtils_1.isSearchDatePreset)(dateOn) ? translate("search.filters.date.presets.".concat(dateOn)) : translate('search.filters.date.on', { date: dateOn }));
        }
        if (dateAfter) {
            dateValue.push(translate('search.filters.date.after', { date: dateAfter }));
        }
        if (dateBefore) {
            dateValue.push(translate('search.filters.date.before', { date: dateBefore }));
        }
        return dateValue.join(', ');
    }
    key = filterKey;
    if (SearchAdvancedFiltersForm_1.AMOUNT_FILTER_KEYS.includes(key)) {
        var lessThanKey = "".concat(key).concat(CONST_1.default.SEARCH.AMOUNT_MODIFIERS.LESS_THAN);
        var greaterThanKey = "".concat(key).concat(CONST_1.default.SEARCH.AMOUNT_MODIFIERS.GREATER_THAN);
        var lessThan = filters[lessThanKey];
        var greaterThan = filters[greaterThanKey];
        if (lessThan && greaterThan) {
            return translate('search.filters.amount.between', {
                lessThan: (0, CurrencyUtils_1.convertToDisplayStringWithoutCurrency)(Number(lessThan)),
                greaterThan: (0, CurrencyUtils_1.convertToDisplayStringWithoutCurrency)(Number(greaterThan)),
            });
        }
        if (lessThan) {
            return translate('search.filters.amount.lessThan', { amount: (0, CurrencyUtils_1.convertToDisplayStringWithoutCurrency)(Number(lessThan)) });
        }
        if (greaterThan) {
            return translate('search.filters.amount.greaterThan', { amount: (0, CurrencyUtils_1.convertToDisplayStringWithoutCurrency)(Number(greaterThan)) });
        }
        // Will never happen
        return;
    }
    key = filterKey;
    if ((key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CURRENCY || key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PURCHASE_CURRENCY) && filters[key]) {
        var filterArray = (_a = filters[key]) !== null && _a !== void 0 ? _a : [];
        return filterArray.sort(localeCompare).join(', ');
    }
    if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CATEGORY && filters[key]) {
        var filterArray = (_b = filters[key]) !== null && _b !== void 0 ? _b : [];
        return filterArray
            .sort(function (a, b) { return (0, SearchQueryUtils_1.sortOptionsWithEmptyValue)(a, b, localeCompare); })
            .map(function (value) { return (value === CONST_1.default.SEARCH.CATEGORY_EMPTY_VALUE ? translate('search.noCategory') : value); })
            .join(', ');
    }
    if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAG && filters[key]) {
        var filterArray = (_c = filters[key]) !== null && _c !== void 0 ? _c : [];
        return filterArray
            .sort(function (a, b) { return (0, SearchQueryUtils_1.sortOptionsWithEmptyValue)(a, b, localeCompare); })
            .map(function (value) { return (value === CONST_1.default.SEARCH.TAG_EMPTY_VALUE ? translate('search.noTag') : (0, PolicyUtils_1.getCleanedTagName)(value)); })
            .join(', ');
    }
    if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DESCRIPTION || key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TITLE) {
        return filters[key];
    }
    if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.REIMBURSABLE || key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.BILLABLE) {
        var filterValue_1 = filters[key];
        return filterValue_1 ? translate("common.".concat(filterValue_1)) : undefined;
    }
    if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TYPE) {
        var filterValue_2 = filters[key];
        return filterValue_2 ? translate("common.".concat(filterValue_2)) : undefined;
    }
    if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ACTION) {
        var filterValue_3 = filters[key];
        return filterValue_3 ? translate("search.filters.action.".concat(filterValue_3)) : undefined;
    }
    if (key === CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.GROUP_BY) {
        var filterValue_4 = filters[key];
        return filterValue_4 ? translate("search.filters.groupBy.".concat(filterValue_4)) : undefined;
    }
    if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_TYPE) {
        var filterValue_5 = filters[key];
        return filterValue_5 ? translate("search.filters.withdrawalType.".concat(filterValue_5)) : undefined;
    }
    if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.HAS) {
        var filterValue_6 = filters[key];
        return filterValue_6 ? filterValue_6.map(function (value) { return translate("search.filters.has.".concat(value)); }).join(', ') : undefined;
    }
    var filterValue = filters[key];
    return Array.isArray(filterValue) ? filterValue.join(', ') : filterValue;
}
function getStatusFilterDisplayTitle(filters, type, groupBy, translate) {
    var statusOptions = (0, SearchUIUtils_1.getStatusOptions)(type, groupBy).concat({ text: translate('common.all'), value: CONST_1.default.SEARCH.STATUS.EXPENSE.ALL });
    var filterValue = filters === null || filters === void 0 ? void 0 : filters.status;
    if (!(filterValue === null || filterValue === void 0 ? void 0 : filterValue.length)) {
        return undefined;
    }
    if (typeof filterValue === 'string') {
        filterValue = filterValue.split(',');
    }
    return filterValue
        .reduce(function (acc, value) {
        var status = statusOptions.find(function (statusOption) { return statusOption.value === value; });
        if (status) {
            return acc.concat(status.text);
        }
        return acc;
    }, [])
        .join(', ');
}
function getFilterTaxRateDisplayTitle(filters, taxRates) {
    var selectedTaxRateKeys = filters[CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAX_RATE];
    if (!selectedTaxRateKeys) {
        return undefined;
    }
    var result = [];
    Object.entries(taxRates).forEach(function (_a) {
        var taxRateName = _a[0], taxRateKeys = _a[1];
        if (!taxRateKeys.some(function (taxRateKey) { return selectedTaxRateKeys.includes(taxRateKey); }) || result.includes(taxRateName)) {
            return;
        }
        result.push(taxRateName);
    });
    return result.join(', ');
}
function getFilterExpenseDisplayTitle(filters, translate) {
    var filterValue = filters[CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPENSE_TYPE];
    return filterValue
        ? Object.values(CONST_1.default.SEARCH.TRANSACTION_TYPE)
            .filter(function (expenseType) { return filterValue.includes(expenseType); })
            .map(function (expenseType) { return translate((0, SearchUIUtils_1.getExpenseTypeTranslationKey)(expenseType)); })
            .join(', ')
        : undefined;
}
function getFilterInDisplayTitle(filters, _, reports) {
    var _a, _b, _c;
    return (_c = (_b = (_a = filters.in) === null || _a === void 0 ? void 0 : _a.map(function (id) { return (0, ReportUtils_1.getReportName)(reports === null || reports === void 0 ? void 0 : reports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(id)]); })) === null || _b === void 0 ? void 0 : _b.filter(Boolean)) === null || _c === void 0 ? void 0 : _c.join(', ');
}
function AdvancedSearchFilters() {
    var _a, _b, _c;
    var _d = (0, useLocalize_1.default)(), translate = _d.translate, localeCompare = _d.localeCompare, formatPhoneNumber = _d.formatPhoneNumber;
    var styles = (0, useThemeStyles_1.default)();
    var singleExecution = (0, useSingleExecution_1.default)().singleExecution;
    var waitForNavigate = (0, useWaitForNavigation_1.default)();
    var reports = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false })[0];
    var savedSearches = (0, useOnyx_1.default)(ONYXKEYS_1.default.SAVED_SEARCHES, { canBeMissing: true })[0];
    var _e = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true })[0], searchAdvancedFilters = _e === void 0 ? (0, EmptyObject_1.getEmptyObject)() : _e;
    var groupBy = searchAdvancedFilters.groupBy;
    var userCardList = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: false })[0];
    var workspaceCardFeeds = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST, { canBeMissing: false })[0];
    var allCards = (0, react_1.useMemo)(function () { return (0, CardUtils_1.mergeCardListWithWorkspaceFeeds)(workspaceCardFeeds !== null && workspaceCardFeeds !== void 0 ? workspaceCardFeeds : CONST_1.default.EMPTY_OBJECT, userCardList, true); }, [userCardList, workspaceCardFeeds]);
    var taxRates = (0, PolicyUtils_1.getAllTaxRates)();
    var personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    var _f = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false })[0], policies = _f === void 0 ? (0, EmptyObject_1.getEmptyObject)() : _f;
    var currentUserLogin = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false, selector: function (session) { return session === null || session === void 0 ? void 0 : session.email; } })[0];
    var workspaces = (0, useWorkspaceList_1.default)({
        policies: policies,
        currentUserLogin: currentUserLogin,
        shouldShowPendingDeletePolicy: false,
        selectedPolicyIDs: undefined,
        searchTerm: '',
        localeCompare: localeCompare,
    }).sections;
    var _g = (0, useAdvancedSearchFilters_1.default)(), currentType = _g.currentType, typeFiltersKeys = _g.typeFiltersKeys;
    var queryString = (0, react_1.useMemo)(function () { return (0, SearchQueryUtils_1.buildQueryStringFromFilterFormValues)(searchAdvancedFilters); }, [searchAdvancedFilters]);
    var queryJSON = (0, react_1.useMemo)(function () { return (0, SearchQueryUtils_1.buildSearchQueryJSON)(queryString || (0, SearchQueryUtils_1.buildCannedSearchQuery)()); }, [queryString]);
    var applyFiltersAndNavigate = function () {
        (0, Search_1.clearAllFilters)();
        Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({
            query: queryString,
        }), { forceReplace: true });
    };
    var onSaveSearch = function () {
        var savedSearchKeys = Object.keys(savedSearches !== null && savedSearches !== void 0 ? savedSearches : {});
        if (!queryJSON || (savedSearches && savedSearchKeys.includes(String(queryJSON.hash)))) {
            // If the search is already saved, we only display the results as we don't need to save it.
            applyFiltersAndNavigate();
            return;
        }
        (0, Search_1.saveSearch)({
            queryJSON: queryJSON,
        });
        applyFiltersAndNavigate();
    };
    var filters = typeFiltersKeys.map(function (section) {
        return section.map(function (key) {
            var _a;
            var onPress = singleExecution(waitForNavigate(function () { return Navigation_1.default.navigate(baseFilterConfig[key].route); }));
            var filterTitle;
            if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID) {
                filterTitle = baseFilterConfig[key].getTitle(searchAdvancedFilters, allCards, translate);
            }
            else if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAX_RATE) {
                filterTitle = baseFilterConfig[key].getTitle(searchAdvancedFilters, taxRates);
            }
            else if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPENSE_TYPE) {
                filterTitle = baseFilterConfig[key].getTitle(searchAdvancedFilters, translate);
            }
            else if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM ||
                key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TO ||
                key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ASSIGNEE ||
                key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ATTENDEE) {
                filterTitle = baseFilterConfig[key].getTitle((_a = searchAdvancedFilters[key]) !== null && _a !== void 0 ? _a : [], personalDetails, formatPhoneNumber);
            }
            else if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.IN) {
                filterTitle = baseFilterConfig[key].getTitle(searchAdvancedFilters, translate, reports);
            }
            else if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POLICY_ID) {
                var workspacesData = workspaces.flatMap(function (value) { return value.data; });
                filterTitle = baseFilterConfig[key].getTitle(searchAdvancedFilters, workspacesData);
            }
            else if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.STATUS) {
                filterTitle = baseFilterConfig[key].getTitle(searchAdvancedFilters, currentType, groupBy, translate);
            }
            else {
                filterTitle = baseFilterConfig[key].getTitle(searchAdvancedFilters, key, translate, localeCompare);
            }
            return {
                key: key,
                title: filterTitle,
                description: translate(baseFilterConfig[key].description),
                onPress: onPress,
            };
        });
    });
    var displaySearchButton = queryJSON && !(0, SearchQueryUtils_1.isCannedSearchQuery)(queryJSON);
    var sections = [
        {
            titleTranslationKey: 'common.general',
            items: (_a = filters.at(0)) !== null && _a !== void 0 ? _a : [],
        },
        {
            titleTranslationKey: 'common.expenses',
            items: (_b = filters.at(1)) !== null && _b !== void 0 ? _b : [],
        },
        {
            titleTranslationKey: 'common.reports',
            items: (_c = filters.at(2)) !== null && _c !== void 0 ? _c : [],
        },
    ];
    sections.forEach(function (section) {
        section.items.sort(function (a, b) {
            if (a.key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TYPE) {
                return -1;
            }
            if (b.key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TYPE) {
                return 1;
            }
            return localeCompare(a.description, b.description);
        });
    });
    return (<>
            <ScrollView_1.default contentContainerStyle={[styles.flexGrow1, styles.justifyContentBetween]}>
                <react_native_1.View>
                    {sections.map(function (section, index) {
            var _a;
            if (section.items.length === 0) {
                return;
            }
            return (
            // eslint-disable-next-line react/no-array-index-key
            <react_native_1.View key={"".concat((_a = section.items.at(0)) === null || _a === void 0 ? void 0 : _a.key, "-").concat(index)}>
                                {index !== 0 && (<SpacerView_1.default shouldShow style={[styles.reportHorizontalRule]}/>)}
                                <Text_1.default style={[styles.headerText, styles.reportHorizontalRule, index === 0 ? null : styles.mt4, styles.mb2]}>{translate(section.titleTranslationKey)}</Text_1.default>
                                {section.items.map(function (item) {
                    return (<MenuItemWithTopDescription_1.default key={item.description} title={item.title} titleStyle={styles.flex1} description={item.description} shouldShowRightIcon onPress={item.onPress}/>);
                })}
                            </react_native_1.View>);
        })}
                </react_native_1.View>
            </ScrollView_1.default>
            {!!displaySearchButton && (<Button_1.default text={translate('search.saveSearch')} onPress={onSaveSearch} style={[styles.mh4, styles.mt4]} large/>)}
            <FormAlertWithSubmitButton_1.default buttonText={translate('search.viewResults')} containerStyles={[styles.m4, styles.mb5]} onSubmit={applyFiltersAndNavigate} enabledWhenOffline/>
        </>);
}
AdvancedSearchFilters.displayName = 'AdvancedSearchFilters';
exports.default = AdvancedSearchFilters;
