"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchRouterItem = SearchRouterItem;
const react_1 = require("react");
const Expensicons = require("@components/Icon/Expensicons");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const SelectionList_1 = require("@components/SelectionList");
const SearchQueryListItem_1 = require("@components/SelectionList/Search/SearchQueryListItem");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const useDebounce_1 = require("@hooks/useDebounce");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardFeedUtils_1 = require("@libs/CardFeedUtils");
const CardUtils_1 = require("@libs/CardUtils");
const Log_1 = require("@libs/Log");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const Performance_1 = require("@libs/Performance");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const SearchAutocompleteUtils_1 = require("@libs/SearchAutocompleteUtils");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const StringUtils_1 = require("@libs/StringUtils");
const Timing_1 = require("@userActions/Timing");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const getQueryWithSubstitutions_1 = require("./SearchRouter/getQueryWithSubstitutions");
const defaultListOptions = {
    userToInvite: null,
    recentReports: [],
    personalDetails: [],
    currentUserOption: null,
    categoryOptions: [],
};
const setPerformanceTimersEnd = () => {
    Timing_1.default.end(CONST_1.default.TIMING.OPEN_SEARCH);
    Performance_1.default.markEnd(CONST_1.default.TIMING.OPEN_SEARCH);
};
function isSearchQueryListItem(listItem) {
    return (0, SearchQueryListItem_1.isSearchQueryItem)(listItem.item);
}
function getAutocompleteDisplayText(filterKey, value) {
    return `${filterKey}:${value}`;
}
function getItemHeight(item) {
    if ((0, SearchQueryListItem_1.isSearchQueryItem)(item)) {
        return 44;
    }
    return 64;
}
function SearchRouterItem(props) {
    const styles = (0, useThemeStyles_1.default)();
    if (isSearchQueryListItem(props)) {
        return (<SearchQueryListItem_1.default 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}/>);
    }
    return (<UserListItem_1.default pressableStyle={[styles.br2, styles.ph3]} forwardedFSClass={CONST_1.default.FULLSTORY.CLASS.MASK} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
}
function SearchAutocompleteList({ autocompleteQueryValue, handleSearch, searchQueryItem, getAdditionalSections, onListItemPress, setTextQuery, updateAutocompleteSubstitutions, shouldSubscribeToArrowKeyEvents = true, onHighlightFirstItem, textInputRef, personalDetails, reports, allFeeds, allCards, }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [betas] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: true });
    const [recentSearches] = (0, useOnyx_1.default)(ONYXKEYS_1.default.RECENT_SEARCHES, { canBeMissing: true });
    const taxRates = (0, PolicyUtils_1.getAllTaxRates)();
    const { options, areOptionsInitialized } = (0, OptionListContextProvider_1.useOptionsList)();
    const searchOptions = (0, react_1.useMemo)(() => {
        if (!areOptionsInitialized) {
            return defaultListOptions;
        }
        return (0, OptionsListUtils_1.getSearchOptions)(options, betas ?? [], true, true, autocompleteQueryValue, CONST_1.default.AUTO_COMPLETE_SUGGESTER.MAX_AMOUNT_OF_SUGGESTIONS, true, true, false, true);
    }, [areOptionsInitialized, betas, options, autocompleteQueryValue]);
    const [isInitialRender, setIsInitialRender] = (0, react_1.useState)(true);
    const typeAutocompleteList = Object.values(CONST_1.default.SEARCH.DATA_TYPES);
    const groupByAutocompleteList = Object.values(CONST_1.default.SEARCH.GROUP_BY).map((value) => (0, SearchQueryUtils_1.getUserFriendlyValue)(value));
    const statusAutocompleteList = (0, react_1.useMemo)(() => {
        const parsedQuery = (0, SearchAutocompleteUtils_1.parseForAutocomplete)(autocompleteQueryValue);
        const typeFilter = parsedQuery?.ranges?.find((range) => range.key === CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.TYPE);
        const currentType = typeFilter?.value;
        let suggestedStatuses;
        switch (currentType) {
            case CONST_1.default.SEARCH.DATA_TYPES.EXPENSE:
                suggestedStatuses = Object.values(CONST_1.default.SEARCH.STATUS.EXPENSE);
                break;
            case CONST_1.default.SEARCH.DATA_TYPES.INVOICE:
                suggestedStatuses = Object.values(CONST_1.default.SEARCH.STATUS.INVOICE);
                break;
            case CONST_1.default.SEARCH.DATA_TYPES.CHAT:
                suggestedStatuses = Object.values(CONST_1.default.SEARCH.STATUS.CHAT);
                break;
            case CONST_1.default.SEARCH.DATA_TYPES.TRIP:
                suggestedStatuses = Object.values(CONST_1.default.SEARCH.STATUS.TRIP);
                break;
            case CONST_1.default.SEARCH.DATA_TYPES.TASK:
                suggestedStatuses = Object.values(CONST_1.default.SEARCH.STATUS.TASK);
                break;
            default:
                suggestedStatuses = Object.values({
                    ...CONST_1.default.SEARCH.STATUS.EXPENSE,
                    ...CONST_1.default.SEARCH.STATUS.INVOICE,
                    ...CONST_1.default.SEARCH.STATUS.CHAT,
                    ...CONST_1.default.SEARCH.STATUS.TRIP,
                    ...CONST_1.default.SEARCH.STATUS.TASK,
                });
        }
        return suggestedStatuses.map((value) => (0, SearchQueryUtils_1.getUserFriendlyValue)(value));
    }, [autocompleteQueryValue]);
    const expenseTypes = Object.values(CONST_1.default.SEARCH.TRANSACTION_TYPE).map((value) => (0, SearchQueryUtils_1.getUserFriendlyValue)(value));
    const withdrawalTypes = Object.values(CONST_1.default.SEARCH.WITHDRAWAL_TYPE);
    const booleanTypes = Object.values(CONST_1.default.SEARCH.BOOLEAN);
    const cardAutocompleteList = (0, react_1.useMemo)(() => Object.values(allCards), [allCards]);
    const feedAutoCompleteList = (0, react_1.useMemo)(() => {
        // We don't want to show the "Expensify Card" feeds in the autocomplete suggestion list as they don't have real "Statements"
        // Thus passing an empty object to the `allCards` parameter.
        return Object.values((0, CardFeedUtils_1.getCardFeedsForDisplay)(allFeeds, {}));
    }, [allFeeds]);
    const taxAutocompleteList = (0, react_1.useMemo)(() => (0, SearchAutocompleteUtils_1.getAutocompleteTaxList)(taxRates), [taxRates]);
    const [allPolicyCategories] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES, { canBeMissing: false });
    const [allRecentCategories] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_CATEGORIES, { canBeMissing: true });
    const categoryAutocompleteList = (0, react_1.useMemo)(() => {
        return (0, SearchAutocompleteUtils_1.getAutocompleteCategories)(allPolicyCategories);
    }, [allPolicyCategories]);
    const recentCategoriesAutocompleteList = (0, react_1.useMemo)(() => {
        return (0, SearchAutocompleteUtils_1.getAutocompleteRecentCategories)(allRecentCategories);
    }, [allRecentCategories]);
    const [policies = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false });
    const [currentUserLogin] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => session?.email, canBeMissing: false });
    const workspaceList = (0, react_1.useMemo)(() => Object.values(policies)
        .filter((singlePolicy) => !!singlePolicy && (0, PolicyUtils_1.shouldShowPolicy)(singlePolicy, false, currentUserLogin) && !singlePolicy?.isJoinRequestPending)
        .map((singlePolicy) => ({ id: singlePolicy?.id, name: singlePolicy?.name ?? '' })), [policies, currentUserLogin]);
    const [currencyList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENCY_LIST, { canBeMissing: false });
    const currencyAutocompleteList = Object.keys(currencyList ?? {}).filter((currency) => !currencyList?.[currency]?.retired);
    const [recentCurrencyAutocompleteList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.RECENTLY_USED_CURRENCIES, { canBeMissing: true });
    const [allPoliciesTags] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_TAGS, { canBeMissing: false });
    const [allRecentTags] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_TAGS, { canBeMissing: true });
    const tagAutocompleteList = (0, react_1.useMemo)(() => {
        return (0, SearchAutocompleteUtils_1.getAutocompleteTags)(allPoliciesTags);
    }, [allPoliciesTags]);
    const recentTagsAutocompleteList = (0, SearchAutocompleteUtils_1.getAutocompleteRecentTags)(allRecentTags);
    const [autocompleteParsedQuery, autocompleteQueryWithoutFilters] = (0, react_1.useMemo)(() => {
        const parsedQuery = (0, SearchAutocompleteUtils_1.parseForAutocomplete)(autocompleteQueryValue);
        const queryWithoutFilters = (0, SearchQueryUtils_1.getQueryWithoutFilters)(autocompleteQueryValue);
        return [parsedQuery, queryWithoutFilters];
    }, [autocompleteQueryValue]);
    const autocompleteSuggestions = (0, react_1.useMemo)(() => {
        const { autocomplete, ranges = [] } = autocompleteParsedQuery ?? {};
        let autocompleteKey = autocomplete?.key;
        let autocompleteValue = autocomplete?.value ?? '';
        if (!autocomplete && ranges.length > 0) {
            const lastRange = ranges.at(ranges.length - 1);
            if (lastRange && CONST_1.CONTINUATION_DETECTION_SEARCH_FILTER_KEYS.includes(lastRange.key)) {
                const afterLastRange = autocompleteQueryValue.substring(lastRange.start + lastRange.length);
                const continuationMatch = afterLastRange.match(/^\s+(\w+)/);
                if (continuationMatch) {
                    autocompleteKey = lastRange.key;
                    autocompleteValue = `${lastRange.value} ${continuationMatch[1]}`;
                }
            }
        }
        const alreadyAutocompletedKeys = ranges
            .filter((range) => {
            return autocompleteKey && range.key === autocompleteKey;
        })
            .map((range) => range.value.toLowerCase());
        switch (autocompleteKey) {
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAG: {
                const autocompleteList = autocompleteValue ? tagAutocompleteList : (recentTagsAutocompleteList ?? []);
                const filteredTags = autocompleteList
                    .filter((tag) => (0, PolicyUtils_1.getCleanedTagName)(tag).toLowerCase().includes(autocompleteValue.toLowerCase()) && !alreadyAutocompletedKeys.includes((0, PolicyUtils_1.getCleanedTagName)(tag).toLowerCase()))
                    .sort()
                    .slice(0, 10);
                return filteredTags.map((tagName) => ({
                    filterKey: CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.TAG,
                    text: (0, PolicyUtils_1.getCleanedTagName)(tagName),
                    autocompleteID: tagName,
                    mapKey: CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAG,
                }));
            }
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CATEGORY: {
                const autocompleteList = autocompleteValue ? categoryAutocompleteList : recentCategoriesAutocompleteList;
                const filteredCategories = autocompleteList
                    .filter((category) => category?.toLowerCase()?.includes(autocompleteValue?.toLowerCase()) && !alreadyAutocompletedKeys.includes(category?.toLowerCase()))
                    .sort()
                    .slice(0, 10);
                return filteredCategories.map((categoryName) => ({
                    filterKey: CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.CATEGORY,
                    text: categoryName,
                }));
            }
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CURRENCY:
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.GROUP_CURRENCY:
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PURCHASE_CURRENCY: {
                const autocompleteList = autocompleteValue ? currencyAutocompleteList : (recentCurrencyAutocompleteList ?? []);
                const filteredCurrencies = autocompleteList
                    .filter((currency) => currency.toLowerCase().includes(autocompleteValue.toLowerCase()) && !alreadyAutocompletedKeys.includes(currency.toLowerCase()))
                    .sort()
                    .slice(0, 10);
                return filteredCurrencies.map((currencyName) => ({
                    filterKey: (0, SearchQueryUtils_1.getUserFriendlyKey)(autocompleteKey),
                    text: currencyName,
                }));
            }
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAX_RATE: {
                const filteredTaxRates = taxAutocompleteList
                    .filter((tax) => tax.taxRateName.toLowerCase().includes(autocompleteValue.toLowerCase()) && !alreadyAutocompletedKeys.includes(tax.taxRateName.toLowerCase()))
                    .sort()
                    .slice(0, 10);
                return filteredTaxRates.map((tax) => ({
                    filterKey: CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.TAX_RATE,
                    text: tax.taxRateName,
                    autocompleteID: tax.taxRateIds.join(','),
                    mapKey: CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAX_RATE,
                }));
            }
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ASSIGNEE:
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TO:
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM:
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PAYER:
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ATTENDEE:
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPORTER: {
                const participants = (0, OptionsListUtils_1.getSearchOptions)(options, betas ?? [], true, true, autocompleteValue, 10, false, false, true, true).personalDetails.filter((participant) => participant.text && !alreadyAutocompletedKeys.includes(participant.text.toLowerCase()));
                return participants.map((participant) => ({
                    filterKey: autocompleteKey,
                    text: participant.text ?? '',
                    autocompleteID: String(participant.accountID),
                    mapKey: autocompleteKey,
                }));
            }
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.IN: {
                const filteredReports = (0, OptionsListUtils_1.getSearchOptions)(options, betas ?? [], true, true, autocompleteValue, 10, false, true, false, true).recentReports;
                return filteredReports.map((chat) => ({
                    filterKey: CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.IN,
                    text: chat.text ?? '',
                    autocompleteID: chat.reportID,
                    mapKey: CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.IN,
                }));
            }
            case CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.TYPE: {
                const filteredTypes = typeAutocompleteList
                    .filter((type) => type.toLowerCase().includes(autocompleteValue.toLowerCase()) && !alreadyAutocompletedKeys.includes(type.toLowerCase()))
                    .sort();
                return filteredTypes.map((type) => ({ filterKey: CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.TYPE, text: type }));
            }
            case CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.GROUP_BY: {
                const filteredGroupBy = groupByAutocompleteList.filter((groupByValue) => groupByValue.toLowerCase().includes(autocompleteValue.toLowerCase()) && !alreadyAutocompletedKeys.includes(groupByValue.toLowerCase()));
                return filteredGroupBy.map((groupByValue) => ({ filterKey: CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.GROUP_BY, text: groupByValue }));
            }
            case CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.STATUS: {
                const filteredStatuses = statusAutocompleteList
                    .filter((status) => status.includes(autocompleteValue.toLowerCase()) && !alreadyAutocompletedKeys.includes(status))
                    .sort()
                    .slice(0, 10);
                return filteredStatuses.map((status) => ({ filterKey: CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.STATUS, text: status }));
            }
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPENSE_TYPE: {
                const filteredExpenseTypes = expenseTypes
                    .filter((expenseType) => expenseType.includes(autocompleteValue.toLowerCase()) && !alreadyAutocompletedKeys.includes(expenseType))
                    .sort();
                return filteredExpenseTypes.map((expenseType) => ({
                    filterKey: CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.EXPENSE_TYPE,
                    text: expenseType,
                }));
            }
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_TYPE: {
                const filteredWithdrawalTypes = withdrawalTypes
                    .filter((withdrawalType) => withdrawalType.includes(autocompleteValue.toLowerCase()) && !alreadyAutocompletedKeys.includes(withdrawalType))
                    .sort();
                return filteredWithdrawalTypes.map((withdrawalType) => ({
                    filterKey: CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.WITHDRAWAL_TYPE,
                    text: withdrawalType,
                }));
            }
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FEED: {
                const filteredFeeds = feedAutoCompleteList
                    .filter((feed) => feed.name.toLowerCase().includes(autocompleteValue.toLowerCase()) && !alreadyAutocompletedKeys.includes(feed.name.toLowerCase()))
                    .sort()
                    .slice(0, 10);
                return filteredFeeds.map((feed) => ({
                    filterKey: CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.FEED,
                    text: feed.name,
                    autocompleteID: feed.id,
                    mapKey: CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FEED,
                }));
            }
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID: {
                const filteredCards = cardAutocompleteList
                    .filter((card) => (0, CardUtils_1.isCard)(card) && !(0, CardUtils_1.isCardHiddenFromSearch)(card))
                    .filter((card) => (card.bank.toLowerCase().includes(autocompleteValue.toLowerCase()) || card.lastFourPAN?.includes(autocompleteValue)) &&
                    !alreadyAutocompletedKeys.includes((0, CardUtils_1.getCardDescription)(card).toLowerCase()))
                    .sort()
                    .slice(0, 10);
                return filteredCards.map((card) => ({
                    filterKey: CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.CARD_ID,
                    text: (0, CardUtils_1.getCardDescription)(card),
                    autocompleteID: card.cardID.toString(),
                    mapKey: CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID,
                }));
            }
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.REIMBURSABLE:
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.BILLABLE: {
                const filteredValues = booleanTypes.filter((value) => value.includes(autocompleteValue.toLowerCase()) && !alreadyAutocompletedKeys.includes(value)).sort();
                return filteredValues.map((value) => ({
                    filterKey: autocompleteKey,
                    text: value,
                }));
            }
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POLICY_ID: {
                const filteredPolicies = workspaceList
                    .filter((workspace) => workspace.name.toLowerCase().includes(autocompleteValue.toLowerCase()) && !alreadyAutocompletedKeys.includes(workspace.name.toLowerCase()))
                    .sort()
                    .slice(0, 10);
                return filteredPolicies.map((workspace) => ({
                    filterKey: CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.POLICY_ID,
                    text: workspace.name,
                    autocompleteID: workspace.id,
                    mapKey: CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POLICY_ID,
                }));
            }
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ACTION: {
                const filteredActionTypes = Object.values(CONST_1.default.SEARCH.ACTION_FILTERS).filter((actionType) => {
                    return actionType.toLowerCase().includes(autocompleteValue.toLowerCase()) && !alreadyAutocompletedKeys.includes(actionType.toLowerCase());
                });
                return filteredActionTypes.map((action) => ({
                    filterKey: CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.ACTION,
                    text: action,
                }));
            }
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.HAS: {
                const filteredHasValues = Object.values(CONST_1.default.SEARCH.HAS_VALUES).filter((hasValue) => {
                    return hasValue.toLowerCase().includes(autocompleteValue.toLowerCase()) && !alreadyAutocompletedKeys.includes(hasValue.toLowerCase());
                });
                return filteredHasValues.map((hasValue) => ({
                    filterKey: CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.HAS,
                    text: hasValue,
                }));
            }
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DATE:
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.SUBMITTED:
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.APPROVED:
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PAID:
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPORTED:
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWN:
            case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POSTED: {
                const filteredDatePresets = (0, SearchUIUtils_1.getDatePresets)(autocompleteKey, true)
                    .filter((datePreset) => datePreset.toLowerCase().includes(autocompleteValue.toLowerCase()) && !alreadyAutocompletedKeys.includes(datePreset.toLowerCase()))
                    .sort()
                    .slice(0, 10);
                return filteredDatePresets.map((datePreset) => ({ filterKey: autocompleteKey, text: datePreset }));
            }
            default: {
                return [];
            }
        }
    }, [
        autocompleteParsedQuery,
        autocompleteQueryValue,
        tagAutocompleteList,
        recentTagsAutocompleteList,
        categoryAutocompleteList,
        recentCategoriesAutocompleteList,
        currencyAutocompleteList,
        recentCurrencyAutocompleteList,
        taxAutocompleteList,
        options,
        betas,
        typeAutocompleteList,
        groupByAutocompleteList,
        statusAutocompleteList,
        expenseTypes,
        withdrawalTypes,
        feedAutoCompleteList,
        cardAutocompleteList,
        booleanTypes,
        workspaceList,
    ]);
    const sortedRecentSearches = (0, react_1.useMemo)(() => {
        return Object.values(recentSearches ?? {}).sort((a, b) => localeCompare(b.timestamp, a.timestamp));
    }, [recentSearches, localeCompare]);
    const recentSearchesData = sortedRecentSearches?.slice(0, 5).map(({ query, timestamp }) => {
        const searchQueryJSON = (0, SearchQueryUtils_1.buildSearchQueryJSON)(query);
        return {
            text: searchQueryJSON ? (0, SearchQueryUtils_1.buildUserReadableQueryString)(searchQueryJSON, personalDetails, reports, taxRates, allCards, allFeeds, policies) : query,
            singleIcon: Expensicons.History,
            searchQuery: query,
            keyForList: timestamp,
            searchItemType: CONST_1.default.SEARCH.SEARCH_ROUTER_ITEM_TYPE.SEARCH,
        };
    });
    const recentReportsOptions = (0, react_1.useMemo)(() => {
        const actionId = `filter_options_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const startTime = Date.now();
        Timing_1.default.start(CONST_1.default.TIMING.SEARCH_FILTER_OPTIONS);
        Performance_1.default.markStart(CONST_1.default.TIMING.SEARCH_FILTER_OPTIONS);
        Log_1.default.info('[CMD_K_DEBUG] Filter options started', false, {
            actionId,
            queryLength: autocompleteQueryValue.length,
            queryTrimmed: autocompleteQueryValue.trim(),
            recentReportsCount: searchOptions.recentReports.length,
            timestamp: startTime,
        });
        try {
            if (autocompleteQueryValue.trim() === '') {
                const endTime = Date.now();
                Timing_1.default.end(CONST_1.default.TIMING.SEARCH_FILTER_OPTIONS);
                Performance_1.default.markEnd(CONST_1.default.TIMING.SEARCH_FILTER_OPTIONS);
                Log_1.default.info('[CMD_K_DEBUG] Filter options completed (empty query path)', false, {
                    actionId,
                    duration: endTime - startTime,
                    timestamp: endTime,
                });
                return searchOptions.recentReports;
            }
            const orderedOptions = (0, OptionsListUtils_1.combineOrderingOfReportsAndPersonalDetails)(searchOptions, autocompleteQueryValue, {
                sortByReportTypeInSearch: true,
                preferChatRoomsOverThreads: true,
            });
            const reportOptions = [...orderedOptions.recentReports, ...orderedOptions.personalDetails];
            if (searchOptions.userToInvite) {
                reportOptions.push(searchOptions.userToInvite);
            }
            const finalOptions = reportOptions.slice(0, 20);
            const endTime = Date.now();
            Timing_1.default.end(CONST_1.default.TIMING.SEARCH_FILTER_OPTIONS);
            Performance_1.default.markEnd(CONST_1.default.TIMING.SEARCH_FILTER_OPTIONS);
            Log_1.default.info('[CMD_K_DEBUG] Filter options completed (search path)', false, {
                actionId,
                duration: endTime - startTime,
                recentReportsFiltered: orderedOptions.recentReports.length,
                personalDetailsFiltered: orderedOptions.personalDetails.length,
                hasUserToInvite: !!searchOptions.userToInvite,
                finalResultCount: finalOptions.length,
                timestamp: endTime,
            });
            return finalOptions;
        }
        catch (error) {
            const endTime = Date.now();
            Timing_1.default.end(CONST_1.default.TIMING.SEARCH_FILTER_OPTIONS);
            Performance_1.default.markEnd(CONST_1.default.TIMING.SEARCH_FILTER_OPTIONS);
            Log_1.default.alert('[CMD_K_FREEZE] Filter options failed', {
                actionId,
                error: String(error),
                duration: endTime - startTime,
                queryLength: autocompleteQueryValue.length,
                timestamp: endTime,
            });
            throw error;
        }
    }, [autocompleteQueryValue, searchOptions]);
    const debounceHandleSearch = (0, useDebounce_1.default)((0, react_1.useCallback)(() => {
        const actionId = `debounce_search_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const startTime = Date.now();
        Performance_1.default.markStart(CONST_1.default.TIMING.DEBOUNCE_HANDLE_SEARCH);
        Log_1.default.info('[CMD_K_DEBUG] Debounced search started', false, {
            actionId,
            queryLength: autocompleteQueryWithoutFilters?.length ?? 0,
            hasHandleSearch: !!handleSearch,
            timestamp: startTime,
        });
        try {
            if (!handleSearch || !autocompleteQueryWithoutFilters) {
                Log_1.default.info('[CMD_K_DEBUG] Debounced search skipped - missing dependencies', false, {
                    actionId,
                    hasHandleSearch: !!handleSearch,
                    hasQuery: !!autocompleteQueryWithoutFilters,
                    timestamp: Date.now(),
                });
                return;
            }
            handleSearch(autocompleteQueryWithoutFilters);
            const endTime = Date.now();
            Performance_1.default.markEnd(CONST_1.default.TIMING.DEBOUNCE_HANDLE_SEARCH);
            Log_1.default.info('[CMD_K_DEBUG] Debounced search completed', false, {
                actionId,
                duration: endTime - startTime,
                queryLength: autocompleteQueryWithoutFilters.length,
                timestamp: endTime,
            });
        }
        catch (error) {
            const endTime = Date.now();
            Performance_1.default.markEnd(CONST_1.default.TIMING.DEBOUNCE_HANDLE_SEARCH);
            Log_1.default.alert('[CMD_K_FREEZE] Debounced search failed', {
                actionId,
                error: String(error),
                duration: endTime - startTime,
                queryLength: autocompleteQueryWithoutFilters?.length ?? 0,
                timestamp: endTime,
            });
            throw error;
        }
    }, [handleSearch, autocompleteQueryWithoutFilters]), CONST_1.default.TIMING.SEARCH_OPTION_LIST_DEBOUNCE_TIME);
    (0, react_1.useEffect)(() => {
        debounceHandleSearch();
    }, [autocompleteQueryWithoutFilters, debounceHandleSearch]);
    /* Sections generation */
    const sections = [];
    if (searchQueryItem) {
        sections.push({ data: [searchQueryItem] });
    }
    const additionalSections = (0, react_1.useMemo)(() => {
        return getAdditionalSections?.(searchOptions);
    }, [getAdditionalSections, searchOptions]);
    if (additionalSections) {
        sections.push(...additionalSections);
    }
    if (!autocompleteQueryValue && recentSearchesData && recentSearchesData.length > 0) {
        sections.push({ title: translate('search.recentSearches'), data: recentSearchesData });
    }
    const styledRecentReports = recentReportsOptions.map((item) => ({
        ...item,
        pressableStyle: styles.br2,
        text: StringUtils_1.default.lineBreaksToSpaces(item.text),
        wrapperStyle: [styles.pr3, styles.pl3],
    }));
    sections.push({ title: autocompleteQueryValue.trim() === '' ? translate('search.recentChats') : undefined, data: styledRecentReports });
    if (autocompleteSuggestions.length > 0) {
        const autocompleteData = autocompleteSuggestions.map(({ filterKey, text, autocompleteID, mapKey }) => {
            return {
                text: getAutocompleteDisplayText(filterKey, text),
                mapKey: mapKey ? (0, getQueryWithSubstitutions_1.getSubstitutionMapKey)(mapKey, text) : undefined,
                singleIcon: Expensicons.MagnifyingGlass,
                searchQuery: text,
                autocompleteID,
                keyForList: autocompleteID ?? text, // in case we have a unique identifier then use it because text might not be unique
                searchItemType: CONST_1.default.SEARCH.SEARCH_ROUTER_ITEM_TYPE.AUTOCOMPLETE_SUGGESTION,
            };
        });
        sections.push({ title: translate('search.suggestions'), data: autocompleteData });
    }
    const onArrowFocus = (0, react_1.useCallback)((focusedItem) => {
        if (!(0, SearchQueryListItem_1.isSearchQueryItem)(focusedItem) || !focusedItem.searchQuery || focusedItem?.searchItemType !== CONST_1.default.SEARCH.SEARCH_ROUTER_ITEM_TYPE.AUTOCOMPLETE_SUGGESTION) {
            return;
        }
        const fieldKey = focusedItem.mapKey?.includes(':') ? focusedItem.mapKey.split(':').at(0) : focusedItem.mapKey;
        const isNameField = fieldKey && CONST_1.CONTINUATION_DETECTION_SEARCH_FILTER_KEYS.includes(fieldKey);
        let trimmedUserSearchQuery;
        if (isNameField && fieldKey) {
            const fieldPattern = `${fieldKey}:`;
            const keyIndex = autocompleteQueryValue.toLowerCase().lastIndexOf(fieldPattern.toLowerCase());
            if (keyIndex !== -1) {
                trimmedUserSearchQuery = autocompleteQueryValue.substring(0, keyIndex + fieldPattern.length);
            }
            else {
                trimmedUserSearchQuery = (0, SearchAutocompleteUtils_1.getQueryWithoutAutocompletedPart)(autocompleteQueryValue);
            }
        }
        else {
            trimmedUserSearchQuery = (0, SearchAutocompleteUtils_1.getQueryWithoutAutocompletedPart)(autocompleteQueryValue);
        }
        setTextQuery(`${trimmedUserSearchQuery}${(0, SearchQueryUtils_1.sanitizeSearchValue)(focusedItem.searchQuery)}\u00A0`);
        updateAutocompleteSubstitutions(focusedItem);
    }, [autocompleteQueryValue, setTextQuery, updateAutocompleteSubstitutions]);
    const sectionItemText = sections?.at(1)?.data?.[0]?.text ?? '';
    const normalizedReferenceText = (0, react_1.useMemo)(() => sectionItemText.toLowerCase(), [sectionItemText]);
    (0, react_1.useEffect)(() => {
        const targetText = autocompleteQueryValue;
        if ((0, SearchQueryUtils_1.shouldHighlight)(normalizedReferenceText, targetText)) {
            onHighlightFirstItem?.();
        }
    }, [autocompleteQueryValue, onHighlightFirstItem, normalizedReferenceText]);
    return (
    // On page refresh, when the list is rendered before options are initialized the auto-focusing on initiallyFocusedOptionKey
    // will fail because the list will be empty on first render so we only render after options are initialized.
    areOptionsInitialized && (<SelectionList_1.default showLoadingPlaceholder fixedNumItemsForLoader={4} loaderSpeed={CONST_1.default.TIMING.SKELETON_ANIMATION_SPEED} sections={sections} onSelectRow={onListItemPress} ListItem={SearchRouterItem} containerStyle={[styles.mh100]} sectionListStyle={[styles.ph2, styles.pb2, styles.overscrollBehaviorContain]} listItemWrapperStyle={[styles.pr0, styles.pl0]} getItemHeight={getItemHeight} onLayout={() => {
            setPerformanceTimersEnd();
            setIsInitialRender(false);
            if (!!textInputRef?.current && ref && 'current' in ref) {
                ref.current?.updateExternalTextInputFocus?.(textInputRef.current.isFocused());
            }
        }} showScrollIndicator={!shouldUseNarrowLayout} sectionTitleStyles={styles.mhn2} shouldSingleExecuteRowSelect onArrowFocus={onArrowFocus} ref={ref} initiallyFocusedOptionKey={!shouldUseNarrowLayout ? styledRecentReports.at(0)?.keyForList : undefined} shouldScrollToFocusedIndex={!isInitialRender} shouldSubscribeToArrowKeyEvents={shouldSubscribeToArrowKeyEvents} disableKeyboardShortcuts={!shouldSubscribeToArrowKeyEvents} addBottomSafeAreaPadding/>));
}
exports.default = (0, react_1.forwardRef)(SearchAutocompleteList);
