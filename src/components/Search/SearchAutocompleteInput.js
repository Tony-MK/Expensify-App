"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const TextInput_1 = require("@components/TextInput");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Search_1 = require("@libs/actions/Search");
const Navigation_1 = require("@libs/Navigation/Navigation");
const runOnLiveMarkdownRuntime_1 = require("@libs/runOnLiveMarkdownRuntime");
const SearchAutocompleteUtils_1 = require("@libs/SearchAutocompleteUtils");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function SearchAutocompleteInput({ value, onSearchQueryChange, onSubmit = () => { }, autocompleteListRef, isFullWidth, disabled = false, shouldShowOfflineMessage = false, autoFocus = true, onFocus, onBlur, caretHidden = false, wrapperStyle, wrapperFocusedStyle = {}, outerWrapperStyle, isSearchingForReports, selection, substitutionMap, }, forwardedRef) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const [currencyList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENCY_LIST, { canBeMissing: false });
    const currencyAutocompleteList = Object.keys(currencyList ?? {}).filter((currencyCode) => !currencyList?.[currencyCode]?.retired);
    const currencySharedValue = (0, react_native_reanimated_1.useSharedValue)(currencyAutocompleteList);
    const [allPolicyCategories] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES, { canBeMissing: false });
    const categoryAutocompleteList = (0, react_1.useMemo)(() => {
        return (0, SearchAutocompleteUtils_1.getAutocompleteCategories)(allPolicyCategories);
    }, [allPolicyCategories]);
    const categorySharedValue = (0, react_native_reanimated_1.useSharedValue)(categoryAutocompleteList);
    const [allPoliciesTags] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_TAGS, { canBeMissing: false });
    const tagAutocompleteList = (0, react_1.useMemo)(() => {
        return (0, SearchAutocompleteUtils_1.getAutocompleteTags)(allPoliciesTags);
    }, [allPoliciesTags]);
    const tagSharedValue = (0, react_native_reanimated_1.useSharedValue)(tagAutocompleteList);
    const [loginList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LOGIN_LIST, { canBeMissing: false });
    const emailList = Object.keys(loginList ?? {});
    const emailListSharedValue = (0, react_native_reanimated_1.useSharedValue)(emailList);
    const offlineMessage = isOffline && shouldShowOfflineMessage ? `${translate('common.youAppearToBeOffline')} ${translate('search.resultsAreLimited')}` : '';
    const { borderColor: focusedBorderColor = theme.border, ...restWrapperFocusedStyle } = wrapperFocusedStyle;
    const { borderColor: wrapperBorderColor = theme.border, ...restWrapperStyle } = wrapperStyle ?? {};
    // we are handling focused/unfocused style using shared value instead of using state to avoid re-rendering. Otherwise layout animation in `Animated.View` will lag.
    const focusedSharedValue = (0, react_native_reanimated_1.useSharedValue)(false);
    const wrapperAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        return focusedSharedValue.get() ? restWrapperFocusedStyle : (restWrapperStyle ?? {});
    });
    const wrapperBorderColorAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        return {
            borderColor: (0, react_native_reanimated_1.interpolateColor)(focusedSharedValue.get() ? 1 : 0, [0, 1], [wrapperBorderColor, focusedBorderColor], 'RGB'),
        };
    });
    (0, react_1.useEffect)(() => {
        (0, runOnLiveMarkdownRuntime_1.default)(() => {
            'worklet';
            emailListSharedValue.set(emailList);
        })();
    }, [emailList, emailListSharedValue]);
    (0, react_1.useEffect)(() => {
        (0, runOnLiveMarkdownRuntime_1.default)(() => {
            'worklet';
            currencySharedValue.set(currencyAutocompleteList);
        })();
    }, [currencyAutocompleteList, currencySharedValue]);
    (0, react_1.useEffect)(() => {
        (0, runOnLiveMarkdownRuntime_1.default)(() => {
            'worklet';
            categorySharedValue.set(categoryAutocompleteList);
        })();
    }, [categorySharedValue, categoryAutocompleteList]);
    (0, react_1.useEffect)(() => {
        (0, runOnLiveMarkdownRuntime_1.default)(() => {
            'worklet';
            tagSharedValue.set(tagAutocompleteList);
        })();
    }, [tagSharedValue, tagAutocompleteList]);
    const parser = (0, react_1.useCallback)((input) => {
        'worklet';
        return (0, SearchAutocompleteUtils_1.parseForLiveMarkdown)(input, currentUserPersonalDetails.displayName ?? '', substitutionMap, emailListSharedValue, currencySharedValue, categorySharedValue, tagSharedValue);
    }, [currentUserPersonalDetails.displayName, substitutionMap, currencySharedValue, categorySharedValue, tagSharedValue, emailListSharedValue]);
    const clearFilters = (0, react_1.useCallback)(() => {
        (0, Search_1.clearAdvancedFilters)();
        onSearchQueryChange('');
        // Check if we are on the search page before clearing query. If we are using the popup search menu,
        // then the clear button is ONLY available when the search is *not* saved, so we don't have to navigate
        const currentRoute = Navigation_1.default.getActiveRouteWithoutParams();
        const isSearchPage = currentRoute === `/${ROUTES_1.default.SEARCH_ROOT.route}`;
        if (isSearchPage) {
            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({
                query: (0, SearchQueryUtils_1.buildCannedSearchQuery)(),
            }));
        }
    }, [onSearchQueryChange]);
    const inputWidth = isFullWidth ? styles.w100 : { width: variables_1.default.popoverWidth };
    return (<react_native_1.View style={[outerWrapperStyle]}>
            <react_native_reanimated_1.default.View style={[styles.flexRow, styles.alignItemsCenter, wrapperStyle ?? styles.searchRouterTextInputContainer, wrapperAnimatedStyle, wrapperBorderColorAnimatedStyle]}>
                <react_native_1.View style={styles.flex1}>
                    <TextInput_1.default testID="search-autocomplete-text-input" value={value} onChangeText={onSearchQueryChange} autoFocus={autoFocus} caretHidden={caretHidden} role={CONST_1.default.ROLE.PRESENTATION} placeholder={translate('search.searchPlaceholder')} autoCapitalize="none" autoCorrect={false} spellCheck={false} enterKeyHint="search" accessibilityLabel={translate('search.searchPlaceholder')} disabled={disabled} maxLength={CONST_1.default.SEARCH_QUERY_LIMIT} onSubmitEditing={onSubmit} shouldUseDisabledStyles={false} textInputContainerStyles={[styles.borderNone, styles.pb0, styles.pl3]} inputStyle={[inputWidth, styles.lineHeightUndefined]} placeholderTextColor={theme.textSupporting} loadingSpinnerStyle={[styles.mt0, styles.mr1, styles.justifyContentCenter]} onFocus={() => {
            onFocus?.();
            autocompleteListRef?.current?.updateExternalTextInputFocus(true);
            focusedSharedValue.set(true);
        }} onBlur={() => {
            autocompleteListRef?.current?.updateExternalTextInputFocus(false);
            focusedSharedValue.set(false);
            onBlur?.();
        }} isLoading={isSearchingForReports} ref={forwardedRef} type="markdown" multiline={false} parser={parser} selection={selection} shouldShowClearButton={!!value && !isSearchingForReports} shouldHideClearButton={false} onClearInput={clearFilters} forwardedFSClass={CONST_1.default.FULLSTORY.CLASS.UNMASK}/>
                </react_native_1.View>
            </react_native_reanimated_1.default.View>
            <FormHelpMessage_1.default style={styles.ph3} isError={false} message={offlineMessage}/>
        </react_native_1.View>);
}
SearchAutocompleteInput.displayName = 'SearchAutocompleteInput';
exports.default = (0, react_1.forwardRef)(SearchAutocompleteInput);
