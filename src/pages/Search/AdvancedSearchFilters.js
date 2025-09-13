"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const ScrollView_1 = require("@components/ScrollView");
const SpacerView_1 = require("@components/SpacerView");
const Text_1 = require("@components/Text");
const useAdvancedSearchFilters_1 = require("@hooks/useAdvancedSearchFilters");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useSingleExecution_1 = require("@hooks/useSingleExecution");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWaitForNavigation_1 = require("@hooks/useWaitForNavigation");
const useWorkspaceList_1 = require("@hooks/useWorkspaceList");
const Search_1 = require("@libs/actions/Search");
const CardFeedUtils_1 = require("@libs/CardFeedUtils");
const CardUtils_1 = require("@libs/CardUtils");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SearchAdvancedFiltersForm_1 = require("@src/types/form/SearchAdvancedFiltersForm");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const baseFilterConfig = {
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
        .filter((value) => value.policyID && filters.policyID?.includes(value.policyID))
        .map((value) => value.text)
        .join(', ');
}
function getFilterCardDisplayTitle(filters, cards, translate) {
    const cardIdsFilter = filters[CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID] ?? [];
    const feedFilter = filters[CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FEED] ?? [];
    const workspaceCardFeeds = Object.entries(cards).reduce((workspaceCardsFeed, [cardID, card]) => {
        const feedKey = `${(0, CardFeedUtils_1.createCardFeedKey)(card.fundID, card.bank)}`;
        const workspaceFeedKey = (0, CardFeedUtils_1.getWorkspaceCardFeedKey)(feedKey);
        /* eslint-disable no-param-reassign */
        workspaceCardsFeed[workspaceFeedKey] ?? (workspaceCardsFeed[workspaceFeedKey] = {});
        workspaceCardsFeed[workspaceFeedKey][cardID] = card;
        /* eslint-enable no-param-reassign */
        return workspaceCardsFeed;
    }, {});
    const cardFeedNamesWithType = (0, CardFeedUtils_1.getCardFeedNamesWithType)({
        workspaceCardFeeds,
        translate,
    });
    const cardNames = Object.values(cards)
        .filter((card) => cardIdsFilter.includes(card.cardID.toString()) && !feedFilter.includes((0, CardFeedUtils_1.createCardFeedKey)(card.fundID, card.bank)))
        .map((card) => (0, CardUtils_1.getCardDescription)(card));
    const feedNames = Object.keys(cardFeedNamesWithType)
        .filter((workspaceCardFeedKey) => {
        const feedKey = (0, CardFeedUtils_1.getCardFeedKey)(workspaceCardFeeds, workspaceCardFeedKey);
        return !!feedKey && feedFilter.includes(feedKey);
    })
        .map((cardFeedKey) => cardFeedNamesWithType[cardFeedKey].name);
    return [...feedNames, ...cardNames].join(', ');
}
function getFilterParticipantDisplayTitle(accountIDs, personalDetails, formatPhoneNumber) {
    const selectedPersonalDetails = accountIDs.map((id) => personalDetails?.[id]);
    return selectedPersonalDetails
        .map((personalDetail) => {
        if (!personalDetail) {
            return '';
        }
        return (0, PersonalDetailsUtils_1.createDisplayName)(personalDetail.login ?? '', personalDetail, formatPhoneNumber);
    })
        .filter(Boolean)
        .join(', ');
}
function getFilterDisplayTitle(filters, filterKey, translate, localeCompare) {
    let key = filterKey;
    if (SearchAdvancedFiltersForm_1.DATE_FILTER_KEYS.includes(filterKey)) {
        const keyOn = `${filterKey}${CONST_1.default.SEARCH.DATE_MODIFIERS.ON}`;
        const keyAfter = `${filterKey}${CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER}`;
        const keyBefore = `${filterKey}${CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE}`;
        const dateOn = filters[keyOn];
        const dateAfter = filters[keyAfter];
        const dateBefore = filters[keyBefore];
        const dateValue = [];
        if (dateOn) {
            dateValue.push((0, SearchQueryUtils_1.isSearchDatePreset)(dateOn) ? translate(`search.filters.date.presets.${dateOn}`) : translate('search.filters.date.on', { date: dateOn }));
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
        const lessThanKey = `${key}${CONST_1.default.SEARCH.AMOUNT_MODIFIERS.LESS_THAN}`;
        const greaterThanKey = `${key}${CONST_1.default.SEARCH.AMOUNT_MODIFIERS.GREATER_THAN}`;
        const lessThan = filters[lessThanKey];
        const greaterThan = filters[greaterThanKey];
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
        const filterArray = filters[key] ?? [];
        return filterArray.sort(localeCompare).join(', ');
    }
    if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CATEGORY && filters[key]) {
        const filterArray = filters[key] ?? [];
        return filterArray
            .sort((a, b) => (0, SearchQueryUtils_1.sortOptionsWithEmptyValue)(a, b, localeCompare))
            .map((value) => (value === CONST_1.default.SEARCH.CATEGORY_EMPTY_VALUE ? translate('search.noCategory') : value))
            .join(', ');
    }
    if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAG && filters[key]) {
        const filterArray = filters[key] ?? [];
        return filterArray
            .sort((a, b) => (0, SearchQueryUtils_1.sortOptionsWithEmptyValue)(a, b, localeCompare))
            .map((value) => (value === CONST_1.default.SEARCH.TAG_EMPTY_VALUE ? translate('search.noTag') : (0, PolicyUtils_1.getCleanedTagName)(value)))
            .join(', ');
    }
    if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DESCRIPTION || key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TITLE) {
        return filters[key];
    }
    if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.REIMBURSABLE || key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.BILLABLE) {
        const filterValue = filters[key];
        return filterValue ? translate(`common.${filterValue}`) : undefined;
    }
    if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TYPE) {
        const filterValue = filters[key];
        return filterValue ? translate(`common.${filterValue}`) : undefined;
    }
    if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ACTION) {
        const filterValue = filters[key];
        return filterValue ? translate(`search.filters.action.${filterValue}`) : undefined;
    }
    if (key === CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.GROUP_BY) {
        const filterValue = filters[key];
        return filterValue ? translate(`search.filters.groupBy.${filterValue}`) : undefined;
    }
    if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_TYPE) {
        const filterValue = filters[key];
        return filterValue ? translate(`search.filters.withdrawalType.${filterValue}`) : undefined;
    }
    if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.HAS) {
        const filterValue = filters[key];
        return filterValue ? filterValue.map((value) => translate(`search.filters.has.${value}`)).join(', ') : undefined;
    }
    const filterValue = filters[key];
    return Array.isArray(filterValue) ? filterValue.join(', ') : filterValue;
}
function getStatusFilterDisplayTitle(filters, type, groupBy, translate) {
    const statusOptions = (0, SearchUIUtils_1.getStatusOptions)(type, groupBy).concat({ text: translate('common.all'), value: CONST_1.default.SEARCH.STATUS.EXPENSE.ALL });
    let filterValue = filters?.status;
    if (!filterValue?.length) {
        return undefined;
    }
    if (typeof filterValue === 'string') {
        filterValue = filterValue.split(',');
    }
    return filterValue
        .reduce((acc, value) => {
        const status = statusOptions.find((statusOption) => statusOption.value === value);
        if (status) {
            return acc.concat(status.text);
        }
        return acc;
    }, [])
        .join(', ');
}
function getFilterTaxRateDisplayTitle(filters, taxRates) {
    const selectedTaxRateKeys = filters[CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAX_RATE];
    if (!selectedTaxRateKeys) {
        return undefined;
    }
    const result = [];
    Object.entries(taxRates).forEach(([taxRateName, taxRateKeys]) => {
        if (!taxRateKeys.some((taxRateKey) => selectedTaxRateKeys.includes(taxRateKey)) || result.includes(taxRateName)) {
            return;
        }
        result.push(taxRateName);
    });
    return result.join(', ');
}
function getFilterExpenseDisplayTitle(filters, translate) {
    const filterValue = filters[CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPENSE_TYPE];
    return filterValue
        ? Object.values(CONST_1.default.SEARCH.TRANSACTION_TYPE)
            .filter((expenseType) => filterValue.includes(expenseType))
            .map((expenseType) => translate((0, SearchUIUtils_1.getExpenseTypeTranslationKey)(expenseType)))
            .join(', ')
        : undefined;
}
function getFilterInDisplayTitle(filters, _, reports) {
    return filters.in
        ?.map((id) => (0, ReportUtils_1.getReportName)(reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${id}`]))
        ?.filter(Boolean)
        ?.join(', ');
}
function AdvancedSearchFilters() {
    const { translate, localeCompare, formatPhoneNumber } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { singleExecution } = (0, useSingleExecution_1.default)();
    const waitForNavigate = (0, useWaitForNavigation_1.default)();
    const [reports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false });
    const [savedSearches] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SAVED_SEARCHES, { canBeMissing: true });
    const [searchAdvancedFilters = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true });
    const groupBy = searchAdvancedFilters.groupBy;
    const [userCardList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: false });
    const [workspaceCardFeeds] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST, { canBeMissing: false });
    const allCards = (0, react_1.useMemo)(() => (0, CardUtils_1.mergeCardListWithWorkspaceFeeds)(workspaceCardFeeds ?? CONST_1.default.EMPTY_OBJECT, userCardList, true), [userCardList, workspaceCardFeeds]);
    const taxRates = (0, PolicyUtils_1.getAllTaxRates)();
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const [policies = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false });
    const [currentUserLogin] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false, selector: (session) => session?.email });
    const { sections: workspaces } = (0, useWorkspaceList_1.default)({
        policies,
        currentUserLogin,
        shouldShowPendingDeletePolicy: false,
        selectedPolicyIDs: undefined,
        searchTerm: '',
        localeCompare,
    });
    const { currentType, typeFiltersKeys } = (0, useAdvancedSearchFilters_1.default)();
    const queryString = (0, react_1.useMemo)(() => (0, SearchQueryUtils_1.buildQueryStringFromFilterFormValues)(searchAdvancedFilters), [searchAdvancedFilters]);
    const queryJSON = (0, react_1.useMemo)(() => (0, SearchQueryUtils_1.buildSearchQueryJSON)(queryString || (0, SearchQueryUtils_1.buildCannedSearchQuery)()), [queryString]);
    const applyFiltersAndNavigate = () => {
        (0, Search_1.clearAllFilters)();
        Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({
            query: queryString,
        }), { forceReplace: true });
    };
    const onSaveSearch = () => {
        const savedSearchKeys = Object.keys(savedSearches ?? {});
        if (!queryJSON || (savedSearches && savedSearchKeys.includes(String(queryJSON.hash)))) {
            // If the search is already saved, we only display the results as we don't need to save it.
            applyFiltersAndNavigate();
            return;
        }
        (0, Search_1.saveSearch)({
            queryJSON,
        });
        applyFiltersAndNavigate();
    };
    const filters = typeFiltersKeys.map((section) => {
        return section.map((key) => {
            const onPress = singleExecution(waitForNavigate(() => Navigation_1.default.navigate(baseFilterConfig[key].route)));
            let filterTitle;
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
                filterTitle = baseFilterConfig[key].getTitle(searchAdvancedFilters[key] ?? [], personalDetails, formatPhoneNumber);
            }
            else if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.IN) {
                filterTitle = baseFilterConfig[key].getTitle(searchAdvancedFilters, translate, reports);
            }
            else if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POLICY_ID) {
                const workspacesData = workspaces.flatMap((value) => value.data);
                filterTitle = baseFilterConfig[key].getTitle(searchAdvancedFilters, workspacesData);
            }
            else if (key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.STATUS) {
                filterTitle = baseFilterConfig[key].getTitle(searchAdvancedFilters, currentType, groupBy, translate);
            }
            else {
                filterTitle = baseFilterConfig[key].getTitle(searchAdvancedFilters, key, translate, localeCompare);
            }
            return {
                key,
                title: filterTitle,
                description: translate(baseFilterConfig[key].description),
                onPress,
            };
        });
    });
    const displaySearchButton = queryJSON && !(0, SearchQueryUtils_1.isCannedSearchQuery)(queryJSON);
    const sections = [
        {
            titleTranslationKey: 'common.general',
            items: filters.at(0) ?? [],
        },
        {
            titleTranslationKey: 'common.expenses',
            items: filters.at(1) ?? [],
        },
        {
            titleTranslationKey: 'common.reports',
            items: filters.at(2) ?? [],
        },
    ];
    sections.forEach((section) => {
        section.items.sort((a, b) => {
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
                    {sections.map((section, index) => {
            if (section.items.length === 0) {
                return;
            }
            return (
            // eslint-disable-next-line react/no-array-index-key
            <react_native_1.View key={`${section.items.at(0)?.key}-${index}`}>
                                {index !== 0 && (<SpacerView_1.default shouldShow style={[styles.reportHorizontalRule]}/>)}
                                <Text_1.default style={[styles.headerText, styles.reportHorizontalRule, index === 0 ? null : styles.mt4, styles.mb2]}>{translate(section.titleTranslationKey)}</Text_1.default>
                                {section.items.map((item) => {
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
