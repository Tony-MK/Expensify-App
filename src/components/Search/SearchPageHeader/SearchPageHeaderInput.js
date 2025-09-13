"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const fast_equals_1 = require("fast-equals");
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const Expensicons = require("@components/Icon/Expensicons");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const SearchAutocompleteList_1 = require("@components/Search/SearchAutocompleteList");
const SearchInputSelectionWrapper_1 = require("@components/Search/SearchInputSelectionWrapper");
const buildSubstitutionsMap_1 = require("@components/Search/SearchRouter/buildSubstitutionsMap");
const getQueryWithSubstitutions_1 = require("@components/Search/SearchRouter/getQueryWithSubstitutions");
const getUpdatedSubstitutionsMap_1 = require("@components/Search/SearchRouter/getUpdatedSubstitutionsMap");
const SearchRouterContext_1 = require("@components/Search/SearchRouter/SearchRouterContext");
const SearchQueryListItem_1 = require("@components/SelectionList/Search/SearchQueryListItem");
const HelpButton_1 = require("@components/SidePanel/HelpComponents/HelpButton");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const Search_1 = require("@libs/actions/Search");
const CardUtils_1 = require("@libs/CardUtils");
const Log_1 = require("@libs/Log");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const SearchAutocompleteUtils_1 = require("@libs/SearchAutocompleteUtils");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const StringUtils_1 = require("@libs/StringUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const keyboard_1 = require("@src/utils/keyboard");
const SearchTypeMenuPopover_1 = require("./SearchTypeMenuPopover");
// When counting absolute positioning, we need to account for borders
const BORDER_WIDTH = 1;
function SearchPageHeaderInput({ queryJSON, searchRouterListVisible, hideSearchRouterList, onSearchRouterFocus, handleSearch }) {
    const [showPopupButton, setShowPopupButton] = (0, react_1.useState)(true);
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { shouldUseNarrowLayout: displayNarrowHeader } = (0, useResponsiveLayout_1.default)();
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const [reports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: true });
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false });
    const taxRates = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getAllTaxRates)(), []);
    const [userCardList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: true });
    const [workspaceCardFeeds] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST, { canBeMissing: true });
    const allCards = (0, react_1.useMemo)(() => (0, CardUtils_1.mergeCardListWithWorkspaceFeeds)(workspaceCardFeeds ?? CONST_1.default.EMPTY_OBJECT, userCardList), [userCardList, workspaceCardFeeds]);
    const [allFeeds] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER, { canBeMissing: true });
    const { inputQuery: originalInputQuery } = queryJSON;
    const isDefaultQuery = (0, SearchQueryUtils_1.isDefaultExpensesQuery)(queryJSON);
    const queryText = (0, SearchQueryUtils_1.buildUserReadableQueryString)(queryJSON, personalDetails, reports, taxRates, allCards, allFeeds, policies);
    // The actual input text that the user sees
    const [textInputValue, setTextInputValue] = (0, react_1.useState)(isDefaultQuery ? '' : queryText);
    // The input text that was last used for autocomplete; needed for the SearchAutocompleteList when browsing list via arrow keys
    const [autocompleteQueryValue, setAutocompleteQueryValue] = (0, react_1.useState)(isDefaultQuery ? '' : queryText);
    const [selection, setSelection] = (0, react_1.useState)({ start: textInputValue.length, end: textInputValue.length });
    const [autocompleteSubstitutions, setAutocompleteSubstitutions] = (0, react_1.useState)({});
    const [isAutocompleteListVisible, setIsAutocompleteListVisible] = (0, react_1.useState)(false);
    const listRef = (0, react_1.useRef)(null);
    const textInputRef = (0, react_1.useRef)(null);
    const hasMountedRef = (0, react_1.useRef)(false);
    const isFocused = (0, native_1.useIsFocused)();
    const { registerSearchPageInput } = (0, SearchRouterContext_1.useSearchRouterContext)();
    (0, react_1.useEffect)(() => {
        hasMountedRef.current = true;
    }, []);
    // useEffect for blurring TextInput when we cancel SearchRouter interaction on narrow layout
    (0, react_1.useEffect)(() => {
        if (!displayNarrowHeader || !!searchRouterListVisible || !textInputRef.current || !textInputRef.current.isFocused()) {
            return;
        }
        textInputRef.current.blur();
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchRouterListVisible]);
    (0, react_1.useEffect)(() => {
        if (displayNarrowHeader || !isFocused || !textInputRef.current) {
            return;
        }
        registerSearchPageInput(textInputRef.current);
    }, [isFocused, registerSearchPageInput, displayNarrowHeader]);
    (0, react_1.useEffect)(() => {
        setTextInputValue(isDefaultQuery ? '' : queryText);
        setAutocompleteQueryValue(isDefaultQuery ? '' : queryText);
    }, [isDefaultQuery, queryText]);
    (0, react_1.useEffect)(() => {
        const substitutionsMap = (0, buildSubstitutionsMap_1.buildSubstitutionsMap)(originalInputQuery, personalDetails, reports, taxRates, allCards, allFeeds, policies);
        setAutocompleteSubstitutions(substitutionsMap);
    }, [allFeeds, allCards, originalInputQuery, personalDetails, reports, taxRates, policies]);
    (0, react_1.useEffect)(() => {
        if (searchRouterListVisible) {
            return;
        }
        setShowPopupButton(true);
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchRouterListVisible]);
    const onFocus = (0, react_1.useCallback)(() => {
        onSearchRouterFocus?.();
        listRef.current?.updateAndScrollToFocusedIndex(0);
        setShowPopupButton(false);
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleSearchAction = (0, react_1.useCallback)((value) => {
        // Skip calling handleSearch on the initial mount
        if (!hasMountedRef.current) {
            return;
        }
        handleSearch(value);
    }, [handleSearch]);
    const onSearchQueryChange = (0, react_1.useCallback)((userQuery) => {
        const actionId = `page_search_query_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const startTime = Date.now();
        Log_1.default.info('[CMD_K_DEBUG] Page search query change started', false, {
            actionId,
            inputLength: userQuery.length,
            previousInputLength: textInputValue.length,
            timestamp: startTime,
        });
        try {
            const singleLineUserQuery = StringUtils_1.default.lineBreaksToSpaces(userQuery, true);
            const updatedUserQuery = (0, SearchAutocompleteUtils_1.getAutocompleteQueryWithComma)(textInputValue, singleLineUserQuery);
            setTextInputValue(updatedUserQuery);
            setAutocompleteQueryValue(updatedUserQuery);
            const updatedSubstitutionsMap = (0, getUpdatedSubstitutionsMap_1.getUpdatedSubstitutionsMap)(singleLineUserQuery, autocompleteSubstitutions);
            if (!(0, fast_equals_1.deepEqual)(autocompleteSubstitutions, updatedSubstitutionsMap) && !(0, isEmpty_1.default)(updatedSubstitutionsMap)) {
                setAutocompleteSubstitutions(updatedSubstitutionsMap);
            }
            if (updatedUserQuery) {
                listRef.current?.updateAndScrollToFocusedIndex(0);
            }
            else {
                listRef.current?.updateAndScrollToFocusedIndex(-1);
            }
            const endTime = Date.now();
            Log_1.default.info('[CMD_K_DEBUG] Page search query change completed', false, {
                actionId,
                duration: endTime - startTime,
                finalInputLength: updatedUserQuery.length,
                substitutionsUpdated: !(0, fast_equals_1.deepEqual)(autocompleteSubstitutions, updatedSubstitutionsMap) && !(0, isEmpty_1.default)(updatedSubstitutionsMap),
                timestamp: endTime,
            });
        }
        catch (error) {
            const endTime = Date.now();
            Log_1.default.alert('[CMD_K_FREEZE] Page search query change failed', {
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
        Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({ query: updatedQuery }));
        hideSearchRouterList?.();
        setIsAutocompleteListVisible(false);
        if (updatedQuery !== originalInputQuery) {
            (0, Search_1.clearAllFilters)();
            setTextInputValue('');
            setAutocompleteQueryValue('');
        }
    }, [autocompleteSubstitutions, hideSearchRouterList, originalInputQuery]);
    const onListItemPress = (0, react_1.useCallback)((item) => {
        const actionId = `page_list_item_press_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const startTime = Date.now();
        Log_1.default.info('[CMD_K_DEBUG] Page list item press started', false, {
            actionId,
            itemType: (0, SearchQueryListItem_1.isSearchQueryItem)(item) ? 'SearchQueryItem' : 'OptionData',
            searchItemType: (0, SearchQueryListItem_1.isSearchQueryItem)(item) ? item.searchItemType : undefined,
            hasSearchQuery: (0, SearchQueryListItem_1.isSearchQueryItem)(item) ? !!item.searchQuery : undefined,
            hasReportID: 'reportID' in item ? !!item.reportID : undefined,
            hasLogin: 'login' in item ? !!item.login : undefined,
            timestamp: startTime,
        });
        try {
            if ((0, SearchQueryListItem_1.isSearchQueryItem)(item)) {
                if (!item.searchQuery) {
                    Log_1.default.info('[CMD_K_DEBUG] Page list item press skipped - no search query', false, {
                        actionId,
                        itemType: 'SearchQueryItem',
                        timestamp: Date.now(),
                    });
                    return;
                }
                if (item.searchItemType === CONST_1.default.SEARCH.SEARCH_ROUTER_ITEM_TYPE.AUTOCOMPLETE_SUGGESTION && textInputValue) {
                    const fieldKey = item.mapKey?.includes(':') ? item.mapKey.split(':').at(0) : item.mapKey;
                    const keyIndex = fieldKey ? textInputValue.toLowerCase().lastIndexOf(`${fieldKey}:`) : -1;
                    const trimmedUserSearchQuery = keyIndex !== -1 && fieldKey ? textInputValue.substring(0, keyIndex + fieldKey.length + 1) : (0, SearchAutocompleteUtils_1.getQueryWithoutAutocompletedPart)(textInputValue);
                    const newSearchQuery = `${trimmedUserSearchQuery}${(0, SearchQueryUtils_1.sanitizeSearchValue)(item.searchQuery)}\u00A0`;
                    onSearchQueryChange(newSearchQuery);
                    setSelection({ start: newSearchQuery.length, end: newSearchQuery.length });
                    if (item.mapKey && item.autocompleteID) {
                        const substitutions = { ...autocompleteSubstitutions, [item.mapKey]: item.autocompleteID };
                        setAutocompleteSubstitutions(substitutions);
                    }
                    const endTime = Date.now();
                    Log_1.default.info('[CMD_K_DEBUG] Page autocomplete suggestion handled', false, {
                        actionId,
                        duration: endTime - startTime,
                        trimmedQueryLength: trimmedUserSearchQuery.length,
                        newQueryLength: newSearchQuery.length,
                        hasMapKey: !!(item.mapKey && item.autocompleteID),
                        timestamp: endTime,
                    });
                }
                else if (item.searchItemType === CONST_1.default.SEARCH.SEARCH_ROUTER_ITEM_TYPE.SEARCH) {
                    submitSearch(item.searchQuery);
                    const endTime = Date.now();
                    Log_1.default.info('[CMD_K_DEBUG] Page search submitted', false, {
                        actionId,
                        duration: endTime - startTime,
                        searchQuery: item.searchQuery,
                        timestamp: endTime,
                    });
                }
            }
            else if (item?.reportID) {
                Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(item?.reportID));
                const endTime = Date.now();
                Log_1.default.info('[CMD_K_DEBUG] Page report navigation handled', false, {
                    actionId,
                    duration: endTime - startTime,
                    reportID: item.reportID,
                    timestamp: endTime,
                });
            }
            else if ('login' in item) {
                (0, Report_1.navigateToAndOpenReport)(item.login ? [item.login] : [], false);
                const endTime = Date.now();
                Log_1.default.info('[CMD_K_DEBUG] Page user navigation handled', false, {
                    actionId,
                    duration: endTime - startTime,
                    hasLogin: !!item.login,
                    timestamp: endTime,
                });
            }
        }
        catch (error) {
            const endTime = Date.now();
            Log_1.default.alert('[CMD_K_FREEZE] Page list item press failed', {
                actionId,
                error: String(error),
                duration: endTime - startTime,
                itemType: (0, SearchQueryListItem_1.isSearchQueryItem)(item) ? 'SearchQueryItem' : 'OptionData',
                searchItemType: (0, SearchQueryListItem_1.isSearchQueryItem)(item) ? item.searchItemType : undefined,
                timestamp: endTime,
            });
            throw error;
        }
    }, [autocompleteSubstitutions, onSearchQueryChange, submitSearch, textInputValue]);
    const updateAutocompleteSubstitutions = (0, react_1.useCallback)((item) => {
        if (!item.autocompleteID || !item.mapKey) {
            return;
        }
        const substitutions = { ...autocompleteSubstitutions, [item.mapKey]: item.autocompleteID };
        setAutocompleteSubstitutions(substitutions);
    }, [autocompleteSubstitutions]);
    const setTextAndUpdateSelection = (0, react_1.useCallback)((text) => {
        setTextInputValue(text);
        setSelection({ start: text.length, end: text.length });
    }, [setSelection, setTextInputValue]);
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
    if (displayNarrowHeader) {
        return (<react_native_1.View dataSet={{ dragArea: false }} style={[styles.flex1]}>
                <react_native_1.View style={[styles.appBG, styles.flex1]}>
                    <react_native_1.View style={[styles.flexRow, styles.mh5, styles.mb3, styles.alignItemsCenter, styles.justifyContentCenter, { height: variables_1.default.searchTopBarHeight }]}>
                        <react_native_reanimated_1.default.View style={[styles.flex1, styles.zIndex10]}>
                            <SearchInputSelectionWrapper_1.default value={textInputValue} substitutionMap={autocompleteSubstitutions} selection={selection} onSearchQueryChange={onSearchQueryChange} isFullWidth onSubmit={() => {
                keyboard_1.default.dismiss().then(() => submitSearch(textInputValue));
            }} autoFocus={false} onFocus={onFocus} wrapperStyle={{ ...styles.searchAutocompleteInputResults, ...styles.br2 }} wrapperFocusedStyle={styles.searchAutocompleteInputResultsFocused} autocompleteListRef={listRef} ref={textInputRef}/>
                        </react_native_reanimated_1.default.View>
                        {showPopupButton && (<react_native_1.View style={[styles.pl3]}>
                                <SearchTypeMenuPopover_1.default queryJSON={queryJSON}/>
                            </react_native_1.View>)}
                    </react_native_1.View>
                    {!!searchRouterListVisible && (<react_native_1.View style={[styles.flex1]}>
                            <SearchAutocompleteList_1.default autocompleteQueryValue={autocompleteQueryValue} handleSearch={handleSearchAction} searchQueryItem={searchQueryItem} onListItemPress={onListItemPress} setTextQuery={setTextAndUpdateSelection} updateAutocompleteSubstitutions={updateAutocompleteSubstitutions} ref={listRef} personalDetails={personalDetails} reports={reports} allCards={allCards} allFeeds={allFeeds}/>
                        </react_native_1.View>)}
                </react_native_1.View>
            </react_native_1.View>);
    }
    const hideAutocompleteList = () => setIsAutocompleteListVisible(false);
    const showAutocompleteList = () => {
        listRef.current?.updateAndScrollToFocusedIndex(0);
        setIsAutocompleteListVisible(true);
    };
    // we need `- BORDER_WIDTH` to achieve the effect that the input will not "jump"
    const leftPopoverHorizontalPosition = 12 - BORDER_WIDTH;
    const rightPopoverHorizontalPosition = 4 - BORDER_WIDTH;
    const autocompleteInputStyle = isAutocompleteListVisible
        ? [
            styles.border,
            styles.borderRadiusComponentLarge,
            styles.pAbsolute,
            styles.pt2,
            { top: 8 - BORDER_WIDTH, left: leftPopoverHorizontalPosition, right: rightPopoverHorizontalPosition },
            { boxShadow: theme.shadow },
        ]
        : [styles.pt4];
    const inputWrapperActiveStyle = isAutocompleteListVisible ? styles.ph2 : null;
    return (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.zIndex10, styles.mr3]}>
            <react_native_1.View dataSet={{ dragArea: false }} style={[styles.searchResultsHeaderBar, styles.flex1, isAutocompleteListVisible && styles.pr1, isAutocompleteListVisible && styles.pl3]}>
                <react_native_1.View style={[styles.appBG, ...autocompleteInputStyle]}>
                    <react_native_1.View style={[styles.flex1]}>
                        <SearchInputSelectionWrapper_1.default value={textInputValue} onSearchQueryChange={onSearchQueryChange} isFullWidth onSubmit={() => {
            const focusedOption = listRef.current?.getFocusedOption();
            if (focusedOption) {
                return;
            }
            submitSearch(textInputValue);
        }} autoFocus={false} onFocus={showAutocompleteList} onBlur={hideAutocompleteList} wrapperStyle={{ ...styles.searchAutocompleteInputResults, ...styles.br2 }} wrapperFocusedStyle={styles.searchAutocompleteInputResultsFocused} outerWrapperStyle={[inputWrapperActiveStyle, styles.pb2]} autocompleteListRef={listRef} ref={textInputRef} selection={selection} substitutionMap={autocompleteSubstitutions}/>
                    </react_native_1.View>
                    <react_native_1.View style={[styles.mh65vh, !isAutocompleteListVisible && styles.dNone]}>
                        <SearchAutocompleteList_1.default autocompleteQueryValue={autocompleteQueryValue} handleSearch={handleSearchAction} searchQueryItem={searchQueryItem} onListItemPress={onListItemPress} setTextQuery={setTextAndUpdateSelection} updateAutocompleteSubstitutions={updateAutocompleteSubstitutions} ref={listRef} shouldSubscribeToArrowKeyEvents={isAutocompleteListVisible} personalDetails={personalDetails} reports={reports} allCards={allCards} allFeeds={allFeeds}/>
                    </react_native_1.View>
                </react_native_1.View>
            </react_native_1.View>
            <HelpButton_1.default style={[styles.mt1Half]}/>
        </react_native_1.View>);
}
SearchPageHeaderInput.displayName = 'SearchPageHeaderInput';
exports.default = SearchPageHeaderInput;
