"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const fast_equals_1 = require("fast-equals");
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const OptionsListSkeletonView_1 = require("@components/OptionsListSkeletonView");
const SearchAutocompleteList_1 = require("@components/Search/SearchAutocompleteList");
const SearchContext_1 = require("@components/Search/SearchContext");
const SearchInputSelectionWrapper_1 = require("@components/Search/SearchInputSelectionWrapper");
const SearchQueryListItem_1 = require("@components/SelectionList/Search/SearchQueryListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useKeyboardShortcut_1 = require("@hooks/useKeyboardShortcut");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useRootNavigationState_1 = require("@hooks/useRootNavigationState");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const InputUtils_1 = require("@libs/InputUtils");
const Log_1 = require("@libs/Log");
const backHistory_1 = require("@libs/Navigation/helpers/backHistory");
const SearchAutocompleteUtils_1 = require("@libs/SearchAutocompleteUtils");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const StringUtils_1 = require("@libs/StringUtils");
const Navigation_1 = require("@navigation/Navigation");
const variables_1 = require("@styles/variables");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const getQueryWithSubstitutions_1 = require("./getQueryWithSubstitutions");
const getUpdatedSubstitutionsMap_1 = require("./getUpdatedSubstitutionsMap");
function getContextualSearchAutocompleteKey(item) {
    if (item.roomType === CONST_1.default.SEARCH.DATA_TYPES.INVOICE) {
        return `${CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TO}:${item.searchQuery}`;
    }
    if (item.roomType === CONST_1.default.SEARCH.DATA_TYPES.CHAT) {
        return `${CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.IN}:${item.searchQuery}`;
    }
}
function getContextualSearchQuery(item) {
    const baseQuery = `${CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.TYPE}:${item.roomType}`;
    let additionalQuery = '';
    switch (item.roomType) {
        case CONST_1.default.SEARCH.DATA_TYPES.EXPENSE:
        case CONST_1.default.SEARCH.DATA_TYPES.INVOICE:
            additionalQuery += ` ${CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.POLICY_ID}:${item.policyID}`;
            if (item.roomType === CONST_1.default.SEARCH.DATA_TYPES.INVOICE && item.autocompleteID) {
                additionalQuery += ` ${CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.TO}:${(0, SearchQueryUtils_1.sanitizeSearchValue)(item.searchQuery ?? '')}`;
            }
            break;
        case CONST_1.default.SEARCH.DATA_TYPES.CHAT:
        default:
            additionalQuery = ` ${CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.IN}:${(0, SearchQueryUtils_1.sanitizeSearchValue)(item.searchQuery ?? '')}`;
            break;
    }
    return baseQuery + additionalQuery;
}
function SearchRouter({ onRouterClose, shouldHideInputCaret, isSearchRouterDisplayed }, ref) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { setShouldResetSearchQuery } = (0, SearchContext_1.useSearchContext)();
    const [, recentSearchesMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.RECENT_SEARCHES, { canBeMissing: true });
    const { areOptionsInitialized } = (0, OptionListContextProvider_1.useOptionsList)();
    const [isSearchingForReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { initWithStoredValues: false, canBeMissing: true });
    const isRecentSearchesDataLoaded = !(0, isLoadingOnyxValue_1.default)(recentSearchesMetadata);
    const shouldShowList = isRecentSearchesDataLoaded && areOptionsInitialized;
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const [reports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: true });
    const [workspaceCardFeeds] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST, { canBeMissing: true });
    const [userCardList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: true });
    const allCards = (0, react_1.useMemo)(() => (0, CardUtils_1.mergeCardListWithWorkspaceFeeds)(workspaceCardFeeds ?? CONST_1.default.EMPTY_OBJECT, userCardList), [userCardList, workspaceCardFeeds]);
    const [allFeeds] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER, { canBeMissing: true });
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const listRef = (0, react_1.useRef)(null);
    // The actual input text that the user sees
    const [textInputValue, , setTextInputValue] = (0, useDebouncedState_1.default)('', 500);
    // The input text that was last used for autocomplete; needed for the SearchAutocompleteList when browsing list via arrow keys
    const [autocompleteQueryValue, setAutocompleteQueryValue] = (0, react_1.useState)(textInputValue);
    const [selection, setSelection] = (0, react_1.useState)({ start: textInputValue.length, end: textInputValue.length });
    const [autocompleteSubstitutions, setAutocompleteSubstitutions] = (0, react_1.useState)({});
    const textInputRef = (0, react_1.useRef)(null);
    const contextualReportID = (0, useRootNavigationState_1.default)((state) => {
        const focusedRoute = (0, native_1.findFocusedRoute)(state);
        if (focusedRoute?.name === SCREENS_1.default.REPORT) {
            // We're guaranteed that the type of params is of SCREENS.REPORT
            return focusedRoute.params.reportID;
        }
    });
    const getAdditionalSections = (0, react_1.useCallback)(({ recentReports }) => {
        if (!contextualReportID) {
            return undefined;
        }
        // We will only show the contextual search suggestion if the user has not typed anything
        if (textInputValue) {
            return undefined;
        }
        if (!isSearchRouterDisplayed) {
            return undefined;
        }
        const reportForContextualSearch = recentReports.find((option) => option.reportID === contextualReportID);
        if (!reportForContextualSearch) {
            return undefined;
        }
        const reportQueryValue = reportForContextualSearch.text ?? reportForContextualSearch.alternateText ?? reportForContextualSearch.reportID;
        let roomType = CONST_1.default.SEARCH.DATA_TYPES.CHAT;
        let autocompleteID = reportForContextualSearch.reportID;
        if (reportForContextualSearch.isInvoiceRoom) {
            roomType = CONST_1.default.SEARCH.DATA_TYPES.INVOICE;
            const report = reportForContextualSearch;
            if (report.item && report.item?.invoiceReceiver && report.item.invoiceReceiver?.type === CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL) {
                autocompleteID = report.item.invoiceReceiver.accountID.toString();
            }
            else {
                autocompleteID = '';
            }
        }
        if (reportForContextualSearch.isPolicyExpenseChat) {
            roomType = CONST_1.default.SEARCH.DATA_TYPES.EXPENSE;
            if (reportForContextualSearch.policyID) {
                autocompleteID = reportForContextualSearch.policyID;
            }
            else {
                autocompleteID = '';
            }
        }
        return [
            {
                data: [
                    {
                        text: StringUtils_1.default.lineBreaksToSpaces(`${translate('search.searchIn')} ${reportForContextualSearch.text ?? reportForContextualSearch.alternateText}`),
                        singleIcon: Expensicons.MagnifyingGlass,
                        searchQuery: reportQueryValue,
                        autocompleteID,
                        itemStyle: styles.activeComponentBG,
                        keyForList: 'contextualSearch',
                        searchItemType: CONST_1.default.SEARCH.SEARCH_ROUTER_ITEM_TYPE.CONTEXTUAL_SUGGESTION,
                        roomType,
                        policyID: reportForContextualSearch.policyID,
                    },
                ],
            },
        ];
    }, [contextualReportID, styles.activeComponentBG, textInputValue, translate, isSearchRouterDisplayed]);
    const searchQueryItem = textInputValue
        ? {
            text: textInputValue,
            singleIcon: Expensicons.MagnifyingGlass,
            searchQuery: textInputValue,
            itemStyle: styles.activeComponentBG,
            keyForList: 'findItem',
            searchItemType: CONST_1.default.SEARCH.SEARCH_ROUTER_ITEM_TYPE.SEARCH,
        }
        : undefined;
    const shouldScrollRef = (0, react_1.useRef)(false);
    // Trigger scrollToRight when input value changes and shouldScroll is true
    (0, react_1.useEffect)(() => {
        if (!textInputRef.current || !shouldScrollRef.current) {
            return;
        }
        (0, InputUtils_1.scrollToRight)(textInputRef.current);
        shouldScrollRef.current = false;
    }, [textInputValue]);
    const onSearchQueryChange = (0, react_1.useCallback)((userQuery, autoScrollToRight = false) => {
        const actionId = `search_query_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const startTime = Date.now();
        Log_1.default.info('[CMD_K_DEBUG] Search query change started', false, {
            actionId,
            inputLength: userQuery.length,
            previousInputLength: textInputValue.length,
            autoScrollToRight,
            timestamp: startTime,
        });
        try {
            if (autoScrollToRight) {
                shouldScrollRef.current = true;
            }
            const singleLineUserQuery = StringUtils_1.default.lineBreaksToSpaces(userQuery, true);
            const updatedUserQuery = (0, SearchAutocompleteUtils_1.getAutocompleteQueryWithComma)(textInputValue, singleLineUserQuery);
            setTextInputValue(updatedUserQuery);
            setAutocompleteQueryValue(updatedUserQuery);
            const updatedSubstitutionsMap = (0, getUpdatedSubstitutionsMap_1.getUpdatedSubstitutionsMap)(singleLineUserQuery, autocompleteSubstitutions);
            if (!(0, fast_equals_1.deepEqual)(autocompleteSubstitutions, updatedSubstitutionsMap)) {
                setAutocompleteSubstitutions(updatedSubstitutionsMap);
            }
            if (updatedUserQuery || textInputValue.length > 0) {
                listRef.current?.updateAndScrollToFocusedIndex(0);
            }
            else {
                listRef.current?.updateAndScrollToFocusedIndex(-1);
            }
            const endTime = Date.now();
            Log_1.default.info('[CMD_K_DEBUG] Search query change completed', false, {
                actionId,
                duration: endTime - startTime,
                finalInputLength: updatedUserQuery.length,
                substitutionsUpdated: !(0, fast_equals_1.deepEqual)(autocompleteSubstitutions, updatedSubstitutionsMap),
                timestamp: endTime,
            });
        }
        catch (error) {
            const endTime = Date.now();
            Log_1.default.alert('[CMD_K_FREEZE] Search query change failed', {
                actionId,
                error: String(error),
                duration: endTime - startTime,
                inputLength: userQuery.length,
                timestamp: endTime,
            });
            throw error;
        }
    }, [autocompleteSubstitutions, setTextInputValue, textInputValue]);
    const submitSearch = (0, react_1.useCallback)((queryString) => {
        const queryWithSubstitutions = (0, getQueryWithSubstitutions_1.getQueryWithSubstitutions)(queryString, autocompleteSubstitutions);
        const updatedQuery = (0, SearchQueryUtils_1.getQueryWithUpdatedValues)(queryWithSubstitutions);
        if (!updatedQuery) {
            return;
        }
        // Reset the search query flag when performing a new search
        setShouldResetSearchQuery(false);
        (0, backHistory_1.default)(() => {
            onRouterClose();
            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({ query: updatedQuery }));
        });
        setTextInputValue('');
        setAutocompleteQueryValue('');
    }, [autocompleteSubstitutions, onRouterClose, setTextInputValue, setShouldResetSearchQuery]);
    const setTextAndUpdateSelection = (0, react_1.useCallback)((text) => {
        setTextInputValue(text);
        shouldScrollRef.current = true;
        setSelection({ start: text.length, end: text.length });
    }, [setSelection, setTextInputValue]);
    const onListItemPress = (0, react_1.useCallback)((item) => {
        const actionId = `list_item_press_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const startTime = Date.now();
        Log_1.default.info('[CMD_K_DEBUG] List item press started', false, {
            actionId,
            itemType: (0, SearchQueryListItem_1.isSearchQueryItem)(item) ? 'SearchQueryItem' : 'OptionData',
            searchItemType: (0, SearchQueryListItem_1.isSearchQueryItem)(item) ? item.searchItemType : undefined,
            hasSearchQuery: (0, SearchQueryListItem_1.isSearchQueryItem)(item) ? !!item.searchQuery : undefined,
            hasReportID: 'reportID' in item ? !!item.reportID : undefined,
            hasLogin: 'login' in item ? !!item.login : undefined,
            timestamp: startTime,
        });
        const setFocusAndScrollToRight = () => {
            try {
                react_native_1.InteractionManager.runAfterInteractions(() => {
                    if (!textInputRef.current) {
                        Log_1.default.info('[CMD_K_DEBUG] Focus skipped - no text input ref', false, {
                            actionId,
                            timestamp: Date.now(),
                        });
                        return;
                    }
                    textInputRef.current.focus();
                    (0, InputUtils_1.scrollToRight)(textInputRef.current);
                });
            }
            catch (error) {
                Log_1.default.alert('[CMD_K_FREEZE] Focus and scroll failed', {
                    actionId,
                    error: String(error),
                    timestamp: Date.now(),
                });
            }
        };
        try {
            if ((0, SearchQueryListItem_1.isSearchQueryItem)(item)) {
                if (!item.searchQuery) {
                    Log_1.default.info('[CMD_K_DEBUG] List item press skipped - no search query', false, {
                        actionId,
                        itemType: 'SearchQueryItem',
                        timestamp: Date.now(),
                    });
                    return;
                }
                if (item.searchItemType === CONST_1.default.SEARCH.SEARCH_ROUTER_ITEM_TYPE.CONTEXTUAL_SUGGESTION) {
                    const searchQuery = getContextualSearchQuery(item);
                    const newSearchQuery = `${searchQuery}\u00A0`;
                    onSearchQueryChange(newSearchQuery, true);
                    setSelection({ start: newSearchQuery.length, end: newSearchQuery.length });
                    const autocompleteKey = getContextualSearchAutocompleteKey(item);
                    if (autocompleteKey && item.autocompleteID) {
                        const substitutions = { ...autocompleteSubstitutions, [autocompleteKey]: item.autocompleteID };
                        setAutocompleteSubstitutions(substitutions);
                    }
                    setFocusAndScrollToRight();
                    const endTime = Date.now();
                    Log_1.default.info('[CMD_K_DEBUG] Contextual suggestion handled', false, {
                        actionId,
                        duration: endTime - startTime,
                        newQueryLength: newSearchQuery.length,
                        hasSubstitutions: !!(autocompleteKey && item.autocompleteID),
                        timestamp: endTime,
                    });
                }
                else if (item.searchItemType === CONST_1.default.SEARCH.SEARCH_ROUTER_ITEM_TYPE.AUTOCOMPLETE_SUGGESTION && textInputValue) {
                    const fieldKey = item.mapKey?.includes(':') ? item.mapKey.split(':').at(0) : item.mapKey;
                    const isNameField = fieldKey && CONST_1.CONTINUATION_DETECTION_SEARCH_FILTER_KEYS.includes(fieldKey);
                    let trimmedUserSearchQuery;
                    if (isNameField && fieldKey) {
                        const fieldPattern = `${fieldKey}:`;
                        const keyIndex = textInputValue.toLowerCase().lastIndexOf(fieldPattern.toLowerCase());
                        if (keyIndex !== -1) {
                            trimmedUserSearchQuery = textInputValue.substring(0, keyIndex + fieldPattern.length);
                        }
                        else {
                            trimmedUserSearchQuery = (0, SearchAutocompleteUtils_1.getQueryWithoutAutocompletedPart)(textInputValue);
                        }
                    }
                    else {
                        const keyIndex = fieldKey ? textInputValue.toLowerCase().lastIndexOf(`${fieldKey}:`) : -1;
                        trimmedUserSearchQuery =
                            keyIndex !== -1 && fieldKey ? textInputValue.substring(0, keyIndex + fieldKey.length + 1) : (0, SearchAutocompleteUtils_1.getQueryWithoutAutocompletedPart)(textInputValue);
                    }
                    const newSearchQuery = `${trimmedUserSearchQuery}${(0, SearchQueryUtils_1.sanitizeSearchValue)(item.searchQuery)}\u00A0`;
                    onSearchQueryChange(newSearchQuery, true);
                    setSelection({ start: newSearchQuery.length, end: newSearchQuery.length });
                    if (item.mapKey && item.autocompleteID) {
                        const substitutions = { ...autocompleteSubstitutions, [item.mapKey]: item.autocompleteID };
                        setAutocompleteSubstitutions(substitutions);
                    }
                    setFocusAndScrollToRight();
                    const endTime = Date.now();
                    Log_1.default.info('[CMD_K_DEBUG] Autocomplete suggestion handled', false, {
                        actionId,
                        duration: endTime - startTime,
                        trimmedQueryLength: trimmedUserSearchQuery.length,
                        newQueryLength: newSearchQuery.length,
                        hasMapKey: !!(item.mapKey && item.autocompleteID),
                        timestamp: endTime,
                    });
                }
                else {
                    submitSearch(item.searchQuery);
                    const endTime = Date.now();
                    Log_1.default.info('[CMD_K_DEBUG] Search submitted', false, {
                        actionId,
                        duration: endTime - startTime,
                        searchQuery: item.searchQuery,
                        timestamp: endTime,
                    });
                }
            }
            else {
                (0, backHistory_1.default)(() => {
                    if (item?.reportID) {
                        Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(item.reportID));
                    }
                    else if ('login' in item) {
                        (0, Report_1.navigateToAndOpenReport)(item.login ? [item.login] : [], false);
                    }
                });
                onRouterClose();
                const endTime = Date.now();
                Log_1.default.info('[CMD_K_DEBUG] Navigation item handled', false, {
                    actionId,
                    duration: endTime - startTime,
                    reportID: item?.reportID,
                    hasLogin: 'login' in item ? !!item.login : false,
                    timestamp: endTime,
                });
            }
        }
        catch (error) {
            const endTime = Date.now();
            Log_1.default.alert('[CMD_K_FREEZE] List item press failed', {
                actionId,
                error: String(error),
                duration: endTime - startTime,
                itemType: (0, SearchQueryListItem_1.isSearchQueryItem)(item) ? 'SearchQueryItem' : 'OptionData',
                searchItemType: (0, SearchQueryListItem_1.isSearchQueryItem)(item) ? item.searchItemType : undefined,
                timestamp: endTime,
            });
            throw error;
        }
    }, [autocompleteSubstitutions, onRouterClose, onSearchQueryChange, submitSearch, textInputValue]);
    const updateAutocompleteSubstitutions = (0, react_1.useCallback)((item) => {
        if (!item.autocompleteID || !item.mapKey) {
            return;
        }
        const substitutions = { ...autocompleteSubstitutions, [item.mapKey]: item.autocompleteID };
        setAutocompleteSubstitutions(substitutions);
    }, [autocompleteSubstitutions]);
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.ESCAPE, () => {
        onRouterClose();
    });
    const modalWidth = shouldUseNarrowLayout ? styles.w100 : { width: variables_1.default.searchRouterPopoverWidth };
    return (<react_native_1.View style={[styles.flex1, modalWidth, styles.h100, !shouldUseNarrowLayout && styles.mh85vh]} testID={SearchRouter.displayName} ref={ref}>
            {shouldUseNarrowLayout && (<HeaderWithBackButton_1.default title={translate('common.search')} onBackButtonPress={() => onRouterClose()} shouldDisplayHelpButton={false}/>)}
            <react_native_1.View style={[shouldUseNarrowLayout ? styles.mv3 : styles.mv2, shouldUseNarrowLayout ? styles.mh5 : styles.mh2]}>
                <SearchInputSelectionWrapper_1.default value={textInputValue} isFullWidth={shouldUseNarrowLayout} onSearchQueryChange={onSearchQueryChange} onSubmit={() => {
            const focusedOption = listRef.current?.getFocusedOption();
            if (!focusedOption) {
                submitSearch(textInputValue);
                return;
            }
            onListItemPress(focusedOption);
        }} caretHidden={shouldHideInputCaret} autocompleteListRef={listRef} shouldShowOfflineMessage wrapperStyle={{ ...styles.border, ...styles.alignItemsCenter }} wrapperFocusedStyle={styles.borderColorFocus} isSearchingForReports={!!isSearchingForReports} selection={selection} substitutionMap={autocompleteSubstitutions} ref={textInputRef}/>
            </react_native_1.View>
            {shouldShowList && (<SearchAutocompleteList_1.default autocompleteQueryValue={autocompleteQueryValue || textInputValue} handleSearch={Report_1.searchInServer} searchQueryItem={searchQueryItem} getAdditionalSections={getAdditionalSections} onListItemPress={onListItemPress} setTextQuery={setTextAndUpdateSelection} updateAutocompleteSubstitutions={updateAutocompleteSubstitutions} onHighlightFirstItem={() => listRef.current?.updateAndScrollToFocusedIndex(1)} ref={listRef} textInputRef={textInputRef} personalDetails={personalDetails} reports={reports} allFeeds={allFeeds} allCards={allCards}/>)}
            {!shouldShowList && (<OptionsListSkeletonView_1.default fixedNumItems={4} shouldStyleAsTable speed={CONST_1.default.TIMING.SKELETON_ANIMATION_SPEED}/>)}
        </react_native_1.View>);
}
SearchRouter.displayName = 'SearchRouter';
exports.default = (0, react_1.forwardRef)(SearchRouter);
