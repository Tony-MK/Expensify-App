"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const ButtonWithDropdownMenu_1 = require("@components/ButtonWithDropdownMenu");
const Expensicons = require("@components/Icon/Expensicons");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const ScrollView_1 = require("@components/ScrollView");
const DateSelectPopup_1 = require("@components/Search/FilterDropdowns/DateSelectPopup");
const DropdownButton_1 = require("@components/Search/FilterDropdowns/DropdownButton");
const MultiSelectPopup_1 = require("@components/Search/FilterDropdowns/MultiSelectPopup");
const SingleSelectPopup_1 = require("@components/Search/FilterDropdowns/SingleSelectPopup");
const UserSelectPopup_1 = require("@components/Search/FilterDropdowns/UserSelectPopup");
const SearchContext_1 = require("@components/Search/SearchContext");
const SearchFiltersSkeleton_1 = require("@components/Skeletons/SearchFiltersSkeleton");
const useAdvancedSearchFilters_1 = require("@hooks/useAdvancedSearchFilters");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Modal_1 = require("@libs/actions/Modal");
const Search_1 = require("@libs/actions/Search");
const CardUtils_1 = require("@libs/CardUtils");
const DateUtils_1 = require("@libs/DateUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SearchAdvancedFiltersForm_1 = require("@src/types/form/SearchAdvancedFiltersForm");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function SearchFiltersBar({ queryJSON, headerButtonsOptions, isMobileSelectionModeEnabled }) {
    const scrollRef = (0, react_1.useRef)(null);
    // type, groupBy and status values are not guaranteed to respect the ts type as they come from user input
    const { hash, type: unsafeType, groupBy: unsafeGroupBy, status: unsafeStatus, flatFilters } = queryJSON;
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { selectedTransactions, selectAllMatchingItems, areAllMatchingItemsSelected, showSelectAllMatchingItems, shouldShowFiltersBarLoading } = (0, SearchContext_1.useSearchContext)();
    const [email] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true, selector: (onyxSession) => onyxSession?.email });
    const [userCardList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: true });
    const [reports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false });
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const [currencyList = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENCY_LIST, { canBeMissing: true });
    const [policyTagsLists] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_TAGS, { canBeMissing: true });
    const [policyCategories] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES, { canBeMissing: true });
    const [workspaceCardFeeds] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST, { canBeMissing: true });
    const [allFeeds] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER, { canBeMissing: true });
    const [searchResultsErrors] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${hash}`, { canBeMissing: true, selector: (data) => data?.errors });
    const taxRates = (0, PolicyUtils_1.getAllTaxRates)();
    const allCards = (0, react_1.useMemo)(() => (0, CardUtils_1.mergeCardListWithWorkspaceFeeds)(workspaceCardFeeds ?? CONST_1.default.EMPTY_OBJECT, userCardList), [userCardList, workspaceCardFeeds]);
    const selectedTransactionsKeys = (0, react_1.useMemo)(() => Object.keys(selectedTransactions ?? {}), [selectedTransactions]);
    const hasMultipleOutputCurrency = (0, react_1.useMemo)(() => {
        const policies = Object.values(allPolicies ?? {}).filter((policy) => (0, PolicyUtils_1.isPaidGroupPolicy)(policy));
        const outputCurrency = policies.at(0)?.outputCurrency;
        return policies.some((policy) => policy.outputCurrency !== outputCurrency);
    }, [allPolicies]);
    const filterFormValues = (0, react_1.useMemo)(() => {
        return (0, SearchQueryUtils_1.buildFilterFormValuesFromQuery)(queryJSON, policyCategories, policyTagsLists, currencyList, personalDetails, allCards, reports, taxRates);
    }, [allCards, currencyList, personalDetails, policyCategories, policyTagsLists, queryJSON, reports, taxRates]);
    const hasErrors = Object.keys(searchResultsErrors ?? {}).length > 0 && !isOffline;
    const shouldShowSelectedDropdown = headerButtonsOptions.length > 0 && (!shouldUseNarrowLayout || isMobileSelectionModeEnabled);
    const [typeOptions, type] = (0, react_1.useMemo)(() => {
        const options = (0, SearchUIUtils_1.getTypeOptions)(allPolicies, email);
        const value = options.find((option) => option.value === unsafeType) ?? null;
        return [options, value];
    }, [allPolicies, email, unsafeType]);
    const [groupByOptions, groupBy] = (0, react_1.useMemo)(() => {
        const options = (0, SearchUIUtils_1.getGroupByOptions)();
        const value = options.find((option) => option.value === unsafeGroupBy) ?? null;
        return [options, value];
    }, [unsafeGroupBy]);
    const [groupCurrencyOptions, groupCurrency] = (0, react_1.useMemo)(() => {
        const options = (0, SearchUIUtils_1.getGroupCurrencyOptions)(currencyList);
        const value = options.find((option) => option.value === filterFormValues.groupCurrency) ?? null;
        return [options, value];
    }, [filterFormValues.groupCurrency, currencyList]);
    const [feedOptions, feed] = (0, react_1.useMemo)(() => {
        const feedFilterValues = flatFilters.find((filter) => filter.key === CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FEED)?.filters?.map((filter) => filter.value);
        const options = (0, SearchUIUtils_1.getFeedOptions)(allFeeds, allCards);
        const value = feedFilterValues ? options.filter((option) => feedFilterValues.includes(option.value)) : [];
        return [options, value];
    }, [flatFilters, allFeeds, allCards]);
    const [statusOptions, status] = (0, react_1.useMemo)(() => {
        const options = type ? (0, SearchUIUtils_1.getStatusOptions)(type.value, groupBy?.value) : [];
        const value = [
            Array.isArray(unsafeStatus) ? options.filter((option) => unsafeStatus.includes(option.value)) : (options.find((option) => option.value === unsafeStatus) ?? []),
        ].flat();
        return [options, value];
    }, [unsafeStatus, type, groupBy]);
    const createDateDisplayValue = (0, react_1.useCallback)((filterValues) => {
        const value = {
            [CONST_1.default.SEARCH.DATE_MODIFIERS.ON]: filterValues.on,
            [CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER]: filterValues.after,
            [CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE]: filterValues.before,
        };
        const displayText = [];
        if (value.On) {
            displayText.push((0, SearchQueryUtils_1.isSearchDatePreset)(value.On) ? translate(`search.filters.date.presets.${value.On}`) : `${translate('common.on')} ${DateUtils_1.default.formatToReadableString(value.On)}`);
        }
        if (value.After) {
            displayText.push(`${translate('common.after')} ${DateUtils_1.default.formatToReadableString(value.After)}`);
        }
        if (value.Before) {
            displayText.push(`${translate('common.before')} ${DateUtils_1.default.formatToReadableString(value.Before)}`);
        }
        return [value, displayText];
    }, [translate]);
    const [date, displayDate] = (0, react_1.useMemo)(() => createDateDisplayValue({
        on: filterFormValues.dateOn,
        after: filterFormValues.dateAfter,
        before: filterFormValues.dateBefore,
    }), [filterFormValues.dateOn, filterFormValues.dateAfter, filterFormValues.dateBefore, createDateDisplayValue]);
    const [posted, displayPosted] = (0, react_1.useMemo)(() => createDateDisplayValue({
        on: filterFormValues.postedOn,
        after: filterFormValues.postedAfter,
        before: filterFormValues.postedBefore,
    }), [filterFormValues.postedOn, filterFormValues.postedAfter, filterFormValues.postedBefore, createDateDisplayValue]);
    const [withdrawn, displayWithdrawn] = (0, react_1.useMemo)(() => createDateDisplayValue({
        on: filterFormValues.withdrawnOn,
        after: filterFormValues.withdrawnAfter,
        before: filterFormValues.withdrawnBefore,
    }), [filterFormValues.withdrawnOn, filterFormValues.withdrawnAfter, filterFormValues.withdrawnBefore, createDateDisplayValue]);
    const [withdrawalTypeOptions, withdrawalType] = (0, react_1.useMemo)(() => {
        const options = (0, SearchUIUtils_1.getWithdrawalTypeOptions)(translate);
        const value = options.find((option) => option.value === filterFormValues.withdrawalType) ?? null;
        return [options, value];
    }, [translate, filterFormValues.withdrawalType]);
    const updateFilterForm = (0, react_1.useCallback)((values) => {
        const updatedFilterFormValues = {
            ...filterFormValues,
            ...values,
        };
        // If the type has changed, reset the status so we dont have an invalid status selected
        if (updatedFilterFormValues.type !== filterFormValues.type) {
            updatedFilterFormValues.status = CONST_1.default.SEARCH.STATUS.EXPENSE.ALL;
        }
        const filterString = (0, SearchQueryUtils_1.buildQueryStringFromFilterFormValues)(updatedFilterFormValues);
        const searchQueryJSON = (0, SearchQueryUtils_1.buildSearchQueryJSON)(filterString);
        const queryString = (0, SearchQueryUtils_1.buildSearchQueryString)(searchQueryJSON);
        (0, Modal_1.close)(() => {
            Navigation_1.default.setParams({ q: queryString });
        });
    }, [filterFormValues]);
    const openAdvancedFilters = (0, react_1.useCallback)(() => {
        (0, Search_1.updateAdvancedFilters)(filterFormValues, true);
        Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
    }, [filterFormValues]);
    const typeComponent = (0, react_1.useCallback)(({ closeOverlay }) => {
        return (<SingleSelectPopup_1.default label={translate('common.type')} value={type} items={typeOptions} closeOverlay={closeOverlay} onChange={(item) => updateFilterForm({ type: item?.value ?? CONST_1.default.SEARCH.DATA_TYPES.EXPENSE })}/>);
    }, [translate, typeOptions, type, updateFilterForm]);
    const groupByComponent = (0, react_1.useCallback)(({ closeOverlay }) => {
        return (<SingleSelectPopup_1.default label={translate('search.groupBy')} items={groupByOptions} value={groupBy} closeOverlay={closeOverlay} onChange={(item) => {
                const newValue = item?.value;
                if (!newValue) {
                    // groupCurrency depends on groupBy. Without groupBy groupCurrency makes no sense
                    updateFilterForm({ groupBy: undefined, groupCurrency: undefined });
                }
                else {
                    updateFilterForm({ groupBy: newValue });
                }
            }}/>);
    }, [translate, groupByOptions, groupBy, updateFilterForm]);
    const groupCurrencyComponent = (0, react_1.useCallback)(({ closeOverlay }) => {
        return (<SingleSelectPopup_1.default label={translate('common.groupCurrency')} items={groupCurrencyOptions} value={groupCurrency} closeOverlay={closeOverlay} onChange={(item) => updateFilterForm({ groupCurrency: item?.value })} isSearchable searchPlaceholder={translate('common.groupCurrency')}/>);
    }, [translate, groupCurrencyOptions, groupCurrency, updateFilterForm]);
    const feedComponent = (0, react_1.useCallback)(({ closeOverlay }) => {
        return (<MultiSelectPopup_1.default label={translate('search.filters.feed')} items={feedOptions} value={feed} closeOverlay={closeOverlay} onChange={(items) => updateFilterForm({ feed: items.map((item) => item.value) })}/>);
    }, [translate, feedOptions, feed, updateFilterForm]);
    const createDatePickerComponent = (0, react_1.useCallback)((filterKey, value, translationKey) => {
        return ({ closeOverlay }) => {
            const onChange = (selectedDates) => {
                const dateFormValues = {
                    [`${filterKey}On`]: selectedDates[CONST_1.default.SEARCH.DATE_MODIFIERS.ON],
                    [`${filterKey}After`]: selectedDates[CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER],
                    [`${filterKey}Before`]: selectedDates[CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE],
                };
                updateFilterForm(dateFormValues);
            };
            return (<DateSelectPopup_1.default label={translate(translationKey)} value={value} onChange={onChange} closeOverlay={closeOverlay} presets={(0, SearchUIUtils_1.getDatePresets)(filterKey, true)}/>);
        };
    }, [translate, updateFilterForm]);
    const datePickerComponent = (0, react_1.useMemo)(() => createDatePickerComponent(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DATE, date, 'common.date'), [createDatePickerComponent, date]);
    const postedPickerComponent = (0, react_1.useMemo)(() => createDatePickerComponent(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POSTED, posted, 'search.filters.posted'), [createDatePickerComponent, posted]);
    const withdrawnPickerComponent = (0, react_1.useMemo)(() => createDatePickerComponent(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWN, withdrawn, 'search.filters.withdrawn'), [createDatePickerComponent, withdrawn]);
    const withdrawalTypeComponent = (0, react_1.useCallback)(({ closeOverlay }) => {
        return (<SingleSelectPopup_1.default label={translate('search.withdrawalType')} items={withdrawalTypeOptions} value={withdrawalType} closeOverlay={closeOverlay} onChange={(item) => updateFilterForm({ withdrawalType: item?.value })}/>);
    }, [translate, withdrawalTypeOptions, withdrawalType, updateFilterForm]);
    const statusComponent = (0, react_1.useCallback)(({ closeOverlay }) => {
        const onChange = (selectedItems) => {
            const newStatus = selectedItems.length ? selectedItems.map((i) => i.value) : CONST_1.default.SEARCH.STATUS.EXPENSE.ALL;
            updateFilterForm({ status: newStatus });
        };
        return (<MultiSelectPopup_1.default label={translate('common.status')} items={statusOptions} value={status} closeOverlay={closeOverlay} onChange={onChange}/>);
    }, [statusOptions, status, translate, updateFilterForm]);
    const userPickerComponent = (0, react_1.useCallback)(({ closeOverlay }) => {
        const value = filterFormValues.from ?? [];
        return (<UserSelectPopup_1.default value={value} closeOverlay={closeOverlay} onChange={(selectedUsers) => updateFilterForm({ from: selectedUsers })}/>);
    }, [filterFormValues.from, updateFilterForm]);
    const { typeFiltersKeys } = (0, useAdvancedSearchFilters_1.default)();
    /**
     * Builds the list of all filter chips to be displayed in the
     * filter bar
     */
    const filters = (0, react_1.useMemo)(() => {
        const fromValue = filterFormValues.from?.map((accountID) => personalDetails?.[accountID]?.displayName ?? accountID) ?? [];
        const shouldDisplayGroupByFilter = !!groupBy?.value && groupBy?.value !== CONST_1.default.SEARCH.GROUP_BY.REPORTS;
        const shouldDisplayGroupCurrencyFilter = shouldDisplayGroupByFilter && hasMultipleOutputCurrency;
        const shouldDisplayFeedFilter = feedOptions.length > 1 && !!filterFormValues.feed;
        const shouldDisplayPostedFilter = !!filterFormValues.feed && (!!filterFormValues.postedOn || !!filterFormValues.postedAfter || !!filterFormValues.postedBefore);
        const shouldDisplayWithdrawalTypeFilter = !!filterFormValues.withdrawalType;
        const shouldDisplayWithdrawnFilter = !!filterFormValues.withdrawnOn || !!filterFormValues.withdrawnAfter || !!filterFormValues.withdrawnBefore;
        const filterList = [
            {
                label: translate('common.type'),
                PopoverComponent: typeComponent,
                value: type?.text ?? null,
                filterKey: SearchAdvancedFiltersForm_1.default.TYPE,
            },
            ...(shouldDisplayGroupByFilter
                ? [
                    {
                        label: translate('search.groupBy'),
                        PopoverComponent: groupByComponent,
                        value: groupBy?.text ?? null,
                        filterKey: SearchAdvancedFiltersForm_1.default.GROUP_BY,
                    },
                ]
                : []),
            ...(shouldDisplayGroupCurrencyFilter
                ? [
                    {
                        label: translate('common.groupCurrency'),
                        PopoverComponent: groupCurrencyComponent,
                        value: groupCurrency?.value ?? null,
                        filterKey: SearchAdvancedFiltersForm_1.default.GROUP_CURRENCY,
                    },
                ]
                : []),
            ...(shouldDisplayFeedFilter
                ? [
                    {
                        label: translate('search.filters.feed'),
                        PopoverComponent: feedComponent,
                        value: feed.map((option) => option.text),
                        filterKey: SearchAdvancedFiltersForm_1.default.FEED,
                    },
                ]
                : []),
            ...(shouldDisplayPostedFilter
                ? [
                    {
                        label: translate('search.filters.posted'),
                        PopoverComponent: postedPickerComponent,
                        value: displayPosted,
                        filterKey: SearchAdvancedFiltersForm_1.default.POSTED_ON,
                    },
                ]
                : []),
            ...(shouldDisplayWithdrawalTypeFilter
                ? [
                    {
                        label: translate('search.withdrawalType'),
                        PopoverComponent: withdrawalTypeComponent,
                        value: withdrawalType?.text ?? null,
                        filterKey: SearchAdvancedFiltersForm_1.default.WITHDRAWAL_TYPE,
                    },
                ]
                : []),
            ...(shouldDisplayWithdrawnFilter
                ? [
                    {
                        label: translate('search.filters.withdrawn'),
                        PopoverComponent: withdrawnPickerComponent,
                        value: displayWithdrawn,
                        filterKey: SearchAdvancedFiltersForm_1.default.WITHDRAWN_ON,
                    },
                ]
                : []),
            {
                label: translate('common.status'),
                PopoverComponent: statusComponent,
                value: status.map((option) => option.text),
                filterKey: SearchAdvancedFiltersForm_1.default.STATUS,
            },
            {
                label: translate('common.date'),
                PopoverComponent: datePickerComponent,
                value: displayDate,
                filterKey: SearchAdvancedFiltersForm_1.default.DATE_ON,
            },
            {
                label: translate('common.from'),
                PopoverComponent: userPickerComponent,
                value: fromValue,
                filterKey: SearchAdvancedFiltersForm_1.default.FROM,
            },
        ].filter((filterItem) => (0, SearchQueryUtils_1.isFilterSupported)(filterItem.filterKey, type?.value ?? CONST_1.default.SEARCH.DATA_TYPES.EXPENSE));
        return filterList;
    }, [
        type,
        groupBy,
        groupCurrency,
        withdrawalType,
        displayDate,
        displayPosted,
        displayWithdrawn,
        filterFormValues.from,
        filterFormValues.feed,
        filterFormValues.postedOn,
        filterFormValues.postedAfter,
        filterFormValues.postedBefore,
        filterFormValues.withdrawalType,
        filterFormValues.withdrawnOn,
        filterFormValues.withdrawnAfter,
        filterFormValues.withdrawnBefore,
        translate,
        typeComponent,
        groupByComponent,
        groupCurrencyComponent,
        statusComponent,
        datePickerComponent,
        userPickerComponent,
        postedPickerComponent,
        withdrawalTypeComponent,
        withdrawnPickerComponent,
        status,
        personalDetails,
        feed,
        feedComponent,
        feedOptions.length,
        hasMultipleOutputCurrency,
    ]);
    const hiddenSelectedFilters = (0, react_1.useMemo)(() => {
        const advancedSearchFiltersKeys = typeFiltersKeys.flat();
        const exposedFiltersKeys = filters.flatMap((filter) => {
            const dateFilterKey = SearchAdvancedFiltersForm_1.DATE_FILTER_KEYS.find((key) => filter.filterKey.startsWith(key));
            if (dateFilterKey) {
                return dateFilterKey;
            }
            return filter.filterKey;
        });
        const hiddenFilters = advancedSearchFiltersKeys.filter((key) => !exposedFiltersKeys.includes(key));
        return hiddenFilters.filter((key) => {
            const dateFilterKey = SearchAdvancedFiltersForm_1.DATE_FILTER_KEYS.find((dateKey) => key === dateKey);
            if (dateFilterKey) {
                return filterFormValues[`${dateFilterKey}On`] ?? filterFormValues[`${dateFilterKey}After`] ?? filterFormValues[`${dateFilterKey}Before`];
            }
            return filterFormValues[key];
        });
    }, [filterFormValues, filters, typeFiltersKeys]);
    if (hasErrors) {
        return null;
    }
    if (shouldShowFiltersBarLoading) {
        return <SearchFiltersSkeleton_1.default shouldAnimate/>;
    }
    const selectionButtonText = areAllMatchingItemsSelected
        ? translate('search.exportAll.allMatchingItemsSelected')
        : translate('workspace.common.selected', { count: selectedTransactionsKeys.length });
    return (<react_native_1.View style={[shouldShowSelectedDropdown && styles.ph5, styles.mb2, styles.searchFiltersBarContainer]}>
            {shouldShowSelectedDropdown ? (<react_native_1.View style={[styles.flexRow, styles.gap3]}>
                    <ButtonWithDropdownMenu_1.default onPress={() => null} shouldAlwaysShowDropdownMenu buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.SMALL} customText={selectionButtonText} options={headerButtonsOptions} isSplitButton={false} anchorAlignment={{
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
            }}/>
                    {!areAllMatchingItemsSelected && showSelectAllMatchingItems && (<Button_1.default link small shouldUseDefaultHover={false} innerStyles={styles.p0} onPress={() => selectAllMatchingItems(true)} text={translate('search.exportAll.selectAllMatchingItems')}/>)}
                </react_native_1.View>) : (<ScrollView_1.default horizontal keyboardShouldPersistTaps="always" style={[styles.flexRow, styles.overflowScroll, styles.flexGrow0]} contentContainerStyle={[styles.flexRow, styles.flexGrow0, styles.gap2, styles.ph5]} ref={scrollRef} showsHorizontalScrollIndicator={false}>
                    {filters.map((filter) => (<DropdownButton_1.default key={filter.label} label={filter.label} value={filter.value} PopoverComponent={filter.PopoverComponent}/>))}

                    <Button_1.default link small shouldUseDefaultHover={false} text={translate('search.filtersHeader') + (hiddenSelectedFilters.length > 0 ? ` (${hiddenSelectedFilters.length})` : '')} iconFill={theme.link} iconHoverFill={theme.linkHover} icon={Expensicons.Filter} textStyles={[styles.textMicroBold]} onPress={openAdvancedFilters}/>
                </ScrollView_1.default>)}
        </react_native_1.View>);
}
SearchFiltersBar.displayName = 'SearchFiltersBar';
exports.default = SearchFiltersBar;
